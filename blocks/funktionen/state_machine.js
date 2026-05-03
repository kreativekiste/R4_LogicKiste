// ==========================================
// BAUTEILE: STATE MACHINE (Switch-Case)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. DER HAUPT-CONTAINER (SWITCH) ---
    {
        "type": "ard_switch",
        "message0": "Zustandsautomat für Variable: %1 %2 %3",
        "args0": [
            {"type": "field_input", "name": "VAR_NAME", "text": "status"},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "CASES"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Der Hauptblock für die State Machine. Er prüft den Wert einer Variablen. Staple die 'Zustand'-Blöcke in diesen Block."
    },
    // --- 2. EIN ZELNER ZUSTAND (CASE) ---
    {
        "type": "ard_case",
        "message0": "Bei Zustand: %1 %2 Mache: %3",
        "args0": [
            {"type": "input_value", "name": "CASE_VAL", "check": "Number"},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Wird ausgeführt, wenn die Variable genau diesen Wert hat. (Entspricht 'case' in C++)."
    },
    // --- 3. DER STANDARD-FALL (DEFAULT) ---
    {
        "type": "ard_default",
        "message0": "Standardfall (Wenn nichts passt) %1 Mache: %2",
        "args0": [
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Wird nur ausgeführt, wenn keiner der anderen Zustände passt. (Entspricht 'default' in C++). Gehört ganz ans Ende!"
    }
]);

ArduinoGenerator.forBlock['ard_switch'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    // Holt alle gestapelten Case/Default Blöcke
    const casesCode = ArduinoGenerator.statementToCode(block, 'CASES');
    
    return `  switch (${varName}) {\n${casesCode}  }\n`;
};

ArduinoGenerator.forBlock['ard_case'] = function(block) {
    // Nimmt den Wert (z.B. eine Zahl oder Text)
    const val = ArduinoGenerator.valueToCode(block, 'CASE_VAL', 0) || '0';
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Das break; wird zur Sicherheit automatisch angehängt!
    return `    case ${val}:\n${doCode}      break;\n`;
};

ArduinoGenerator.forBlock['ard_default'] = function(block) {
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');
    
    return `    default:\n${doCode}      break;\n`;
};