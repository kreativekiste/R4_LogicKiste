// =======================================================================
// PROCESSING: STATUSANZEIGEN (OUTPUT / AUSGABE)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "processing_output_bar",
        "message0": "Balkenanzeige Wert %1 Min %2 Max %3 X %4 Y %5 Breite %6 Hoehe %7",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "MIN", "check": "Number"},
            {"type": "input_value", "name": "MAX", "check": "Number"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Zeichnet einen grafischen Balken."
    },
    {
        "type": "processing_output_dial",
        "message0": "Zeigerinstrument Wert %1 Min %2 Max %3 X %4 Y %5 Radius %6",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "MIN", "check": "Number"},
            {"type": "input_value", "name": "MAX", "check": "Number"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "R", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Zeichnet einen Tacho (Halbkreis) mit einem Zeigerausschlag."
    },
    {
        "type": "processing_output_digital_lamp",
        "message0": "Statuslampe (Digital) Zustand %1 X %2 Y %3 Radius %4 Farbe bei Falsch (0) %5 Farbe bei Wahr (1) %6",
        "args0": [
            {"type": "input_value", "name": "STATE", "check": ["Boolean", "Number"]},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "R", "check": "Number"},
            {"type": "field_colour", "name": "COL0", "colour": "#808080"},
            {"type": "field_colour", "name": "COL1", "colour": "#00ff00"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Eine Lampe, die zwischen zwei Farben wechselt (z.B. fuer Relais)."
    },
    {
        "type": "processing_output_analog_lamp",
        "message0": "Status-Ampel (Analog) Wert %1 X %2 Y %3 Radius %4 Farbe 0 %5 Farbe 1 %6 Farbe 2 %7 Farbe 3 %8 Farbe 4 %9",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "R", "check": "Number"},
            {"type": "field_colour", "name": "C0", "colour": "#808080"},
            {"type": "field_colour", "name": "C1", "colour": "#00ff00"},
            {"type": "field_colour", "name": "C2", "colour": "#ffff00"},
            {"type": "field_colour", "name": "C3", "colour": "#ff0000"},
            {"type": "field_colour", "name": "C4", "colour": "#0000ff"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Wechselt die Farbe basierend auf einer Zahl von 0 bis 4."
    }
]);

// --- GENERATOREN ---

ProcessingGenerator.forBlock['processing_output_bar'] = function(block) {
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`
void lk_drawBar(float val, float minVal, float maxVal, float x, float y, float w, float h) {
  float cVal = constrain(val, minVal, maxVal);
  float mappedW = map(cVal, minVal, maxVal, 0, w);
  noFill(); stroke(200); rect(x, y, w, h);
  fill(80, 200, 120); noStroke(); rect(x, y, mappedW, h);
}`);
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const min = ProcessingGenerator.valueToCode(block, 'MIN', ProcessingGenerator.ORDER_NONE) || '0';
    const max = ProcessingGenerator.valueToCode(block, 'MAX', ProcessingGenerator.ORDER_NONE) || '100';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '100';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '20';
    return `  lk_drawBar(${val}, ${min}, ${max}, ${x}, ${y}, ${w}, ${h});\n`;
};

ProcessingGenerator.forBlock['processing_output_dial'] = function(block) {
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`
void lk_drawDial(float val, float minVal, float maxVal, float x, float y, float r) {
  float cVal = constrain(val, minVal, maxVal);
  float angle = map(cVal, minVal, maxVal, PI, TWO_PI);
  noFill(); stroke(200); strokeWeight(2); arc(x, y, r * 2, r * 2, PI, TWO_PI);
  stroke(220, 50, 50); strokeWeight(4); line(x, y, x + cos(angle) * (r * 0.85), y + sin(angle) * (r * 0.85));
  fill(100); noStroke(); ellipse(x, y, r * 0.2, r * 0.2); strokeWeight(1);
}`);
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const min = ProcessingGenerator.valueToCode(block, 'MIN', ProcessingGenerator.ORDER_NONE) || '0';
    const max = ProcessingGenerator.valueToCode(block, 'MAX', ProcessingGenerator.ORDER_NONE) || '100';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const r = ProcessingGenerator.valueToCode(block, 'R', ProcessingGenerator.ORDER_NONE) || '50';
    return `  lk_drawDial(${val}, ${min}, ${max}, ${x}, ${y}, ${r});\n`;
};

ProcessingGenerator.forBlock['processing_output_digital_lamp'] = function(block) {
    const state = ProcessingGenerator.valueToCode(block, 'STATE', ProcessingGenerator.ORDER_NONE) || 'false';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const r = ProcessingGenerator.valueToCode(block, 'R', ProcessingGenerator.ORDER_NONE) || '20';
    const c0 = block.getFieldValue('COL0');
    const c1 = block.getFieldValue('COL1');
    
    // Unterstuetzt true/false oder 1/0
    return `  if (${state} == true || ${state} == 1) { fill(${c1}); } else { fill(${c0}); }
  stroke(50); ellipse(${x}, ${y}, ${r}*2, ${r}*2);\n`;
};

ProcessingGenerator.forBlock['processing_output_analog_lamp'] = function(block) {
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const r = ProcessingGenerator.valueToCode(block, 'R', ProcessingGenerator.ORDER_NONE) || '20';
    
    const c0 = block.getFieldValue('C0');
    const c1 = block.getFieldValue('C1');
    const c2 = block.getFieldValue('C2');
    const c3 = block.getFieldValue('C3');
    const c4 = block.getFieldValue('C4');

    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`
void lk_drawAmpel(int val, float x, float y, float r, color c0, color c1, color c2, color c3, color c4) {
  if(val == 0) fill(c0);
  else if(val == 1) fill(c1);
  else if(val == 2) fill(c2);
  else if(val == 3) fill(c3);
  else if(val == 4) fill(c4);
  else fill(100); // Grau, wenn Zahl unbekannt
  stroke(50); ellipse(x, y, r*2, r*2);
}`);

    return `  lk_drawAmpel(int(${val}), ${x}, ${y}, ${r}, ${c0}, ${c1}, ${c2}, ${c3}, ${c4});\n`;
};