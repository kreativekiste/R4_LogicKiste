// ==========================================
// BAUTEILE: ADVANCED LEDs (FastLED & LedControl)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. NEOPIXEL (FastLED) ---
    {
        "type": "out_fastled",
        "message0": "FastLED PIN %1 | LEDs: %2",
        "args0": [
            { "type": "field_input", "name": "PIN", "text": "6" },
            { "type": "field_number", "name": "NUM_LEDS", "value": 16, "min": 1 }
        ],
        "message1": "Setze LED Nr. %1 auf R: %2 G: %3 B: %4",
        "args1": [
            { "type": "input_value", "name": "INDEX", "check": "Number" },
            { "type": "input_value", "name": "R", "check": "Number" },
            { "type": "input_value", "name": "G", "check": "Number" },
            { "type": "input_value", "name": "B", "check": "Number" }
        ],
        "message2": "Sofort anzeigen (Show): %1",
        "args2": [{ "type": "field_checkbox", "name": "SHOW", "checked": true }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt eine Farbe via FastLED. Der Index startet bei 0."
    },
    // --- 2. MAX7219 MATRIX (LedControl) ---
    {
        "type": "out_max7219_lc",
        "message0": "Matrix (LedControl) DIN:%1 CS:%2 CLK:%3",
        "args0": [
            { "type": "field_input", "name": "DIN", "text": "12" },
            { "type": "field_input", "name": "CS", "text": "10" },
            { "type": "field_input", "name": "CLK", "text": "11" }
        ],
        "message1": "Setze Pixel X:%1 Y:%2 auf %3",
        "args1": [
            { "type": "input_value", "name": "X", "check": "Number" },
            { "type": "input_value", "name": "Y", "check": "Number" },
            { "type": "field_dropdown", "name": "STATE", "options": [["AN", "true"], ["AUS", "false"]] }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Einfache Matrix-Steuerung via LedControl Library."
    }
]);

// --- DEZENTRALE SCANNERS ---

ArduinoGenerator.hardwareScanners['out_fastled'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const num = block.getFieldValue('NUM_LEDS');
    const stripName = `leds_pin_${safePin}`;

    // 1. Pin im Core anmelden
    ArduinoGenerator.usedPinsOutput.add(rawPin);

    // 2. Scanner-Gedächtnis prüfen
    if (!ArduinoGenerator.initializedFastLEDs) {
        ArduinoGenerator.initializedFastLEDs = new Set();
    }

    if (!ArduinoGenerator.initializedFastLEDs.has(safePin)) {
        ArduinoGenerator.initializedFastLEDs.add(safePin);

        ArduinoGenerator.includes_.add('#include <FastLED.h>');
        ArduinoGenerator.globals_.add(`CRGB ${stripName}[${num}];`);
        
        // Setup: LEDs registrieren (Nutzt bewusst rawPin für das Template)
        ArduinoGenerator.autoSetup_.push(`  FastLED.addLeds<NEOPIXEL, ${rawPin}>(${stripName}, ${num});`);
    }
};

ArduinoGenerator.hardwareScanners['out_max7219_lc'] = function(block) {
    const din = block.getFieldValue('DIN');
    const cs = block.getFieldValue('CS');
    const clk = block.getFieldValue('CLK');
    const safeCS = cs.replace(/[^a-zA-Z0-9]/g, '');
    const matrixName = `lc_${safeCS}`;

    // 1. Pins im Core anmelden
    ArduinoGenerator.usedPinsOutput.add(din);
    ArduinoGenerator.usedPinsOutput.add(cs);
    ArduinoGenerator.usedPinsOutput.add(clk);

    // 2. Scanner-Gedächtnis prüfen
    if (!ArduinoGenerator.initializedMatrices) {
        ArduinoGenerator.initializedMatrices = new Set();
    }

    if (!ArduinoGenerator.initializedMatrices.has(safeCS)) {
        ArduinoGenerator.initializedMatrices.add(safeCS);

        ArduinoGenerator.includes_.add('#include <LedControl.h>');
        // Nutzt die vom Core erzeugten pin-Variablen für sauberes C++
        ArduinoGenerator.globals_.add(`LedControl ${matrixName} = LedControl(pin${din}, pin${clk}, pin${cs}, 1);`);
        
        // Setup: Initialisierung nur einmal pro Matrix
        ArduinoGenerator.autoSetup_.push(`  ${matrixName}.shutdown(0, false);\n  ${matrixName}.setIntensity(0, 8);\n  ${matrixName}.clearDisplay(0);`);
    }
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['out_fastled'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const safePin = rawPin.replace(/[^a-zA-Z0-9]/g, '');
    const stripName = `leds_pin_${safePin}`;
    
    const index = ArduinoGenerator.valueToCode(block, 'INDEX', 0) || '0';
    const r = ArduinoGenerator.valueToCode(block, 'R', 0) || '0';
    const g = ArduinoGenerator.valueToCode(block, 'G', 0) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    const show = block.getFieldValue('SHOW') === 'TRUE';

    let code = `  ${stripName}[${index}] = CRGB(${r}, ${g}, ${b});\n`;
    if (show) code += `  FastLED.show();\n`;
    return code;
};

ArduinoGenerator.forBlock['out_max7219_lc'] = function(block) {
    const cs = block.getFieldValue('CS');
    const safeCS = cs.replace(/[^a-zA-Z0-9]/g, '');
    const matrixName = `lc_${safeCS}`;
    
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const state = block.getFieldValue('STATE');

    return `  ${matrixName}.setLed(0, ${y}, ${x}, ${state});\n`;
};
```</NEOPIXEL,>