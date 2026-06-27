// ====================================================================
// BLOCK: Logik-Test (Ternärer Operator)
// ====================================================================

Blockly.defineBlocksWithJsonArray([{
    "type": "release_logic_ternary",
    "message0": "❓ Test: %1 ➔ Wenn WAHR: %2 ➔ Wenn FALSCH: %3",
    "args0": [
        {"type": "input_value", "name": "CONDITION", "check": "Boolean"},
        {"type": "input_value", "name": "THEN"},
        {"type": "input_value", "name": "ELSE"}
    ],
    "output": null,
    "colour": 210,
    "tooltip": "Prüft die Bedingung. Ist sie wahr, wird der erste Wert genutzt, ansonsten der zweite."
}]);

ArduinoGenerator.forBlock['release_logic_ternary'] = function(block) {
    const condition = ArduinoGenerator.valueToCode(block, 'CONDITION', 0) || 'false';
    const then = ArduinoGenerator.valueToCode(block, 'THEN', 0) || '0';
    const els = ArduinoGenerator.valueToCode(block, 'ELSE', 0) || '0';

    return [`(${condition}) ? (${then}) : (${els})`, 0];
};