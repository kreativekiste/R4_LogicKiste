// ==========================================
// BAUTEILE: LOGIK GRUNDLAGEN
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // UND / ODER (Mit ard_ Präfix, um Blockly-Konflikte zu vermeiden)
    {
        "type": "ard_logic_operation",
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "A"},
            {"type": "field_dropdown", "name": "OP", "options": [["UND (&&)", "&&"], ["ODER (||)", "||"]]},
            {"type": "input_value", "name": "B"}
        ],
        "output": "Boolean",
        "colour": 210
    },
    // NICHT
    {
        "type": "ard_logic_negate",
        "message0": "NICHT %1",
        "args0": [{"type": "input_value", "name": "BOOL"}],
        "output": "Boolean",
        "colour": 210
    },
    // WAHR / FALSCH
    {
        "type": "ard_logic_boolean",
        "message0": "%1",
        "args0": [{"type": "field_dropdown", "name": "BOOL", "options": [["WAHR", "true"], ["FALSCH", "false"]]}],
        "output": "Boolean",
        "colour": 210
    }
]);

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