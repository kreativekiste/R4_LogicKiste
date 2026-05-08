// ====================================================================
// BLOCK: Modulo (Rest der Division)
// ORDNER: release/math_modulo.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_math_modulo'] = {
  init: function() {
    this.appendValueInput("DIVIDEND")
        .setCheck("Number")
        .appendField("Rest von:");
    this.appendValueInput("DIVISOR")
        .setCheck("Number")
        .appendField("geteilt durch:");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setColour(230); // Blau/Türkis für Mathe-Blöcke
    this.setTooltip("Berechnet den Rest einer Division (z. B. 10 % 3 = 1). Perfekt für gerade/ungerade Prüfungen.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_math_modulo'] = function(block) {
  // Wir holen die Werte. Falls nichts angedockt ist, nutzen wir 0 und 1.
  var value_dividend = Blockly.JavaScript.valueToCode(block, 'DIVIDEND', Blockly.JavaScript.ORDER_MULTIPLICATIVE) || '0';
  var value_divisor = Blockly.JavaScript.valueToCode(block, 'DIVISOR', Blockly.JavaScript.ORDER_MULTIPLICATIVE) || '1';

  // Wichtig für Arduino C++: Der % Operator funktioniert nur mit Integern (Ganzzahlen).
  // Wir casten die Eingaben daher sicherheitshalber auf (int), um Fehler zu vermeiden.
  var code = '((int)' + value_dividend + ' % (int)' + value_divisor + ')';
  
  return [code, Blockly.JavaScript.ORDER_MULTIPLICATIVE];
};