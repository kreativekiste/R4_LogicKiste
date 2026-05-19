
Blockly.defineBlocksWithJsonArray([
    // 1. INITIALISIEREN (Setup)
    {
        "type": "ard_sd_begin",
        "message0": "SD-Karte starten (CS-Pin: %1)",
        "args0": [
            { "type": "field_number", "name": "CS_PIN", "value": 4, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Startet die SD-Karte am angegebenen Chip-Select (CS) Pin. Gehört ins SETUP!"
    },
    // 2. SCHREIBEN (Append)
    {
        "type": "ard_sd_write",
        "message0": "Schreibe in Datei %1 Text: %2 %3 Neue Zeile",
        "args0": [
            { "type": "input_value", "name": "FILENAME", "check": "String" },
            { "type": "input_value", "name": "TEXT" },
            { "type": "field_checkbox", "name": "NEWLINE", "checked": true }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Schreibt Daten in eine Datei. Wenn die Datei nicht existiert, wird sie erstellt. (Dateiname max. 8 Zeichen + .txt)"
    },
    // 3. EXISTIERT PRÜFEN
    {
        "type": "ard_sd_exists",
        "message0": "Datei %1 existiert?",
        "args0": [
            { "type": "input_value", "name": "FILENAME", "check": "String" }
        ],
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Gibt WAHR zurück, wenn die Datei auf der SD-Karte gefunden wurde."
    },
    // 4. LÖSCHEN
    {
        "type": "ard_sd_remove",
        "message0": "Lösche Datei %1",
        "args0": [
            { "type": "input_value", "name": "FILENAME", "check": "String" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Löscht die angegebene Datei dauerhaft von der SD-Karte."
    }
]);

// DEZENTRALER SCANNER
const addSDIncludes = function() {
    ArduinoGenerator.globals_.add(`#include <SPI.h>`);
    ArduinoGenerator.globals_.add(`#include <SD.h>`);
};
ArduinoGenerator.hardwareScanners['ard_sd_begin'] = addSDIncludes;
ArduinoGenerator.hardwareScanners['ard_sd_write'] = addSDIncludes;
ArduinoGenerator.hardwareScanners['ard_sd_exists'] = addSDIncludes;
ArduinoGenerator.hardwareScanners['ard_sd_remove'] = addSDIncludes;

// GENERATOR LOGIK
ArduinoGenerator.forBlock['ard_sd_begin'] = function(block) {
    const csPin = block.getFieldValue('CS_PIN');
    return `  SD.begin(${csPin});\n`;
};

ArduinoGenerator.forBlock['ard_sd_write'] = function(block) {
    const filename = ArduinoGenerator.valueToCode(block, 'FILENAME', 0) || '"daten.txt"';
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const newline = block.getFieldValue('NEWLINE') === 'TRUE';
    const command = newline ? 'println' : 'print';
    
    return `  {\n    File myFile = SD.open(${filename}, FILE_WRITE);\n    if (myFile) {\n      myFile.${command}(${text});\n      myFile.close();\n    }\n  }\n`;
};

ArduinoGenerator.forBlock['ard_sd_exists'] = function(block) {
    const filename = ArduinoGenerator.valueToCode(block, 'FILENAME', 0) || '"daten.txt"';
    return [`SD.exists(${filename})`, 0];
};

ArduinoGenerator.forBlock['ard_sd_remove'] = function(block) {
    const filename = ArduinoGenerator.valueToCode(block, 'FILENAME', 0) || '"daten.txt"';
    return `  SD.remove(${filename});\n`;
};