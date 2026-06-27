// ====================================================================
// BLOCK-SYSTEM: Tabellen (Arrays)
// ====================================================================

Blockly.defineBlocksWithJsonArray([
    // 1. Tabelle Erstellen
    {
        "type": "release_array_declare",
        "message0": "🗄️ Erstelle Tabelle: %1 Typ: %2 Größe (Fächer): %3",
        "args0": [
            {"type": "field_input", "name": "ARRAY_NAME", "text": "MeineWerte"},
            {"type": "field_dropdown", "name": "ARRAY_TYPE", "options": [
                ["Ganzzahl (int)", "int"],
                ["Kommazahl (float)", "float"],
                ["Text (String)", "String"]
            ]},
            {"type": "field_number", "name": "ARRAY_SIZE", "value": 10, "min": 1}
        ],
        "previousStatement": "VAR_DECLARE",
        "nextStatement": "VAR_DECLARE",
        "colour": 315,
        "tooltip": "Erstellt eine Tabelle. Gehört in den GLOBAL-Bereich!"
    },
    // 2. Wert schreiben
    {
        "type": "release_array_write",
        "message0": "📥 Tabelle: %1 schreibe in Fach Nr. %2 den Wert: %3",
        "args0": [
            {"type": "field_input", "name": "ARRAY_NAME", "text": "MeineWerte"},
            {"type": "input_value", "name": "INDEX", "check": "Number"},
            {"type": "input_value", "name": "VALUE"}
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 315,
        "tooltip": "Speichert einen Wert in ein Fach der Tabelle. Erstes Fach = 0!"
    },
    // 3. Wert lesen
    {
        "type": "release_array_read",
        "message0": "📤 Lese Tabelle: %1 Fach Nr. %2",
        "args0": [
            {"type": "field_input", "name": "ARRAY_NAME", "text": "MeineWerte"},
            {"type": "input_value", "name": "INDEX", "check": "Number"}
        ],
        "inputsInline": true,
        "output": null,
        "colour": 315,
        "tooltip": "Holt einen Wert aus einem Fach der Tabelle."
    }
]);

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['release_array_declare'] = function(block) {
    const name = block.getFieldValue('ARRAY_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    const type = block.getFieldValue('ARRAY_TYPE');
    const size = block.getFieldValue('ARRAY_SIZE');

    // FIX: globals_.add statt addGlobal
    ArduinoGenerator.globals_.add(`${type} ${name}[${size}];`);
    return `// Tabelle ${name} mit ${size} Fächern wurde global erstellt.\n`;
};

ArduinoGenerator.forBlock['release_array_write'] = function(block) {
    const name = block.getFieldValue('ARRAY_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    const index = ArduinoGenerator.valueToCode(block, 'INDEX', 0) || '0';
    const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
    return `  ${name}[${index}] = ${value};\n`;
};

ArduinoGenerator.forBlock['release_array_read'] = function(block) {
    const name = block.getFieldValue('ARRAY_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    const index = ArduinoGenerator.valueToCode(block, 'INDEX', 0) || '0';
    return [`${name}[${index}]`, 0];
};
