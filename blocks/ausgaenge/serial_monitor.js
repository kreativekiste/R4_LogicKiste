// ==========================================
// BAUTEILE: SERIELLER MONITOR & TEXT
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SERIELLE AUSGABE ---
    {
        "type": "serial_print",
        "message0": "Sende an PC (Serial): %1 %2 Zeilenumbruch danach: %3",
        "args0": [
            {"type": "input_value", "name": "TEXT"},
            {"type": "input_dummy"},
            {"type": "field_checkbox", "name": "NEWLINE", "checked": true}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Sendet Daten über USB an den Seriellen Monitor (Baudrate 9600)."
    },
    // --- 2. HILFSBLOCK: TEXT / STRING ---
    {
        "type": "text_string",
        "message0": "\"%1\"",
        "args0": [{"type": "field_input", "name": "TEXT", "text": "Hallo Welt"}],
        "output": "String",
        "colour": 160,
        "tooltip": "Einfacher Text (String)."
    }
]);

ArduinoGenerator.forBlock['serial_print'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const newline = block.getFieldValue('NEWLINE') === 'TRUE';
    
    // Für das nächste index.html Update: 
    // Sobald dieser Block existiert, muss 'Serial.begin(9600);' ins Setup.
    ArduinoGenerator.useSerial = true;
    
    if (newline) {
        return `  Serial.println(${text});\n`;
    } else {
        return `  Serial.print(${text});\n`;
    }
};

ArduinoGenerator.forBlock['text_string'] = function(block) {
    // Anführungszeichen und Backslashes escapen, sonst Syntaxfehler im C++ String
    const text = block.getFieldValue('TEXT')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
    return [`"${text}"`, 0];
};