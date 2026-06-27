// =======================================================================
// PROCESSING: BEDIENELEMENTE (INPUT / EINGABE)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "processing_input_button",
        "message0": "Button geklickt an X %1 Y %2 Breite %3 Hoehe %4",
        "args0": [
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"}
        ],
        "output": "Boolean",
        "colour": 120,
        "tooltip": "Gibt WAHR zurueck, wenn die Maus gerade innerhalb dieses Bereichs geklickt wird."
    },
    {
        "type": "processing_input_slider",
        "message0": "Schieberegler Aktueller Wert %1 Min %2 Max %3 X %4 Y %5 Breite %6 Hoehe %7",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "MIN", "check": "Number"},
            {"type": "input_value", "name": "MAX", "check": "Number"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"}
        ],
        "output": "Number",
        "colour": 120,
        "tooltip": "Ein Regler, der auf die Maus reagiert."
    },
    {
        "type": "processing_input_text",
        "message0": "Texteingabe-Feld Aktueller Text %1 X %2 Y %3 Breite %4 Hoehe %5 Info-Text %6",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "String"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"},
            {"type": "field_input", "name": "PROMPT", "text": "Bitte Text eingeben:"}
        ],
        "output": "String",
        "colour": 120,
        "tooltip": "Zeichnet ein Feld. Bei Klick oeffnet sich ein Fenster zur Tastatureingabe."
    },
    {
        "type": "processing_input_number",
        "message0": "Zahleneingabe-Feld Aktuelle Zahl %1 X %2 Y %3 Breite %4 Hoehe %5 Info-Text %6",
        "args0": [
            {"type": "input_value", "name": "VAL", "check": "Number"},
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "input_value", "name": "W", "check": "Number"},
            {"type": "input_value", "name": "H", "check": "Number"},
            {"type": "field_input", "name": "PROMPT", "text": "Bitte Zahl eingeben:"}
        ],
        "output": "Number",
        "colour": 120,
        "tooltip": "Zeichnet ein Feld. Bei Klick oeffnet sich ein Fenster zur Zahleneingabe."
    }
]);

// --- GENERATOREN ---

ProcessingGenerator.forBlock['processing_input_button'] = function(block) {
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '50';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '50';
    const code = `(mousePressed && mouseX >= ${x} && mouseX <= (${x} + ${w}) && mouseY >= ${y} && mouseY <= (${y} + ${h}))`;
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_input_slider'] = function(block) {
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`
float lk_readSlider(float val, float minVal, float maxVal, float x, float y, float w, float h) {
  fill(220); stroke(150); rect(x, y, w, h);
  float handleX = map(constrain(val, minVal, maxVal), minVal, maxVal, x, x + w);
  fill(100); noStroke(); rect(handleX - 5, y - 5, 10, h + 10);
  if (mousePressed && mouseX >= x && mouseX <= (x + w) && mouseY >= y && mouseY <= (y + h)) {
    return map(mouseX, x, x + w, minVal, maxVal);
  }
  return val;
}`);
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const min = ProcessingGenerator.valueToCode(block, 'MIN', ProcessingGenerator.ORDER_NONE) || '0';
    const max = ProcessingGenerator.valueToCode(block, 'MAX', ProcessingGenerator.ORDER_NONE) || '100';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '100';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '20';
    return [`lk_readSlider(${val}, ${min}, ${max}, ${x}, ${y}, ${w}, ${h})`, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_input_text'] = function(block) {
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`import javax.swing.JOptionPane;`);
    ProcessingGenerator.globals_.add(`
boolean lk_inputActive = false;
String lk_textInput(String val, float x, float y, float w, float h, String prompt) {
  fill(250); stroke(150); rect(x, y, w, h);
  fill(0); textAlign(LEFT, CENTER); textSize(14); text(val, x + 5, y + h/2);
  if (mousePressed && mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && !lk_inputActive) {
    lk_inputActive = true;
    String input = JOptionPane.showInputDialog(prompt, val);
    lk_inputActive = false;
    if (input != null) return input;
  }
  return val;
}`);
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '""';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '150';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '30';
    const prompt = block.getFieldValue('PROMPT');
    return [`lk_textInput(${val}, ${x}, ${y}, ${w}, ${h}, "${prompt}")`, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_input_number'] = function(block) {
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`import javax.swing.JOptionPane;`);
    ProcessingGenerator.globals_.add(`
float lk_numInput(float val, float x, float y, float w, float h, String prompt) {
  fill(250); stroke(150); rect(x, y, w, h);
  fill(0); textAlign(LEFT, CENTER); textSize(14); text(str(val), x + 5, y + h/2);
  if (mousePressed && mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h && !lk_inputActive) {
    lk_inputActive = true;
    String input = JOptionPane.showInputDialog(prompt, str(val));
    lk_inputActive = false;
    if (input != null) {
        try { return Float.parseFloat(input.replace(',', '.')); } 
        catch (Exception e) { return val; }
    }
  }
  return val;
}`);
    const val = ProcessingGenerator.valueToCode(block, 'VAL', ProcessingGenerator.ORDER_NONE) || '0';
    const x = ProcessingGenerator.valueToCode(block, 'X', ProcessingGenerator.ORDER_NONE) || '0';
    const y = ProcessingGenerator.valueToCode(block, 'Y', ProcessingGenerator.ORDER_NONE) || '0';
    const w = ProcessingGenerator.valueToCode(block, 'W', ProcessingGenerator.ORDER_NONE) || '100';
    const h = ProcessingGenerator.valueToCode(block, 'H', ProcessingGenerator.ORDER_NONE) || '30';
    const prompt = block.getFieldValue('PROMPT');
    return [`lk_numInput(${val}, ${x}, ${y}, ${w}, ${h}, "${prompt}")`, ProcessingGenerator.ORDER_ATOMIC];
};