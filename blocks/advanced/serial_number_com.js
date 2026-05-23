Blockly.defineBlocksWithJsonArray([{
    "type": "ard_serial_read_number",
    "message0": "Lese Serial Daten (als Zahl)",
    "output": "Number",
    "colour": 160,
    "tooltip": "Liest ankommende serielle Daten direkt als ganze Zahl (int) aus. Text wird ignoriert."
}]);

ArduinoGenerator.forBlock['ard_serial_read_number'] = function(block) {
    return ['Serial.parseInt()', 0]; 
};