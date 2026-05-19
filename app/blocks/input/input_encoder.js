
Blockly.defineBlocksWithJsonArray([{
    "type": "input_encoder",
    "message0": "Drehgeber | CLK: %1 DT: %2",
    "args0": [
        {"type": "field_number", "name": "PIN_CLK", "value": 2, "min": 0},
        {"type": "field_number", "name": "PIN_DT",  "value": 3, "min": 0}
    ],
    "message1": "Schritte pro Raste: %1",
    "args1": [
        {
            "type": "field_dropdown",
            "name": "DIVISOR",
            "options": [
                ["keine Teilung (1 Schritt)",  "1"],
                ["÷ 2  (2 Schritte/Raste)",    "2"],
                ["÷ 4  (4 Schritte/Raste)",    "4"],
                ["÷ 6  (6 Schritte/Raste)",    "6"]
            ]
        }
    ],
    "message2": "Wert speichern in: %1",
    "args2": [
        {"type": "field_variable", "name": "VAR_NAME", "variable": "encoderWert"}
    ],
    "colour": 45,
    "tooltip": "Rotary Encoder per Interrupt. 'Schritte pro Raste' korrigiert Encoder die 2 oder 4 Impulse pro Klick senden — der gespeicherte Wert zählt immer in ganzen Rasten."
}]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['input_encoder'] = function(block) {
    const clk     = block.getFieldValue('PIN_CLK');
    const dt      = block.getFieldValue('PIN_DT');
    const varName = block.getField('VAR_NAME').getText();
    const divisor = parseInt(block.getFieldValue('DIVISOR'));

    // Aufsteigender Zähler → sauber lesbar, kollisionsfrei
    if (!ArduinoGenerator._encoderCount) ArduinoGenerator._encoderCount = 0;
    ArduinoGenerator._encoderCount++;
    const id      = ArduinoGenerator._encoderCount;
    const isrName = `isr_logickiste_${id}`;

    // 1. Nutzervariable als volatile long anmelden
    ArduinoGenerator.globals_.add(`volatile long ${varName} = 0;`);

    // Sperrliste: verhindert Doppel-Deklaration durch den Core
    if (!ArduinoGenerator.suppressedVars_) ArduinoGenerator.suppressedVars_ = new Set();
    ArduinoGenerator.suppressedVars_.add(varName);

    // 2. Interne Hilfsvariablen (Flanke + Rohzähler bei Teilung)
    ArduinoGenerator.globals_.add(`volatile bool lastClk_${id} = LOW;`);

    if (divisor > 1) {
        // Rohzähler zählt jeden Impuls, Nutzervariable = rawCount / divisor
        ArduinoGenerator.globals_.add(`volatile long rawCount_${id} = 0;`);
    }

    // 3. ISR generieren
    let isr = `void ${isrName}() {\n`;
    isr    += `  bool clkState = digitalRead(${clk});\n`;
    isr    += `  if (clkState != lastClk_${id}) {\n`;
    isr    += `    if (digitalRead(${dt}) != clkState) {\n`;

    if (divisor > 1) {
        isr += `      rawCount_${id}++;\n`;
    } else {
        isr += `      ${varName}++;\n`;
    }

    isr    += `    } else {\n`;

    if (divisor > 1) {
        isr += `      rawCount_${id}--;\n`;
    } else {
        isr += `      ${varName}--;\n`;
    }

    isr    += `    }\n`;

    if (divisor > 1) {
        // Nutzervariable hält immer den geteilten (echten Rasten-) Wert
        isr += `    ${varName} = rawCount_${id} / ${divisor};\n`;
    }

    isr    += `  }\n`;
    isr    += `  lastClk_${id} = clkState;\n`;
    isr    += `}\n`;

    ArduinoGenerator.isrFunctions_.push(isr);

    // 4. Setup
    let setup  = `  pinMode(${clk}, INPUT_PULLUP);\n`;
    setup     += `  pinMode(${dt},  INPUT_PULLUP);\n`;
    setup     += `  lastClk_${id} = digitalRead(${clk});\n`;
    setup     += `  attachInterrupt(digitalPinToInterrupt(${clk}), ${isrName}, CHANGE);\n`;

    ArduinoGenerator.autoSetupInterrupts_.push(setup);
};

// Freischwebender Block
ArduinoGenerator.forBlock['input_encoder'] = function(block) {
    return '';
};
