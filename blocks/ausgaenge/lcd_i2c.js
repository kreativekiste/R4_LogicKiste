// ==========================================
// BAUTEILE: I2C LCD DISPLAYS (LiquidCrystal_I2C)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "out_lcd_i2c",
        "message0": "I2C Display (%1) Adresse: %2 %3 Schreibe Text: %4 %5 in Zeile: %6 Spalte: %7",
        "args0": [
            {"type": "field_dropdown", "name": "FORMAT", "options": [
                ["20x4 Zeichen", "20, 4"], 
                ["16x2 Zeichen", "16, 2"],
                ["20x2 Zeichen", "20, 2"]
            ]},
            {"type": "field_dropdown", "name": "ADDR", "options": [
                ["0x27 (Standard)", "0x27"], 
                ["0x3F (Alternativ)", "0x3F"]
            ]},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "TEXT"},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "ROW"},
            {"type": "input_value", "name": "COL"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // Optionaler Block, um das Display schnell zu löschen
    {
        "type": "out_lcd_clear",
        "message0": "I2C Display (%1) löschen",
        "args0": [
            {"type": "field_dropdown", "name": "ADDR", "options": [["0x27", "0x27"], ["0x3F", "0x3F"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    }
]);

ArduinoGenerator.forBlock['out_lcd_i2c'] = function(block) {
    const format = block.getFieldValue('FORMAT'); // Gibt z.B. "20, 4" zurück
    const addr = block.getFieldValue('ADDR');
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const row = ArduinoGenerator.valueToCode(block, 'ROW', 0) || '0';
    const col = ArduinoGenerator.valueToCode(block, 'COL', 0) || '0';
    
    // Adresse von "0x27" zu "0x27" ohne Anführungszeichen konvertieren für den Namen
    const safeAddr = addr.replace('0x', ''); 
    const lcdName = `lcd_${safeAddr}`;
    
    // Anmeldung für index.html (LiquidCrystal_I2C Initialisierung)
    if (!ArduinoGenerator.usedLCDs) ArduinoGenerator.usedLCDs = new Map();
    ArduinoGenerator.usedLCDs.set(lcdName, {addr, format});
    
    return `  ${lcdName}.setCursor(${col}, ${row});\n  ${lcdName}.print(${text});\n`;
};

ArduinoGenerator.forBlock['out_lcd_clear'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;

    // Auch hier anmelden — falls kein Write-Block vorhanden ist, wird das Objekt
    // trotzdem deklariert und initialisiert. FORMAT-Default ist "16, 2".
    if (!ArduinoGenerator.usedLCDs) ArduinoGenerator.usedLCDs = new Map();
    if (!ArduinoGenerator.usedLCDs.has(lcdName)) {
        ArduinoGenerator.usedLCDs.set(lcdName, {addr, format: '16, 2'});
    }

    return `  ${lcdName}.clear();\n`;
};