// ==========================================
// BAUTEILE: VARIABLEN (3-Säulen System)
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
        "tooltip": "Legt den Datentyp fest. Passt nur in den GLOBAL-Bereich. const int bevorzugen, wenn sich der Wert nicht ändert!"
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
        "tooltip": "Weist einer Variablen einen neuen Wert zu."
    },

    // --- 3. LESEN (Wert abrufen) ---
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

// ACHTUNG: Der Scanner für var_declare wurde absichtlich gelöscht!
// Da der Block nur noch im GLOBAL-Slot sitzt, generieren wir die 
// C++ Variablen-Deklaration direkt als sauberen String.

ArduinoGenerator.forBlock['var_declare'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0);

    // Typ-sicherer Fallback, verhindert String-Kompilierfehler
    if (!value) {
        value = (type === 'String') ? '""' : '0';
    }

    // C++ saubere globale Deklaration (kein Umweg mehr über den Scanner nötig)
    return `${type} ${name} = ${value};\n`;
};

ArduinoGenerator.forBlock['var_set'] = function(block) {
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0);
    
    // Generischer Fallback
    if (!value) value = '0';
    
    return `  ${name} = ${value};\n`;
};

ArduinoGenerator.forBlock['var_get'] = function(block) {
    const name = block.getField('VAR_NAME').getText().replace(/[^a-zA-Z0-9_]/g, '');
    return [name, 0];
};