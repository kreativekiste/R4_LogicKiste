// ====================================================================
// BLOCK: Systemzeit (Mikrosekunden / micros)
// ORDNER: release/time_micros.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_time_micros'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("⏱️ Systemzeit (µs)");
    this.setOutput(true, "Number"); // true bedeutet: Gibt eine Zahl nach links zurück
    this.setColour(330); // Orange/Rot-Ton für Zeit-Blöcke
    this.setTooltip("Gibt die vergangenen Mikrosekunden seit dem Start des Arduinos zurück. Überlauf nach ca. 70 Minuten!");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_time_micros'] = function(block) {
  // Der C++ Befehl für die Mikrosekunden.
  var code = 'micros()';
  
  // ORDER_ATOMIC bedeutet, dass dieser Aufruf für sich alleine steht 
  // und in Rechnungen nicht in zusätzliche Klammern gepackt werden muss.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};