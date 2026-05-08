// ==========================================
// BAUTEILE: DIGITAL SCHREIBEN (Flexibler Pin)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "write_digital",
    "message0": "Schreibe Digital-PIN %1 auf %2",
    "args0": [
        {
            "type": "field_input", 
            "name": "PIN", 
            "text": "13"
        },
        {
            "type": "field_dropdown", 
            "name": "STATE", 
            "options": [
                ["HIGH", "HIGH"], 
                ["LOW", "LOW"]
            ]
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Setzt einen Pin auf HIGH oder LOW. Unterstützt Zahlen (13) und analoge Bezeichnungen (A0)."
}]);

// --- DEZENTRALER SCANNER ---
// Das Set verhindert doppelte Einträge, und generator_core.js erzeugt
// daraus automatisch die pinMode(..., OUTPUT)-Zeile im Setup.
ArduinoGenerator.hardwareScanners['write_digital'] = function(block) {
    const pin = block.getFieldValue('PIN').trim();
    ArduinoGenerator.usedPinsOutput.add(pin);
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['write_digital'] = function(block) {
    const pin = block.getFieldValue('PIN').trim();
    const state = block.getFieldValue('STATE');
    // Erzeugt sauberen C++ Code wie: digitalWrite(pin13, HIGH);
    return `  digitalWrite(pin${pin}, ${state});\n`;
};
