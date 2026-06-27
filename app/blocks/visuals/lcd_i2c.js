
const I2C_LCD_COLOR = 230; 

Blockly.defineBlocksWithJsonArray([
    // 0. SETUP BLOCK
    {
        "type": "setup_lcd_i2c",
        "message0": "I2C Setup (%1) Adresse: %2",
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": I2C_LCD_COLOR,
        "tooltip": "Initialisiert das I2C LCD. Dieser Block muss in den SETUP-Bereich!"
    },

    // 1. SCHREIBEN
    {
        "type": "out_lcd_i2c",
        "message0": "I2C Display (%1) Schreibe Text: %2",
        "args0": [
            {"type": "field_dropdown", "name": "ADDR", "options": [
                ["0x27", "0x27"], 
                ["0x3F", "0x3F"]
            ]},
            {"type": "input_value", "name": "TEXT"}
        ],
        "message1": "in Zeile: %1 Spalte: %2",
        "args1": [
            {"type": "input_value", "name": "ROW", "check": "Number"},
            {"type": "input_value", "name": "COL", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": I2C_LCD_COLOR,
        "tooltip": "Schreibt Text auf das I2C LCD. Zeilen und Spalten beginnen bei 0."
    },

    // 2. LÖSCHEN
    {
        "type": "out_lcd_clear",
        "message0": "I2C Display (%1) löschen",
        "args0": [
            {"type": "field_dropdown", "name": "ADDR", "options": [
                ["0x27", "0x27"], 
                ["0x3F", "0x3F"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": I2C_LCD_COLOR,
        "tooltip": "Leert den gesamten Bildschirm des Displays."
    },

    // 3. AKTIONEN
    {
        "type": "out_lcd_action",
        "message0": "I2C Display (%1) Aktion: %2",
        "args0": [
            {"type": "field_dropdown", "name": "ADDR", "options": [
                ["0x27", "0x27"], 
                ["0x3F", "0x3F"]
            ]},
            {"type": "field_dropdown", "name": "ACTION", "options": [
                ["Cursor blinken EIN", "blink()"],
                ["Cursor blinken AUS", "noBlink()"],
                ["Cursor Linie EIN", "cursor()"],
                ["Cursor Linie AUS", "noCursor()"],
                ["Display Text EIN", "display()"],
                ["Display Text AUS", "noDisplay()"],
                ["Hintergrundlicht EIN", "backlight()"],
                ["Hintergrundlicht AUS", "noBacklight()"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": I2C_LCD_COLOR,
        "tooltip": "Führt spezielle Aktionen (wie Blinken oder Licht an/aus) auf dem Display aus."
    }
]);

// GENERATOR LOGIK

// 0. Setup Generierung
ArduinoGenerator.forBlock['setup_lcd_i2c'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const format = block.getFieldValue('FORMAT');
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;

    // Bibliotheken einbinden
    if (ArduinoGenerator.includes_.add) {
        ArduinoGenerator.includes_.add('#include <Wire.h>');
        ArduinoGenerator.includes_.add('#include <LiquidCrystal_I2C.h>');
    }

    // Globale Instanz erstellen
    if (ArduinoGenerator.globals_.add) {
        ArduinoGenerator.globals_.add(`LiquidCrystal_I2C ${lcdName}(${addr}, ${format});`);
    }

    return `  ${lcdName}.init();\n  ${lcdName}.backlight();\n`;
};

// 1. Schreiben Generierung
ArduinoGenerator.forBlock['out_lcd_i2c'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;
    
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const row = ArduinoGenerator.valueToCode(block, 'ROW', 0) || '0';
    const col = ArduinoGenerator.valueToCode(block, 'COL', 0) || '0';
    
    return `  ${lcdName}.setCursor(${col}, ${row});\n  ${lcdName}.print(${text});\n`;
};

// 2. Löschen Generierung
ArduinoGenerator.forBlock['out_lcd_clear'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;

    return `  ${lcdName}.clear();\n`;
};

// 3. Aktionen Generierung (NEU)
ArduinoGenerator.forBlock['out_lcd_action'] = function(block) {
    const addr = block.getFieldValue('ADDR');
    const action = block.getFieldValue('ACTION'); // Holt direkt den C++ Befehl aus dem Dropdown
    const safeAddr = addr.replace('0x', '');
    const lcdName = `lcd_${safeAddr}`;

    return `  ${lcdName}.${action};\n`;
};