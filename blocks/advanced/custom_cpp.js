Blockly.defineBlocksWithJsonArray([
    // INLINE CODE (Für Setup & Loop)
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
    // GLOBALER CODE
    {
        "type": "ard_custom_code_global",
        "message0": "C++ Code (Global) %1 %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "field_multilinetext", "name": "CODE", "text": "#include <MeineLibrary.h>" }
        ],
        "colour": 160,
        "tooltip": "Dieser Block schwebt frei. Alles hier drin landet GANZ OBEN im C++ Code (z.B. für Includes)."
    },
    // KOMMENTAR BLOCK
    {
        "type": "kommentar",
        "message0": "📝 Kommentar: %1",
        "args0": [
            { "type": "field_input", "name": "TEXT", "text": "Hier Info eintragen..." }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "Schreibt einen // Kommentar in den generierten C++ Code. Das Programm ignoriert diesen Text beim Ausführen."
    }
]);

// DEZENTRALER SCANNER FÜR GLOBAL
ArduinoGenerator.hardwareScanners['ard_custom_code_global'] = function(block) {
    const code = block.getFieldValue('CODE');
    if (code && code.trim() !== "") {
        ArduinoGenerator.globals_.add(code);
    }
};

// GENERATOR FÜR INLINE
ArduinoGenerator.forBlock['ard_custom_code_inline'] = function(block) {
    const code = block.getFieldValue('CODE');
    return `  // --- Custom Code ---\n  ${code.split('\n').join('\n  ')}\n`;
};

// GENERATOR FÜR GLOBAL
ArduinoGenerator.forBlock['ard_custom_code_global'] = function(block) {
    return '';
};

// GENERATOR FÜR KOMMENTAR
ArduinoGenerator.forBlock['kommentar'] = function(block) {
    const text = block.getFieldValue('TEXT');
    return `  // ${text}\n`;
};