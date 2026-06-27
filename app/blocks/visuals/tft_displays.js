

Blockly.defineBlocksWithJsonArray([
    // 1. SETUP: ST7735 (Klein)
    {
        "type": "tft_setup_st7735",
        "message0": "TFT Setup (ST7735) %1 CS: %2 DC: %3 RST: %4 %5 Rotation: %6 %7 SPIset: %8 SPIfix: %9",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_input", "name": "CS", "text": "10"},
            {"type": "field_input", "name": "DC", "text": "9"},
            {"type": "field_input", "name": "RST", "text": "8"},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "ROTATION", "options": [["0°", "0"], ["90°", "1"], ["180°", "2"], ["270°", "3"]]},
            {"type": "input_dummy"},
            {"type": "field_checkbox", "name": "SPISET", "checked": false},
            {"type": "field_checkbox", "name": "SPIFIX", "checked": false}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Block noch nicht geprüft  "
    },
    // 2. SETUP: ILI9486 (Groß)
    {
        "type": "tft_setup_ili9486",
        "message0": "TFT Setup (ILI9486) %1 CS: %2 DC: %3 RST: %4 %5 Rotation: %6 %7 Startfarbe: %8 %9 SPIset: %10 SPIfix: %11",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_input", "name": "CS", "text": "SS"},
            {"type": "field_input", "name": "DC", "text": "8"},
            {"type": "field_input", "name": "RST", "text": "9"},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "ROTATION", "options": [["0°", "0"], ["90°", "1"], ["180°", "2"], ["270°", "3"]]},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "START_COLOR", "options": [
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
            ]},
            {"type": "input_dummy"},
            {"type": "field_checkbox", "name": "SPISET", "checked": false},
            {"type": "field_checkbox", "name": "SPIFIX", "checked": false}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Initialisiert ILI9486 Display Initialisiert | CS 10 | DC 8 | RS 9 | SDI 11 |  13 SCK ."
    },
    // 3. TEXT SCHREIBEN
    {
        "type": "tft_print_text",
        "message0": "TFT Text: %1 X: %2 Y: %3",
        "args0": [
            {"type": "input_value", "name": "TEXT"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"}
        ],
        "message1": "Größe: %1 Farbe: %2 BG: %3",
        "args1": [
            {"type": "input_value", "name": "SIZE", "check": "Number"},
            {"type": "field_dropdown", "name": "COLOR", "options": [
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
            ]},
            {"type": "field_dropdown", "name": "BG_COLOR", "options": [
                ["Transparent", "TRANS"], 
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // 4. FORMEN ZEICHNEN
    {
        "type": "tft_draw_shape",
        "message0": "TFT Form: %1 X: %2 Y: %3",
        "args0": [
            {"type": "field_dropdown", "name": "SHAPE", "options": [
                ["Linie", "drawLine"],
                ["Rechteck (Rand)", "drawRect"], ["Rechteck (Voll)", "fillRect"], 
                ["Rundes Rechteck (Rand)", "drawRoundRect"], ["Rundes Rechteck (Voll)", "fillRoundRect"],
                ["Kreis (Rand)", "drawCircle"], ["Kreis (Voll)", "fillCircle"],
                ["Dreieck (Rand)", "drawTriangle"], ["Dreieck (Voll)", "fillTriangle"]
            ]},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"}
        ],
        "message1": "B / X2: %1 H / Y2: %2",
        "args1": [
            {"type": "input_value", "name": "W_X2", "check": "Number"},
            {"type": "input_value", "name": "H_Y2", "check": "Number"}
        ],
        "message2": "Rad / X3: %1 Y3: %2 Farbe: %3",
        "args2": [
            {"type": "input_value", "name": "R_X3", "check": "Number"},
            {"type": "input_value", "name": "Y3", "check": "Number"},
            {"type": "field_dropdown", "name": "COLOR", "options": [
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Zeichnet Formen. Je nach Form werden B/H, X2/Y2/X3/Y3 oder Radius verwendet."
    },
    // 5. TFT FILL SCREEN
    {
        "type": "tft_dimensions",
        "message0": "TFT fillScreen Farbe: %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "COLOR",
                "options": [
                    ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                    ["Grün", "0x07E0"], ["Blau", "0x001F"], ["Gelb", "0xFFE0"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Füllt den gesamten Bildschirm mit der gewählten Farbe."
    }
]);

// DEZENTRALE SCANNERS

ArduinoGenerator.hardwareScanners['tft_setup_st7735'] = function(block) {
    const cs = block.getFieldValue('CS').trim();
    const dc = block.getFieldValue('DC').trim();
    const rst = block.getFieldValue('RST').trim();

    ArduinoGenerator.includes_.add('#include <SPI.h>');
    ArduinoGenerator.includes_.add('#include <Adafruit_GFX.h>');
    ArduinoGenerator.includes_.add('#include <Adafruit_ST7735.h>');
    ArduinoGenerator.globals_.add(`Adafruit_ST7735 tft = Adafruit_ST7735(${cs}, ${dc}, ${rst});`);
};

ArduinoGenerator.hardwareScanners['tft_setup_ili9486'] = function(block) {
    const cs = block.getFieldValue('CS').trim();
    const dc = block.getFieldValue('DC').trim();
    const rst = block.getFieldValue('RST').trim();

    ArduinoGenerator.includes_.add('#include <SPI.h>');
    ArduinoGenerator.includes_.add('#include <ILI9486_SPI.h>');
    ArduinoGenerator.globals_.add(`ILI9486_SPI tft(${cs}, ${dc}, ${rst});`);
};

// GENERATOR LOGIK

ArduinoGenerator.forBlock['tft_setup_st7735'] = function(block) {
    const rot = block.getFieldValue('ROTATION');
    const spiset = block.getFieldValue('SPISET') === 'TRUE';
    const spifix = block.getFieldValue('SPIFIX') === 'TRUE';

    let code = `  tft.initR(INITR_BLACKTAB);\n  tft.setRotation(${rot});\n`;
    code += `  tft.setSpiKludge(${spiset});\n`;
    if (spifix) {
        code += `  tft.setAddrWindow(0,0, tft.width()-1, tft.height()-1);\n`;
    }
    code += `  tft.fillScreen(0x0000);\n`;
    return code;
};

ArduinoGenerator.forBlock['tft_setup_ili9486'] = function(block) {
    const rot = block.getFieldValue('ROTATION');
    const startColor = block.getFieldValue('START_COLOR');
    const spiset = block.getFieldValue('SPISET') === 'TRUE';
    const spifix = block.getFieldValue('SPIFIX') === 'TRUE';

    let code = `  tft.setSpiKludge(${spiset});\n`;
    code += `  tft.init();\n`;
    code += `  tft.setRotation(${rot});\n`;
    if (spifix) {
        code += `  tft.setAddrWindow(0,0, tft.width()-1, tft.height()-1);\n`;
    }
    code += `  tft.fillScreen(${startColor});\n`;
    return code;
};

ArduinoGenerator.forBlock['tft_print_text'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const size = ArduinoGenerator.valueToCode(block, 'SIZE', 0) || '1';
    const color = block.getFieldValue('COLOR');
    const bgColor = block.getFieldValue('BG_COLOR');
    
    let code = `  tft.setCursor(${x}, ${y});\n  tft.setTextSize(${size});\n`;
    code += (bgColor !== 'TRANS') ? `  tft.setTextColor(${color}, ${bgColor});\n` : `  tft.setTextColor(${color});\n`;
    code += `  tft.print(${text});\n`;
    return code;
};

ArduinoGenerator.forBlock['tft_draw_shape'] = function(block) {
    const shape = block.getFieldValue('SHAPE');
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const w_x2 = ArduinoGenerator.valueToCode(block, 'W_X2', 0) || '0';
    const h_y2 = ArduinoGenerator.valueToCode(block, 'H_Y2', 0) || '0';
    const r_x3 = ArduinoGenerator.valueToCode(block, 'R_X3', 0) || '0';
    const y3 = ArduinoGenerator.valueToCode(block, 'Y3', 0) || '0';
    const color = block.getFieldValue('COLOR');
    
    if (shape === 'drawLine') {
        return `  tft.drawLine(${x}, ${y}, ${w_x2}, ${h_y2}, ${color});\n`;
    } else if (shape.includes('Rect')) {
        if (shape.includes('Round')) {
            return `  tft.${shape}(${x}, ${y}, ${w_x2}, ${h_y2}, ${r_x3}, ${color});\n`;
        }
        return `  tft.${shape}(${x}, ${y}, ${w_x2}, ${h_y2}, ${color});\n`;
    } else if (shape.includes('Circle')) {
        return `  tft.${shape}(${x}, ${y}, ${w_x2}, ${color});\n`;
    } else if (shape.includes('Triangle')) {
        return `  tft.${shape}(${x}, ${y}, ${w_x2}, ${h_y2}, ${r_x3}, ${y3}, ${color});\n`;
    }
    return '';
};

ArduinoGenerator.forBlock['tft_dimensions'] = function(block) {
    const color = block.getFieldValue('COLOR');
    return `  tft.fillScreen(${color});\n`;
};