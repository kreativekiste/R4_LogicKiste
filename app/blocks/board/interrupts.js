// ==========================================
// BAUTEIL: INTERRUPTS (R4 - Hardware)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "board_pc_interrupt",
        "message0": "INTERRUPT 2,3,8,13 Pin %1 %2 Modus: %3 %4 Auslösen bei: %5 %6 Mache: %7",
        "args0": [
            {
                "type": "field_number", 
                "name": "PIN", 
                "value": 2, 
                "min": 0, 
                "max": 13
            },
            {"type": "input_dummy"},
            {
                "type": "field_dropdown", 
                "name": "RESISTOR", 
                "options": [
                    ["PULL-UP", "INPUT_PULLUP"],
                    ["INPUT", "INPUT"]
                ]
            },
            {"type": "input_dummy"},
            {
                "type": "field_dropdown", 
                "name": "MODE", 
                "options": [
                    ["RISING", "RISING"], 
                    ["FALLING", "FALLING"], 
                    ["CHANGE", "CHANGE"], 
                    ["LOW", "LOW"],
                    ["HIGH", "HIGH"]
                ]
            },
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 230,
        "tooltip": "Führt Code sofort aus."
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['board_pc_interrupt'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    const resistor = block.getFieldValue('RESISTOR'); // Holt "INPUT" oder "INPUT_PULLUP"
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    const funcName = `isr_pin_${pin}_LogicKiste`;

    // 1. Lass deinen Kern die Pin-Definition (const int) übernehmen:
    ArduinoGenerator.usedPinsInput.add(pin);
    
    // 2. Dem Kern die Entscheidung über den Widerstand übergeben
    // Der Kern schreibt jetzt zuverlässig 1x den pinMode (egal ob INPUT oder INPUT_PULLUP)
    ArduinoGenerator.pinModes.set(pin, resistor);
    ArduinoGenerator.pinModes.set(Number(pin), resistor);

    // 3. NUR noch den attachInterrupt in die Setup-Warteschlange schieben
    let setupCode = `  attachInterrupt(digitalPinToInterrupt(pin${pin}), ${funcName}, ${mode});\n`;
    ArduinoGenerator.autoSetupInterrupts_.push(setupCode);

    // 4. Die ISR-Funktion ganz ans Ende schreiben
    ArduinoGenerator.isrFunctions_.push(`void ${funcName}() {\n${branch}}\n`);
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['board_pc_interrupt'] = function(block) {
    return '';
};