
Blockly.defineBlocksWithJsonArray([

    // 1a. DEFINIEREN ohne Rückgabewert (void)
    {
        "type": "ard_function_define",
        "message0": "Unterprogramm: %1",
        "args0": [
            {"type": "field_input", "name": "FUNC_NAME", "text": "Menue"}
        ],
        "message1": "Mache: %1",
        "args1": [
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 290,
        "tooltip": "Erstellt ein neues Unterprogramm ohne Rückgabewert (void). Dieser Block steht frei auf dem Raster, nicht in der Loop."
    },

    // 1b. DEFINIEREN mit Rückgabewert
    {
        "type": "ard_function_define_return",
        "message0": "Funktion: %1  Rückgabetyp: %2",
        "args0": [
            {"type": "field_input", "name": "FUNC_NAME", "text": "meinErgebnis"},
            {"type": "field_dropdown", "name": "RETURN_TYPE", "options": [
                ["int (Ganzzahl)",   "int"],
                ["float (Kommazahl)", "float"],
                ["bool (Wahr/Falsch)", "bool"],
                ["String (Text)",    "String"]
            ]}
        ],
        "message1": "Mache: %1",
        "args1": [
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 290,
        "tooltip": "Erstellt eine Funktion, die einen Wert zurückgibt. Nutze den 'Gib zurück'-Block im Körper. Steht frei auf dem Raster."
    },

    // 2. GIB ZURÜCK (Rückgabe-Statement)
    {
        "type": "ard_function_return",
        "message0": "↩ Gib zurück: %1",
        "args0": [
            {"type": "input_value", "name": "VALUE"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Gibt den angesteckten Wert aus der Funktion zurück. Nur in Funktionen mit Rückgabewert sinnvoll."
    }

]);

// 3. AUFRUFEN ohne Rückgabewert (Statement)
Blockly.Blocks['ard_function_call'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Führe Unterprogramm aus:")
            .appendField(new Blockly.FieldDropdown(this.getDynamicOptions.bind(this)), "FUNC_NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("Führt das ausgewählte Unterprogramm aus. Die Liste aktualisiert sich automatisch.");
    },

    getDynamicOptions: function() {
        let options = [];
        if (this.workspace) {
            let blocks = this.workspace.getBlocksByType('ard_function_define');
            blocks.forEach(function(block) {
                let name = block.getFieldValue('FUNC_NAME');
                if (name) {
                    let safeName = name.replace(/[^a-zA-Z0-9_]/g, '');
                    if (safeName) {
                        options.push([name, safeName]);
                    }
                }
            });
        }
        if (options.length === 0) {
            options.push(['-- Kein Unterprogramm gefunden --', 'NONE']);
        }
        return options;
    }
};

// 4. AUFRUFEN mit Rückgabewert (Wert-Ausgang)

Blockly.Blocks['ard_function_call_return'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Ergebnis von:")
            .appendField(new Blockly.FieldDropdown(this.getDynamicOptions.bind(this)), "FUNC_NAME");
        this.setOutput(true, null);   
        this.setColour(290);
        this.setTooltip("Ruft die Funktion auf und gibt deren Rückgabewert zurück. Andockbar wie eine Variable oder Zahl.");
    },

    getDynamicOptions: function() {
        let options = [];
        if (this.workspace) {
            let blocks = this.workspace.getBlocksByType('ard_function_define_return');
            blocks.forEach(function(block) {
                let name = block.getFieldValue('FUNC_NAME');
                if (name) {
                    let safeName = name.replace(/[^a-zA-Z0-9_]/g, '');
                    if (safeName) {
                        options.push([name, safeName]);
                    }
                }
            });
        }
        if (options.length === 0) {
            options.push(['-- Keine Funktion gefunden --', 'NONE']);
        }
        return options;
    }
};

// GENERATOR LOGIK

ArduinoGenerator.forBlock['ard_function_define'] = function(block) {
    let funcName = block.getFieldValue('FUNC_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    if (funcName === "setup" || funcName === "loop") funcName += "_f";

    const branch = ArduinoGenerator.statementToCode(block, 'DO');

    if (!ArduinoGenerator.userFunctions) {
        ArduinoGenerator.userFunctions = new Map();
    }

    if (funcName) {
        const functionCode = `void ${funcName}() {\n${branch}}\n`;
        ArduinoGenerator.userFunctions.set(funcName, functionCode);
    }

    return '';
};

ArduinoGenerator.forBlock['ard_function_define_return'] = function(block) {
    let funcName = block.getFieldValue('FUNC_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    if (funcName === "setup" || funcName === "loop") funcName += "_f";
    
    const returnType = block.getFieldValue('RETURN_TYPE');
    const branch = ArduinoGenerator.statementToCode(block, 'DO');

    if (!ArduinoGenerator.userFunctions) {
        ArduinoGenerator.userFunctions = new Map();
    }

    if (funcName) {
        const functionCode = `${returnType} ${funcName}() {\n${branch}}\n`;
        ArduinoGenerator.userFunctions.set(funcName, functionCode);
    }

    return '';
};

ArduinoGenerator.forBlock['ard_function_return'] = function(block) {
    const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
    return `  return ${value};\n`;
};

ArduinoGenerator.forBlock['ard_function_call'] = function(block) {
    const funcName = block.getFieldValue('FUNC_NAME');

    if (funcName === 'NONE' || !funcName) {
        return `  // WARNUNG: Kein Unterprogramm ausgewählt!\n`;
    }

    return `  ${funcName}();\n`;
};

ArduinoGenerator.forBlock['ard_function_call_return'] = function(block) {
    const funcName = block.getFieldValue('FUNC_NAME');

    if (funcName === 'NONE' || !funcName) {
        return [`0 /* WARNUNG: Keine Funktion ausgewählt! */`, 0];
    }

    return [`${funcName}()`, 0];
};