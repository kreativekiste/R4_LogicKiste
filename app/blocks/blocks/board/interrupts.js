// ==========================================
// BAUTEIL: INTERRUPTS (R4 - Hardware)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "board_pc_interrupt",
        "message0": "INTERRUPT Pin %1 %2 Modus: %3 %4 Auslösen bei: %5 %6 Mache: %7",
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
                    ["INPUT",   "INPUT"]
                ]
            },
            {"type": "input_dummy"},
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    ["RISING",   "RISING"],
                    ["FALLING",  "FALLING"],
                    ["CHANGE",   "CHANGE"],
                    ["LOW",      "LOW"],
                    ["HIGH",     "HIGH"]
                ]
            },
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 230,
        "tooltip": "Führt Code sofort per Hardware-Interrupt aus. Variablen die du hier hochzählst werden automatisch als 'volatile' deklariert damit der Compiler sie nicht wegoptimiert."
    }
]);


// --- DEZENTRALER SCANNER ---
// ISR-Generierung im Scanner — weil der Block freischwebend ist und forBlock
// nur auf Blöcken in einer Statement-Kette läuft. Ohne Scanner-Generierung
// entsteht eine Forward-Deklaration ohne Definition → Linker-Fehler.
ArduinoGenerator.hardwareScanners['board_pc_interrupt'] = function(block) {
    const pin      = block.getFieldValue('PIN');
    const mode     = block.getFieldValue('MODE');
    const resistor = block.getFieldValue('RESISTOR');
    const funcName = `isr_pin_${pin}_LogicKiste`;

    // 1. Pin-Definition dem Kern übergeben — immer als String, kein Typ-Mismatch
    ArduinoGenerator.usedPinsInput.add(String(pin));

    // 2. Widerstandsmodus setzen (INPUT oder INPUT_PULLUP)
    ArduinoGenerator.pinModes.set(String(pin), resistor);

    // 3. Alle Blockly-Variablen im DO-Bereich als volatile anmelden
    if (!ArduinoGenerator.suppressedVars_) ArduinoGenerator.suppressedVars_ = new Set();
    const doBlock = block.getInputTargetBlock('DO');
    if (doBlock) {
        const collectVars = (b) => {
            if (!b) return;
            b.inputList.forEach(input => {
                input.fieldRow.forEach(field => {
                    if (field instanceof Blockly.FieldVariable) {
                        const vName = field.getText();
                        if (vName && !ArduinoGenerator.suppressedVars_.has(vName)) {
                            ArduinoGenerator.globals_.add(`volatile long ${vName} = 0;`);
                            ArduinoGenerator.suppressedVars_.add(vName);
                        }
                    }
                });
            });
            b.getChildren(false).forEach(child => collectVars(child));
        };
        collectVars(doBlock);
    }

    // 4. ISR-Body generieren (statementToCode hier OK — Block ist vollständig initialisiert)
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    ArduinoGenerator.isrFunctions_.push(`void ${funcName}() {\n${branch}}\n`);

    // 5. attachInterrupt in Setup-Warteschlange (läuft nach allen pinMode-Aufrufen)
    ArduinoGenerator.autoSetupInterrupts_.push(
        `  attachInterrupt(digitalPinToInterrupt(pin${pin}), ${funcName}, ${mode});\n`
    );
};


// --- GENERATOR LOGIK ---
// Freischwebender Block — der Scanner übernimmt alles, forBlock gibt nur '' zurück
ArduinoGenerator.forBlock['board_pc_interrupt'] = function(block) {
    return '';
};
