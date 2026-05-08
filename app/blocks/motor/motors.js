// ==========================================
// BAUTEILE: MOTOREN (Servo)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SERVO MOTOR ---
    {
        "type": "out_servo",
        "message0": "Servo an PIN %1 auf Winkel %2 drehen",
        "args0": [
            { "type": "field_input", "name": "PIN", "text": "9" },
            { "type": "input_value", "name": "ANGLE", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Dreht einen Servo auf einen bestimmten Winkel (0-180 Grad)."
    }
]);

// --- DEZENTRALE SCANNERS ---

ArduinoGenerator.hardwareScanners['out_servo'] = function(block) {
    const pin = block.getFieldValue('PIN');
    
    // 1. Core Integration: Include und Pin-Deklaration
    ArduinoGenerator.includes_.add('#include <Servo.h>');
    ArduinoGenerator.usedPinsOutput.add(pin);
    
    // 2. Instanz global erstellen
    ArduinoGenerator.globals_.add(`Servo servo_pin${pin};`);
    
    // FIX Bug 2: attach() nur einmal ins Setup pushen (Array deduplizieren)
    const attachCode = `  servo_pin${pin}.attach(pin${pin});\n`;
    if (!ArduinoGenerator.autoSetup_.includes(attachCode)) {
        ArduinoGenerator.autoSetup_.push(attachCode);
    }
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['out_servo'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const angle = ArduinoGenerator.valueToCode(block, 'ANGLE', 0) || '90';
    
    return `  servo_pin${pin}.write(${angle});\n`;
};
