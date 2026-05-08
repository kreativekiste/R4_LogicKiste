// ====================================================================
// BLOCK: Analog Glätter (Mittelwert-Messung)
// ORDNER: release/analog_smooth.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

Blockly.Blocks['release_analog_smooth'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("📉 Glätter: Lese Pin")
        .appendField(new Blockly.FieldDropdown([
            ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], 
            ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
        ]), "PIN");
    this.appendDummyInput()
        .appendField("Messungen:")
        .appendField(new Blockly.FieldNumber(10, 1, 100), "SAMPLES")
        .appendField("Pause (ms):")
        .appendField(new Blockly.FieldNumber(2, 0, 100), "WAIT");
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setColour(230); // Blau/Türkis für Sensoren/Mathe
    this.setTooltip("Liest einen analogen Wert mehrfach aus und berechnet den Durchschnitt, um das Signal zu glätten.");
    this.setHelpUrl("");
  }
};

// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_analog_smooth'] = function(block) {
  var dropdown_pin = block.getFieldValue('PIN');
  var number_samples = block.getFieldValue('SAMPLES');
  var number_wait = block.getFieldValue('WAIT');

  // Wir lagern die Logik in eine eigene Funktion aus, um den Loop sauber zu halten.
  // Das verhindert auch Probleme, wenn der Nutzer den Block mehrfach verwendet.
  var funcName = 'getSmoothAnalog';
  var funcCode = 
    'int ' + funcName + '(int pin, int samples, int waitTime) {\n' +
    '  long sum = 0;\n' +
    '  for (int i = 0; i < samples; i++) {\n' +
    '    sum += analogRead(pin);\n' +
    '    if (waitTime > 0) delay(waitTime);\n' +
    '  }\n' +
    '  return (int)(sum / samples);\n' +
    '}\n';

  // Funktion einmalig global registrieren
  Blockly.JavaScript.addGlobal('func_getSmoothAnalog', funcCode);

  // Der Aufruf im Code: getSmoothAnalog(A0, 10, 2)
  var code = funcName + '(' + dropdown_pin + ', ' + number_samples + ', ' + number_wait + ')';
  
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};