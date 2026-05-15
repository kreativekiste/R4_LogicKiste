// ==========================================
// BAUTEILE: SOLANGE SCHLEIFE (While)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_loop_while",
        "message0": "Solange %1 %2 mache %3",
        "args0": [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": ["Boolean", "Number"] // Akzeptiert direkt Logik-Blöcke
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt die enthaltenen Blöcke immer wieder aus, solange die Bedingung WAHR ist. Achtung: Die Bedingung muss sich irgendwann ändern, sonst entsteht eine Endlosschleife!"
    }
]);

ArduinoGenerator.forBlock['ard_loop_while'] = function(block) {
    // Holt die Bedingung (z.B. eine Logik-Prüfung). Wenn nichts dranhängt, standardmäßig 'false'.
    // Das verhindert C++ Syntaxfehler und versehentliche Endlosschleifen.
    const condition = ArduinoGenerator.valueToCode(block, 'CONDITION', 0) || 'false';
    
    // Holt alle Blöcke, die im Inneren der Schleife platziert wurden
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Baut den C++ Code zusammen
    return `  while (${condition}) {\n${branch}  }\n`;
};