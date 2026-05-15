// ====================================================================
// BLOCK: Modulo (Rest der Division)
// ====================================================================

Blockly.defineBlocksWithJsonArray([{
    "type": "math_modulo",
    "message0": "Rest von: %1 geteilt durch: %2",
    "args0": [
        {"type": "input_value", "name": "DIVIDEND", "check": "Number"},
        {"type": "input_value", "name": "DIVISOR", "check": "Number"}
    ],
    "inputsInline": true,
    "output": "Number",
    "colour": 230,
    "tooltip": "Berechnet den Rest einer Division (z.B. 10 % 3 = 1). Perfekt für gerade/ungerade Prüfungen."
}]);

ArduinoGenerator.forBlock['math_modulo'] = function(block) {
    const dividend = ArduinoGenerator.valueToCode(block, 'DIVIDEND', 0) || '0';
    const divisor = ArduinoGenerator.valueToCode(block, 'DIVISOR', 0) || '1';

    // Cast auf int – % Operator funktioniert in C++ nur mit Ganzzahlen
    return [`((int)${dividend} % (int)${divisor})`, 0];
};
