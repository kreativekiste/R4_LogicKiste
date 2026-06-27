// =======================================================================
// PROCESSING: SYNTHESIZER & WELLENFORMEN (LIVE-TÖNE GENERIEREN)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // --- OSZILLATOR INITIALISIEREN & STARTEN ---
    {
        "type": "processing_synth_init",
        "message0": "Erstelle Oszillator %1 mit Name %2",
        "args0": [
            {
                "type": "field_dropdown", "name": "TYPE", "options": [
                    ["Sinus (weich)", "SinOsc"],
                    ["Rechteck (Retro 8-Bit)", "SqrOsc"],
                    ["Sägezahn (rau)", "SawOsc"],
                    ["Dreieck (hohl)", "TriOsc"]
                ]
            },
            {"type": "field_input", "name": "VAR", "text": "meinOszillator"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Erstellt einen Live-Ton-Erzeuger im SETUP-Bereich und startet ihn."
    },

    // --- FREQUENZ STEUERN (TONHÖHE) ---
    {
        "type": "processing_synth_freq",
        "message0": "Setze Frequenz von Oszillator %1 auf %2 Hz",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinOszillator"},
            {"type": "input_value", "name": "FREQ", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Aendert die Tonhoehe in Hertz. Perfekt fuer Poti-Variablen!"
    },

    // --- AMPLITUDE STEUERN (LAUTSTÄRKE) ---
    {
        "type": "processing_synth_amp",
        "message0": "Setze Amplitude von Oszillator %1 auf %2 (0.0 bis 1.0)",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinOszillator"},
            {"type": "input_value", "name": "AMP", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Aendert die Lautstaerke der Schwingung. 0.0 = stumm, 1.0 = voll."
    },

    // --- OSZILLATOR STOPPEN / STARTEN ---
    {
        "type": "processing_synth_control",
        "message0": "Oszillator %1 %2",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinOszillator"},
            {
                "type": "field_dropdown", "name": "CMD", "options": [
                    ["stoppen", "stop"],
                    ["starten / weiter", "play"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Schaltet den Oszillator komplett aus oder ein."
    }
]);

// =======================================================================
// GENERATOREN
// =======================================================================

ProcessingGenerator.forBlock['processing_synth_init'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const varName = block.getFieldValue('VAR');
    
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    
    // Nötige Bibliothek importieren & globale Variable erzeugen
    ProcessingGenerator.globals_.add(`import processing.sound.*;`);
    ProcessingGenerator.globals_.add(`${type} ${varName};`);
    
    // Initialisierung und direkter Start im setup()
    return `  ${varName} = new ${type}(this);\n  ${varName}.play();\n`;
};

ProcessingGenerator.forBlock['processing_synth_freq'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const freq = ProcessingGenerator.valueToCode(block, 'FREQ', ProcessingGenerator.ORDER_NONE) || '440';
    
    return `  ${varName}.freq(${freq});\n`;
};

ProcessingGenerator.forBlock['processing_synth_amp'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const amp = ProcessingGenerator.valueToCode(block, 'AMP', ProcessingGenerator.ORDER_NONE) || '0.5';
    
    return `  ${varName}.amp(${amp});\n`;
};

ProcessingGenerator.forBlock['processing_synth_control'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const cmd = block.getFieldValue('CMD');
    
    return `  ${varName}.${cmd}();\n`;
};