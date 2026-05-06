// ==========================================
// VARIABLEN: TEXT & ZAHLEN EINGABEN (Literale)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- TEXT EINGABE ---
    {
        "type": "var_text_literal",
        "message0": "\" %1 \"",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": "Hallo"
            }
        ],
        "output": "String",
        "colour": 330, // Variablen-Farbe (Pink/Lila)
        "tooltip": "Ein einfacher Text für Variablen oder Displays."
    },
    
    // --- ZAHLEN EINGABE ---
    {
        "type": "var_number_literal",
        "message0": "%1",
        "args0": [
            {
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }
        ],
        "output": "Number",
        "colour": 330, // Variablen-Farbe (Pink/Lila)
        "tooltip": "Eine feste Zahl (Parameter)."
    }
]);

// --- GENERATOREN ---

ArduinoGenerator.forBlock['var_text_literal'] = function(block) {
    const text = block.getFieldValue('TEXT');
    // Setzt den Text in Anführungszeichen
    return [`"${text}"`, ArduinoGenerator.ORDER_ATOMIC];
};

ArduinoGenerator.forBlock['var_number_literal'] = function(block) {
    const num = block.getFieldValue('NUM');
    // Gibt die Zahl direkt zurück
    return [num, ArduinoGenerator.ORDER_ATOMIC];
};