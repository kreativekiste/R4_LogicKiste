// ==========================================
// BAUTEIL: ENTPRELLTER COUNTER (Taster)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "input_counter",
    "message0": "Taster an PIN %1 zählen %2 Speichern in: %3 %4 Entprell-Zeit: %5 ms",
    "args0": [
        {"type": "field_number", "name": "PIN", "value": 2, "min": 0},
        {"type": "input_dummy"},
        {"type": "field_input", "name": "VAR_NAME", "text": "meinZaehler"},
        {"type": "input_dummy"},
        {"type": "field_number", "name": "DEBOUNCE", "value": 50, "min": 1}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "Zählt jeden Tastendruck genau einmal (fallende Flanke, HIGH→LOW). Taster muss gegen GND schalten — passt zum internen INPUT_PULLUP."
}]);

ArduinoGenerator.forBlock['input_counter'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const varName = block.getFieldValue('VAR_NAME');
    const debounce = block.getFieldValue('DEBOUNCE');

    // 1. Hardware Pin beim Hauptprogramm anmelden — immer mit INPUT_PULLUP (Taster gegen GND)
    ArduinoGenerator.usedPinsInput.add(pin);
    if (!ArduinoGenerator.pinModes) ArduinoGenerator.pinModes = new Map();
    ArduinoGenerator.pinModes.set(pin, 'INPUT_PULLUP');

    // 2. Die Variable global als 'int' anmelden, falls du sie noch nicht woanders deklariert hast
    if (!ArduinoGenerator.customVariables) {
        ArduinoGenerator.customVariables = new Map();
    }
    if (!ArduinoGenerator.customVariables.has(varName)) {
        ArduinoGenerator.customVariables.set(varName, "int");
    }

    // 3. Eindeutige ID für diesen spezifischen Block generieren
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');

    // 4. Der C++ Code mit 'static' Variablen (Merken sich den Zustand im Loop)
    // Mit INPUT_PULLUP ist Drücken = LOW (fallende Flanke HIGH→LOW)
    return `
  // --- Entprellter Zähler für PIN ${pin} ---
  static bool lastState_${safeId} = HIGH;
  static unsigned long lastDebounce_${safeId} = 0;
  bool currentState_${safeId} = digitalRead(pin${pin});

  if (currentState_${safeId} == LOW && lastState_${safeId} == HIGH && (millis() - lastDebounce_${safeId} > ${debounce})) {
    ${varName}++;
    lastDebounce_${safeId} = millis();
  }
  lastState_${safeId} = currentState_${safeId};
`;
};