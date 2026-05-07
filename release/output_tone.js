// ====================================================================
// BLOCK: Ton erzeugen (Buzzer / Piezo)
// ORDNER: release/output_tone.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_output_tone'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🔊 Spiele Ton an Pin")
        .appendField(new Blockly.FieldDropdown([
            ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], 
            ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], 
            ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
            ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
        ]), "PIN");
    this.appendValueInput("FREQ")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Frequenz (Hz):");
    this.appendValueInput("DURATION")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Dauer (ms):");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250); // Rot/Pink-Ton für Ausgänge
    this.setTooltip("Lässt einen Buzzer am gewählten Pin mit der angegebenen Frequenz (Tonhöhe) und Dauer piepsen.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_output_tone'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  
  // Werte aus den angedockten Blöcken holen. 
  // Falls nichts angedockt ist, geben wir Standardwerte vor (1000 Hz, 500 ms).
  var value_freq = Blockly.JavaScript.valueToCode(block, 'FREQ', Blockly.JavaScript.ORDER_ATOMIC) || '1000';
  var value_duration = Blockly.JavaScript.valueToCode(block, 'DURATION', Blockly.JavaScript.ORDER_ATOMIC) || '500';

  // Der klassische C++ Befehl: tone(pin, frequency, duration);
  var code = 'tone(' + dropdown_pin + ', ' + value_freq + ', ' + value_duration + ');\n';
  
  return code;
};