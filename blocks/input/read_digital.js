// ==========================================
// BAUTEIL: DIGITAL LESEN (Flexibler Pin)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_read_digital",
        "message0": "Lese digitalen PIN %1",
        "args0": [
            {
                "type": "field_input", 
                "name": "PIN", 
                "text": "2"
            }
        ],
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR oder FALSCH zurück. Unterstützt Zahlen (2, 3) und analoge Pins (A0, A1)."
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['ard_read_digital'] = function(block) {
    // Kleine Pro-Sicherheit: Versehentliche Leerzeichen des Nutzers entfernen
    const pin = block.getFieldValue('PIN').trim(); 
    
    // 1. Pin ordnungsgemäß im System anmelden
    ArduinoGenerator.usedPinsInput.add(pin);
    
    // Safety-Check für die Map (verhindert Absturz, falls der Core mal anders lädt)
    if (!ArduinoGenerator.pinModes) {
        ArduinoGenerator.pinModes = new Map();
    }

    // 2. Modus auf INPUT setzen (nur wenn nicht schon ein PULLUP existiert)
    if (!ArduinoGenerator.pinModes.has(pin)) {
        ArduinoGenerator.pinModes.set(pin, 'INPUT');
    }
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['ard_read_digital'] = function(block) {
    // Auch hier das trim() für die saubere Variablen-Referenz
    const pin = block.getFieldValue('PIN').trim();
    
    // Konsequente Nutzung der generierten Variablen-Referenz (z.B. pin2)
    return [`digitalRead(pin${pin})`, 0];
};