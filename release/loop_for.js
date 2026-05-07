// ====================================================================
// BLOCK: Zählschleife (For-Schleife)
// ORDNER: release/loop_for.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_loop_for'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔄 Zähle Variable")
        .appendField(new Blockly.FieldVariable("i"), "VAR")
        .appendField("von")
        .appendField(new Blockly.FieldNumber(0), "START")
        .appendField("bis")
        .appendField(new Blockly.FieldNumber(10), "END")
        .appendField("mit Schrittweite")
        .appendField(new Blockly.FieldNumber(1), "STEP");
    this.appendStatementInput("DO")
        .setCheck(null)
        .appendField("Mache:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120); // Grün für Schleifen/Logik
    this.setTooltip("Wiederholt die eingefügten Blöcke und zählt dabei die Variable hoch oder runter.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_loop_for'] = function(block) {
  // Holt den sicheren Variablennamen aus Blockly (meistens "i")
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  
  // Holt die Werte aus den Zahlenfeldern
  var number_start = parseFloat(block.getFieldValue('START'));
  var number_end = parseFloat(block.getFieldValue('END'));
  var number_step = Math.abs(parseFloat(block.getFieldValue('STEP'))); // Schrittweite immer positiv machen für die Logik
  
  // Holt den Code, der in die Schleife gesteckt wurde
  var statements_do = Blockly.JavaScript.statementToCode(block, 'DO');

  // Absicherung: Falls die Schrittweite 0 ist, auf 1 setzen, um einen Absturz (Endlosschleife) zu verhindern
  if (number_step === 0) {
      number_step = 1;
  }

  var code = '';
  
  // Logik: Zählen wir hoch oder runter?
  if (number_start <= number_end) {
    // C++ Code für das Hochzählen (z.B. von 0 bis 10)
    code = 'for (int ' + variable_var + ' = ' + number_start + '; ' + variable_var + ' <= ' + number_end + '; ' + variable_var + ' += ' + number_step + ') {\n' +
           statements_do +
           '}\n';
  } else {
    // C++ Code für das Runterzählen (z.B. von 10 bis 0)
    code = 'for (int ' + variable_var + ' = ' + number_start + '; ' + variable_var + ' >= ' + number_end + '; ' + variable_var + ' -= ' + number_step + ') {\n' +
           statements_do +
           '}\n';
  }
  
  return code;
};