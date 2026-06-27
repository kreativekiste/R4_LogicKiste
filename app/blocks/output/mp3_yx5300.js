// --- Block Definitionen ---
Blockly.defineBlocksWithJsonArray([
    // 1. Setup Block (Optimiert für R4)
    {
        "type": "mp3_setup",
        "message0": "🎵 MP3 YX5300 Setup | Port: %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SERIAL_PORT",
                "options": [
                    ["Serial1 (Pin 0/1)", "Serial1"],
                    ["Serial2", "Serial2"],
                    ["Serial3", "Serial3"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Initialisiert das MP3 Modul. Am R4 nutzt man standardmäßig Serial1 (Pin 0 und 1)."
    },
    // 2. Lautstärke Block
    {
        "type": "mp3_volume",
        "message0": "🎵 MP3 Lautstärke auf: %1 (0-30)",
        "args0": [
            {"type": "input_value", "name": "VOL", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // 3. Ordner abspielen Block
    {
        "type": "mp3_play_folder",
        "message0": "🎵 MP3 Spiele Ordner: %1 %2",
        "args0": [
            {"type": "input_value", "name": "FOLDER", "check": "Number"},
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    ["(Einmalig)", "playFolder"],
                    ["(Dauerschleife)", "playFolderLoop"]
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // 4. Steuerungs Block (Play, Pause, Stop...)
    {
        "type": "mp3_control",
        "message0": "🎵 MP3 Aktion: %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "ACTION",
                "options": [
                    ["⏯️ Play (Fortsetzen)", "play()"],
                    ["⏸️ Pause", "pause()"],
                    ["⏹️ Stop", "stop()"],
                    ["⏭️ Nächster Titel", "playNext()"],
                    ["⏮️ Vorheriger Titel", "playPrev()"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    }
]);

// --- Generatoren (C++ Export) ---

// Der Hardware-Scanner sammelt die Globals und das Auto-Setup ein
ArduinoGenerator.hardwareScanners['mp3_setup'] = function(block) {
    const port = block.getFieldValue('SERIAL_PORT');
    
    ArduinoGenerator.globals_.add(`#include <YX5300_Player.h>`);
    ArduinoGenerator.globals_.add(`YX5300_Player mp3(${port});`);
    
    // Die Serial-Schnittstelle muss gestartet werden! YX5300 nutzt standardmäßig 9600 Baud.
    ArduinoGenerator.autoSetup_.push(`  ${port}.begin(9600);\n  mp3.begin();\n`);
};

ArduinoGenerator.forBlock['mp3_setup'] = function(block) {
    // Da alles Wichtige über den hardwareScanner in den Header und Setup gepusht wurde,
    // geben wir hier nur einen leeren String zurück.
    return '';
};

ArduinoGenerator.forBlock['mp3_volume'] = function(block) {
    const vol = ArduinoGenerator.valueToCode(block, 'VOL', 0) || '15';
    return `  mp3.setVolume(${vol});\n`;
};

ArduinoGenerator.forBlock['mp3_play_folder'] = function(block) {
    const folder = ArduinoGenerator.valueToCode(block, 'FOLDER', 0) || '1';
    const mode = block.getFieldValue('MODE'); // 'playFolder' oder 'playFolderLoop'
    return `  mp3.${mode}(${folder});\n`;
};

ArduinoGenerator.forBlock['mp3_control'] = function(block) {
    const action = block.getFieldValue('ACTION');
    return `  mp3.${action};\n`;
};