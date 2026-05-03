// ==========================================
// BAUTEIL: SCHLEIFE (Wiederhole X mal)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "loop_repeat",
    "message0": "Wiederhole %1 mal",
    "args0": [
        { "type": "field_number", "name": "TIMES", "value": 10, "min": 1 }
    ],
    "message1": "MACHE %1",
    "args1": [{ "type": "input_statement", "name": "DO" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120
}]);

ArduinoGenerator.forBlock['loop_repeat'] = function(block) {
    const repeats = block.getFieldValue('TIMES');
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Eindeutiger Zählername per Block-ID — verhindert Variablen-Shadowing
    // bei verschachtelten Schleifen (z.B. i_A3fg vs i_B7kx)
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const counter = `i_${safeId}`;
    
    return `  for (int ${counter} = 0; ${counter} < ${repeats}; ${counter}++) {\n${branch}  }\n`;
};