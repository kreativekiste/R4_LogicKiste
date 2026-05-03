// ==========================================
// BAUTEILE: NEOPIXEL BASIC (WS2812B)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SETUP BLOCK ---
    {
        "type": "neopixel_setup",
        "message0": "NeoPixel Setup | PIN %1 | Anzahl LEDs: %2",
        "args0": [
            {"type": "field_input", "name": "PIN", "text": "6"},
            {"type": "field_number", "name": "NUM_LEDS", "value": 16, "min": 1}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Muss einmalig im Setup aufgerufen werden."
    },

    // --- 2. EINZELNEN PIXEL SCHALTEN ---
    {
        "type": "neopixel_set_single",
        "message0": "Pixel %1 Farbe 🔴 %2 🟢 %3 🔵 %4",
        "args0": [
            {"type": "input_value", "name": "PIXEL"},
            {"type": "input_value", "name": "R"},
            {"type": "input_value", "name": "G"},
            {"type": "input_value", "name": "B"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt die Farbe eines einzelnen Pixels (Startet bei 0)."
    },

    // --- 3. PIXEL-LISTE SCHALTEN (Dein Wunsch!) ---
    {
        "type": "neopixel_set_list",
        "message0": "Pixel-Liste %1 Farbe 🔴 %2 🟢 %3 🔵 %4",
        "args0": [
            {"type": "field_input", "name": "PIXEL_LIST", "text": "0, 1, 2, 5"},
            {"type": "input_value", "name": "R"},
            {"type": "input_value", "name": "G"},
            {"type": "input_value", "name": "B"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Mehrere Pixel gleichzeitig schalten. Mit Komma trennen (z.B. 1, 2, 44)."
    },

    // --- 4. SHOW BLOCK (Senden) ---
    {
        "type": "neopixel_show",
        "message0": "NeoPixel aktualisieren (Show)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Sendet die eingestellten Farben an den LED-Streifen."
    }
]);

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['neopixel_setup'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const num = block.getFieldValue('NUM_LEDS');
    
    // Globale Library und Objekt einbinden
    if (!ArduinoGenerator.includes_) ArduinoGenerator.includes_ = new Set();
    ArduinoGenerator.includes_.add('#include <Adafruit_NeoPixel.h>');
    
    if (!ArduinoGenerator.globals_) ArduinoGenerator.globals_ = new Set();
    ArduinoGenerator.globals_.add(`Adafruit_NeoPixel strip = Adafruit_NeoPixel(${num}, pin${pin}, NEO_GRB + NEO_KHZ800);`);
    
    ArduinoGenerator.usedPinsOutput.add(pin);
    
    // Setup Code
    return `  strip.begin();\n  strip.show(); // Alle LEDs initial ausschalten\n`;
};

ArduinoGenerator.forBlock['neopixel_set_single'] = function(block) {
    const pixel = ArduinoGenerator.valueToCode(block, 'PIXEL', ArduinoGenerator.PRECEDENCE) || '0';
    const r = ArduinoGenerator.valueToCode(block, 'R', ArduinoGenerator.PRECEDENCE) || '0';
    const g = ArduinoGenerator.valueToCode(block, 'G', ArduinoGenerator.PRECEDENCE) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', ArduinoGenerator.PRECEDENCE) || '0';
    
    return `  strip.setPixelColor(${pixel}, strip.Color(${r}, ${g}, ${b}));\n`;
};

ArduinoGenerator.forBlock['neopixel_set_list'] = function(block) {
    const listStr = block.getFieldValue('PIXEL_LIST');
    const r = ArduinoGenerator.valueToCode(block, 'R', ArduinoGenerator.PRECEDENCE) || '0';
    const g = ArduinoGenerator.valueToCode(block, 'G', ArduinoGenerator.PRECEDENCE) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', ArduinoGenerator.PRECEDENCE) || '0';
    
    // JavaScript zerteilt die kommagetrennte Liste (z.B. "1, 2, 3")
    const pixels = listStr.split(',').map(p => p.trim()).filter(p => p !== '');
    
    let code = `  // --- Pixel-Liste: ${listStr} ---\n`;
    pixels.forEach(p => {
        // C++ Code für jeden einzelnen Pixel generieren (Beste Performance!)
        code += `  strip.setPixelColor(${p}, strip.Color(${r}, ${g}, ${b}));\n`;
    });
    
    return code;
};

ArduinoGenerator.forBlock['neopixel_show'] = function(block) {
    return `  strip.show();\n`;
};