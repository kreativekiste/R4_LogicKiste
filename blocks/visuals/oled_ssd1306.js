Blockly.defineBlocksWithJsonArray([
    // 1. OLED SETUP BLOCK
    {
        "type": "ard_oled_setup",
        "message0": "🖥️ Setup OLED 128x64 (I2C) Takt: %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "CLOCK",
                "options": [
                    ["400 kHz (Schnell)", "400000L"],
                    ["100 kHz (Standard)", "100000L"],
                    ["1000 kHz (Ultra)", "1000000L"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Initialisiert das SSD1306 OLED-Display über I2C (Standardadresse 0x3C). Gehört ins SETUP!"
    },

    // 2. SCHRIFTART UND GRÖSSE SETZEN
    {
        "type": "ard_oled_set_font",
        "message0": "OLED Schriftart auf %1 setzen",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "FONT",
                "options": [
                    ["Normal (System5x7)", "System5x7"],
                    ["Schmal (font5x7)", "font5x7"],
                    ["Groß (lcd5x7)", "lcd5x7"],
                    ["Retro (font8x8)", "font8x8"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Legt die aktuelle Schriftart für den nachfolgenden Text fest."
    },

    // 3. DISPLAY LÖSCHEN
    {
        "type": "ard_oled_clear",
        "message0": "OLED Display löschen",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Löscht den gesamten aktuellen Bildschirminhalt des OLEDs."
    },

    // 4. TEXT / VARIABLE SCHREIBEN
    {
        "type": "ard_oled_print",
        "message0": "OLED schreibe Text/Zahl: %1 neue Zeile (Umbruch): %2",
        "args0": [
            {
                "type": "input_value",
                "name": "VAL"
            },
            {
                "type": "field_checkbox",
                "name": "NEW_LINE",
                "checked": true
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Gibt einen Text oder einen Variablenwert auf dem Display aus. Ist das Häkchen gesetzt, springt der Cursor danach in die nächste Zeile."
    }
]);

// =======================================================================
// C++ GENERATOREN & HARDWARE-SCANNER
// =======================================================================

// Dezentraler Hardware-Scanner für das Setup
ArduinoGenerator.hardwareScanners['ard_oled_setup'] = function(block) {
    // Nötige Bibliotheken einbinden
    ArduinoGenerator.includes_.add('#include <Wire.h>');
    ArduinoGenerator.includes_.add('#include "SSD1306Ascii.h"');
    ArduinoGenerator.includes_.add('#include "SSD1306AsciiWire.h"');
    
    // Globale Display-Instanz und Adresse definieren
    ArduinoGenerator.globals_.add('#define I2C_ADDRESS 0x3C\nSSD1306AsciiWire oled;');
};

// Setup-Code-Injektion
ArduinoGenerator.forBlock['ard_oled_setup'] = function(block) {
    const clock = block.getFieldValue('CLOCK');
    
    // Setup-Code in die automatische Initialisierung pushen
    ArduinoGenerator.autoSetup_.push(`  Wire.begin();\n  Wire.setClock(${clock});\n  oled.begin(&Adafruit128x64, I2C_ADDRESS);\n`);
    return '';
};

// Schriftart-Code generieren
ArduinoGenerator.forBlock['ard_oled_set_font'] = function(block) {
    const font = block.getFieldValue('FONT');
    return `  oled.setFont(${font});\n`;
};

// Lösch-Code generieren
ArduinoGenerator.forBlock['ard_oled_clear'] = function(block) {
    return '  oled.clear();\n';
};

// Text- und Variablenausgabe generieren
ArduinoGenerator.forBlock['ard_oled_print'] = function(block) {
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0);
    const newLine = block.getFieldValue('NEW_LINE') === 'TRUE';
    
    // Falls kein Block angesteckt ist, leeren Text verwenden
    if (!value) {
        value = '" "';
    }
    
    // Je nach Häkchen oled.print() oder oled.println() wählen
    const printFunction = newLine ? 'println' : 'print';
    return `  oled.${printFunction}(${value});\n`;
};