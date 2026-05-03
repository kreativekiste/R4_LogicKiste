// ==========================================
// BAUTEILE: ZUFALL (Random)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. RANDOM SEED (Gehört ins Setup) ---
    {
        "type": "ard_math_random_seed",
        "message0": "Zufall initialisieren (Rauschen von %1 nutzen)",
        "args0": [
            {"type": "field_dropdown", "name": "PIN", "options": [
                ["Analog A0", "A0"], ["Analog A1", "A1"], ["Analog A2", "A2"], 
                ["Analog A3", "A3"], ["Analog A4", "A4"], ["Analog A5", "A5"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "Liest einen offenen analogen Pin aus, um einen echten Zufalls-Startwert zu generieren. Ins SETUP packen!"
    },
    // --- 2. ZUFALLSZAHL GENERIEREN ---
    {
        "type": "ard_math_random_int",
        "message0": "Zufallszahl zwischen %1 und %2",
        "args0": [
            {"type": "input_value", "name": "MIN"},
            {"type": "input_value", "name": "MAX"}
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "Gibt eine zufällige ganze Zahl zurück."
    }
]);

ArduinoGenerator.forBlock['ard_math_random_seed'] = function(block) {
    const pin = block.getFieldValue('PIN');
    // Analog-Pin anmelden (kein INPUT_PULLUP, kein pinMode nötig)
    ArduinoGenerator.usedPinsAnalog.add(pin);
    return `  randomSeed(analogRead(pin${pin}));\n`;
};

ArduinoGenerator.forBlock['ard_math_random_int'] = function(block) {
    const min = ArduinoGenerator.valueToCode(block, 'MIN', 0) || '0';
    const max = ArduinoGenerator.valueToCode(block, 'MAX', 0) || '100';
    
    // WICHTIG: Die Arduino-Funktion random(min, max) schließt das Maximum aus!
    // Damit "1 bis 10" wirklich auch eine 10 ausgeben kann, müssen wir im C++ Code "+ 1" rechnen.
    return [`random(${min}, ${max} + 1)`, 0];
};