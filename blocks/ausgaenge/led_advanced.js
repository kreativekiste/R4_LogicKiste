// ==========================================
// BAUTEILE: ADVANCED LEDs (FastLED & LedControl)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- NEOPIXEL (FastLED) ---
    {
        "type": "out_fastled",
        "message0": "NeoPixel (FastLED) PIN %1 Gesamt-LEDs: %2 %3 Setze LED Nr. %4 auf Farbe (R:%5 G:%6 B:%7) %8",
        "args0": [
            {"type": "field_number", "name": "PIN", "value": 6},
            {"type": "field_number", "name": "NUM_LEDS", "value": 16},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "INDEX"},
            {"type": "field_number", "name": "R", "value": 255, "min": 0, "max": 255},
            {"type": "field_number", "name": "G", "value": 0, "min": 0, "max": 255},
            {"type": "field_number", "name": "B", "value": 0, "min": 0, "max": 255},
            {"type": "input_dummy"}
        ],
        "message1": "Änderung anzeigen (Show) %1",
        "args1": [{"type": "field_checkbox", "name": "SHOW", "checked": true}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // --- MAX7219 MATRIX ---
    {
        "type": "out_max7219",
        "message0": "MAX7219 Matrix (DIN:%1 CS:%2 CLK:%3) %4 Setze Pixel X:%5 Y:%6 auf %7",
        "args0": [
            {"type": "field_number", "name": "DIN", "value": 12},
            {"type": "field_number", "name": "CS", "value": 10},
            {"type": "field_number", "name": "CLK", "value": 11},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "X"},
            {"type": "input_value", "name": "Y"},
            {"type": "field_dropdown", "name": "STATE", "options": [["AN", "true"], ["AUS", "false"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    }
]);

ArduinoGenerator.forBlock['out_fastled'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const numLeds = block.getFieldValue('NUM_LEDS');
    const r = block.getFieldValue('R');
    const g = block.getFieldValue('G');
    const b = block.getFieldValue('B');
    const show = block.getFieldValue('SHOW') === 'TRUE';
    const index = ArduinoGenerator.valueToCode(block, 'INDEX', 0) || '0';
    
    const stripName = `leds_pin${pin}`;
    
    // Anmeldung für index.html (damit dort das Array und FastLED.addLeds generiert wird)
    if (!ArduinoGenerator.usedFastLEDs) ArduinoGenerator.usedFastLEDs = new Map();
    ArduinoGenerator.usedFastLEDs.set(stripName, {pin, numLeds});
    
    let code = `  ${stripName}[${index}] = CRGB(${r}, ${g}, ${b});\n`;
    if (show) code += `  FastLED.show();\n`;
    return code;
};

ArduinoGenerator.forBlock['out_max7219'] = function(block) {
    const din = block.getFieldValue('DIN');
    const cs = block.getFieldValue('CS');
    const clk = block.getFieldValue('CLK');
    const state = block.getFieldValue('STATE');
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    
    const matrixName = `matrix_${cs}`;
    
    // Anmeldung für index.html (LedControl)
    if (!ArduinoGenerator.usedMatrices) ArduinoGenerator.usedMatrices = new Map();
    ArduinoGenerator.usedMatrices.set(matrixName, {din, clk, cs});
    
    // LedControl syntax: setLed(addr, row, col, state)
    return `  ${matrixName}.setLed(0, ${y}, ${x}, ${state});\n`;
};