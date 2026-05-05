// ==========================================
// BAUTEIL: PULLUP AKTIVIEREN (Explizit)
// ==========================================

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

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['ard_setup_pullup'] = function(block) {
    // Kleine Pro-Sicherheit: Versehentliche Leerzeichen des Nutzers entfernen
    const pin = block.getFieldValue('PIN').trim();
    
    // Saubere Integration in den Core. 
    // Das System generiert daraus dedupliziert "pinMode(pinX, INPUT_PULLUP);" im Setup
    // und legt "const int pinX = X;" global an.
    ArduinoGenerator.usedPinsInput.add(pin);
    
    // Safety-Check für die Map (verhindert Absturz, falls der Core mal anders lädt)
    if (!ArduinoGenerator.pinModes) {
        ArduinoGenerator.pinModes = new Map();
    }
    
    ArduinoGenerator.pinModes.set(pin, 'INPUT_PULLUP');
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['ard_setup_pullup'] = function(block) {
    // Auch hier das trim() für die saubere Variablen-Referenz
    const pin = block.getFieldValue('PIN').trim();
    
    // Da die Arbeit im Setup (via Scanner) erledigt wird, 
    // hinterlassen wir im Loop nur einen hilfreichen Kommentar mit der korrekten Variable.
    return `  // Pin pin${pin} wird vom System automatisch im Setup als PULLUP konfiguriert\n`;
};