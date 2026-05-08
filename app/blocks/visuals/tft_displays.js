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
            {"type": "field_input", "name": "CS", "text": "10"},
            {"type": "field_input", "name": "DC", "text": "9"},
            {"type": "field_input", "name": "RST", "text": "8"},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "ROTATION", "options": [["0°", "0"], ["90°", "1"], ["180°", "2"], ["270°", "3"]]}
        ],
        "colour": 160,
        "tooltip": "Initialisiert das ST7735 Display. Nutzt die Adafruit GFX Library."
    },
    // --- 2. SETUP: ILI9486 (Groß) ---
    {
        "type": "tft_setup_ili9486",
        "message0": "TFT Setup (ILI9486) %1 CS: %2 DC: %3 RST: %4 %5 Rotation: %6 %7 SPI Fix: %8",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_input", "name": "CS", "text": "10"},
            {"type": "field_input", "name": "DC", "text": "8"},
            {"type": "field_input", "name": "RST", "text": "9"},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "ROTATION", "options": [["0°", "0"], ["90°", "1"], ["180°", "2"], ["270°", "3"]]},
            {"type": "input_dummy"},
            {"type": "field_checkbox", "name": "KLUDGE", "checked": false}
        ],
        "colour": 160,
        "tooltip": "Initialisiert das große ILI9486 Display (4 Zoll)."
    },
    // --- 3. TEXT SCHREIBEN ---
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
                ["Transparent", "TRANS"], ["Schwarz", "0x0000"], ["Weiß", "0xFFFF"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // --- 4. FORMEN ZEICHNEN ---
    {
        "type": "tft_draw_shape",
        "message0": "TFT Form: %1 X: %2 Y: %3",
        "args0": [
            {"type": "field_dropdown", "name": "SHAPE", "options": [
                ["Rechteck (Rand)", "drawRect"], ["Rechteck (Voll)", "fillRect"], 
                ["Kreis (Rand)", "drawCircle"], ["Kreis (Voll)", "fillCircle"]
            ]},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"}
        ],
        "message1": "Breite/Rad: %1 Höhe: %2 Farbe: %3",
        "args1": [
            {"type": "input_value", "name": "W_R", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"},
            {"type": "field_dropdown", "name": "COLOR", "options": [
                ["Weiß", "0xFFFF"], ["Schwarz", "0x0000"], ["Rot", "0xF800"], 
                ["Grün", "0x07E0"], ["Blau", "0x001F"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // --- 5. TFT DIMENSIONEN (Breite / Höhe) ---
    {
        "type": "tft_dimensions",
        "message0": "TFT %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIMENSION",
                "options": [
                    ["Breite (Width)", "width"],
                    ["Höhe (Height)", "height"]
                ]
            }
        ],
        "output": "Number",
        "colour": 160,
        "tooltip": "Gibt die aktuelle Breite oder Höhe des Displays in Pixeln zurück."
    }
]);

// --- DEZENTRALE SCANNERS ---

const setupTFT = function(block, model) {
    // FIX Bug 2: Wächter – nur einmal initialisieren pro Generierungs-Lauf
    if (ArduinoGenerator.initializedTFT) return;
    ArduinoGenerator.initializedTFT = true;

    const cs = block.getFieldValue('CS').trim();
    const dc = block.getFieldValue('DC').trim();
    const rst = block.getFieldValue('RST').trim();
    const rot = block.getFieldValue('ROTATION');

    // PIN-MANAGEMENT (Core Integration)
    ArduinoGenerator.usedPinsOutput.add(cs);
    ArduinoGenerator.usedPinsOutput.add(dc);
    ArduinoGenerator.usedPinsOutput.add(rst);

    ArduinoGenerator.includes_.add('#include <Adafruit_GFX.h>');
    
    if (model === 'ST7735') {
        ArduinoGenerator.includes_.add('#include <Adafruit_ST7735.h>');
        ArduinoGenerator.globals_.add(`Adafruit_ST7735 tft = Adafruit_ST7735(pin${cs}, pin${dc}, pin${rst});`);
        ArduinoGenerator.autoSetup_.push(`  tft.initR(INITR_BLACKTAB);\n  tft.setRotation(${rot});\n  tft.fillScreen(0x0000);\n`);
    } else {
        ArduinoGenerator.includes_.add('#include <Adafruit_ILI9486.h>');
        ArduinoGenerator.globals_.add(`Adafruit_ILI9486 tft = Adafruit_ILI9486(pin${cs}, pin${dc}, pin${rst});`);
        let setup = `  tft.begin();\n  tft.setRotation(${rot});`;
        if (block.getFieldValue('KLUDGE') === 'TRUE') setup += `\n  // SPI Kludge Fix\n  tft.setAddrWindow(0,0, tft.width()-1, tft.height()-1);`;
        ArduinoGenerator.autoSetup_.push(setup + `\n  tft.fillScreen(0x0000);\n`);
    }
};

ArduinoGenerator.hardwareScanners['tft_setup_st7735'] = (block) => setupTFT(block, 'ST7735');
ArduinoGenerator.hardwareScanners['tft_setup_ili9486'] = (block) => setupTFT(block, 'ILI9486');

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['tft_setup_st7735'] = () => '';
ArduinoGenerator.forBlock['tft_setup_ili9486'] = () => '';

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
    const wr = ArduinoGenerator.valueToCode(block, 'W_R', 0) || '10';
    const h = ArduinoGenerator.valueToCode(block, 'H', 0) || '10';
    const color = block.getFieldValue('COLOR');
    
    return shape.includes('Circle') 
        ? `  tft.${shape}(${x}, ${y}, ${wr}, ${color});\n`
        : `  tft.${shape}(${x}, ${y}, ${wr}, ${h}, ${color});\n`;
};

ArduinoGenerator.forBlock['tft_dimensions'] = function(block) {
    const dim = block.getFieldValue('DIMENSION');
    return [`tft.${dim}()`, 0];
};
