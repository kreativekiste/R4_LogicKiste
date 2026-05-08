// ==========================================
// BAUTEILE: SYSTEMZEIT (Millis & Micros)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_time_sys",
        "message0": "Systemzeit seit Start in %1",
        "args0": [
            {"type": "field_dropdown", "name": "UNIT", "options": [
                ["Millisekunden (ms)", "millis"], 
                ["Mikrosekunden (µs)", "micros"]
            ]}
        ],
        "output": "Number",
        "colour": 290,
        "tooltip": "Gibt die Systemzeit zurück. Wichtig: Immer mit Subtraktion (Jetzt - Vorher >= Intervall) nutzen, um Überläufe sicher zu handhaben."
    }
]);

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['ard_time_sys'] = function(block) {
    const unit = block.getFieldValue('UNIT');
    // Generiert direkt den Funktionsaufruf millis() oder micros()
    return [`${unit}()`, 0];
};