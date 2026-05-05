// ==========================================
// BAUTEIL: LOGIK (WENN-DANN, SONST-WENN, SONST)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. WENN-DANN ---
    {
        "type": "logic_if",
        "message0": "WENN %1",
        "args0": [
            { 
                "type": "input_value", 
                "name": "CONDITION",
                "check": "Boolean" // Akzeptiert nur Wahrheitswerte oder Logik-Blöcke
            }
        ],
        "message1": "DANN %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt den DANN-Teil nur aus, wenn die Bedingung WAHR ist."
    },

    // --- 2. WENN-DANN-SONST ---
    {
        "type": "logic_if_else",
        "message0": "WENN %1",
        "args0": [
            { 
                "type": "input_value", 
                "name": "CONDITION",
                "check": "Boolean"
            }
        ],
        "message1": "DANN %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "message2": "SONST %1",
        "args2": [{ "type": "input_statement", "name": "ELSE" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt den DANN-Teil aus, wenn WAHR, andernfalls den SONST-Teil."
    },

    // --- 3. WENN - SONST WENN - SONST (NEU) ---
    {
        "type": "logic_if_elseif_else",
        "message0": "WENN %1",
        "args0": [
            { 
                "type": "input_value", 
                "name": "COND_1",
                "check": "Boolean"
            }
        ],
        "message1": "DANN %1",
        "args1": [{ "type": "input_statement", "name": "DO_1" }],
        "message2": "SONST WENN %1",
        "args2": [
            { 
                "type": "input_value", 
                "name": "COND_2",
                "check": "Boolean"
            }
        ],
        "message3": "DANN %1",
        "args3": [{ "type": "input_statement", "name": "DO_2" }],
        "message4": "SONST %1",
        "args4": [{ "type": "input_statement", "name": "ELSE" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Prüft zwei Bedingungen nacheinander. Wenn beide falsch sind, wird der SONST-Teil ausgeführt."
    }
]);

// --- GENERATOR FÜR WENN-DANN ---
ArduinoGenerator.forBlock['logic_if'] = function(block) {
    const condition = ArduinoGenerator.valueToCode(block, 'CONDITION', 0) || 'false';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    return `  if (${condition}) {\n${branch}  }\n`;
};

// --- GENERATOR FÜR WENN-DANN-SONST ---
ArduinoGenerator.forBlock['logic_if_else'] = function(block) {
    const condition = ArduinoGenerator.valueToCode(block, 'CONDITION', 0) || 'false';
    const branchDo = ArduinoGenerator.statementToCode(block, 'DO');
    const branchElse = ArduinoGenerator.statementToCode(block, 'ELSE');
    
    return `  if (${condition}) {\n${branchDo}  } else {\n${branchElse}  }\n`;
};

// --- GENERATOR FÜR WENN - SONST WENN - SONST ---
ArduinoGenerator.forBlock['logic_if_elseif_else'] = function(block) {
    const cond1 = ArduinoGenerator.valueToCode(block, 'COND_1', 0) || 'false';
    const branchDo1 = ArduinoGenerator.statementToCode(block, 'DO_1');
    
    const cond2 = ArduinoGenerator.valueToCode(block, 'COND_2', 0) || 'false';
    const branchDo2 = ArduinoGenerator.statementToCode(block, 'DO_2');
    
    const branchElse = ArduinoGenerator.statementToCode(block, 'ELSE');
    
    return `  if (${cond1}) {\n${branchDo1}  } else if (${cond2}) {\n${branchDo2}  } else {\n${branchElse}  }\n`;
};