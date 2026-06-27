// =======================================================================
// PROCESSING: FORMEN, FARBEN & TEXTE
// =======================================================================

Blockly.defineBlocksWithJsonArray([

    // --- HINTERGRUND ---
    {
        "type": "processing_background",
        "message0": "Hintergrundfarbe %1",
        "args0": [{"type": "field_colour", "name": "COLOR", "colour": "#ffffff"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Fuellt den gesamten Hintergrund mit einer festen Farbe."
    },

    // --- STIFTE & FARBEN ---
    {
        "type": "processing_fill",
        "message0": "Fuellfarbe %1",
        "args0": [{"type": "field_colour", "name": "COLOR", "colour": "#ff0000"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt die Farbe fuer das Innere der nachfolgenden Formen."
    },
    {
        "type": "processing_no_fill",
        "message0": "Keine Fuellung",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Nachfolgende Formen werden transparent (nur der Rand ist sichtbar)."
    },
    {
        "type": "processing_stroke",
        "message0": "Randfarbe %1",
        "args0": [{"type": "field_colour", "name": "COLOR", "colour": "#000000"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt die Farbe fuer Linien und die Raender von Formen."
    },
    {
        "type": "processing_no_stroke",
        "message0": "Kein Rand",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Nachfolgende Formen werden ohne Randlinie gezeichnet."
    },
    {
        "type": "processing_stroke_weight",
        "message0": "Linienstaerke %1",
        "args0": [{"type": "input_value", "name": "WEIGHT", "check": "Number"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Legt die Dicke der Linien und Raender fest."
    },

    // --- FORMEN ---
    {
        "type": "processing_rect",
        "message0": "Rechteck X %1 Y %2 Breite %3 Hoehe %4",
        "args0": [
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Zeichnet ein Rechteck ab der Position X/Y."
    },
    {
        "type": "processing_ellipse",
        "message0": "Kreis / Ellipse X %1 Y %2 Breite %3 Hoehe %4",
        "args0": [
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Zeichnet eine Ellipse oder einen Kreis. X/Y ist der Mittelpunkt."
    },
    {
        "type": "processing_line",
        "message0": "Linie von X1 %1 Y1 %2 nach X2 %3 Y2 %4",
        "args0": [
            {"type": "input_value", "name": "X1", "check": "Number"},
            {"type": "input_value", "name": "Y1", "check": "Number"},
            {"type": "input_value", "name": "X2", "check": "Number"},
            {"type": "input_value", "name": "Y2", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Zeichnet eine gerade Linie zwischen zwei Punkten."
    },

    // --- TEXTE ---
    {
        "type": "processing_text",
        "message0": "Zeige Text %1 an X %2 Y %3",
        "args0": [
            {"type": "input_value", "name": "TEXT"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Schreibt einen Text oder eine Variable auf den Bildschirm."
    },
    {
        "type": "processing_text_size",
        "message0": "Textgroesse %1",
        "args0": [{"type": "input_value", "name": "SIZE", "check": "Number"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Legt die Schriftgroesse fuer nachfolgende Texte fest."
    },
    {
        "type": "processing_text_align",
        "message0": "Textausrichtung %1",
        "args0": [
            {"type": "field_dropdown", "name": "ALIGN", "options": [
                ["Linksbuendig", "LEFT"],
                ["Zentriert", "CENTER"],
                ["Rechtsbuendig", "RIGHT"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Richtet den nachfolgenden Text am X-Punkt aus."
    },
    {
        "type": "processing_text_font",
        "message0": "Schriftart %1",
        "args0": [
            {"type": "field_dropdown", "name": "FONT", "options": [
                ["Arial", "Arial"],
                ["Courier New", "Courier New"],
                ["Verdana", "Verdana"],
                ["Georgia", "Georgia"],
                ["Times New Roman", "Times New Roman"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Legt die Schriftart fuer nachfolgende Texte fest."
    },
    {
        "type": "processing_text_color",
        "message0": "Textfarbe %1",
        "args0": [{"type": "field_colour", "name": "COLOR", "colour": "#000000"}],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt die Farbe fuer den nachfolgenden Text."
    }
]);

// =======================================================================
// CODE-GENERATOREN FÜR PROCESSING (JAVA)
// =======================================================================

ProcessingGenerator.forBlock['processing_background'] = function(block) {
    const color = block.getFieldValue('COLOR');
    return `  background(${color});\n`;
};

ProcessingGenerator.forBlock['processing_fill'] = function(block) {
    const color = block.getFieldValue('COLOR');
    return `  fill(${color});\n`;
};

ProcessingGenerator.forBlock['processing_no_fill'] = function(block) {
    return `  noFill();\n`;
};

ProcessingGenerator.forBlock['processing_stroke'] = function(block) {
    const color = block.getFieldValue('COLOR');
    return `  stroke(${color});\n`;
};

ProcessingGenerator.forBlock['processing_no_stroke'] = function(block) {
    return `  noStroke();\n`;
};

ProcessingGenerator.forBlock['processing_stroke_weight'] = function(block) {
    const weight = ProcessingGenerator.valueToCode(block, 'WEIGHT', ProcessingGenerator.ORDER_NONE) || '1';
    return `  strokeWeight(${weight});\n`;
};

ProcessingGenerator.forBlock['processing_rect'] = function(block) {
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '100';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '100';
    return `  rect(${x}, ${y}, ${w}, ${h});\n`;
};

ProcessingGenerator.forBlock['processing_ellipse'] = function(block) {
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '100';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '100';
    return `  ellipse(${x}, ${y}, ${w}, ${h});\n`;
};

ProcessingGenerator.forBlock['processing_line'] = function(block) {
    const x1 = ProcessingGenerator.valueToCode(block, 'X1', ProcessingGenerator.ORDER_NONE) || '0';
    const y1 = ProcessingGenerator.valueToCode(block, 'Y1', ProcessingGenerator.ORDER_NONE) || '0';
    const x2 = ProcessingGenerator.valueToCode(block, 'X2', ProcessingGenerator.ORDER_NONE) || '100';
    const y2 = ProcessingGenerator.valueToCode(block, 'Y2', ProcessingGenerator.ORDER_NONE) || '100';
    return `  line(${x1}, ${y1}, ${x2}, ${y2});\n`;
};

ProcessingGenerator.forBlock['processing_text'] = function(block) {
    const textCode = ProcessingGenerator.valueToCode(block, 'TEXT', ProcessingGenerator.ORDER_NONE) || '""';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    return `  text(${textCode} + "", ${x}, ${y});\n`;
};

ProcessingGenerator.forBlock['processing_text_size'] = function(block) {
    const size = ProcessingGenerator.valueToCode(block, 'SIZE', ProcessingGenerator.ORDER_NONE) || '12';
    return `  textSize(${size});\n`;
};

ProcessingGenerator.forBlock['processing_text_align'] = function(block) {
    const align = block.getFieldValue('ALIGN');
    return `  textAlign(${align});\n`;
};

ProcessingGenerator.forBlock['processing_text_font'] = function(block) {
    const font = block.getFieldValue('FONT');
    return `  textFont(createFont("${font}", 24));\n`;
};

ProcessingGenerator.forBlock['processing_text_color'] = function(block) {
    const color = block.getFieldValue('COLOR');
    return `  fill(${color});\n`;
};


ProcessingGenerator.forBlock['processing_text_val'] = function(block) {
    // Holt den Text aus dem Eingabefeld und setzt ihn in Anfuehrungszeichen
    const textValue = block.getFieldValue('TEXT') || '';
    return ['"' + textValue + '"', ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_number'] = function(block) {
    // Holt die Zahl aus dem Eingabefeld
    const numValue = block.getFieldValue('NUM') || '0';
    return [numValue, ProcessingGenerator.ORDER_ATOMIC];
};