// ====================================================================
// BLOCK: Ton erzeugen (Buzzer / Piezo)
// ====================================================================

Blockly.defineBlocksWithJsonArray([{
    "type": "output_tone",
    "message0": "🔊 Spiele Ton an Pin %1 Frequenz (Hz): %2 Dauer (ms): %3",
    "args0": [
        {"type": "field_input", "name": "PIN", "text": "8"},
        {"type": "input_value", "name": "FREQ", "check": "Number"},
        {"type": "input_value", "name": "DURATION", "check": "Number"}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Lässt einen Buzzer am gewählten Pin mit der angegebenen Frequenz und Dauer piepsen."
}]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['output_tone'] = function(block) {
    const pin = block.getFieldValue('PIN').trim();
    // FIX: Pin beim Core anmelden → pinMode(OUTPUT) wird generiert
    ArduinoGenerator.usedPinsOutput.add(pin);
};

ArduinoGenerator.forBlock['output_tone'] = function(block) {
    const pin = block.getFieldValue('PIN').trim();
    const freq = ArduinoGenerator.valueToCode(block, 'FREQ', 0) || '1000';
    const duration = ArduinoGenerator.valueToCode(block, 'DURATION', 0) || '500';

    // tone() nutzt die vom Core generierte pinX Variable
    return `  tone(pin${pin}, ${freq}, ${duration});\n`;
};
