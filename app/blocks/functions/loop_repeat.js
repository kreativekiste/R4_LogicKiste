// ==========================================
// BAUTEIL: SCHLEIFE (Wiederhole X mal)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "loop_repeat",
    "message0": "Wiederhole %1 mal",
    "args0": [
        { 
            "type": "input_value", 
            "name": "TIMES",
            "check": "Number" // Akzeptiert nur Zahlen, Mathe-Blöcke oder Variablen
        }
    ],
    "message1": "MACHE %1",
    "args1": [{ "type": "input_statement", "name": "DO" }],
    "previousStatement": null,
    "nextStatement": null,
    // Korrigiert auf 290, um konsistent zur "Steuerung" in app.js zu sein
    "colour": 290,
    "tooltip": "Führt die enthaltenen Blöcke in der Schleife so oft aus, wie angegeben."
}]);

ArduinoGenerator.forBlock['loop_repeat'] = function(block) {
    // Holt den Wert flexibel aus dem angedockten Block (Zahl, Variable, Sensorwert etc.)
    // Wenn nichts angedockt ist, wird als Fallback 0 verwendet.
    const repeats = ArduinoGenerator.valueToCode(block, 'TIMES', 0) || '0';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Eindeutiger Zählername per Block-ID — verhindert Variablen-Shadowing
    // bei verschachtelten Schleifen (z.B. i_A3fg vs i_B7kx)
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const counter = `i_${safeId}`;
    
    return `  for (int ${counter} = 0; ${counter} < ${repeats}; ${counter}++) {\n${branch}  }\n`;
};