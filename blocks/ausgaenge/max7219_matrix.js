// ==========================================
// BAUTEILE: MAX7219 DOT-MATRIX (MD_Parola)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SETUP ---
    {
        "type": "max7219_setup",
        "message0": "Setup Dot-Matrix | CS Pin: %1 | Module: %2 | Helligkeit (0-15): %3",
        "args0": [
            {"type": "field_input", "name": "CS", "text": "10"},
            {"type": "field_number", "name": "NUM", "value": 4, "min": 1},
            {"type": "field_number", "name": "INTENSITY", "value": 5, "min": 0, "max": 15}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Initialisiert die MAX7219 Matrix (SPI: DIN an 11, CLK an 13)."
    },

    // --- 2. TEXT ---
    {
        "type": "max7219_print",
        "message0": "Matrix Text: %1 | Ausrichtung: %2",
        "args0": [
            {"type": "input_value", "name": "TEXT"},
            {
                "type": "field_dropdown", "name": "ALIGN", "options": [
                    ["Links", "PA_LEFT"], ["Mitte", "PA_CENTER"], ["Rechts", "PA_RIGHT"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Zeigt Text auf der Matrix an."
    },

    // --- 3. EINZEL-PIXEL ---
    {
        "type": "max7219_set_pixel",
        "message0": "Matrix Pixel X: %1 Y: %2 Status: %3",
        "args0": [
            {"type": "input_value", "name": "X"},
            {"type": "input_value", "name": "Y"},
            {"type": "field_dropdown", "name": "STATE", "options": [["AN", "true"], ["AUS", "false"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Schaltet einen einzelnen Punkt (X/Y) an oder aus."
    },

    // --- 4. PIXEL-LISTE (NeoPixel Style) ---
    {
        "type": "max7219_set_list",
        "message0": "Matrix Pixel-Liste: %1 Status: %2",
        "args0": [
            {"type": "field_input", "name": "LIST", "text": "0, 1, 2, 15"},
            {"type": "field_dropdown", "name": "STATE", "options": [["AN", "true"], ["AUS", "false"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Schaltet eine Liste von IDs (0 bis Module*64-1) an oder aus."
    },

    // --- 5. CONTROL (Clear, Rotation) ---
    {
        "type": "max7219_control",
        "message0": "Matrix Aktion: %1",
        "args0": [
            {
                "type": "field_dropdown", "name": "ACTION", "options": [
                    ["Alles löschen", "displayClear()"],
                    ["Drehen 90°", "setRotation(1)"],
                    ["Drehen 180°", "setRotation(2)"],
                    ["Invertieren", "setInvert(true)"],
                    ["Normalmodus", "setInvert(false)"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Spezielle Befehle für die Anzeige."
    }
]);

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['max7219_setup'] = function(block) {
    const cs = block.getFieldValue('CS');
    const num = block.getFieldValue('NUM');
    const intensity = block.getFieldValue('INTENSITY');

    if (!ArduinoGenerator.includes_) ArduinoGenerator.includes_ = new Set();
    ArduinoGenerator.includes_.add('#include <MD_Parola.h>\n#include <MD_MAX72xx.h>\n#include <SPI.h>');

    if (!ArduinoGenerator.globals_) ArduinoGenerator.globals_ = new Set();
    ArduinoGenerator.globals_.add(`const int mx_cs_pin = ${cs};\nconst int mx_num_dev = ${num};\nMD_Parola P = MD_Parola(MD_MAX72XX::FC16_HW, mx_cs_pin, mx_num_dev);`);
    
    ArduinoGenerator.usedPinsOutput.add(cs);
    ArduinoGenerator.mx_modules = num;

    return `  P.begin();\n  P.setIntensity(${intensity});\n  P.displayClear();\n`;
};

ArduinoGenerator.forBlock['max7219_print'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', ArduinoGenerator.PRECEDENCE) || '" "';
    const align = block.getFieldValue('ALIGN');
    return `  P.setTextAlignment(${align});\n  P.print(${text});\n`;
};

ArduinoGenerator.forBlock['max7219_set_pixel'] = function(block) {
    const x = ArduinoGenerator.valueToCode(block, 'X', ArduinoGenerator.PRECEDENCE) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', ArduinoGenerator.PRECEDENCE) || '0';
    const state = block.getFieldValue('STATE');
    return `  P.getGraphicObject()->setPoint(${y}, ${x}, ${state});\n`;
};

ArduinoGenerator.forBlock['max7219_set_list'] = function(block) {
    const listStr = block.getFieldValue('LIST');
    const state = block.getFieldValue('STATE');
    const modules = (ArduinoGenerator.mx_modules && ArduinoGenerator.mx_modules > 0) ? ArduinoGenerator.mx_modules : 4;
    if (!ArduinoGenerator.mx_modules || ArduinoGenerator.mx_modules === 0) {
        console.warn('max7219_set_list: Kein Setup-Block gefunden, nutze Standard 4 Module.');
    }
    const totalWidth = modules * 8;

    const ids = listStr.split(',').map(p => p.trim()).filter(p => p !== '');
    let code = `  // --- Matrix Pixel-Liste: ${listStr} ---\n`;
    
    ids.forEach(id => {
        const val = parseInt(id);
        if (!isNaN(val)) {
            const row = Math.floor(val / totalWidth);
            const col = val % totalWidth;
            code += `  P.getGraphicObject()->setPoint(${row}, ${col}, ${state});\n`;
        }
    });
    return code;
};

ArduinoGenerator.forBlock['max7219_control'] = function(block) {
    const action = block.getFieldValue('ACTION');
    return `  P.${action};\n`;
};