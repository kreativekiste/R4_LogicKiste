
Blockly.defineBlocksWithJsonArray([{
    "type": "read_analog",
    "message0": "Lese Analog-PIN %1",
    "args0": [
        {
            "type": "field_input", 
            "name": "PIN", 
            "text": "A0"
        }
    ],
    "output": "Number",
    "colour": 45,
    "tooltip": "Liest einen analogen Wert (0 bis 1023). Unterstützt A0 bis A5 und weitere analogfähige Pins des R4."
}]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['read_analog'] = function(block) {
    const pin = block.getFieldValue('PIN');
    
    ArduinoGenerator.usedPinsAnalog.add(pin);
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['read_analog'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(pin${pin})`, 0];
};