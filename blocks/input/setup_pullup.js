
Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_setup_pullup",
        "message0": "Aktiviere internen Pullup für PIN %1",
        "args0": [
            {
                "type": "field_input", 
                "name": "PIN", 
                "text": "A0"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Setzt den Pin-Modus auf INPUT_PULLUP. Ideal für Taster, die gegen GND schalten."
    }
]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['ard_setup_pullup'] = function(block) {
    // Kleine Pro-Sicherheit: Versehentliche Leerzeichen des Nutzers entfernen
    const pin = block.getFieldValue('PIN').trim();
    ArduinoGenerator.usedPinsInput.add(pin);

    if (!ArduinoGenerator.pinModes) {
        ArduinoGenerator.pinModes = new Map();
    }
    
    ArduinoGenerator.pinModes.set(pin, 'INPUT_PULLUP');
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['ard_setup_pullup'] = function(block) {
    const pin = block.getFieldValue('PIN').trim();

    return `  // Pin pin${pin} wird vom System automatisch im Setup als PULLUP konfiguriert\n`;
};