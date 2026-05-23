

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

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['read_dht'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const rawPin = block.getFieldValue('PIN').trim(); // <-- FIX A2: trim() hinzugefügt
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const dhtName = `dht_pin${safePin}`;

    // 1. Library anmelden
    ArduinoGenerator.includes_.add('#include <DHT.h>');

    // A1 ABSICHTLICH UNBERÜHRT GELASSEN
    const globalDecl = `const int pin${safePin} = ${rawPin};`;
    if (!ArduinoGenerator.globals_.has(globalDecl)) {
        // 2. Globale Definitionen hinzufügen
        ArduinoGenerator.globals_.add(globalDecl);
        ArduinoGenerator.globals_.add(`DHT ${dhtName}(pin${safePin}, DHT${type});`);

        // 3. Sensor im Setup starten
        ArduinoGenerator.autoSetup_.push(`  ${dhtName}.begin();\n`);
    }

    // B1: Performance Caching-Architektur hinzufügen (Maximal alle 2000ms lesen)
    const cacheKey = `// _dht_cache_${safePin}`;
    if (!ArduinoGenerator.globals_.has(cacheKey)) {
        ArduinoGenerator.globals_.add(cacheKey);
        
        ArduinoGenerator.globals_.add(`
// --- DHT Caching Variablen für Pin ${safePin} ---
unsigned long _dht_lastRead_${safePin} = 0;
float _dht_t_${safePin} = 0.0;
float _dht_h_${safePin} = 0.0;
bool _dht_first_${safePin} = true;

void updateDHT_${safePin}() {
  if (millis() - _dht_lastRead_${safePin} >= 2000 || _dht_first_${safePin}) {
    _dht_lastRead_${safePin} = millis();
    _dht_first_${safePin} = false;
    _dht_t_${safePin} = ${dhtName}.readTemperature();
    _dht_h_${safePin} = ${dhtName}.readHumidity();
  }
}

float getDHT_Temp_${safePin}() {
  updateDHT_${safePin}();
  return _dht_t_${safePin};
}

float getDHT_Hum_${safePin}() {
  updateDHT_${safePin}();
  return _dht_h_${safePin};
}
`);
    }
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['read_dht'] = function(block) {
    const rawPin = block.getFieldValue('PIN').trim();
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const value = block.getFieldValue('VALUE');
    
    // B1: Caching-Funktionen abrufen anstatt den Sensor direkt zu triggern
    if (value.includes('Temperature')) {
        return [`getDHT_Temp_${safePin}()`, 0];
    } else {
        return [`getDHT_Hum_${safePin}()`, 0];
    }
};