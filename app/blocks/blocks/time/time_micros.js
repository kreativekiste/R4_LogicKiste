// ====================================================================
// BLOCK: Warte Mikrosekunden (delayMicroseconds)
// ====================================================================

// --- 1. BLOCK DEFINITION ---
Blockly.Blocks['delay_micros'] = {
  init: function() {
    this.appendValueInput("TIME")
        .setCheck("Number")
        .appendField("⏳ Warte");
    this.appendDummyInput()
        .appendField("µs");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330); 
    this.setTooltip("Pausiert das Programm für die angegebene Anzahl an Mikrosekunden.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOR ---
ArduinoGenerator.forBlock['delay_micros'] = function(block) {
  // Holt den Wert aus dem angedockten Block (Zahl oder Variable)
  const time = ArduinoGenerator.valueToCode(block, 'TIME', 0) || '0';
  
  return `  delayMicroseconds(${time});\n`;
};