// =======================================================================
// PROCESSING: TÖNE & SOUNDS (AUDIO-DATEIEN)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // --- SOUND LADEN ---
    {
        "type": "processing_sound_load",
        "message0": "Lade Sound %1 Datei %2",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinSound"},
            {"type": "field_input", "name": "FILE", "text": "klick.mp3"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Laedt eine Audiodatei in den Speicher. Muss in den SETUP-Bereich!"
    },

    // --- SOUND ABSPIELEN / STOPPEN ---
    {
        "type": "processing_sound_action",
        "message0": "Sound %1 %2",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinSound"},
            {
                "type": "field_dropdown", "name": "ACTION", "options": [
                    ["einmal abspielen (play)", "play"],
                    ["endlos wiederholen (loop)", "loop"],
                    ["pausieren / stoppen (stop)", "stop"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Startet oder stoppt die Wiedergabe des Sounds."
    },

    // --- LAUTSTÄRKE STEUERN ---
    {
        "type": "processing_sound_volume",
        "message0": "Setze Lautstaerke von %1 auf %2 (0.0 bis 1.0)",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinSound"},
            {"type": "input_value", "name": "VOL", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Aendert die Lautstaerke. 0.0 ist stumm, 1.0 ist volle Lautstaerke."
    }
]);

// =======================================================================
// GENERATOREN
// =======================================================================

ProcessingGenerator.forBlock['processing_sound_load'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const fileName = block.getFieldValue('FILE');
    
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    
    // Die Sound-Bibliothek importieren
    ProcessingGenerator.globals_.add(`import processing.sound.*;`);
    // Die Variable deklarieren
    ProcessingGenerator.globals_.add(`SoundFile ${varName};`);
    
    // Initialisierung im setup()
    return `  ${varName} = new SoundFile(this, "${fileName}");\n`;
};

ProcessingGenerator.forBlock['processing_sound_action'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const action = block.getFieldValue('ACTION'); 
    
    return `  ${varName}.${action}();\n`;
};

ProcessingGenerator.forBlock['processing_sound_volume'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const vol = ProcessingGenerator.valueToCode(block, 'VOL', ProcessingGenerator.ORDER_NONE) || '1.0';
    
    // Processing nutzt amp() fuer die Lautstaerke
    return `  ${varName}.amp(${vol});\n`;
};