// ==========================================
// BAUTEILE: TM-SERIE (TM1637 & TM1638)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // ==========================================
    // 1. TM1637 (Kleines 4-Digit Display)
    // ==========================================
    {
        "type": "ard_visu_tm1637_setup",
        "message0": "Setup 4-Digit (TM1637) CLK: %1 DIO: %2",
        "args0": [
            { "type": "field_number", "name": "CLK", "value": 2, "min": 0, "max": 53 },
            { "type": "field_number", "name": "DIO", "value": 3, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Startet das kleine 4-stellige Display. Gehört ins SETUP!"
    },
    {
        "type": "ard_visu_tm1637_print",
        "message0": "TM1637 zeige Zahl: %1",
        "args0": [
            { "type": "input_value", "name": "NUM", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Zeigt eine Zahl auf dem TM1637 Display an."
    },

    // ==========================================
    // 2. TM1638 (Großes 8-Digit Pult mit LEDs & Tasten)
    // ==========================================
    {
        "type": "ard_visu_tm1638_setup",
        "message0": "Setup 8-Digit Pult (TM1638) STB: %1 CLK: %2 DIO: %3",
        "args0": [
            { "type": "field_number", "name": "STB", "value": 4, "min": 0, "max": 53 },
            { "type": "field_number", "name": "CLK", "value": 5, "min": 0, "max": 53 },
            { "type": "field_number", "name": "DIO", "value": 6, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Startet das TM1638 Modul. Gehört ins SETUP!"
    },
    {
        "type": "ard_visu_tm1638_print",
        "message0": "TM1638 zeige Zahl: %1",
        "args0": [
            { "type": "input_value", "name": "NUM", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Zeigt eine Zahl auf den 8 Ziffern an."
    },
    {
        "type": "ard_visu_tm1638_led",
        "message0": "TM1638 LED Nr. %1 schalten auf %2",
        "args0": [
            { "type": "field_number", "name": "LED_NUM", "value": 1, "min": 1, "max": 8 },
            { "type": "input_value", "name": "STATE", "check": "Boolean" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Schaltet eine der 8 LEDs über dem Display an oder aus."
    },
    {
        "type": "ard_visu_tm1638_button",
        "message0": "TM1638 Taste Nr. %1 gedrückt?",
        "args0": [
            { "type": "field_number", "name": "BTN_NUM", "value": 1, "min": 1, "max": 8 }
        ],
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn die ausgewählte Taste gedrückt wird."
    }
]);

// ==========================================
// DEZENTRALE SCANNER (Libraries & Globals)
// ==========================================

// --- TM1637 Scanner ---
ArduinoGenerator.hardwareScanners['ard_visu_tm1637_setup'] = function(block) {
    // FIX Bug 4: Wächter gegen doppelte Deklaration
    if (ArduinoGenerator.initializedTM1637) return;
    ArduinoGenerator.initializedTM1637 = true;

    const clk = block.getFieldValue('CLK');
    const dio = block.getFieldValue('DIO');
    
    // FIX Bug 3: includes_ statt globals_ für #include
    ArduinoGenerator.includes_.add('#include <TM1637Display.h>');
    ArduinoGenerator.globals_.add(`const int TM1637_CLK = ${clk};\nconst int TM1637_DIO = ${dio};`);
    ArduinoGenerator.globals_.add(`TM1637Display displayTM(TM1637_CLK, TM1637_DIO);`);
};

// --- TM1638 Scanner ---
ArduinoGenerator.hardwareScanners['ard_visu_tm1638_setup'] = function(block) {
    // FIX Bug 4: Wächter gegen doppelte Deklaration
    if (ArduinoGenerator.initializedTM1638) return;
    ArduinoGenerator.initializedTM1638 = true;

    const stb = block.getFieldValue('STB');
    const clk = block.getFieldValue('CLK');
    const dio = block.getFieldValue('DIO');
    
    // FIX Bug 3: includes_ statt globals_ für #include
    ArduinoGenerator.includes_.add('#include <TM1638plus.h>');
    ArduinoGenerator.globals_.add(`const int TM1638_STB = ${stb};\nconst int TM1638_CLK = ${clk};\nconst int TM1638_DIO = ${dio};`);
    // false = Standardfrequenz, gut für die meisten Boards
    ArduinoGenerator.globals_.add(`TM1638plus tm(TM1638_STB, TM1638_CLK, TM1638_DIO, false);`);
};

// ==========================================
// GENERATOR LOGIK (Setup & Loop)
// ==========================================

// --- TM1637 ---
ArduinoGenerator.forBlock['ard_visu_tm1637_setup'] = function(block) {
    return `  displayTM.setBrightness(0x0f); // Maximale Helligkeit\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1637_print'] = function(block) {
    const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
    return `  displayTM.showNumberDec(${num});\n`;
};

// --- TM1638 ---
ArduinoGenerator.forBlock['ard_visu_tm1638_setup'] = function(block) {
    return `  tm.displayBegin();\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_print'] = function(block) {
    const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
    // false = keine führenden Nullen anzeigen
    return `  tm.displayIntNum(${num}, false);\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_led'] = function(block) {
    // Minus 1, da C++ Arrays und Indizes bei 0 anfangen (Taste 1 = Index 0)
    const ledIndex = block.getFieldValue('LED_NUM') - 1; 
    const state = ArduinoGenerator.valueToCode(block, 'STATE', 0) || 'false';
    return `  tm.setLED(${ledIndex}, ${state});\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_button'] = function(block) {
    // Minus 1, um von 1-8 auf die Bits 0-7 zu mappen
    const btnIndex = block.getFieldValue('BTN_NUM') - 1;
    // Liest das Byte aller Tasten und prüft per Bitshift, ob die spezifische Taste gedrückt ist
    const code = `((tm.readButtons() & (1 << ${btnIndex})) != 0)`;
    return [code, 0];
};
