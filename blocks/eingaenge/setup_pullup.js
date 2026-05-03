// ==========================================
// BAUTEILE: PULLUP AKTIVIEREN (Flexibler Pin)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_setup_pullup",
        "message0": "Aktiviere internen Pullup für PIN %1",
        "args0": [
            {"type": "field_input", "name": "PIN", "text": "A0"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Aktiviert den internen Widerstand. Funktioniert für digitale und analoge Pins (z.B. A0)."
    }
]);

ArduinoGenerator.forBlock['ard_setup_pullup'] = function(block) {
    const pin = block.getFieldValue('PIN');
    
    if (!ArduinoGenerator.pinModes) ArduinoGenerator.pinModes = new Map();
    ArduinoGenerator.pinModes.set(pin, 'INPUT_PULLUP');
    ArduinoGenerator.usedPinsInput.add(pin);
    
    return `  // Pullup für Pin ${pin} konfiguriert\n`;
};