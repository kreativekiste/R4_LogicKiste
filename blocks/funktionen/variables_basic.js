// ==========================================
// BAUTEILE: VARIABLEN (3-Säulen System mit Dropdown)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. ERSTELLEN (Deklarieren mit Typ) ---
    {
        "type": "var_declare",
        "message0": "Erstelle %1 Variable: %2 Startwert: %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["const int (Fester Wert/Pin, beste Performance)", "const int"],
                    ["int (Ganze Zahl)", "int"],
                    ["float (Kommazahl)", "float"],
                    ["String (Text)", "String"],
                    ["bool (Wahr/Falsch)", "bool"],
                    ["long (Große Zahl)", "long"]
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
        "previousStatement": null,
        "nextStatement": null,
        "colour": 330,
        "tooltip": "Legt den Typ der Variable fest. Klicke auf den Namen, um das Menü für neue Variablen zu öffnen."
    },

    // --- 2. SCHREIBEN (Wert zuweisen) ---
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
        "tooltip": "Ändert den Wert einer bereits erstellten Variablen. Wähle den Namen bequem aus der Liste."
    },

    // --- 3. LESEN (Wert abrufen für Rechnungen) ---
    {
        "type": "var_get",
        "message0": "Variable %1",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR_NAME",
                "variable": "meineVariable"
            }
        ],
        "output": null,
        "colour": 330,
        "tooltip": "Gibt den aktuellen Wert der Variablen aus. Perfekt zum Einstecken in Mathe-Blöcke oder Ausgaben."
    }
]);

ArduinoGenerator.forBlock['var_declare'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const name = block.getField('VAR_NAME').getText();
    const value = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    
    if (!ArduinoGenerator.customVariables) ArduinoGenerator.customVariables = new Map();

    if (type === 'const int') {
        // const int muss direkt bei der Deklaration initialisiert werden.
        // Zuweisung danach ist in C++ nicht erlaubt → direkt in globals_ schreiben.
        if (!ArduinoGenerator.globals_) ArduinoGenerator.globals_ = new Set();
        ArduinoGenerator.globals_.add(`const int ${name} = ${value};`);
        return ''; // Kein inline-Code nötig
    }

    ArduinoGenerator.customVariables.set(name, type);
    return `  ${name} = ${value};\n`;
};

ArduinoGenerator.forBlock['var_set'] = function(block) {
    const name = block.getField('VAR_NAME').getText();
    const value = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    
    return `  ${name} = ${value};\n`;
};

ArduinoGenerator.forBlock['var_get'] = function(block) {
    const name = block.getField('VAR_NAME').getText();
    
    return [name, 0];
};