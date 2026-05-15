// ==========================================
// BAUTEILE: ERWEITERTE MATHE (Map & Constrain)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- MAP (Wertebereich umwandeln) ---
    {
        "type": "ard_math_map",
        "message0": "Wandle Wert %1 von [%2 bis %3] %4 auf [%5 bis %6] um",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "F_MIN", "check": "Number"},
            {"type": "input_value", "name": "F_MAX", "check": "Number"},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "T_MIN", "check": "Number"},
            {"type": "input_value", "name": "T_MAX", "check": "Number"}
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "Rechnet einen Wert proportional von einem Bereich in einen anderen um (z.B. Sensor 0-1023 zu Servo 0-180). Achtung: Werte außerhalb des Eingangsbereichs werden NICHT automatisch begrenzt — ggf. mit 'Begrenze' kombinieren!"
    },
    // --- CONSTRAIN (Werte abschneiden/begrenzen) ---
    {
        "type": "ard_math_constrain",
        "message0": "Begrenze Wert %1 zwischen Min: %2 und Max: %3",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "MIN", "check": "Number"},
            {"type": "input_value", "name": "MAX", "check": "Number"}
        ],
        "output": "Number",
        "colour": 230,
        "inputsInline": true,
        "tooltip": "Schneidet Werte ab, die kleiner als Min oder größer als Max sind."
    }
]);

ArduinoGenerator.forBlock['ard_math_map'] = function(block) {
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    const fMin = ArduinoGenerator.valueToCode(block, 'F_MIN', 0) || '0';
    const fMax = ArduinoGenerator.valueToCode(block, 'F_MAX', 0) || '1023';
    const tMin = ArduinoGenerator.valueToCode(block, 'T_MIN', 0) || '0';
    const tMax = ArduinoGenerator.valueToCode(block, 'T_MAX', 0) || '255';
    
    return [`map(${val}, ${fMin}, ${fMax}, ${tMin}, ${tMax})`, 0];
};

ArduinoGenerator.forBlock['ard_math_constrain'] = function(block) {
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    const min = ArduinoGenerator.valueToCode(block, 'MIN', 0) || '0';
    const max = ArduinoGenerator.valueToCode(block, 'MAX', 0) || '100';
    
    return [`constrain(${val}, ${min}, ${max})`, 0];
};