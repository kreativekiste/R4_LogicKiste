Blockly.defineBlocksWithJsonArray([
    // SCHREIBEN
    {
        "type": "ard_eeprom_write",
        "message0": "Speichere in Flash/EEPROM %1 Adresse (0-1023): %2 %3 Wert (0-255): %4",
        "args0": [
            { "type": "input_dummy" },
            { "type": "input_value", "name": "ADDR", "check": "Number" },
            { "type": "input_dummy" },
            { "type": "input_value", "name": "VAL", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Speichert einen Wert (nur 0 bis 255) dauerhaft auf dem R4 ab. Nutzt EEPROM.write()."
    },
    // LESEN
    {
        "type": "ard_eeprom_read",
        "message0": "Lese Flash/EEPROM %1 Adresse (0-1023): %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "input_value", "name": "ADDR", "check": "Number" }
        ],
        "output": "Number",
        "colour": 160,
        "tooltip": "Liest den gespeicherten Wert aus dem Flash-Speicher."
    }
]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['ard_eeprom_write'] = function(block) {
    ArduinoGenerator.globals_.add(`#include <EEPROM.h>`);
};
ArduinoGenerator.hardwareScanners['ard_eeprom_read'] = function(block) {
    ArduinoGenerator.globals_.add(`#include <EEPROM.h>`);
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['ard_eeprom_write'] = function(block) {
    const addr = ArduinoGenerator.valueToCode(block, 'ADDR', 0) || '0';
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    return `  EEPROM.update(${addr}, ${val});\n`;
};

ArduinoGenerator.forBlock['ard_eeprom_read'] = function(block) {
    const addr = ArduinoGenerator.valueToCode(block, 'ADDR', 0) || '0';
    return [`EEPROM.read(${addr})`, 0];
};