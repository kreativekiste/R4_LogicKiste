
Blockly.defineBlocksWithJsonArray([{
    "type": "loop_for",
    "message0": "🔄 Zähle %1 von %2 bis %3 mit Schrittweite %4",
    "args0": [
        {"type": "field_input", "name": "VAR", "text": "i"},
        {"type": "field_number", "name": "START", "value": 0},
        {"type": "field_number", "name": "END", "value": 10},
        {"type": "field_number", "name": "STEP", "value": 1, "min": 1}
    ],
    "message1": "Mache: %1",
    "args1": [{"type": "input_statement", "name": "DO"}],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290,
    "tooltip": "Wiederholt die Blöcke und zählt dabei die Variable hoch oder runter."
}]);

ArduinoGenerator.forBlock['loop_for'] = function(block) {
    const varName = block.getFieldValue('VAR').replace(/[^a-zA-Z0-9_]/g, '') || 'i';
    const start = block.getFieldValue('START');
    const end = block.getFieldValue('END');
    const step = Math.abs(parseFloat(block.getFieldValue('STEP'))) || 1;
    const branch = ArduinoGenerator.statementToCode(block, 'DO');

    if (parseFloat(start) <= parseFloat(end)) {
        return `  for (int ${varName} = ${start}; ${varName} <= ${end}; ${varName} += ${step}) {\n${branch}  }\n`;
    } else {
        return `  for (int ${varName} = ${start}; ${varName} >= ${end}; ${varName} -= ${step}) {\n${branch}  }\n`;
    }
};
