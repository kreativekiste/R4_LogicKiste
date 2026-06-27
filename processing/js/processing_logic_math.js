// =======================================================================
// PROCESSING: WERTE (LOGIK, MATHE & VARIABLEN)
// =======================================================================

Blockly.defineBlocksWithJsonArray([

    // --- GRUNDWERTE (ZAHL, TEXT, WAHR/FALSCH) ---
    {
        "type": "processing_number",
        "message0": "%1",
        "args0": [{"type": "field_number", "name": "NUM", "value": 0}],
        "output": "Number",
        "colour": 230,
        "tooltip": "Eine einfache Zahl."
    },
    {
        "type": "processing_text_val",
        "message0": "\" %1 \"",
        "args0": [{"type": "field_input", "name": "TEXT", "text": "hallo"}],
        "output": "String",
        "colour": 160,
        "tooltip": "Ein reiner Text."
    },
    {
        "type": "processing_boolean",
        "message0": "%1",
        "args0": [
            {"type": "field_dropdown", "name": "BOOL", "options": [
                ["wahr", "true"],
                ["falsch", "false"]
            ]}
        ],
        "output": "Boolean",
        "colour": 210,
        "tooltip": "Wahr (true) oder Falsch (false)."
    },

    // --- VARIABLEN ---
    {
        "type": "processing_var_set",
        "message0": "Setze Variable %1 auf %2",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meineZahl"},
            {"type": "input_value", "name": "VAL"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 330,
        "tooltip": "Speichert einen Wert. Die Variable wird im Hintergrund automatisch angelegt."
    },
    {
        "type": "processing_var_get",
        "message0": "Variable %1",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meineZahl"}
        ],
        "output": null,
        "colour": 330,
        "tooltip": "Liest den Wert der Variablen aus."
    },
    {
        "type": "processing_array_get_float",
        "message0": "Hole Zahl aus Liste %1 an Position %2",
        "args0": [
            {"type": "input_value", "name": "LIST", "check": "Array"},
            {"type": "input_value", "name": "INDEX", "check": "Number"}
        ],
        "output": "Number",
        "colour": 330,
        "tooltip": "Nimmt ein Textstueck aus dem Zerstueckeler und wandelt es sicher in eine Zahl fuer Processing um (Achtung: Index beginnt bei 0!)."
    },

    // --- LOGIK ---
    {
        "type": "processing_if",
        "message0": "Wenn %1",
        "args0": [{"type": "input_value", "name": "COND", "check": "Boolean"}],
        "message1": "Dann %1",
        "args1": [{"type": "input_statement", "name": "DO"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "Fuehrt die Bloecke nur aus, wenn die Bedingung wahr ist."
    },
    {
        "type": "processing_if_else",
        "message0": "Wenn %1",
        "args0": [{"type": "input_value", "name": "COND", "check": "Boolean"}],
        "message1": "Dann %1",
        "args1": [{"type": "input_statement", "name": "DO"}],
        "message2": "Sonst %1",
        "args2": [{"type": "input_statement", "name": "ELSE"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "Fuehrt den oberen Bereich aus, wenn wahr, ansonsten den unteren Bereich."
    },
    {
        "type": "processing_compare",
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "A"},
            {"type": "field_dropdown", "name": "OP", "options": [
                ["==", "=="],
                ["!=", "!="],
                ["<", "<"],
                [">", ">"],
                ["<=", "<="],
                [">=", ">="]
            ]},
            {"type": "input_value", "name": "B"}
        ],
        "output": "Boolean",
        "colour": 210,
        "tooltip": "Vergleicht zwei Werte miteinander."
    },

    // --- MATHE ---
    {
        "type": "processing_math",
        "message0": "%1 %2 %3",
        "args0": [
            {"type": "input_value", "name": "A", "check": "Number"},
            {"type": "field_dropdown", "name": "OP", "options": [
                ["+", "+"],
                ["-", "-"],
                ["*", "*"],
                ["/", "/"]
            ]},
            {"type": "input_value", "name": "B", "check": "Number"}
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 230,
        "tooltip": "Einfache Grundrechenarten."
    },
    {
        "type": "processing_map",
        "message0": "Skaliere %1 von (%2 bis %3) auf (%4 bis %5)",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "IN_MIN", "check": "Number"},
            {"type": "input_value", "name": "IN_MAX", "check": "Number"},
            {"type": "input_value", "name": "OUT_MIN", "check": "Number"},
            {"type": "input_value", "name": "OUT_MAX", "check": "Number"}
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "Rechnet einen Wertebereich in einen anderen um."
    },
    {
        "type": "processing_constrain",
        "message0": "Begrenze Wert %1 min %2 max %3",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "LOW", "check": "Number"},
            {"type": "input_value", "name": "HIGH", "check": "Number"}
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 230,
        "tooltip": "Begrenzt einen Wert strikt auf einen Mindest- und Maximalwert."
    },
    {
        "type": "processing_min_max",
        "message0": "%1 von %2 und %3",
        "args0": [
            {"type": "field_dropdown", "name": "OP", "options": [
                ["Minimum", "min"],
                ["Maximum", "max"]
            ]},
            {"type": "input_value", "name": "A", "check": "Number"},
            {"type": "input_value", "name": "B", "check": "Number"}
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 230,
        "tooltip": "Gibt den kleineren oder groesseren der beiden Werte zurueck."
    },
    {
        "type": "processing_round_abs",
        "message0": "%1 von %2",
        "args0": [
            {"type": "field_dropdown", "name": "OP", "options": [
                ["Runde auf ganze Zahl", "round"],
                ["Absolutwert (Betrag)", "abs"]
            ]},
            {"type": "input_value", "name": "NUM", "check": "Number"}
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 230,
        "tooltip": "Rundet eine Zahl oder entfernt ein eventuelles Minuszeichen."
    },
    {
        "type": "processing_power",
        "message0": "Potenz: Basis %1 hoch Exponent %2",
        "args0": [
            {"type": "input_value", "name": "BASE", "check": "Number"},
            {"type": "input_value", "name": "EXP", "check": "Number"}
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 230,
        "tooltip": "Berechnet eine Zahl hoch eine andere."
    }
]);

// =======================================================================
// CODE-GENERATOREN FÜR PROCESSING (JAVA)
// =======================================================================

ProcessingGenerator.forBlock['processing_number'] = function(block) {
    const num = block.getFieldValue('NUM');
    return [num, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_text_val'] = function(block) {
    const text = block.getFieldValue('TEXT');
    return ['"' + text + '"', ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_boolean'] = function(block) {
    const bool = block.getFieldValue('BOOL');
    return [bool, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_var_set'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';

    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`float ${varName} = 0;`);

    return `  ${varName} = ${val};\n`;
};

ProcessingGenerator.forBlock['processing_var_get'] = function(block) {
    const varName = block.getFieldValue('VAR');
    return [varName, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_array_get_float'] = function(block) {
    const list = ProcessingGenerator.valueToCode(block, 'LIST', ProcessingGenerator.ORDER_NONE) || 'datenPaket';
    const index = ProcessingGenerator.valueToCode(block, 'INDEX', ProcessingGenerator.ORDER_NONE) || '0';
    const code = `float(${list}[${index}])`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_if'] = function(block) {
    const cond = ProcessingGenerator.valueToCode(block, 'COND', ProcessingGenerator.ORDER_NONE) || 'false';
    const doCode = ProcessingGenerator.statementToCode(block, 'DO');
    return `  if (${cond}) {\n${doCode}  }\n`;
};

ProcessingGenerator.forBlock['processing_if_else'] = function(block) {
    const cond = ProcessingGenerator.valueToCode(block, 'COND', ProcessingGenerator.ORDER_NONE) || 'false';
    const doCode = ProcessingGenerator.statementToCode(block, 'DO');
    const elseCode = ProcessingGenerator.statementToCode(block, 'ELSE');
    return `  if (${cond}) {\n${doCode}  } else {\n${elseCode}  }\n`;
};

ProcessingGenerator.forBlock['processing_compare'] = function(block) {
    const op = block.getFieldValue('OP');
    const a = ProcessingGenerator.valueToCode(block, 'A', ProcessingGenerator.ORDER_NONE) || '0';
    const b = ProcessingGenerator.valueToCode(block, 'B', ProcessingGenerator.ORDER_NONE) || '0';
    return [`(${a} ${op} ${b})`, ProcessingGenerator.ORDER_RELATIONAL];
};

ProcessingGenerator.forBlock['processing_math'] = function(block) {
    const op = block.getFieldValue('OP');
    const a = ProcessingGenerator.valueToCode(block, 'A', ProcessingGenerator.ORDER_NONE) || '0';
    const b = ProcessingGenerator.valueToCode(block, 'B', ProcessingGenerator.ORDER_NONE) || '0';
    return [`(${a} ${op} ${b})`, ProcessingGenerator.ORDER_ADDITIVE];
};

ProcessingGenerator.forBlock['processing_map'] = function(block) {
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const inMin = ProcessingGenerator.valueToCode(block, 'IN_MIN', ProcessingGenerator.ORDER_NONE) || '0';
    const inMax = ProcessingGenerator.valueToCode(block, 'IN_MAX', ProcessingGenerator.ORDER_NONE) || '1023';
    const outMin = ProcessingGenerator.valueToCode(block, 'OUT_MIN', ProcessingGenerator.ORDER_NONE) || '0';
    const outMax = ProcessingGenerator.valueToCode(block, 'OUT_MAX', ProcessingGenerator.ORDER_NONE) || '255';
    const code = `map(${val}, ${inMin}, ${inMax}, ${outMin}, ${outMax})`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_constrain'] = function(block) {
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const low = ProcessingGenerator.valueToCode(block, 'LOW', ProcessingGenerator.ORDER_NONE) || '0';
    const high = ProcessingGenerator.valueToCode(block, 'HIGH', ProcessingGenerator.ORDER_NONE) || '255';
    const code = `constrain(${val}, ${low}, ${high})`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_min_max'] = function(block) {
    const op = block.getFieldValue('OP');
    const a = ProcessingGenerator.valueToCode(block, 'A', ProcessingGenerator.ORDER_NONE) || '0';
    const b = ProcessingGenerator.valueToCode(block, 'B', ProcessingGenerator.ORDER_NONE) || '0';
    const code = `${op}(${a}, ${b})`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_round_abs'] = function(block) {
    const op = block.getFieldValue('OP');
    const num = ProcessingGenerator.valueToCode(block, 'NUM', ProcessingGenerator.ORDER_NONE) || '0';
    const code = `${op}(${num})`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_power'] = function(block) {
    const base = ProcessingGenerator.valueToCode(block, 'BASE', ProcessingGenerator.ORDER_NONE) || '0';
    const exp = ProcessingGenerator.valueToCode(block, 'EXP', ProcessingGenerator.ORDER_NONE) || '0';
    const code = `pow(${base}, ${exp})`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};