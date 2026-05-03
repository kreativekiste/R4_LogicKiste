// ==========================================
// BAUTEILE: ULTRASCHALL SENSOR (HC-SR04)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "read_ultrasonic",
        "message0": "Ultraschall Distanz (cm) | Trig %1 Echo %2",
        "args0": [
            {"type": "field_input", "name": "TRIG", "text": "7"},
            {"type": "field_input", "name": "ECHO", "text": "8"}
        ],
        "output": "Number",
        "colour": 45,
        "tooltip": "Misst die Entfernung mit dem HC-SR04 in Zentimetern. Der Wert hat Nachkommastellen (Float)."
    }
]);

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['read_ultrasonic'] = function(block) {
    const trig = block.getFieldValue('TRIG');
    const echo = block.getFieldValue('ECHO');

    // Pins automatisch im Setup deklarieren
    ArduinoGenerator.usedPinsOutput.add(trig);
    ArduinoGenerator.usedPinsInput.add(echo);

    // Wir erstellen eine kleine, schnelle C++ Hilfsfunktion. 
    // Diese wird nur ein einziges Mal ganz oben in den Code geschrieben, 
    // egal wie oft du den Block benutzt (spart Speicher!).
    if (!ArduinoGenerator.globals_) ArduinoGenerator.globals_ = new Set();
    
    const helperFunction = 
`// --- HC-SR04 Ultraschall Hilfsfunktion ---
float getUltrasonicDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // 30000 Mikrosekunden Timeout (entspricht ca. 5 Metern) verhindert, dass der Arduino hängen bleibt
  long duration = pulseIn(echoPin, HIGH, 30000); 
  return duration * 0.01723; // Umrechnung der Schallgeschwindigkeit in cm
}`;
    
    ArduinoGenerator.globals_.add(helperFunction);

    // Der saubere Aufruf, der in deiner Loop landet:
    const code = `getUltrasonicDistance(pin${trig}, pin${echo})`;
    
    return [code, ArduinoGenerator.PRECEDENCE];
};