
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
        "tooltip": "Führt Code sofort per Hardware-Interrupt aus."
    }
]);

ArduinoGenerator.hardwareScanners['board_pc_interrupt'] = function(block) {
    const pin      = block.getFieldValue('PIN');
    const mode     = block.getFieldValue('MODE');
    const resistor = block.getFieldValue('RESISTOR');
    const funcName = `isr_pin_${pin}_LogicKiste`;

    ArduinoGenerator.usedPinsInput.add(String(pin));
    ArduinoGenerator.pinModes.set(String(pin), resistor);

    ArduinoGenerator.autoSetupInterrupts_.push(
        `  attachInterrupt(digitalPinToInterrupt(pin${pin}), ${funcName}, ${mode});\n`
    );
};

ArduinoGenerator.forBlock['board_pc_interrupt'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const funcName = `isr_pin_${pin}_LogicKiste`;
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    ArduinoGenerator.isrFunctions_.push(`void ${funcName}() {\n${branch}}\n`);
    return '';
};