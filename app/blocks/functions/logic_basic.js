
Blockly.defineBlocksWithJsonArray([
    // UND / ODER
    {
        "type": "ard_logic_operation",
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "A", "check": "Boolean"},
            {"type": "field_dropdown", "name": "OP", "options": [["UND (&&)", "&&"], ["ODER (||)", "||"]]},
            {"type": "input_value", "name": "B", "check": "Boolean"}
        ],
        "output": "Boolean",
        "colour": 280,
        "tooltip": "Verknüpft zwei Bedingungen mit UND oder ODER. Akzeptiert nur Logik-Werte."
    },
    // NICHT
    {
        "type": "ard_logic_negate",
        "message0": "NICHT %1",
        "args0": [{"type": "input_value", "name": "BOOL", "check": "Boolean"}],
        "output": "Boolean",
        "colour": 280,
        "tooltip": "Kehrt den Wahrheitswert um (aus WAHR wird FALSCH und umgekehrt)."
    },
    // WAHR / FALSCH
    {
        "type": "ard_logic_boolean",
        "message0": "%1",
        "args0": [{"type": "field_dropdown", "name": "BOOL", "options": [["WAHR", "true"], ["FALSCH", "false"]]}],
        "output": "Boolean",
        "colour": 280,
        "tooltip": "Gibt entweder WAHR (true) oder FALSCH (false) zurück."
    }
]);

// GENERATOR LOGIK

ArduinoGenerator.forBlock['ard_logic_operation'] = function(block) {
    const valA = ArduinoGenerator.valueToCode(block, 'A', 0) || 'false';
    const op = block.getFieldValue('OP');
    const valB = ArduinoGenerator.valueToCode(block, 'B', 0) || 'false';
    return [`(${valA} ${op} ${valB})`, 0];
};

ArduinoGenerator.forBlock['ard_logic_negate'] = function(block) {
    const val = ArduinoGenerator.valueToCode(block, 'BOOL', 0) || 'false';
    return [`!(${val})`, 0];
};

ArduinoGenerator.forBlock['ard_logic_boolean'] = function(block) {
    return [block.getFieldValue('BOOL'), 0];
};