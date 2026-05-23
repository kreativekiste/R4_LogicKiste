// ====================================================================
// BLOCK: Gyro Sensor (MPU6050)
// ====================================================================

Blockly.defineBlocksWithJsonArray([
    // 1. SETUP
    {
        "type": "gyro_setup",
        "message0": "⚙️ SETUP: Gyro/Beschleunigung (MPU6050)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "Startet den MPU6050 Sensor. Muss zwingend in den Setup-Bereich!"
    },
    // 2. LESEN
    {
        "type": "gyro_read",
        "message0": "Lese Gyro (MPU6050): %1",
        "args0": [
            {"type": "field_dropdown", "name": "VALUE_TYPE", "options": [
                ["Beschleunigung X", "1"],
                ["Beschleunigung Y", "2"],
                ["Beschleunigung Z", "3"],
                ["Rotation X (Gyro)", "4"],
                ["Rotation Y (Gyro)", "5"],
                ["Rotation Z (Gyro)", "6"],
                ["Temperatur (°C)",   "7"]
            ]}
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "Liest die aktuellen Werte des MPU6050 Sensors aus."
    }
]);

// --- DEZENTRALER SCANNER ---

// Shared Init-Funktion: wird von gyro_setup UND gyro_read aufgerufen
// Deduplication über globals_.has() — kein persistentes Flag das zwischen
// Generierungen hängen bleibt (das war der Bug!)
function _initMPU6050() {
    const guardKey = '// _mpu6050_initialized';
    if (ArduinoGenerator.globals_.has(guardKey)) return;
    ArduinoGenerator.globals_.add(guardKey);

    ArduinoGenerator.includes_.add('#include <Wire.h>');
    ArduinoGenerator.includes_.add('#include <Adafruit_Sensor.h>');
    ArduinoGenerator.includes_.add('#include <Adafruit_MPU6050.h>');

    ArduinoGenerator.globals_.add('Adafruit_MPU6050 mpu;');

    ArduinoGenerator.globals_.add(`
float readMPU6050(const int type) {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  switch(type) {
    case 1: return a.acceleration.x;
    case 2: return a.acceleration.y;
    case 3: return a.acceleration.z;
    case 4: return g.gyro.x;
    case 5: return g.gyro.y;
    case 6: return g.gyro.z;
    case 7: return temp.temperature;
    default: return 0;
  }
}`);
}

ArduinoGenerator.hardwareScanners['gyro_setup'] = function(block) {
    _initMPU6050();
};

// Auch gyro_read registriert die Library — so funktioniert der Block
// auch wenn kein Setup-Block vorhanden ist (kein Compiler-Fehler)
ArduinoGenerator.hardwareScanners['gyro_read'] = function(block) {
    _initMPU6050();
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['gyro_setup'] = function(block) {
    return `  if (!mpu.begin()) {\n    while (1) { delay(10); }\n  }\n` +
           `  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);\n` +
           `  mpu.setGyroRange(MPU6050_RANGE_500_DEG);\n` +
           `  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);\n`;
};

ArduinoGenerator.forBlock['gyro_read'] = function(block) {
    const type = block.getFieldValue('VALUE_TYPE');
    return [`readMPU6050(${type})`, 0];
};
