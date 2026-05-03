// ==========================================
// BAUTEILE: SYSTEMZEIT (Millis & Micros)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_time_sys",
        "message0": "Systemzeit seit Start in %1",
        "args0": [
            {"type": "field_dropdown", "name": "UNIT", "options": [
                ["Millisekunden (millis)", "millis"], 
                ["Mikrosekunden (micros)", "micros"]
            ]}
        ],
        "output": "Number",
        "colour": 290,
        "tooltip": "Gibt die Systemzeit zurück. Erzeugt einen overflow-sicheren Wrapper: millis() läuft nach ~49 Tagen über, micros() nach ~70 Minuten — der Wrapper setzt den Wert dabei automatisch auf 0 zurück."
    }
]);

ArduinoGenerator.forBlock['ard_time_sys'] = function(block) {
    const unit = block.getFieldValue('UNIT');

    // Overflow-sichere Wrapper-Funktionen: erkennen den Überlauf (current < lastVal)
    // und setzen auf 0 zurück, damit direkter Vergleich mit dem Rückgabewert korrekt bleibt.
    // millis() läuft nach ~49 Tagen über, micros() nach ~70 Minuten.
    if (unit === 'millis') {
        ArduinoGenerator.needsSafeMillis = true;
        return [`millis_safe()`, 0];
    }
    if (unit === 'micros') {
        ArduinoGenerator.needsSafeMicros = true;
        return [`micros_safe()`, 0];
    }

    return [`${unit}()`, 0];
};