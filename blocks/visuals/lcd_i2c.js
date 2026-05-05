// ==========================================
// BAUTEILE: I2C LCD DISPLAYS (LiquidCrystal_I2C)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SCHREIBEN ---
    {
        "type": "out_lcd_i2c",
        "message0": "I2C Display (%1) Adresse: %2",
        "args0": [
            {"type": "field_dropdown", "name": "FORMAT", "options": [
                ["16x2 Zeichen", "16, 2"],
                ["20x4 Zeichen", "20, 4"], 
                ["20x2 Zeichen", "20, 2"]
            ]},
            {"type": "field_dropdown", "name": "ADDR", "options": [
                ["0x27 (Standard)", "0x27"], 
                ["0x3F (Alternativ)", "0x3F"]
            ]}
        ],
        "message1": "Schreibe Text: %1",
        "args1": [
            {"type": "input_value", "name": "TEXT"}
        ],
        "message2": "in Zeile: %1 Spalte: %2",
        "args2": [
            {"type": "input_value", "name": "ROW", "check": "Number"},
            {"type": "input_value", "name": "COL", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Schreibt Text auf das I2C LCD. Zeilen und Spalten beginnen bei 0."
    },
    // --- 2. LÖSCHEN ---
    {
        "type": "out_lcd_clear",
        "message0": "I2C Display (%1) löschen",
        "args0": [
            {"type": "field_dropdown", "name": "ADDR", "options": [["0x27", "0x27"], ["0x3F", "0x3F"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Leert den gesamten Bildschirm des Displays."
    }
]);

// --- DEZENTRALER SCANNER ---

const registerLCD = function(block) {
    const addr = block.getFieldValue('ADDR');
    const format = block.getFieldValue('FORMAT') || '16, 2'; // Fallback für den Clear-Block
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;

    // Bibliotheken einbinden (Set verhindert automatisch Duplikate)
    ArduinoGenerator.includes_.add('#include <Wire.h>');
    ArduinoGenerator.includes_.add('#include <LiquidCrystal_I2C.h>');
    
    // Gedächtnis-Objekt anlegen, falls noch nicht vorhanden
    if (!ArduinoGenerator.initializedLCDs) {
        ArduinoGenerator.initializedLCDs = new Set();
    }

    // Prüfen: Wurde dieses Display in diesem Generierungs-Lauf schon aufgesetzt?
    if (!ArduinoGenerator.initializedLCDs.has(lcdName)) {
        ArduinoGenerator.initializedLCDs.add(lcdName);
        
        // Objekt global anlegen (passiert jetzt strikt nur 1x pro Adresse)
        ArduinoGenerator.globals_.add(`LiquidCrystal_I2C ${lcdName}(${addr}, ${format});`);

        // Setup-Code (landet jetzt ebenfalls nur 1x im setup())
        ArduinoGenerator.autoSetup_.push(`  ${lcdName}.init();\n  ${lcdName}.backlight();`);
    }
};

ArduinoGenerator.hardwareScanners['out_lcd_i2c'] = registerLCD;
ArduinoGenerator.hardwareScanners['out_lcd_clear'] = registerLCD;

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['out_lcd_i2c'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;
    
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const row = ArduinoGenerator.valueToCode(block, 'ROW', 0) || '0';
    const col = ArduinoGenerator.valueToCode(block, 'COL', 0) || '0';
    
    return `  ${lcdName}.setCursor(${col}, ${row});\n  ${lcdName}.print(${text});\n`;
};

ArduinoGenerator.forBlock['out_lcd_clear'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;

    return `  ${lcdName}.clear();\n`;
};