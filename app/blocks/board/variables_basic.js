Blockly.defineBlocksWithJsonArray([
    //1. ERSTELLEN (Normale Variablen)
    {
        "type": "var_declare",
        "message0": "Erstelle %1 Variable: %2 Startwert: %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["const int", "const int"],
                    ["int", "int"],
                    ["float", "float"],
                    ["String", "String"],
                    ["bool", "bool"],
                    ["long", "long"]
                ]
            },
            {
                "type": "field_variable",
                "name": "VAR_NAME",
                "variable": "meineVariable"
            },
            {
                "type": "input_value",
                "name": "VAL"
            }
        ],
        "previousStatement": "VAR_DECLARE",
        "nextStatement": "VAR_DECLARE",
        "colour": 330,
        "tooltip": "Legt den Datentyp fest. Im GLOBAL-Bereich anlegen!"
    },

    // 1.b ERSTELLEN (⚡ Interrupt-Spezial-Variable)
    {
        "type": "var_declare_interrupt",
        "message0": "⚡ ERSTELLE INTERRUPT-VARIABLE %1 Typ: %2 Startwert: %3",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR_NAME",
                "variable": "interruptZaehler"
            },
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["int (Zahl)", "volatile int"],
                    ["long (Große Zahl)", "volatile long"],
                    ["bool (Wahr/Falsch)", "volatile bool"]
                ]
            },
            {
                "type": "input_value",
                "name": "VAL"
            }
        ],
        "previousStatement": "VAR_DECLARE",
        "nextStatement": "VAR_DECLARE",
        "colour": 300, 
        "tooltip": "MUSS für Variablen im Interrupt verwendet werden. Im globalen Bereich anlegen."
    },

    //2. SCHREIBEN (Wert zuweisen)
    {
        "type": "var_set",
        "message0": "Schreibe %1 = %2",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR_NAME",
                "variable": "meineVariable"
            },
            {
                "type": "input_value",
                "name": "VAL"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 330,
        "tooltip": "Weist einer Variablen einen neuen Wert zu."
    },

    // 3. LESEN
    {
        "type": "var_get",
        "message0": "%1",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR_NAME",
                "variable": "meineVariable"
            }
        ],
        "output": null,
        "colour": 330,
        "tooltip": "Gibt den Wert der Variablen zurück."
    }
]);

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['var_declare'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0);

    if (!value) {
        value = (type === 'String') ? '""' : '0';
    }

    return `${type} ${name} = ${value};\n`;
};

// C++ Generator für die Interrupt-Variable
ArduinoGenerator.forBlock['var_declare_interrupt'] = function(block) {
    // TYPE enthält jetzt schon das Wort "volatile" (z.B. "volatile int")
    const type = block.getFieldValue('TYPE'); 
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0);

    if (!value) {
        value = (type === 'volatile bool') ? 'false' : '0';
    }

    // Wir erzeugen einen schönen, sauberen C++ String
    return `${type} ${name} = ${value};\n`;
};

ArduinoGenerator.forBlock['var_set'] = function(block) {
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0);
    
    if (!value) value = '0';
    
    return `  ${name} = ${value};\n`;
};

ArduinoGenerator.forBlock['var_get'] = function(block) {
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    return [name, 0];
};