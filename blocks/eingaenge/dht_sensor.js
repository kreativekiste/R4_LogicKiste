// ==========================================
// BAUTEIL: DHT 11 / DHT 22 SENSOR
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "read_dht",
    "message0": "DHT%1 an PIN %2 lese %3",
    "args0": [
        {"type": "field_dropdown", "name": "TYPE", "options": [["11", "11"], ["22", "22"]]},
        {"type": "field_number", "name": "PIN", "value": 2, "min": 0},
        {"type": "field_dropdown", "name": "VALUE", "options": [
            ["Temperatur (°C)", "readTemperature()"], 
            ["Luftfeuchtigkeit (%)", "readHumidity()"]
        ]}
    ],
    "output": "Number",
    "colour": 45,
    "tooltip": "Liest Temperatur oder Luftfeuchtigkeit aus. Benötigt die Adafruit DHT Library."
}]);

ArduinoGenerator.forBlock['read_dht'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    
    const dhtName = `dht_${pin}`;
    
    // Für das nächste index.html Update speichern wir uns den Sensor,
    // damit wir '#include <DHT.h>' und 'dht.begin()' generieren können.
    if (!ArduinoGenerator.usedDHTs) ArduinoGenerator.usedDHTs = new Map();
    ArduinoGenerator.usedDHTs.set(dhtName, {pin: pin, type: `DHT${type}`});
    
    return [`${dhtName}.${value}`, 0];
};