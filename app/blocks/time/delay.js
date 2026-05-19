
Blockly.defineBlocksWithJsonArray([{
    "type": "delay_ms",
    "message0": "Warten %1 ms",
    "args0": [
        {
            "type": "input_value",
            "name": "TIME",
            "check": "Number"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290,
    "tooltip": "ACHTUNG: Pausiert den gesamten Arduino. Besser millis() oder Timer verwenden!"
}]);

ArduinoGenerator.forBlock['delay_ms'] = function(block) {
    const time = ArduinoGenerator.valueToCode(block, 'TIME', 0) || '1000';
    
    return `  delay(${time});\n`;
};