// ==========================================
// BAUTEILE: DIGITAL SCHREIBEN (Flexibler Pin)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "write_digital",
    "message0": "Schreibe Digital-PIN %1 auf %2",
    "args0": [
        {"type": "field_input", "name": "PIN", "text": "13"},
        {"type": "field_dropdown", "name": "STATE", "options": [
            ["HIGH (Strom an)", "HIGH"], 
            ["LOW (Strom aus)", "LOW"]
        ]}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Setzt einen Pin auf HIGH oder LOW. Du kannst Zahlen (z.B. 13) oder analoge Bezeichnungen (z.B. A0) nutzen."
}]);

ArduinoGenerator.forBlock['write_digital'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    
    // Meldet den Pin beim Hauptscanner als Ausgang an
    ArduinoGenerator.usedPinsOutput.add(pin);
    
    // Gibt den C++ Befehl zurück
    return `  digitalWrite(pin${pin}, ${state});\n`;
};