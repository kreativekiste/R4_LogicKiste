// ==========================================
// BAUTEILE: LOGIK VERGLEICH (>, <, ==, !=)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_logic_compare",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["=", "EQ"],
                    ["≠ (nicht gleich)", "NEQ"],
                    ["<", "LT"],
                    ["≤ (kleiner gleich)", "LTE"],
                    [">", "GT"],
                    ["≥ (größer gleich)", "GTE"]
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "colour": 230,
        "tooltip": "Vergleicht zwei Werte miteinander. Gibt WAHR zurück, wenn die Bedingung stimmt."
    }
]);

ArduinoGenerator.forBlock['ard_logic_compare'] = function(block) {
    const op = block.getFieldValue('OP');
    
    // Die Übersetzung vom Dropdown-Menü zum echten C++ Code
    const operatorMap = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    
    // Holt die beiden Werte, die an den Block angesteckt wurden (Standard ist 0, falls leer)
    const a = ArduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    
    // Setzt die Logik-Prüfung in Klammern, damit sie in komplexen Formeln sicher funktioniert
    return [`(${a} ${operatorMap[op]} ${b})`, 0];
};