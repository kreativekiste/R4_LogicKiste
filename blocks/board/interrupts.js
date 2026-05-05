// ==========================================
// BAUTEIL: INTERRUPTS (R4 - Hardware)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "board_pc_interrupt",
        "message0": "Interrupt bei Ereignis %1 PIN: %2 %3 Auslöser: %4 %5 MACHE %6",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_number", "name": "PIN", "value": 2, "min": 0, "max": 13},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "MODE", "options": [
                ["Steigend (RISING)", "RISING"], 
                ["Fallend (FALLING)", "FALLING"], 
                ["Wechsel (CHANGE)", "CHANGE"], 
                ["Tief (LOW)", "LOW"],
                ["Hoch (HIGH)", "HIGH"]
            ]},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 210,
        "tooltip": "Führt den Code sofort aus, wenn das Ereignis eintritt. Unterbricht das Hauptprogramm."
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['board_pc_interrupt'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const funcName = `isr_pin_${pin}_${safeId}`;

    // 1. Zentrale Pin-Registrierung nutzen, um "const int pinX" zu generieren
    ArduinoGenerator.usedPinsInput.add(pin);
    
    // 2. Erzwungener PULLUP für diesen Block über das Kern-System
    ArduinoGenerator.pinModes.set(pin, 'INPUT_PULLUP');

    // 3. Die ISR-Funktion nach loop() schreiben (nicht in globals_!)
    ArduinoGenerator.isrFunctions_.push(`void ${funcName}() {\n${branch}}\n`);

    // 4. attachInterrupt NACH allen anderen pinMode-Aufrufen (autoSetupInterrupts_!)
    // generator_core.js erstellt die Variable 'pinX', diese nutzen wir hier:
    let setupCode = `  attachInterrupt(digitalPinToInterrupt(pin${pin}), ${funcName}, ${mode});\n`;
    ArduinoGenerator.autoSetupInterrupts_.push(setupCode);
};

// --- GENERATOR LOGIK ---
// Da der Block freischwebend auf der Fläche liegt (nicht im Loop):
ArduinoGenerator.forBlock['board_pc_interrupt'] = function(block) {
    return '';
};