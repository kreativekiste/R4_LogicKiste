// ==========================================
// BAUTEIL: ROTARY ENCODER (Interrupt-gesteuert)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "input_encoder",
    "message0": "Drehgeber an CLK: %1 DT: %2",
    "args0": [
        // field_number erzwingt reine Zahlen, Buchstaben wie "A" sind gesperrt
        {"type": "field_number", "name": "PIN_CLK", "value": 2, "min": 0},
        {"type": "field_number", "name": "PIN_DT", "value": 3, "min": 0}
    ],
    "message1": "Wert speichern in Variable: %1",
    "args1": [
        {
            "type": "field_variable", 
            "name": "VAR_NAME", 
            "variable": "encoderWert"
        }
    ],
    "colour": 45,
    "tooltip": "Liest einen Drehgeber per Interrupt aus."
}]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['input_encoder'] = function(block) {
    const clk = block.getFieldValue('PIN_CLK');
    const dt = block.getFieldValue('PIN_DT');
    const varName = block.getField('VAR_NAME').getText();
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const isrName = `isr_encoder_${safeId}`;

    // 1. KRITISCH: Variable als 'volatile' global anmelden! 
    // Darf nicht über customVariables laufen, da ISR-Daten sonst wegoptimiert werden.
    ArduinoGenerator.globals_.add(`volatile long ${varName} = 0;`);

    // 2. Hilfsvariable für die Flankenerkennung (global, ebenfalls volatile)
    ArduinoGenerator.globals_.add(`volatile bool lastClk_${safeId} = LOW;`);

    // 3. Die Interrupt-Service-Routine (ISR) erstellen
    let isrCode = `void ${isrName}() {\n`;
    isrCode += `  bool clkState = digitalRead(${clk});\n`;
    isrCode += `  if (clkState != lastClk_${safeId}) {\n`;
    isrCode += `    if (digitalRead(${dt}) != clkState) {\n`;
    isrCode += `      ${varName}++;\n`;
    isrCode += `    } else {\n`;
    isrCode += `      ${varName}--;\n`;
    isrCode += `    }\n`;
    isrCode += `  }\n`;
    isrCode += `  lastClk_${safeId} = clkState;\n`;
    isrCode += `}\n`;
    
    ArduinoGenerator.isrFunctions_.push(isrCode);

    // 4. Setup: Harte Codierung ohne Core-Registrierung (Wie angefordert)
    let setup = `  pinMode(${clk}, INPUT_PULLUP);\n`;
    setup += `  pinMode(${dt}, INPUT_PULLUP);\n`;
    setup += `  lastClk_${safeId} = digitalRead(${clk});\n`;
    setup += `  attachInterrupt(digitalPinToInterrupt(${clk}), ${isrName}, CHANGE);\n`;
    
    ArduinoGenerator.autoSetupInterrupts_.push(setup);
};

// Freischwebender Block
ArduinoGenerator.forBlock['input_encoder'] = function(block) {
    return '';
};