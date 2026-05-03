// ==========================================
// BAUTEIL: LOGIK (WENN-DANN & WENN-DANN-SONST)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. WENN-DANN ---
    {
        "type": "logic_if",
        "message0": "WENN %1 %2 %3",
        "args0": [
            { "type": "input_value", "name": "A" },
            { 
                "type": "field_dropdown", 
                "name": "OP", 
                "options": [["ist gleich (==)", "=="], ["ist größer (>)", ">"], ["ist kleiner (<)", "<"], ["ist ungleich (!=)", "!="]] 
            },
            { "type": "input_value", "name": "B" }
        ],
        "message1": "DANN %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210
    },

    // --- 2. WENN-DANN-SONST ---
    {
        "type": "logic_if_else",
        "message0": "WENN %1 %2 %3",
        "args0": [
            { "type": "input_value", "name": "A" },
            { 
                "type": "field_dropdown", 
                "name": "OP", 
                "options": [["ist gleich (==)", "=="], ["ist größer (>)", ">"], ["ist kleiner (<)", "<"], ["ist ungleich (!=)", "!="]] 
            },
            { "type": "input_value", "name": "B" }
        ],
        "message1": "DANN %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "message2": "SONST %1",
        "args2": [{ "type": "input_statement", "name": "ELSE" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210
    }
]);

// --- GENERATOR FÜR WENN-DANN ---
ArduinoGenerator.forBlock['logic_if'] = function(block) {
    const valA = ArduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const op = block.getFieldValue('OP');
    const valB = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    return `  if (${valA} ${op} ${valB}) {\n${branch}  }\n`;
};

// --- GENERATOR FÜR WENN-DANN-SONST ---
ArduinoGenerator.forBlock['logic_if_else'] = function(block) {
    const valA = ArduinoGenerator.valueToCode(block, 'A', 0) || '0';
    const op = block.getFieldValue('OP');
    const valB = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    const branchDo = ArduinoGenerator.statementToCode(block, 'DO');
    const branchElse = ArduinoGenerator.statementToCode(block, 'ELSE');
    
    return `  if (${valA} ${op} ${valB}) {\n${branchDo}  } else {\n${branchElse}  }\n`;
};