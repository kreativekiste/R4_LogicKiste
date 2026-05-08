// ====================================================================
// BLOCK: Gyro Sensor (MPU6050)
// ORDNER: release/gyro_mpu6050.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_gyro_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⚙️ SETUP: Gyro/Beschleunigung (MPU6050)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230); // Farbe passend zu deinen Sensoren wählen
    this.setTooltip("Startet den MPU6050 Sensor. Muss zwingend in den Setup-Bereich!");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['release_gyro_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Lese Gyro (MPU6050):")
        .appendField(new Blockly.FieldDropdown([
          ["Beschleunigung X", "ACCEL_X"],
          ["Beschleunigung Y", "ACCEL_Y"],
          ["Beschleunigung Z", "ACCEL_Z"],
          ["Rotation X (Gyro)", "GYRO_X"],
          ["Rotation Y (Gyro)", "GYRO_Y"],
          ["Rotation Z (Gyro)", "GYRO_Z"],
          ["Temperatur (°C)", "TEMP"]
        ]), "VALUE_TYPE");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Liest die aktuellen Werte des MPU6050 Sensors aus.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_gyro_setup'] = function(block) {
  // 1. Bibliotheken einbinden
  Blockly.JavaScript.addInclude('Wire', '#include <Wire.h>');
  Blockly.JavaScript.addInclude('Adafruit_Sensor', '#include <Adafruit_Sensor.h>');
  Blockly.JavaScript.addInclude('Adafruit_MPU6050', '#include <Adafruit_MPU6050.h>');

  // 2. Globales Objekt erstellen (wird ganz oben im Code platziert)
  Blockly.JavaScript.addGlobal('mpu6050_obj', 'Adafruit_MPU6050 mpu;');

  // 3. Setup Code generieren
  var setupCode = 
    '  // MPU6050 initialisieren\n' +
    '  if (!mpu.begin()) {\n' +
    '    Serial.println("MPU6050 nicht gefunden! Bitte Verkabelung prüfen.");\n' +
    '    while (1) { delay(10); }\n' +
    '  }\n' +
    '  // Standard-Empfindlichkeiten einstellen\n' +
    '  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);\n' +
    '  mpu.setGyroRange(MPU6050_RANGE_500_DEG);\n' +
    '  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);\n';

  return setupCode;
};

Blockly.JavaScript['release_gyro_read'] = function(block) {
  var dropdown_type = block.getFieldValue('VALUE_TYPE');

  // Um den Haupt-Loop extrem sauber zu halten, lagern wir das eigentliche
  // Auslesen in eine globale C++ Funktion aus. Das spart Speicherplatz, 
  // falls der Nutzer den Block mehrfach verwendet.
  var funcName = 'readMPU6050';
  var funcCode = 
    'float readMPU6050(const int type) {\n' +
    '  sensors_event_t a, g, temp;\n' +
    '  mpu.getEvent(&a, &g, &temp);\n' +
    '  switch(type) {\n' +
    '    case 1: return a.acceleration.x;\n' +
    '    case 2: return a.acceleration.y;\n' +
    '    case 3: return a.acceleration.z;\n' +
    '    case 4: return g.gyro.x;\n' +
    '    case 5: return g.gyro.y;\n' +
    '    case 6: return g.gyro.z;\n' +
    '    case 7: return temp.temperature;\n' +
    '    default: return 0;\n' +
    '  }\n' +
    '}\n';
  
  // Funktion global registrieren (wird nur 1x generiert, auch wenn 10 Blöcke genutzt werden)
  Blockly.JavaScript.addGlobal('func_readMPU6050', funcCode);

  // Herausfinden, welche Zahl wir an die Funktion übergeben müssen
  var typeCode = 0;
  if (dropdown_type == 'ACCEL_X') typeCode = 1;
  if (dropdown_type == 'ACCEL_Y') typeCode = 2;
  if (dropdown_type == 'ACCEL_Z') typeCode = 3;
  if (dropdown_type == 'GYRO_X') typeCode = 4;
  if (dropdown_type == 'GYRO_Y') typeCode = 5;
  if (dropdown_type == 'GYRO_Z') typeCode = 6;
  if (dropdown_type == 'TEMP') typeCode = 7;

  // Den finalen Aufruf für den Loop bauen, z.B. "readMPU6050(1)"
  var code = funcName + '(' + typeCode + ')';
  
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};