
// 1. Einfache Korrektur
Blockly.Blocks['math_correction_single'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([
            ["Absolutwert (Betrag) von", "ABS"],
            ["Runde auf ganze Zahl:", "ROUND"]
        ]), "OP");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Korrigiert einen einzelnen Wert (entfernt Minuszeichen oder rundet Kommazahlen).");
  }
};

ArduinoGenerator.forBlock['math_correction_single'] = function(block) {
  const op = block.getFieldValue('OP');
  const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
  let code = '';
  if (op === 'ABS') code = `abs(${num})`;
  else if (op === 'ROUND') code = `round(${num})`;
  return [code, 0];
};

// 2. Wertevergleich
Blockly.Blocks['math_correction_double'] = {
  init: function() {
    this.appendValueInput("NUM1")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([
            ["Minimum von", "MIN"],
            ["Maximum von", "MAX"]
        ]), "OP");
    this.appendValueInput("NUM2")
        .setCheck("Number")
        .appendField("und");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Vergleicht zwei Zahlen und gibt nur den kleineren oder größeren Wert aus.");
  }
};

ArduinoGenerator.forBlock['math_correction_double'] = function(block) {
  const op = block.getFieldValue('OP');
  const num1 = ArduinoGenerator.valueToCode(block, 'NUM1', 0) || '0';
  const num2 = ArduinoGenerator.valueToCode(block, 'NUM2', 0) || '0';
  let code = '';
  if (op === 'MIN') code = `min(${num1}, ${num2})`;
  else if (op === 'MAX') code = `max(${num1}, ${num2})`;
  return [code, 0];
};

// 3. Trigonometrie & Wurzel
Blockly.Blocks['math_trig_root'] = {
  init: function() {
    this.appendValueInput("NUM")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([
            ["Wurzel (sqrt) aus", "SQRT"],
            ["Sinus (sin) von", "SIN"],
            ["Cosinus (cos) von", "COS"],
            ["Tangens (tan) von", "TAN"]
        ]), "OP");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Erweiterte mathematische Berechnungen.");
  }
};

ArduinoGenerator.forBlock['math_trig_root'] = function(block) {
  const op = block.getFieldValue('OP');
  const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
  let code = '';
  if (op === 'SQRT') code = `sqrt(${num})`;
  else if (op === 'SIN') code = `sin(${num})`;
  else if (op === 'COS') code = `cos(${num})`;
  else if (op === 'TAN') code = `tan(${num})`;
  return [code, 0];
};

// 4. Potenzrechnung
Blockly.Blocks['math_power'] = {
  init: function() {
    this.appendValueInput("BASE")
        .setCheck("Number")
        .appendField("Potenz: Basis");
    this.appendValueInput("EXP")
        .setCheck("Number")
        .appendField("hoch Exponent");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Berechnet eine Zahl hoch eine andere (z.B. 2 hoch 3 = 8).");
  }
};

ArduinoGenerator.forBlock['math_power'] = function(block) {
  const base = ArduinoGenerator.valueToCode(block, 'BASE', 0) || '0';
  const exp = ArduinoGenerator.valueToCode(block, 'EXP', 0) || '0';
  const code = `pow(${base}, ${exp})`;
  return [code, 0];
};

// 5. Konstante Pi
Blockly.Blocks['math_pi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Konstante Pi (π)");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Gibt die mathematische Konstante Pi (3.14159...) zurück.");
  }
};

ArduinoGenerator.forBlock['math_pi'] = function(block) {
  return ['(PI)', 0];
};

// 6. Wertebereich umschreiben
Blockly.Blocks['ard_math_map'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("Map: Wert");
    this.appendValueInput("IN_MIN")
        .setCheck("Number")
        .appendField("von");
    this.appendValueInput("IN_MAX")
        .setCheck("Number")
        .appendField("–");
    this.appendValueInput("OUT_MIN")
        .setCheck("Number")
        .appendField("nach");
    this.appendValueInput("OUT_MAX")
        .setCheck("Number")
        .appendField("–");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Rechnet einen Wert aus einem Bereich in einen anderen um. z.B. Analogwert 0–1023 → Servo 0–180.");
  }
};

ArduinoGenerator.forBlock['ard_math_map'] = function(block) {
  const value  = ArduinoGenerator.valueToCode(block, 'VALUE',   0) || '0';
  const inMin  = ArduinoGenerator.valueToCode(block, 'IN_MIN',  0) || '0';
  const inMax  = ArduinoGenerator.valueToCode(block, 'IN_MAX',  0) || '1023';
  const outMin = ArduinoGenerator.valueToCode(block, 'OUT_MIN', 0) || '0';
  const outMax = ArduinoGenerator.valueToCode(block, 'OUT_MAX', 0) || '180';
  return [`map(${value}, ${inMin}, ${inMax}, ${outMin}, ${outMax})`, 0];
};

// 7. Wert begrenzen
Blockly.Blocks['ard_math_constrain'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("Begrenze Wert");
    this.appendValueInput("LOW")
        .setCheck("Number")
        .appendField("min");
    this.appendValueInput("HIGH")
        .setCheck("Number")
        .appendField("max");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Begrenzt einen Wert auf einen Mindest- und Maximalwert. Werte außerhalb werden auf das Limit gekappt.");
  }
};

ArduinoGenerator.forBlock['ard_math_constrain'] = function(block) {
  const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
  const low   = ArduinoGenerator.valueToCode(block, 'LOW',   0) || '0';
  const high  = ArduinoGenerator.valueToCode(block, 'HIGH',  0) || '255';

  return [`(constrain(${value}, ${low}, ${high}))`, 0];
};