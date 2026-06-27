
Blockly.defineBlocksWithJsonArray([
    // 1. SETUP
    {
        "type": "neopixel_setup",
        "message0": "NeoPixel Setup | PIN: %1 | Anzahl LEDs: %2",
        "args0": [
            { "type": "field_input", "name": "PIN", "text": "6" },
            { "type": "field_number", "name": "NUM_LEDS", "value": 16, "min": 1 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Initialisiert den NeoPixel-Streifen. Unterstützt alle digitalen und analogen Pins."
    },

    // 2. EINZELNEN PIXEL SCHALTEN
    {
        "type": "neopixel_set_single",
        "message0": "Pixel %1 Farbe 🔴 %2 🟢 %3 🔵 %4",
        "args0": [
            { "type": "input_value", "name": "PIXEL", "check": "Number" },
            { "type": "input_value", "name": "R", "check": "Number" },
            { "type": "input_value", "name": "G", "check": "Number" },
            { "type": "input_value", "name": "B", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Setzt die Farbe eines einzelnen Pixels (Zählung beginnt bei 0)."
    },

    // 3. PIXEL-LISTE SCHALTEN
    {
        "type": "neopixel_set_list",
        "message0": "Pixel-Liste %1 Farbe 🔴 %2 🟢 %3 🔵 %4",
        "args0": [
            { "type": "field_input", "name": "PIXEL_LIST", "text": "0, 1, 2, 5" },
            { "type": "input_value", "name": "R", "check": "Number" },
            { "type": "input_value", "name": "G", "check": "Number" },
            { "type": "input_value", "name": "B", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Schaltet mehrere Pixel gleichzeitig (z. B. 0, 2, 15)."
    },

    // 4. AKTUALISIEREN
    {
        "type": "neopixel_show",
        "message0": "NeoPixel aktualisieren (Show)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Überträgt alle Farbbefehle an die LEDs. Erst danach leuchten sie!"
    },

    // 5. CODE AUS DESIGNER EINFÜGEN
    {
        "type": "neopixel_custom_code",
        "message0": "Code aus NeoPixel-Designer: %1",
        "args0": [
            { "type": "field_input", "name": "CUSTOM_CODE", "text": "STRG+V hier..." }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Fügt den kopierten C++ Code aus dem NeoPixel Web-Designer direkt in dein Programm ein."
    }
]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['neopixel_setup'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const num = block.getFieldValue('NUM_LEDS');

    if (!ArduinoGenerator.includes_.has('#include <Adafruit_NeoPixel.h>')) {
        ArduinoGenerator.includes_.add('#include <Adafruit_NeoPixel.h>');
        ArduinoGenerator.globals_.add(`const int NEOPIXEL_PIN = ${rawPin};`);
        ArduinoGenerator.globals_.add(`const int NEOPIXEL_NUM = ${num};`);
        ArduinoGenerator.globals_.add(`Adafruit_NeoPixel strip = Adafruit_NeoPixel(NEOPIXEL_NUM, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);`);
        ArduinoGenerator.autoSetup_.push('  strip.begin();\n  strip.clear();\n  strip.show();\n');		
    }
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['neopixel_setup'] = function(block) {
    return ''; 
};

ArduinoGenerator.forBlock['neopixel_set_single'] = function(block) {
    const pixel = ArduinoGenerator.valueToCode(block, 'PIXEL', 0) || '0';
    const r = ArduinoGenerator.valueToCode(block, 'R', 0) || '0';
    const g = ArduinoGenerator.valueToCode(block, 'G', 0) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    return `  strip.setPixelColor(${pixel}, strip.Color(${r}, ${g}, ${b}));\n`;
};

ArduinoGenerator.forBlock['neopixel_set_list'] = function(block) {
    const listStr = block.getFieldValue('PIXEL_LIST');
    const r = ArduinoGenerator.valueToCode(block, 'R', 0) || '0';
    const g = ArduinoGenerator.valueToCode(block, 'G', 0) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';
    const pixels = listStr.split(',').map(p => p.trim()).filter(p => p !== '');
    let code = `  // --- Setze Pixel-Gruppe: ${listStr} ---\n`;
    pixels.forEach(p => {
        if(!isNaN(parseInt(p))) {
            code += `  strip.setPixelColor(${p}, strip.Color(${r}, ${g}, ${b}));\n`;
        }
    });
    return code;
};

ArduinoGenerator.forBlock['neopixel_show'] = function(block) {
    return `  strip.show();\n`;
};

ArduinoGenerator.forBlock['neopixel_custom_code'] = function(block) {
    const customCode = block.getFieldValue('CUSTOM_CODE');
    return `  ${customCode}\n`;
};