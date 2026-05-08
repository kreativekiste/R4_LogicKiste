// ==========================================
// BAUTEIL: ARDUINO UNO R4 WIFI LED MATRIX
// ==========================================

// --- 1. SETUP BLOCK ---
Blockly.Blocks['r4_matrix_setup'] = {
    init: function() {
        this.jsonInit({
            "type": "r4_matrix_setup",
            "message0": "R4 Matrix initialisieren",
            "previousStatement": null,
            "nextStatement": null,
            "colour": 140,
            "tooltip": "Startet die interne 12x8 LED Matrix des R4 WiFi (muss ins SETUP)."
        });
    }
};

// --- 2. LAUFSCHRIFT (Scrollt und blockiert) ---
Blockly.Blocks['r4_matrix_print'] = {
    init: function() {
        this.jsonInit({
            "type": "r4_matrix_print",
            "message0": "Laufschrift: %1 Tempo (ms): %2",
            "args0": [
                { "type": "input_value", "name": "TEXT" },
                { "type": "input_value", "name": "SPEED", "check": "Number" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 140,
            "tooltip": "Scrollt Text oder Zahlen. Achtung: Pausiert das Programm, bis der Text durchgelaufen ist!"
        });
    }
};

// --- 3. NEU: STATISCHER TEXT (Ohne Scrollen, blitzschnell) ---
Blockly.Blocks['r4_matrix_print_static'] = {
    init: function() {
        this.jsonInit({
            "type": "r4_matrix_print_static",
            "message0": "Zeige statisch: %1",
            "args0": [
                { "type": "input_value", "name": "TEXT" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 140,
            "tooltip": "Zeigt bis zu 2-3 Zeichen sofort an, ohne das Programm zu blockieren."
        });
    }
};

// --- 4. SYMBOLE ---
Blockly.Blocks['r4_matrix_symbol'] = {
    init: function() {
        this.jsonInit({
            "type": "r4_matrix_symbol",
            "message0": "Zeige Symbol: %1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SYMBOL",
                    "options": [
                        ["❤️ Herz", "HERZ"],
                        ["🙂 Smiley", "SMILEY"],
                        ["❌ Kreuz (X)", "KREUZ"],
                        ["✅ Haken", "HAKEN"],
                        ["⬛ Alles AN", "VOLL"]
                    ]
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 140,
            "tooltip": "Zeigt ein vorgefertigtes Symbol an."
        });
    }
};

// --- 5. PIXEL LISTE ---
Blockly.Blocks['r4_matrix_pixels'] = {
    init: function() {
        this.jsonInit({
            "type": "r4_matrix_pixels",
            "message0": "Schalte Pixel (0-95) an: %1",
            "args0": [
                { "type": "field_input", "name": "PIXELS", "text": "0, 1, 2" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 140,
            "tooltip": "Schaltet gezielt einzelne LEDs ein. Zählung von 0 (oben links) bis 95 (unten rechts)."
        });
    }
};

// --- 6. MATRIX AUS ---
Blockly.Blocks['r4_matrix_clear'] = {
    init: function() {
        this.jsonInit({
            "type": "r4_matrix_clear",
            "message0": "Matrix ausschalten",
            "previousStatement": null,
            "nextStatement": null,
            "colour": 140,
            "tooltip": "Schaltet alle LEDs der Matrix aus."
        });
    }
};


// ==========================================
// GENERATOREN FÜR C++
// ==========================================

// --- 1. SETUP ---
ArduinoGenerator.forBlock['r4_matrix_setup'] = function(block) {
    ArduinoGenerator.includes_.add('#include <ArduinoGraphics.h>\n#include <Arduino_LED_Matrix.h>');
    ArduinoGenerator.globals_.add('ArduinoLEDMatrix matrix;');
    return '  matrix.begin();\n';
};

// --- 2. LAUFSCHRIFT ---
ArduinoGenerator.forBlock['r4_matrix_print'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const speed = ArduinoGenerator.valueToCode(block, 'SPEED', 0) || '60';

    ArduinoGenerator.includes_.add('#include <ArduinoGraphics.h>\n#include <Arduino_LED_Matrix.h>');
    ArduinoGenerator.globals_.add('ArduinoLEDMatrix matrix;');

    let code = `  // --- R4 Laufschrift ---\n`;
    code += `  matrix.beginDraw();\n`;
    code += `  matrix.stroke(0xFFFFFFFF);\n`;
    code += `  matrix.textScrollSpeed(${speed});\n`;
    code += `  matrix.textFont(Font_5x7);\n`;
    code += `  matrix.beginText(0, 1, 0xFFFFFF);\n`;
    code += `  matrix.print(" " + String(${text}) + " ");\n`;
    code += `  matrix.endText(SCROLL_LEFT);\n`;
    code += `  matrix.endDraw();\n`;

    return code;
};

// --- 3. NEU: STATISCHER TEXT ---
ArduinoGenerator.forBlock['r4_matrix_print_static'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';

    ArduinoGenerator.includes_.add('#include <ArduinoGraphics.h>\n#include <Arduino_LED_Matrix.h>');
    ArduinoGenerator.globals_.add('ArduinoLEDMatrix matrix;');

    let code = `  // --- R4 Statischer Text ---\n`;
    code += `  matrix.beginDraw();\n`;
    code += `  matrix.stroke(0xFFFFFFFF);\n`;
    code += `  matrix.textFont(Font_5x7);\n`;
    // X=0, Y=1 positioniert den Text oben links
    code += `  matrix.beginText(0, 1, 0xFFFFFF);\n`;
    code += `  matrix.print(String(${text}));\n`;
    // NO_SCROLL verhindert das Blockieren und zeigt es sofort an!
    code += `  matrix.endText(NO_SCROLL);\n`;
    code += `  matrix.endDraw();\n`;

    return code;
};

// --- 4. SYMBOLE ---
ArduinoGenerator.forBlock['r4_matrix_symbol'] = function(block) {
    const symbol = block.getFieldValue('SYMBOL');
    
    ArduinoGenerator.includes_.add('#include <ArduinoGraphics.h>\n#include <Arduino_LED_Matrix.h>');
    ArduinoGenerator.globals_.add('ArduinoLEDMatrix matrix;');

    let arrayName = "r4_sym_" + symbol.toLowerCase();

    if (symbol === 'HERZ') {
        ArduinoGenerator.globals_.add(`uint8_t ${arrayName}[8][12] = {
  {0,0,1,1,0,0,0,0,1,1,0,0}, {0,1,1,1,1,0,0,1,1,1,1,0}, {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1},
  {0,1,1,1,1,1,1,1,1,1,1,0}, {0,0,1,1,1,1,1,1,1,1,0,0}, {0,0,0,0,1,1,1,1,0,0,0,0}, {0,0,0,0,0,1,1,0,0,0,0,0} };`);
    } else if (symbol === 'SMILEY') {
        ArduinoGenerator.globals_.add(`uint8_t ${arrayName}[8][12] = {
  {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,1,0,0,0,0,1,0,0,0}, {0,0,0,1,0,0,0,0,1,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0},
  {0,0,1,0,0,0,0,0,0,1,0,0}, {0,0,0,1,0,0,0,0,1,0,0,0}, {0,0,0,0,1,1,1,1,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0} };`);
    } else if (symbol === 'KREUZ') {
        ArduinoGenerator.globals_.add(`uint8_t ${arrayName}[8][12] = {
  {0,0,1,0,0,0,0,0,0,1,0,0}, {0,0,0,1,0,0,0,0,1,0,0,0}, {0,0,0,0,1,0,0,1,0,0,0,0}, {0,0,0,0,0,1,1,0,0,0,0,0},
  {0,0,0,0,0,1,1,0,0,0,0,0}, {0,0,0,0,1,0,0,1,0,0,0,0}, {0,0,0,1,0,0,0,0,1,0,0,0}, {0,0,1,0,0,0,0,0,0,1,0,0} };`);
    } else if (symbol === 'HAKEN') {
        ArduinoGenerator.globals_.add(`uint8_t ${arrayName}[8][12] = {
  {0,0,0,0,0,0,0,0,0,0,1,0}, {0,0,0,0,0,0,0,0,0,1,0,0}, {0,0,0,0,0,0,0,0,1,0,0,0}, {0,0,0,0,0,0,0,1,0,0,0,0},
  {0,0,1,0,0,0,1,0,0,0,0,0}, {0,0,0,1,0,1,0,0,0,0,0,0}, {0,0,0,0,1,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0} };`);
    } else if (symbol === 'VOLL') {
        ArduinoGenerator.globals_.add(`uint8_t ${arrayName}[8][12] = {
  {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1},
  {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1}, {1,1,1,1,1,1,1,1,1,1,1,1} };`);
    }

    return `  matrix.renderBitmap(${arrayName}, 8, 12);\n`;
};

// --- 5. PIXEL LISTE ---
ArduinoGenerator.forBlock['r4_matrix_pixels'] = function(block) {
    const pixelsStr = block.getFieldValue('PIXELS');
    
    ArduinoGenerator.includes_.add('#include <ArduinoGraphics.h>\n#include <Arduino_LED_Matrix.h>');
    ArduinoGenerator.globals_.add('ArduinoLEDMatrix matrix;');

    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    let frameName = `r4_frame_${safeId}`;

    let code = `  // --- R4 Pixel setzen ---\n`;
    code += `  uint8_t ${frameName}[8][12] = {0};\n`;

    let pixels = pixelsStr.split(',');
    for (let i = 0; i < pixels.length; i++) {
        let p = parseInt(pixels[i].trim());
        if (!isNaN(p) && p >= 0 && p <= 95) {
            let y = Math.floor(p / 12);
            let x = p % 12;
            code += `  ${frameName}[${y}][${x}] = 1;\n`;
        }
    }
    code += `  matrix.renderBitmap(${frameName}, 8, 12);\n`;

    return code;
};

// --- 6. MATRIX AUS ---
ArduinoGenerator.forBlock['r4_matrix_clear'] = function(block) {
    ArduinoGenerator.includes_.add('#include <ArduinoGraphics.h>\n#include <Arduino_LED_Matrix.h>');
    ArduinoGenerator.globals_.add('ArduinoLEDMatrix matrix;');

    ArduinoGenerator.globals_.add(`uint8_t r4_sym_leer[8][12] = {
  {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0},
  {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0}, {0,0,0,0,0,0,0,0,0,0,0,0} };`);

    return `  matrix.renderBitmap(r4_sym_leer, 8, 12);\n`;
};