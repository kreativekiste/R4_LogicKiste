
Blockly.defineBlocksWithJsonArray([
    {
        "type": "read_ultrasonic",
        "message0": "Ultraschall Distanz (cm) | Trig %1 Echo %2 | Intervall (ms) %3",
        "args0": [
            { "type": "field_input",  "name": "TRIG",     "text": "7"  },
            { "type": "field_input",  "name": "ECHO",     "text": "8"  },
            { "type": "field_number", "name": "INTERVAL", "value": 60, "min": 10, "max": 3000 }
        ],
        "output": "Number",
        "colour": 45,
        "tooltip": "Misst die Entfernung mit dem HC-SR04 in Zentimetern. Das Intervall (Standard: 60ms) verhindert Echo-Interferenz ohne den Loop zu blockieren – der letzte Messwert wird zurückgegeben bis das Intervall abgelaufen ist."
    }
]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['read_ultrasonic'] = function(block) {
    const trig     = block.getFieldValue('TRIG').trim();
    const echo     = block.getFieldValue('ECHO').trim();
    const interval = block.getFieldValue('INTERVAL') || 60;

    const id = `${trig}_${echo}`;

    ArduinoGenerator.usedPinsOutput.add(trig);
    ArduinoGenerator.usedPinsInput.add(echo);
    ArduinoGenerator.pinModes.set(echo, 'INPUT');

    const helperKey = `// _ultrasonic_helper_${id}`;
    if (!ArduinoGenerator.globals_.has(helperKey)) {
        ArduinoGenerator.globals_.add(helperKey);

        ArduinoGenerator.globals_.add(`
// --- Ultraschall Sensor (Trig: ${trig}, Echo: ${echo}) ---
unsigned long _us_lastRead_${id} = 0;
float         _us_lastDist_${id} = 0.0;

float getUltrasonicDistance_${id}(uint8_t trigPin, uint8_t echoPin, unsigned int interval) {
  if (millis() - _us_lastRead_${id} >= interval) {
    _us_lastRead_${id} = millis();
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    // 23500 us Timeout ≈ 400 cm (maximale stabile Reichweite)
    long duration = pulseIn(echoPin, HIGH, 23500);
    _us_lastDist_${id} = (duration == 0) ? 0.0 : duration * 0.01715;
  }
  return _us_lastDist_${id};
}`);
    }
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['read_ultrasonic'] = function(block) {
    const trig     = block.getFieldValue('TRIG');
    const echo     = block.getFieldValue('ECHO');
    const interval = block.getFieldValue('INTERVAL') || 60;
    const id       = `${trig}_${echo}`;

    return [`getUltrasonicDistance_${id}(pin${trig}, pin${echo}, ${interval})`, 0];
};
