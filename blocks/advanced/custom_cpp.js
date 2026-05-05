// ==========================================
// BAUTEILE: CUSTOM C++ CODE (Notausgang)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- INLINE CODE (Für Setup & Loop) ---
    {
        "type": "ard_custom_code_inline",
        "message0": "C++ Code (Ablauf) %1 %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "field_multilinetext", "name": "CODE", "text": "// Dein Code hier..." }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Wird exakt so in den Ablauf (Setup oder Loop) geschrieben. Pass auf Semikolons auf!"
    },
    // --- GLOBALER CODE (Frei schwebend) ---
    {
        "type": "ard_custom_code_global",
        "message0": "C++ Code (Global) %1 %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "field_multilinetext", "name": "CODE", "text": "#include <MeineLibrary.h>" }
        ],
        "colour": 160,
        "tooltip": "Dieser Block schwebt frei. Alles hier drin landet GANZ OBEN im C++ Code (z.B. für Includes)."
    }
]);

// --- DEZENTRALER SCANNER FÜR GLOBAL ---
ArduinoGenerator.hardwareScanners['ard_custom_code_global'] = function(block) {
    const code = block.getFieldValue('CODE');
    if (code && code.trim() !== "") {
        ArduinoGenerator.globals_.add(code);
    }
};

// --- GENERATOR FÜR INLINE ---
ArduinoGenerator.forBlock['ard_custom_code_inline'] = function(block) {
    const code = block.getFieldValue('CODE');
    // Wir rücken den Code für die Lesbarkeit leicht ein
    return `  // --- Custom Code ---\n  ${code.split('\n').join('\n  ')}\n`;
};

// Freischwebend gibt im direkten Flow nichts zurück
ArduinoGenerator.forBlock['ard_custom_code_global'] = function(block) {
    return '';
};