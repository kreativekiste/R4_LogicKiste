// ==========================================
// BAUTEILE: TFT DISPLAYS (ST7735 & ILI9486)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SETUP: ST7735 (Klein) ---
    {
        "type": "tft_setup_st7735",
        "message0": "TFT Setup (ST7735) %1 CS: %2 DC: %3 RST: %4 %5 Rotation: %6",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_number", "name": "CS", "value": 10},
            {"type": "field_number", "name": "DC", "value": 9},
            {"type": "field_number", "name": "RST", "value": 8},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "ROTATION", "options": [["0°", "0"], ["90°", "1"], ["180°", "2"], ["270°", "3"]]}
        ],
        "colour": 160,
        "tooltip": "Freischwebender Block. Richtet das kleine ST7735 Display ein."
    },
    // --- 2. SETUP: ILI9486 (Groß) ---
    {
        "type": "tft_setup_ili9486",
        "message0": "TFT Setup (ILI9486 - 4 Zoll) %1 CS: %2 DC: %3 RST: %4 %5 Rotation: %6 %7 SPI Kludge (Fix): %8",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_number", "name": "CS", "value": 10},
            {"type": "field_number", "name": "DC", "value": 8},
            {"type": "field_number", "name": "RST", "value": 9},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "ROTATION", "options": [["0°", "0"], ["90°", "1"], ["180°", "2"], ["270°", "3"]]},
            {"type": "input_dummy"},
            {"type": "field_checkbox", "name": "KLUDGE", "checked": false}
        ],
        "colour": 160,
        "tooltip": "Freischwebender Block. Richtet das große ILI9486 Display ein."
    },
    // --- 3. TEXT SCHREIBEN (Mit Auto-Reset) ---
    {
        "type": "tft_print_text",
        "message0": "TFT Text: %1 X: %2 Y: %3 %4 Größe: %5 Farbe: %6 Hintergrund: %7",
        "args0": [
            {"type": "input_value", "name": "TEXT"},
            {"type": "input_value", "name": "X"},
            {"type": "input_value", "name": "Y"},
            {"type": "input_dummy"},
            {"type": "field_number", "name": "SIZE", "value": 2, "min": 1},
            {"type": "field_dropdown", "name": "COLOR", "options": [
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
            ]},
            {"type": "field_dropdown", "name": "BG_COLOR", "options": [
                ["Transparent (Nicht überschreiben)", "TRANS"], 
                ["Schwarz", "0x0000"], ["Weiß", "0xFFFF"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // --- 4. FORMEN ZEICHNEN ---
    {
        "type": "tft_draw_shape",
        "message0": "TFT Form: %1 %2 X: %3 Y: %4 %5 Breite/Radius: %6 Höhe (bei Rechteck): %7 %8 Farbe: %9",
        "args0": [
            {"type": "field_dropdown", "name": "SHAPE", "options": [
                ["Rechteck (Rand)", "drawRect"], ["Rechteck (Gefüllt)", "fillRect"], 
                ["Kreis (Rand)", "drawCircle"], ["Kreis (Gefüllt)", "fillCircle"]
            ]},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "X"},
            {"type": "input_value", "name": "Y"},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "W_R"},
            {"type": "input_value", "name": "H"},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "COLOR", "options": [
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // --- 5. HILFSWERTE (Display Breite / Höhe) ---
    {
        "type": "tft_dimensions",
        "message0": "TFT %1",
        "args0": [
            {"type": "field_dropdown", "name": "DIM", "options": [
                ["Breite", "tft.width()"], 
                ["Höhe", "tft.height()"]
            ]}
        ],
        "output": "Number",
        "colour": 160
    }
]);

// Die Generatoren für die aktiven Blöcke (Setup wird im Scanner der index.html erledigt)

ArduinoGenerator.forBlock['tft_print_text'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const size = block.getFieldValue('SIZE');
    const color = block.getFieldValue('COLOR');
    const bgColor = block.getFieldValue('BG_COLOR');
    
    let code = `  tft.setCursor(${x}, ${y});\n  tft.setTextSize(${size});\n`;
    
    // Auto-Reset Feature: Wenn eine Hintergrundfarbe gewählt wurde, nutze setTextColor(FG, BG)
    if (bgColor !== 'TRANS') {
        code += `  tft.setTextColor(${color}, ${bgColor});\n`;
    } else {
        code += `  tft.setTextColor(${color});\n`;
    }
    
    code += `  tft.print(${text});\n`;
    return code;
};

ArduinoGenerator.forBlock['tft_draw_shape'] = function(block) {
    const shape = block.getFieldValue('SHAPE');
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const w_r = ArduinoGenerator.valueToCode(block, 'W_R', 0) || '10';
    const h = ArduinoGenerator.valueToCode(block, 'H', 0) || '10';
    const color = block.getFieldValue('COLOR');
    
    if (shape.includes('Circle')) {
        return `  tft.${shape}(${x}, ${y}, ${w_r}, ${color});\n`;
    } else {
        return `  tft.${shape}(${x}, ${y}, ${w_r}, ${h}, ${color});\n`;
    }
};

ArduinoGenerator.forBlock['tft_dimensions'] = function(block) {
    return [block.getFieldValue('DIM'), 0];
};