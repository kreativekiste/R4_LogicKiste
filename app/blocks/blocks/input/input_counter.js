// ==========================================
// BAUTEIL: ENTPRELLTER COUNTER (Taster)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "input_counter",
    "message0": "Zähle Tastendruck an PIN %1",
    "args0": [
        {"type": "field_input", "name": "PIN", "text": "2"}
    ],
    "message1": "Speichern in: %1",
    "args1": [
        {
            "type": "field_variable",
            "name": "VAR_NAME",
            "variable": "meinZaehler"
        }
    ],
    "message2": "Entprell-Zeit: %1 ms",
    "args2": [
        {
            "type": "input_value",
            "name": "DEBOUNCE",
            "check": "Number"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "Zählt jeden Tastendruck (fallende Flanke). Nutzt internen PULLUP. Die Variable wird automatisch als Integer erstellt."
}]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['input_counter'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const varName = block.getField('VAR_NAME').getText();
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    
    // 1. Saubere Pin-Registrierung über den Core
    ArduinoGenerator.usedPinsInput.add(rawPin);
    ArduinoGenerator.pinModes.set(rawPin, 'INPUT_PULLUP');

    // 2. AUTOMATISIERUNG: Variable global als int deklarieren lassen (dedupliziert sich selbst)
    ArduinoGenerator.customVariables.set(varName, 'int');

    // 3. Globale Hilfsvariablen für das Entprellen dieses spezifischen Blocks
    ArduinoGenerator.globals_.add(`bool lastState_${safeId} = HIGH;`);
    ArduinoGenerator.globals_.add(`unsigned long lastDebounce_${safeId} = 0;`);
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['input_counter'] = function(block) {
    const rawPin = block.getFieldValue('PIN');
    const varName = block.getField('VAR_NAME').getText();
    const debounce = ArduinoGenerator.valueToCode(block, 'DEBOUNCE', 0) || '50';
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');

    // C++ Logik: Flankenerkennung mit Zeitprüfung
    // WICHTIG: Nutzt pinX aus dem Generator, nicht rawPin
    let code = `  // --- Entprellter Zähler (${varName}) ---\n`;
    code += `  bool currentState_${safeId} = digitalRead(pin${rawPin});\n`;
    code += `  if (currentState_${safeId} == LOW && lastState_${safeId} == HIGH && (millis() - lastDebounce_${safeId} > ${debounce})) {\n`;
    code += `    ${varName}++;\n`;
    code += `    lastDebounce_${safeId} = millis();\n`;
    code += `  }\n`;
    code += `  lastState_${safeId} = currentState_${safeId};\n`;
    
    return code;
};