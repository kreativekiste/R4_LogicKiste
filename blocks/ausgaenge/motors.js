// ==========================================
// BAUTEILE: MOTOREN (Servo & ULN2003 Stepper)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- SERVO MOTOR ---
    {
        "type": "out_servo",
        "message0": "Servo an PIN %1 auf Winkel %2 drehen",
        "args0": [
            {"type": "field_number", "name": "PIN", "value": 9, "min": 0},
            {"type": "input_value", "name": "ANGLE"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    },
    // --- STEPPER (ULN2003) ---
    {
        "type": "out_stepper",
        "message0": "Stepper (ULN2003) IN1:%1 IN2:%2 IN3:%3 IN4:%4 %5 %6 Schritte bewegen %7 (Tempo: %8)",
        "args0": [
            {"type": "field_number", "name": "IN1", "value": 8},
            {"type": "field_number", "name": "IN2", "value": 10}, // ULN2003 Reihenfolge ist oft 1-3-2-4 für die Library
            {"type": "field_number", "name": "IN3", "value": 9},
            {"type": "field_number", "name": "IN4", "value": 11},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "STEPS"},
            {"type": "input_dummy"},
            {"type": "field_number", "name": "SPEED", "value": 15, "min": 1}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160
    }
]);

ArduinoGenerator.forBlock['out_servo'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const angle = ArduinoGenerator.valueToCode(block, 'ANGLE', 0) || '90';
    
    // Melde den Servo für den index.html Scanner an
    if (!ArduinoGenerator.usedServos) ArduinoGenerator.usedServos = new Set();
    ArduinoGenerator.usedServos.add(pin);
    
    return `  servo_${pin}.write(${angle});\n`;
};

ArduinoGenerator.forBlock['out_stepper'] = function(block) {
    const in1 = block.getFieldValue('IN1');
    const in2 = block.getFieldValue('IN2');
    const in3 = block.getFieldValue('IN3');
    const in4 = block.getFieldValue('IN4');
    const speed = block.getFieldValue('SPEED');
    const steps = ArduinoGenerator.valueToCode(block, 'STEPS', 0) || '0';
    
    // Alle 4 Pins im Namen — verhindert Kollision bei zwei Steppern mit gleichen IN1/IN2
    const stepperName = `stepper_${in1}_${in2}_${in3}_${in4}`;
    
    // Melde den Stepper für die index.html an (2048 = Standard Schritte pro Umdrehung für 28BYJ-48)
    if (!ArduinoGenerator.usedSteppers) ArduinoGenerator.usedSteppers = new Map();
    ArduinoGenerator.usedSteppers.set(stepperName, {in1, in2, in3, in4, speed});
    
    return `  ${stepperName}.step(${steps});\n`;
};