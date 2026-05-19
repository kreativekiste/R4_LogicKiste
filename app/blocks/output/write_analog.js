
Blockly.defineBlocksWithJsonArray([{
    "type": "write_analog",  
    "message0": "Schreibe (PWM) an PIN %1",
    "args0": [
        {
            "type": "field_input", 
            "name": "PIN", 
            "text": "9"
        }
    ],
    "message1": "Wert (0-255): %1",
    "args1": [
        {
            "type": "input_value",
            "name": "VAL",
            "check": "Number"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Schreibe analogen Wert an Pin"
}]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['write_analog'] = function(block) { 
    const pin = block.getFieldValue('PIN').trim();
    ArduinoGenerator.usedPinsOutput.add(pin);
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['write_analog'] = function(block) { 
    const pin = block.getFieldValue('PIN').trim();
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    
    return `  analogWrite(pin${pin}, ${val});\n`;
};