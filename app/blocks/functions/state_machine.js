
Blockly.defineBlocksWithJsonArray([
    // --- 1. DER HAUPT-CONTAINER (SWITCH) ---
    {
        "type": "ard_switch",
        "message0": "Zustandsautomat für Wert: %1 %2 %3",
        "args0": [
            {
                "type": "input_value", 
                "name": "SWITCH_VAL"
                // Hinweis: C++ Switch verträgt keine Floats oder Strings. 
                // Da Blockly das nicht strikt trennt, belassen wir es ohne "check", 
                // der Nutzer muss aber darauf achten, Integers oder Chars zu übergeben.
            },
            {"type": "input_dummy"},
            {
                "type": "input_statement", 
                "name": "CASES",
                "check": "CaseBlock" // KRITISCH: Akzeptiert NUR noch ard_case oder ard_default
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Der Hauptblock für die State Machine. Er prüft den angedockten Wert. Staple die 'Zustand'-Blöcke in diesen Block."
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
        "previousStatement": "CaseBlock", // KRITISCH: Darf nur in Switch oder unter ein anderes Case
        "nextStatement": "CaseBlock",     // KRITISCH: Erlaubt nur weitere Cases darunter
        "colour": 290,
        "tooltip": "Wird ausgeführt, wenn der Wert genau diesem Zustand entspricht. (Entspricht 'case' in C++)."
    },
    // --- 3. DER STANDARD-FALL (DEFAULT) ---
    {
        "type": "ard_default",
        "message0": "Standardfall (Wenn nichts passt) %1 Mache: %2",
        "args0": [
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "previousStatement": "CaseBlock", // KRITISCH: Darf nur ans Ende der Case-Kette
        // nextStatement wurde ENTFERNT! An einen Default-Block darf unten nichts mehr angedockt werden.
        "colour": 290,
        "tooltip": "Wird nur ausgeführt, wenn keiner der anderen Zustände passt. (Entspricht 'default' in C++). Gehört ganz ans Ende!"
    }
]);

ArduinoGenerator.forBlock['ard_switch'] = function(block) {
    const switchVal = ArduinoGenerator.valueToCode(block, 'SWITCH_VAL', 0) || '0';
    const casesCode = ArduinoGenerator.statementToCode(block, 'CASES');
    return `  switch (${switchVal}) {\n${casesCode}  }\n`;
};

ArduinoGenerator.forBlock['ard_case'] = function(block) {
    const val = ArduinoGenerator.valueToCode(block, 'CASE_VAL', 0) || '0';
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');
    return `    case ${val}:\n${doCode}      break;\n`;
};

ArduinoGenerator.forBlock['ard_default'] = function(block) {
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');
    return `    default:\n${doCode}      break;\n`;
};