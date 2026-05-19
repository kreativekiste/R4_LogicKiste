
Blockly.defineBlocksWithJsonArray([
    // 1. SERVO MOTOR
    {
        "type": "out_servo",
        "message0": "Servo an PIN %1 auf Winkel %2 drehen",
        "args0": [
            { "type": "field_input",  "name": "PIN",   "text": "9" },
            { "type": "input_value",  "name": "ANGLE", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Dreht einen Servo auf einen bestimmten Winkel (0–180°). Optimiert für Arduino R4 (500–2500µs Pulsbereich)."
    },

    // 2. SERVO RAMPE
    {
        "type": "out_servo_ramp",
        "message0": "Servo Rampe | PIN %1 | Richtung: %2",
        "args0": [
            { "type": "field_input",    "name": "PIN",       "text": "9" },
            {
                "type": "field_dropdown", "name": "DIRECTION",
                "options": [
                    ["⬆️  Hoch",          "UP"],
                    ["⬇️  Runter",         "DOWN"],
                    ["🔁 Hoch & Runter",   "BOTH"]
                ]
            }
        ],
        "message1": "Von (°): %1",
        "args1": [
            { "type": "input_value", "name": "ANGLE_FROM", "check": "Number" }
        ],
        "message2": "Bis (°): %1",
        "args2": [
            { "type": "input_value", "name": "ANGLE_TO", "check": "Number" }
        ],
        "message3": "Schrittweite (°): %1",
        "args3": [
            { "type": "input_value", "name": "STEP", "check": "Number" }
        ],
        "message4": "Pause pro Schritt (ms): %1",
        "args4": [
            { "type": "input_value", "name": "DELAY", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Fährt den Servo sanft in einer Rampe. Von/Bis = Winkelbereich (z.B. 30–150°). Schrittweite = Grad pro Schritt. Pause = ms zwischen Schritten."
    }
,

    // 3. SERVO VERBINDEN
    {
        "type": "out_servo_attach",
        "message0": "Servo an PIN %1 verbinden",
        "args0": [
            { "type": "field_input", "name": "PIN", "text": "9" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Verbindet den Servo wieder mit dem Pin (nach einem detach). Nutzt den R4-optimierten Pulsbereich 500–2500µs."
    },

    // 4. SERVO TRENNEN
    {
        "type": "out_servo_detach",
        "message0": "Servo an PIN %1 trennen",
        "args0": [
            { "type": "field_input", "name": "PIN", "text": "9" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Trennt den Servo vom Pin — der Pin kann danach wieder normal genutzt werden und der Servo hält seine Position ohne Strom zu ziehen."
    }
]);

// DEZENTRALE SCANNERS
function _initServo(pin) {
    const guardKey = `// _servo_init_pin${pin}`;
    if (ArduinoGenerator.globals_.has(guardKey)) return;
    ArduinoGenerator.globals_.add(guardKey);

    ArduinoGenerator.includes_.add('#include <Servo.h>');
    ArduinoGenerator.globals_.add(`const int pin${pin} = ${pin};`);
    ArduinoGenerator.globals_.add(`Servo servo_pin${pin};`);

    // R4-Fix: attach mit 500–2500µs Pulsbereich für vollen 0–180° Bereich
    ArduinoGenerator.autoSetup_.push(`  servo_pin${pin}.attach(pin${pin}, 500, 2500);\n`);
}

ArduinoGenerator.hardwareScanners['out_servo_attach'] = function(block) {
    _initServo(block.getFieldValue('PIN'));
};

ArduinoGenerator.hardwareScanners['out_servo_detach'] = function(block) {
    _initServo(block.getFieldValue('PIN'));
};

ArduinoGenerator.hardwareScanners['out_servo'] = function(block) {
    _initServo(block.getFieldValue('PIN'));
};

ArduinoGenerator.hardwareScanners['out_servo_ramp'] = function(block) {
    _initServo(block.getFieldValue('PIN'));
};


// GENERATOR LOGIK

ArduinoGenerator.forBlock['out_servo'] = function(block) {
    const pin   = block.getFieldValue('PIN');
    const angle = ArduinoGenerator.valueToCode(block, 'ANGLE', 0) || '90';
    return `  servo_pin${pin}.write(${angle});\n`;
};

ArduinoGenerator.forBlock['out_servo_attach'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return `  servo_pin${pin}.attach(pin${pin}, 500, 2500);
`;
};

ArduinoGenerator.forBlock['out_servo_detach'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return `  servo_pin${pin}.detach();
`;
};

ArduinoGenerator.forBlock['out_servo_ramp'] = function(block) {
    const pin   = block.getFieldValue('PIN');
    const dir   = block.getFieldValue('DIRECTION');
    const from  = ArduinoGenerator.valueToCode(block, 'ANGLE_FROM', 0) || '0';
    const to    = ArduinoGenerator.valueToCode(block, 'ANGLE_TO',   0) || '180';
    const step  = ArduinoGenerator.valueToCode(block, 'STEP',       0) || '1';
    const dly   = ArduinoGenerator.valueToCode(block, 'DELAY',      0) || '15';
    const servo = `servo_pin${pin}`;

    let code = `  // --- Servo Rampe (PIN ${pin}) ---\n`;

    if (dir === 'UP' || dir === 'BOTH') {
        code += `  for (int _a = ${from}; _a <= ${to}; _a += ${step}) {\n`;
        code += `    ${servo}.write(_a);\n`;
        code += `    delay(${dly});\n`;
        code += `  }\n`;
    }

    if (dir === 'DOWN' || dir === 'BOTH') {
        code += `  for (int _a = ${to}; _a >= ${from}; _a -= ${step}) {\n`;
        code += `    ${servo}.write(_a);\n`;
        code += `    delay(${dly});\n`;
        code += `  }\n`;
    }

    return code;
};
