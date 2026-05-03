// ==========================================
// BAUTEILE: STOPPUHR (Ohne externe Library)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. STOPPUHR STEUERN (Start, Stop, Reset, Restart) ---
    {
        "type": "stopwatch_command",
        "message0": "Stoppuhr %1 %2",
        "args0": [
            {"type": "field_input", "name": "NAME", "text": "meineUhr"},
            {"type": "field_dropdown", "name": "CMD", "options": [
                ["starten", "start()"],
                ["stoppen", "stop()"],
                ["zurücksetzen (reset)", "reset()"],
                ["neu starten (restart)", "restart()"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Steuert eine Stoppuhr."
    },
    // --- 2. STOPPUHR AUSLESEN (Elapsed) ---
    {
        "type": "stopwatch_read",
        "message0": "Vergangene Zeit von Stoppuhr %1 in %2",
        "args0": [
            {"type": "field_input", "name": "NAME", "text": "meineUhr"},
            {"type": "field_dropdown", "name": "UNIT", "options": [
                ["Millisekunden", "MILLIS"],
                ["Sekunden", "SECS"],
                ["Minuten", "MINS"]
            ]}
        ],
        "output": "Number",
        "colour": 290,
        "tooltip": "Gibt die gemessene Zeit der Stoppuhr zurück. Basis-Auflösung ist Millisekunden (millis()), daher sind keine echten Mikrosekunden möglich."
    }
]);

ArduinoGenerator.forBlock['stopwatch_command'] = function(block) {
    const name = block.getFieldValue('NAME');
    const cmd = block.getFieldValue('CMD');

    // Meldet die Stoppuhr für das nächste index.html Update an
    if (!ArduinoGenerator.usedStopWatches) ArduinoGenerator.usedStopWatches = new Set();
    ArduinoGenerator.usedStopWatches.add(name);

    return `  ${name}.${cmd};\n`;
};

ArduinoGenerator.forBlock['stopwatch_read'] = function(block) {
    const name = block.getFieldValue('NAME');
    const unit = block.getFieldValue('UNIT');

    if (!ArduinoGenerator.usedStopWatches) ArduinoGenerator.usedStopWatches = new Set();
    ArduinoGenerator.usedStopWatches.add(name);

    // Der Basis-Befehl gibt Millisekunden zurück
    let code = `${name}.elapsed()`;
    
    // Mathematik für die gewünschte Einheit direkt im C++ Code anwenden
    if (unit === 'SECS') code = `(${code} / 1000)`;
    if (unit === 'MINS') code = `(${code} / 60000)`;

    return [code, 0];
};