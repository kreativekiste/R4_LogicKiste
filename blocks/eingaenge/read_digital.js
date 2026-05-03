// ==========================================
// BAUTEILE: DIGITAL LESEN (Flexibler Pin)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_read_digital",
        "message0": "Lese digitalen PIN %1",
        "args0": [
            {"type": "field_input", "name": "PIN", "text": "2"}
        ],
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Liest den Zustand eines Pins. Du kannst Zahlen (2, 3) oder analoge Bezeichnungen (A0, A1) nutzen."
    }
]);

ArduinoGenerator.forBlock['ard_read_digital'] = function(block) {
    const pin = block.getFieldValue('PIN');
    
    if (!ArduinoGenerator.pinModes) ArduinoGenerator.pinModes = new Map();
    ArduinoGenerator.usedPinsInput.add(pin);
    
    if (!ArduinoGenerator.pinModes.has(pin)) {
        ArduinoGenerator.pinModes.set(pin, 'INPUT');
    }
    
    return [`digitalRead(pin${pin})`, 0];
};