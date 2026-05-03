Blockly.defineBlocksWithJsonArray([{
    "type": "delay_ms",
    "message0": "Warten %1 ms",
    "args0": [
        {"type": "field_number", "name": "TIME", "value": 1000, "min": 0}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290
}]);

ArduinoGenerator.forBlock['delay_ms'] = function(block) {
    const time = block.getFieldValue('TIME');
    return `  delay(${time});\n`;
};