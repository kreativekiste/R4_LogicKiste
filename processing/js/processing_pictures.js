// =======================================================================
// PROCESSING: BILDER & EFFEKTE
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // --- BILDER LADEN & ZEIGEN ---
    {
        "type": "processing_image_load",
        "message0": "Lade Bild %1 Datei %2",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinBild"},
            {"type": "field_input", "name": "FILE", "text": "maschine.png"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 70,
        "tooltip": "Laedt ein Bild in den Speicher. Muss in den SETUP-Bereich!"
    },
    {
        "type": "processing_image_show",
        "message0": "Zeige Bild %1 X %2 Y %3 Breite %4 Hoehe %5",
        "args0": [
            {"type": "field_input", "name": "VAR", "text": "meinBild"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 70,
        "tooltip": "Zeichnet das geladene Bild."
    },

    // --- BILD EFFEKTE (TINT) ---
    {
        "type": "processing_image_tint",
        "message0": "Setze Bild-Transparenz (0-255) %1",
        "args0": [
            {"type": "input_value", "name": "ALPHA", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 70,
        "tooltip": "Aendert die Deckkraft der folgenden Bilder. 0 = unsichtbar, 255 = voll sichtbar."
    },
    {
        "type": "processing_image_tint_color",
        "message0": "Faerbe Bild Rot %1 Gruen %2 Blau %3 Transparenz %4",
        "args0": [
            {"type": "input_value", "name": "R", "check": "Number"},
            {"type": "input_value", "name": "G", "check": "Number"},
            {"type": "input_value", "name": "B", "check": "Number"},
            {"type": "input_value", "name": "ALPHA", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 70,
        "tooltip": "Legt einen Farbfilter ueber das Bild und setzt die Deckkraft."
    },
    {
        "type": "processing_image_no_tint",
        "message0": "Entferne Bild-Effekte",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 70,
        "tooltip": "Setzt Farben und Transparenz fuer alle nachfolgenden Bilder zurueck."
    }
]);

// =======================================================================
// GENERATOREN
// =======================================================================

ProcessingGenerator.forBlock['processing_image_load'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const fileName = block.getFieldValue('FILE');
    
    // Globale Variable für das Bild anlegen
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`PImage ${varName};`);
    
    return `  ${varName} = loadImage("${fileName}");\n`;
};

ProcessingGenerator.forBlock['processing_image_show'] = function(block) {
    const varName = block.getFieldValue('VAR');
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '100';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '100';
    
    return `  image(${varName}, ${x}, ${y}, ${w}, ${h});\n`;
};

ProcessingGenerator.forBlock['processing_image_tint'] = function(block) {
    // Holt den Wert für die Transparenz
    const alpha = ProcessingGenerator.valueToCode(block, 'ALPHA', ProcessingGenerator.ORDER_NONE) || '255';
    // tint(255, alpha) wendet keine Farbe an, sondern nur den Alpha-Kanal
    return `  tint(255, ${alpha});\n`;
};

ProcessingGenerator.forBlock['processing_image_tint_color'] = function(block) {
    const r = ProcessingGenerator.valueToCode(block, 'R', ProcessingGenerator.ORDER_NONE) || '255';
    const g = ProcessingGenerator.valueToCode(block, 'G', ProcessingGenerator.ORDER_NONE) || '255';
    const b = ProcessingGenerator.valueToCode(block, 'B', ProcessingGenerator.ORDER_NONE) || '255';
    const alpha = ProcessingGenerator.valueToCode(block, 'ALPHA', ProcessingGenerator.ORDER_NONE) || '255';
    
    return `  tint(${r}, ${g}, ${b}, ${alpha});\n`;
};

ProcessingGenerator.forBlock['processing_image_no_tint'] = function(block) {
    return `  noTint();\n`;
};