Blockly.defineBlocksWithJsonArray([
    // 1. DER HAUPT-KONTROLL-BLOCK FÜR NEMA STEPPER (Blockierend + Rampe integriert)
    {
        "type": "stepper_nema_control",
        "message0": " NEMA Stepper %1 (blockierend)",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MOTOR_ID",
                "options": [["1", "1"], ["2", "2"], ["3", "3"]]
            }
        ],
        "message1": "Schritt-Pin: %1 | Richtungs-Pin: %2",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "STEP_PIN",
                "options": [["Pin 4", "4"], ["Pin 5", "5"], ["Pin 6", "6"]]
            },
            {
                "type": "field_dropdown",
                "name": "DIR_PIN",
                "options": [["0 (Nicht verwendet)", "0"], ["Pin 7", "7"], ["Pin 8", "8"], ["Pin 9", "9"]]
            }
        ],
        "message2": "Schritte (±): %1",
        "args2": [
            {"type": "input_value", "name": "STEPS", "check": "Number"}
        ],
        "message3": "Puls-Pause (µs): %1",
        "args3": [
            {"type": "input_value", "name": "DELAY", "check": "Number"}
        ],
        "message4": "Anlauf-Rampe: %1",
        "args4": [
            {
                "type": "field_dropdown",
                "name": "RAMP_TYPE",
                "options": [
                    ["0 (Aus)", "0"],
                    ["1 (Schnell)", "1"],
                    ["2 (Medium)", "2"],
                    ["3 (Langsam)", "3"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Blockiert das Programm. Positive Schritte = Vorwärts, Negative Schritte = Rückwärts. Exponentielle Anlauf-Rampe."
    },

    // 2. DER KOOPERATIVE BLOCK (Non-Blocking + Rampe integriert)
    {
        "type": "stepper_nema_coop",
        "message0": " NEMA Stepper (Kooperativ) %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MOTOR_ID",
                "options": [["1", "1"], ["2", "2"], ["3", "3"]]
            }
        ],
        "message1": "Schritt-Pin: %1 | Richtungs-Pin: %2",
        "args1": [
            {
                "type": "field_dropdown",
                "name": "STEP_PIN",
                "options": [["Pin 4", "4"], ["Pin 5", "5"], ["Pin 6", "6"]]
            },
            {
                "type": "field_dropdown",
                "name": "DIR_PIN",
                "options": [["0 (Nicht verwendet)", "0"], ["Pin 7", "7"], ["Pin 8", "8"], ["Pin 9", "9"]]
            }
        ],
        "message2": "Schritte Gesamt (±): %1",
        "args2": [
            {"type": "input_value", "name": "STEPS", "check": "Number"}
        ],
        "message3": "Teilschritte pro Loop: %1",
        "args3": [
            {"type": "input_value", "name": "CHUNK", "check": "Number"}
        ],
        "message4": "Puls-Pause (µs): %1",
        "args4": [
            {"type": "input_value", "name": "DELAY", "check": "Number"}
        ],
        "message5": "Anlauf-Rampe: %1",
        "args5": [
            {
                "type": "field_dropdown",
                "name": "RAMP_TYPE",
                "options": [
                    ["0 (Aus)", "0"],
                    ["1 (Schnell)", "1"],
                    ["2 (Medium)", "2"],
                    ["3 (Langsam)", "3"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Fährt in kleinen Häppchen non-blocking im Loop. Vorzeichen bestimmt Richtung. Unterstützt ebenfalls exponentielle Rampen."
    },

    // 3. POSITION AUSLESEN (Nur Motor 1)
    {
        "type": "stepper_nema_position",
        "message0": "📍 Position NEMA Stepper 1",
        "output": "Number",
        "colour": 180,
        "tooltip": "Gibt die absolute, mitgezählte Position von NEMA-Motor 1 zurück."
    },

    // 4. POSITION RESETTEN (Nur Motor 1)
    {
        "type": "stepper_nema_reset",
        "message0": "📍 Position NEMA 1 auf %1 setzen",
        "args0": [
            {"type": "input_value", "name": "POS", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Setzt den internen Schrittzähler für NEMA Motor 1 auf einen neuen Wert."
    }
]);

// --- HARDWARE SCANNER ---
const scanNemaHardware = function(block) {
    const stepPin = block.getFieldValue('STEP_PIN');
    const dirPin = block.getFieldValue('DIR_PIN');
    const motorId = block.getFieldValue('MOTOR_ID');

    ArduinoGenerator.usedPinsOutput.add(stepPin);
    if (dirPin !== "0") {
        ArduinoGenerator.usedPinsOutput.add(dirPin);
    }
    if (motorId === "1") {
        ArduinoGenerator.customVariables.set(`nema_steps_1`, 'long');
    }
};

ArduinoGenerator.hardwareScanners['stepper_nema_control'] = scanNemaHardware;
ArduinoGenerator.hardwareScanners['stepper_nema_coop'] = scanNemaHardware;


// --- HELPER FUNKTION FÜR C++ GENERIERUNG DER QUADRATISCHEN RAMPE ---
function generateRampCPlusPlus(rampType, bId) {
    let rampCode = `      long current_delay_${bId} = base_delay_${bId};\n`;
    rampCode += `      long ramp_steps_${bId} = 0;\n`;
    rampCode += `      long max_offset_${bId} = 0;\n`;
    
    // Konfiguration der Rampen-Profile
    if (rampType === "1") { rampCode += `      ramp_steps_${bId} = 100; max_offset_${bId} = 1000;\n`; }
    else if (rampType === "2") { rampCode += `      ramp_steps_${bId} = 300; max_offset_${bId} = 2000;\n`; }
    else if (rampType === "3") { rampCode += `      ramp_steps_${bId} = 700; max_offset_${bId} = 4000;\n`; }

    // Exponentielle (quadratische) Berechnung für die Start-Rampe
    rampCode += `      if (ramp_steps_${bId} > 0 && total_steps_${bId} > ramp_steps_${bId}) {\n`;
    rampCode += `        if (_i < ramp_steps_${bId}) {\n`;
    rampCode += `          long rem_${bId} = ramp_steps_${bId} - _i;\n`;
    rampCode += `          current_delay_${bId} += (max_offset_${bId} * rem_${bId} * rem_${bId}) / (ramp_steps_${bId} * ramp_steps_${bId});\n`;
    rampCode += `        }\n`;
    rampCode += `      }\n`;
    
    return rampCode;
}


// --- C++ GENERATOR: 1. NEMA BLOCKIEREND ---
ArduinoGenerator.forBlock['stepper_nema_control'] = function(block) {
    const motorId = block.getFieldValue('MOTOR_ID');
    const stepPin = block.getFieldValue('STEP_PIN');
    const dirPin = block.getFieldValue('DIR_PIN');
    const rampType = block.getFieldValue('RAMP_TYPE');

    const inputSteps = ArduinoGenerator.valueToCode(block, 'STEPS', 0) || '0';
    const delayUs = ArduinoGenerator.valueToCode(block, 'DELAY', 0) || '500';
    const bId = block.id.replace(/[^a-zA-Z0-9]/g, '_');

    let code = `  // --- NEMA Stepper ${motorId} (blockierend mit Vorzeichen & dyn. Rampe) ---\n`;
    code += `  {\n`; // SCOPE ÖFFNEN FÜR SWITCH/CASE KOMPATIBILITÄT
    code += `    long raw_steps_${bId} = ${inputSteps};\n`;
    code += `    long total_steps_${bId} = abs(raw_steps_${bId});\n`;
    code += `    long base_delay_${bId} = ${delayUs};\n`;

    if (dirPin !== "0") {
        code += `    if (raw_steps_${bId} < 0) digitalWrite(pin${dirPin}, HIGH); else digitalWrite(pin${dirPin}, LOW);\n`;
    }

    code += `    for (long _i = 0; _i < total_steps_${bId}; _i++) {\n`;
    code += generateRampCPlusPlus(rampType, bId);
    code += `      digitalWrite(pin${stepPin}, HIGH);\n`;
    code += `      delayMicroseconds(current_delay_${bId});\n`;
    code += `      digitalWrite(pin${stepPin}, LOW);\n`;
    code += `      delayMicroseconds(current_delay_${bId});\n`;

    if (motorId === "1") {
        code += `      if (raw_steps_${bId} >= 0) nema_steps_1++; else nema_steps_1--;\n`;
    }
    code += `    }\n`;
    code += `  }\n`; // SCOPE SCHLIESSEN

    return code;
};


// --- C++ GENERATOR: 2. NEMA KOOPERATIV ---
ArduinoGenerator.forBlock['stepper_nema_coop'] = function(block) {
    const motorId = block.getFieldValue('MOTOR_ID');
    const stepPin = block.getFieldValue('STEP_PIN');
    const dirPin = block.getFieldValue('DIR_PIN');
    const rampType = block.getFieldValue('RAMP_TYPE');

    const inputSteps = ArduinoGenerator.valueToCode(block, 'STEPS', 0) || '0';
    const chunk = ArduinoGenerator.valueToCode(block, 'CHUNK', 0) || '1';
    const delayUs = ArduinoGenerator.valueToCode(block, 'DELAY', 0) || '500';
    const bId = block.id.replace(/[^a-zA-Z0-9]/g, '_');

    let code = `  // --- NEMA Stepper ${motorId} (Kooperativ mit Vorzeichen & dyn. Rampe) ---\n`;
    code += `  {\n`; // SCOPE ÖFFNEN FÜR SWITCH/CASE KOMPATIBILITÄT
    code += `    static bool is_moving_${bId} = false;\n`;
    code += `    static long progress_${bId} = 0;\n`;
    code += `    static long static_raw_${bId} = 0;\n`;
    code += `    long req_steps_${bId} = ${inputSteps};\n`;
    code += `    long chunk_${bId} = ${chunk};\n`;
    code += `    long base_delay_${bId} = ${delayUs};\n\n`;

    code += `    if (!is_moving_${bId} && req_steps_${bId} != 0) {\n`;
    code += `      is_moving_${bId} = true;\n`;
    code += `      progress_${bId} = 0;\n`;
    code += `      static_raw_${bId} = req_steps_${bId};\n`;
    code += `    }\n\n`;

    code += `    if (is_moving_${bId}) {\n`;
    code += `      long total_steps_${bId} = abs(static_raw_${bId});\n`;
    code += `      long steps_now_${bId} = min(chunk_${bId}, total_steps_${bId} - progress_${bId});\n`;
    
    if (dirPin !== "0") {
        code += `      if (static_raw_${bId} < 0) digitalWrite(pin${dirPin}, HIGH); else digitalWrite(pin${dirPin}, LOW);\n`;
    }

    code += `      for (long _k = 0; _k < steps_now_${bId}; _k++) {\n`;
    code += `        long _i = progress_${bId};\n`; 
    code += generateRampCPlusPlus(rampType, bId);
    code += `        digitalWrite(pin${stepPin}, HIGH);\n`;
    code += `        delayMicroseconds(current_delay_${bId});\n`;
    code += `        digitalWrite(pin${stepPin}, LOW);\n`;
    code += `        delayMicroseconds(current_delay_${bId});\n`;

    if (motorId === "1") {
        code += `        if (static_raw_${bId} >= 0) nema_steps_1++; else nema_steps_1--;\n`;
    }
    code += `        progress_${bId}++;\n`;
    code += `      }\n`;

    code += `      if (progress_${bId} >= total_steps_${bId}) {\n`;
    code += `        is_moving_${bId} = false;\n`;
    code += `      }\n`;
    code += `    }\n`;
    code += `  }\n`; // SCOPE SCHLIESSEN

    return code;
};


// --- C++ GENERATOR: POSITION AUSLESEN & RESET ---
ArduinoGenerator.forBlock['stepper_nema_position'] = function(block) {
    return [`nema_steps_1`, 0];
};

ArduinoGenerator.forBlock['stepper_nema_reset'] = function(block) {
    const pos = ArduinoGenerator.valueToCode(block, 'POS', 0) || '0';
    return `  nema_steps_1 = ${pos};\n`;
};