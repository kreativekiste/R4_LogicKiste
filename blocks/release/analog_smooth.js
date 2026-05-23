// ====================================================================
// BLOCK: Analog Glätter (Mittelwert-Messung)
// ====================================================================

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
        this.setColour(230);
        this.setTooltip("Liest einen analogen Wert mehrfach aus und berechnet den Durchschnitt.");
    }
};

ArduinoGenerator.forBlock['release_analog_smooth'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const samples = block.getFieldValue('SAMPLES');
    const wait = block.getFieldValue('WAIT');

    // FIX: Hilfsfunktion über globals_ registrieren (Set = nur 1x)
    // FEINSCHLIFF: Parameter als const int deklariert
    ArduinoGenerator.globals_.add(`
int getSmoothAnalog(const int pin, const int samples, const int waitTime) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(pin);
    if (waitTime > 0) delay(waitTime);
  }
  return (int)(sum / samples);
}`);

    return [`getSmoothAnalog(${pin}, ${samples}, ${wait})`, 0];
};