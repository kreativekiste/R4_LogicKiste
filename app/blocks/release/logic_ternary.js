// ====================================================================
// BLOCK: Logik-Test (Ternärer Operator)
// ORDNER: release/logic_ternary.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_logic_ternary'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setCheck("Boolean")
        .appendField("❓ Test / Bedingung:");
    this.appendValueInput("THEN")
        .setCheck(null)
        .appendField("➔ Wenn WAHR:");
    this.appendValueInput("ELSE")
        .setCheck(null)
        .appendField("➔ Wenn FALSCH:");
    this.setOutput(true, null); // true bedeutet: Dieser Block gibt einen Wert nach links zurück
    this.setColour(210); // Helles Blau, passend zur Standard-Logik-Kategorie
    this.setTooltip("Prüft die Bedingung. Ist sie wahr, wird der erste Wert genutzt, ansonsten der zweite.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_logic_ternary'] = function(block) {
  // 1. Die angedockten Blöcke auslesen. Wenn nichts angedockt ist, setzen wir sichere Standardwerte.
  // ORDER_CONDITIONAL sorgt dafür, dass die Klammern in C++ richtig gesetzt werden.
  var value_condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.JavaScript.valueToCode(block, 'THEN', Blockly.JavaScript.ORDER_CONDITIONAL) || '0';
  var value_else = Blockly.JavaScript.valueToCode(block, 'ELSE', Blockly.JavaScript.ORDER_CONDITIONAL) || '0';

  // 2. Den C++ Code im Ternary-Format zusammenbauen: (Bedingung) ? (Wahr-Wert) : (Falsch-Wert)
  var code = '(' + value_condition + ') ? (' + value_then + ') : (' + value_else + ')';
  
  // 3. Code zurückgeben. ORDER_CONDITIONAL teilt dem Generator mit, wie wichtig dieser Block in der Rangfolge ist.
  return [code, Blockly.JavaScript.ORDER_CONDITIONAL];
};