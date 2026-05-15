// ==========================================
// BAUTEILE: MATHE GRUNDLAGEN
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // Einfache Zahl (Mit ard_ Präfix)
    {
        "type": "ard_math_number",
        "message0": "%1",
        "args0": [{"type": "field_number", "name": "NUM", "value": 0}],
        "output": "Number",
        "colour": 230,
        "tooltip": "Eine einfache Zahl."
    },
    // Rechnen
    {
        "type": "ard_math_arithmetic",
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "A", "check": "Number"},
            {"type": "field_dropdown", "name": "OP", "options": [["+", "+"], ["-", "-"], ["*", "*"], ["/", "/"], ["Modulo (%)", "%"]]},
            {"type": "input_value", "name": "B", "check": "Number"}
        ],
        "inputsInline": true, // Hinzugefügt für bessere horizontale Lesbarkeit
        "output": "Number",
        "colour": 230,
        "tooltip": "Führt einfache mathematische Berechnungen durch."
    }
]);

ArduinoGenerator.forBlock['ard_math_number'] = function(block) {
    return [block.getFieldValue('NUM'), 0];
};

ArduinoGenerator.forBlock['ard_math_arithmetic'] = function(block) {
    const valA = ArduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const op = block.getFieldValue('OP');
    const valB = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    
    // Klammern sind extrem wichtig für die C++ Operatorrangfolge
    return [`(${valA} ${op} ${valB})`, 0];
};