Blockly.defineBlocksWithJsonArray([{
    "type": "write_analog",
    "message0": "Schreibe Analog-PIN (PWM) %1 auf %2",
    "args0": [
        {"type": "field_number", "name": "PIN", "value": 9, "min": 0},
        {"type": "field_number", "name": "VAL", "value": 255, "min": 0, "max": 255}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160
}]);

ArduinoGenerator.forBlock['write_analog'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const val = block.getFieldValue('VAL');
    ArduinoGenerator.usedPinsOutput.add(pin);
    return `  analogWrite(pin${pin}, ${val});\n`;
};