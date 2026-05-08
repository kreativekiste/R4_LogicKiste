// ==========================================
// BAUTEILE: ULTRASCHALL SENSOR (HC-SR04)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "read_ultrasonic",
        "message0": "Ultraschall Distanz (cm) | Trig %1 Echo %2",
        "args0": [
            { "type": "field_input", "name": "TRIG", "text": "7" },
            { "type": "field_input", "name": "ECHO", "text": "8" }
        ],
        "output": "Number",
        "colour": 45,
        "tooltip": "Misst die Entfernung mit dem HC-SR04 in Zentimetern."
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['read_ultrasonic'] = function(block) {
    const trig = block.getFieldValue('TRIG');
    const echo = block.getFieldValue('ECHO');

    // 1. Saubere Pin-Registrierung im Core
    // Trig muss OUTPUT sein, Echo muss INPUT sein
    ArduinoGenerator.usedPinsOutput.add(trig);
    ArduinoGenerator.usedPinsInput.add(echo);
    ArduinoGenerator.pinModes.set(echo, 'INPUT');

    // 2. Die Hilfsfunktion einmalig in den Globals hinterlegen
    // Nutzt uint8_t für effiziente Pin-Übergabe auf AVR/R4
    const helperFunction = `
float getUltrasonicDistance(uint8_t trigPin, uint8_t echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // 23500 us Timeout entspricht ca. 400cm (maximale stabile Reichweite)
  long duration = pulseIn(echoPin, HIGH, 23500); 
  if (duration == 0) return 0; 
  return duration * 0.01715; 
}`;

    ArduinoGenerator.globals_.add(helperFunction);
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['read_ultrasonic'] = function(block) {
    const trig = block.getFieldValue('TRIG');
    const echo = block.getFieldValue('ECHO');

    // Aufruf mit den vom Core generierten Variablen (pinX)
    const code = `getUltrasonicDistance(pin${trig}, pin${echo})`;
    
    return [code, 0];
};