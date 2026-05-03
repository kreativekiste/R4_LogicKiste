Blockly.defineBlocksWithJsonArray([{
    "type": "read_analog",
    "message0": "Lese Analog-PIN %1",
    "args0": [
        {"type": "field_dropdown", "name": "PIN", "options": [
            ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
        ]}
    ],
    "output": "Number",
    "colour": 45
}]);

ArduinoGenerator.forBlock['read_analog'] = function(block) {
    const pin = block.getFieldValue('PIN');
    // Analoge Pins brauchen kein pinMode — separates Set verhindert INPUT_PULLUP im Setup
    ArduinoGenerator.usedPinsAnalog.add(pin);
    return [`analogRead(pin${pin})`, ArduinoGenerator.PRECEDENCE];
};