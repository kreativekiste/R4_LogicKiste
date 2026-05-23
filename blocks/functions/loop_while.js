
Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_loop_while",
        "message0": "Solange %1 %2 mache %3",
        "args0": [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": ["Boolean", "Number"] 
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt die enthaltenen Blöcke immer wieder aus, solange die Bedingung WAHR ist. "
    }
]);

ArduinoGenerator.forBlock['ard_loop_while'] = function(block) {
    const condition = ArduinoGenerator.valueToCode(block, 'CONDITION', 0) || 'false';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    return `  while (${condition}) {\n${branch}  }\n`;
};