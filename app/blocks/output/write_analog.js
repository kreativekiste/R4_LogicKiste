// ==========================================
// BAUTEILE: ANALOG SCHREIBEN (PWM / Helligkeit)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "write_analog",  // <-- FIX: Name stimmt jetzt mit der Toolbox überein!
    "message0": "Schreibe Helligkeit (PWM) an PIN %1",
    "args0": [
        {
            "type": "field_input", 
            "name": "PIN", 
            "text": "9"
        }
    ],
    "message1": "Wert (0-255): %1",
    "args1": [
        {
            "type": "input_value",
            "name": "VAL",
            "check": "Number"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Setzt die Helligkeit einer LED oder Geschwindigkeit eines Motors (0-255). Nutze Pins mit dem ~ Symbol (z.B. 3, 5, 6, 9, 10, 11)."
}]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['write_analog'] = function(block) { // <-- FIX
    const pin = block.getFieldValue('PIN').trim(); // Pro-Tipp: Gegen versehentliche Leerzeichen
    // Pin zentral anmelden. generator_core.js erstellt daraus "const int pinX = X;" und pinMode OUTPUT.
    ArduinoGenerator.usedPinsOutput.add(pin);
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['write_analog'] = function(block) { // <-- FIX
    const pin = block.getFieldValue('PIN').trim();
    // Holt den Wert vom Steckplatz (Standard 0, falls leer)
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    
    // Erzeugt sauberen C++ Code: analogWrite(pin9, 128);
    return `  analogWrite(pin${pin}, ${val});\n`;
};