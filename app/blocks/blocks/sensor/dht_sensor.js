// ==========================================
// BAUTEIL: DHT 11 / DHT 22 SENSOR
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "read_dht",
    "message0": "DHT %1 an PIN %2 lese %3",
    "args0": [
        {"type": "field_dropdown", "name": "TYPE", "options": [["11", "11"], ["22", "22"]]},
        {"type": "field_input", "name": "PIN", "text": "7"},
        {"type": "field_dropdown", "name": "VALUE", "options": [
            ["Temperatur (°C)", "readTemperature()"], 
            ["Luftfeuchtigkeit (%)", "readHumidity()"]
        ]}
    ],
    "output": "Number",
    "colour": 45,
    "tooltip": "Liest Temperatur oder Luftfeuchtigkeit aus. Unterstützt DHT11 und DHT22."
}]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['read_dht'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const rawPin = block.getFieldValue('PIN');
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const dhtName = `dht_pin${safePin}`;

    // 1. Library anmelden
    ArduinoGenerator.includes_.add('#include <DHT.h>');

    // Deduplication über globals_ — wird bei jeder Generierung neu aufgebaut,
    // daher kein persistentes dht_setup_done-Objekt nötig (das war der Bug!)
    const globalDecl = `const int pin${safePin} = ${rawPin};`;
    if (!ArduinoGenerator.globals_.has(globalDecl)) {
        // 2. Globale Definitionen hinzufügen
        ArduinoGenerator.globals_.add(globalDecl);
        ArduinoGenerator.globals_.add(`DHT ${dhtName}(pin${safePin}, DHT${type});`);

        // 3. Sensor im Setup starten
        ArduinoGenerator.autoSetup_.push(`  ${dhtName}.begin();\n`);
    }
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['read_dht'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const value = block.getFieldValue('VALUE');
    const dhtName = `dht_pin${safePin}`;
    
    // Gibt die Abfrage für die loop() zurück
    return [`${dhtName}.${value}`, 0];
};