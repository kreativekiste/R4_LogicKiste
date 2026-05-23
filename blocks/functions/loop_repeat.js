
Blockly.defineBlocksWithJsonArray([{
    "type": "loop_repeat",
    "message0": "Wiederhole %1 mal",
    "args0": [
        { 
            "type": "input_value", 
            "name": "TIMES",
            "check": "Number" 
        }
    ],
    "message1": "MACHE %1",
    "args1": [{ "type": "input_statement", "name": "DO" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290,
    "tooltip": "Führt die enthaltenen Blöcke in der Schleife so oft aus, wie angegeben."
}]);

ArduinoGenerator.forBlock['loop_repeat'] = function(block) {
    const repeats = ArduinoGenerator.valueToCode(block, 'TIMES', 0) || '0';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    if (!ArduinoGenerator._repeatCount) ArduinoGenerator._repeatCount = 0;
    ArduinoGenerator._repeatCount++;
    const counter = `lk_i${ArduinoGenerator._repeatCount}`;

    return `  for (int ${counter} = 0; ${counter} < ${repeats}; ${counter}++) {\n${branch}  }\n`;
};