// ==========================================
// BAUTEIL: DHT 11 / DHT 22 SENSOR
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "read_dht",
    "message0": "DHT %1 an PIN %2 lese %3",
    "args0": [
        {"type": "field_dropdown", "name": "TYPE", "options": [["11", "11"], ["22", "22"]]},
        {"type": "field_input", "name": "PIN", "text": "2"},
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

    // 1. Library & Pin-Anmeldung im Core
    ArduinoGenerator.includes_.add('#include <DHT.h>');
    ArduinoGenerator.usedPinsInput.add(rawPin);

    // 2. Instanz für diesen spezifischen Pin erstellen
    ArduinoGenerator.globals_.add(`DHT ${dhtName}(pin${rawPin}, DHT${type});`);

    // 3. Sensor im Setup starten – FIX: kein doppeltes begin() bei mehrfachem Block
    const beginCode = `  ${dhtName}.begin();\n`;`
    if (!ArduinoGenerator.autoSetup_.includes(beginCode)) {
        ArduinoGenerator.autoSetup_.push(beginCode);
    }
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['read_dht'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const value = block.getFieldValue('VALUE');
    const dhtName = `dht_pin${safePin}`;
    
    // Gibt z.B. dht_pin2.readTemperature() zurück
    return [`${dhtName}.${value}`, 0];
};
