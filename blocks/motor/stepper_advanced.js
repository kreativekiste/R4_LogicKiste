// ==========================================
// BAUTEILE: SMART STEPPER MOTOR (Modular)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. DEFINIEREN (Hardware Setup) ---
    {
        "type": "stepper_setup", // Korrigiert: Muss stepper_setup heißen gem. app.js
        "message0": "⚙️ Stepper anlegen: %1",
        "args0": [
            {"type": "field_input", "name": "MOTOR_NAME", "text": "meinMotor"}
        ],
        "message1": "Pins IN1:%1 IN2:%2 IN3:%3 IN4:%4",
        "args1": [
            {"type": "field_input", "name": "IN1", "text": "8"},
            {"type": "field_input", "name": "IN2", "text": "10"},
            {"type": "field_input", "name": "IN3", "text": "9"},
            {"type": "field_input", "name": "IN4", "text": "11"}
        ],
        "message2": "Schritte/Umdr.: %1 | Tracken: %2",
        "args2": [
            {"type": "field_number", "name": "STEPS_REV", "value": 2048},
            {"type": "field_checkbox", "name": "TRACK_POS", "checked": true}
        ],
        "colour": 180,
        "tooltip": "Konfiguriert den Stepper. Die Pin-Reihenfolge ist für ULN2003 optimiert."
    }
]);

// --- 2. BEWEGEN (Loop Block) ---
Blockly.Blocks['stepper_move'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("🚀 Motor")
            .appendField(new Blockly.FieldDropdown(this.getMotorOptions.bind(this)), "MOTOR_NAME")
            .appendField("bewegen");
        this.appendValueInput("STEPS").setCheck("Number").appendField("Schritte:");
        this.appendValueInput("TEMPO").setCheck("Number").appendField("Tempo (RPM):");
        this.appendValueInput("DIR").setCheck("Number").appendField("Richtung (1 / -1):");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
    },
    getMotorOptions: function() {
        let options = [];
        if (this.workspace) {
            let blocks = this.workspace.getBlocksByType('stepper_setup');
            blocks.forEach(b => {
                let n = b.getFieldValue('MOTOR_NAME');
                if (n) {
                    // Anzeige original, intern gesichert mit Präfix
                    let safeName = "sm_" + n.replace(/[^a-zA-Z0-9_]/g, '');
                    if(safeName !== "sm_") options.push([n, safeName]);
                }
            });
        }
        return options.length > 0 ? options : [['-- Kein Motor --', 'NONE']];
    }
};

// --- 3. POSITION RESET ---
Blockly.Blocks['stepper_reset'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("📍 Position von")
            .appendField(new Blockly.FieldDropdown(Blockly.Blocks['stepper_move'].getMotorOptions.bind(this)), "MOTOR_NAME");
        this.appendValueInput("POS").setCheck("Number").appendField("auf:");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
    }
};

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['stepper_setup'] = function(block) {
    const rawName = block.getFieldValue('MOTOR_NAME');
    const safeName = "sm_" + rawName.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Wenn kein gültiger Name existiert, abbrechen
    if(safeName === "sm_") return;

    const in1 = block.getFieldValue('IN1');
    const in2 = block.getFieldValue('IN2');
    const in3 = block.getFieldValue('IN3');
    const in4 = block.getFieldValue('IN4');
    const stepsRev = block.getFieldValue('STEPS_REV');
    const trackPos = block.getFieldValue('TRACK_POS') === 'TRUE';

    // 1. Saubere Pin-Registrierung im Core
    ArduinoGenerator.usedPinsOutput.add(in1);
    ArduinoGenerator.usedPinsOutput.add(in2);
    ArduinoGenerator.usedPinsOutput.add(in3);
    ArduinoGenerator.usedPinsOutput.add(in4);

    // 2. Library & Objekt (Nutzt die pinX Variablen)
    ArduinoGenerator.includes_.add('#include <Stepper.h>');
    ArduinoGenerator.globals_.add(`Stepper ${safeName}(${stepsRev}, pin${in1}, pin${in3}, pin${in2}, pin${in4});`);
    
    if (trackPos) {
        // C++ Map Simulieren für Track-Prüfung in der Code-Generierung
        ArduinoGenerator.globals_.add(`long ${safeName}_pos = 0; // TRACKING_ACTIVE`);
    }
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['stepper_setup'] = function(block) { return ''; };

ArduinoGenerator.forBlock['stepper_move'] = function(block) {
    const safeName = block.getFieldValue('MOTOR_NAME');
    if (safeName === 'NONE' || !safeName) return '  // Motor fehlt\n';

    const steps = ArduinoGenerator.valueToCode(block, 'STEPS', 0) || '0';
    const tempo = ArduinoGenerator.valueToCode(block, 'TEMPO', 0) || '15';
    const dir = ArduinoGenerator.valueToCode(block, 'DIR', 0) || '1';

    let code = `  ${safeName}.setSpeed(${tempo});\n`;
    code += `  ${safeName}.step(${steps} * ${dir});\n`;

    // Prüfen, ob für diesen Motor Tracking-Variablen existieren (nutzt den Kommentar-Tag)
    if (ArduinoGenerator.globals_.has(`long ${safeName}_pos = 0; // TRACKING_ACTIVE`)) {
        code += `  ${safeName}_pos += (${steps} * ${dir});\n`;
    }
    return code;
};

ArduinoGenerator.forBlock['stepper_reset'] = function(block) {
    const safeName = block.getFieldValue('MOTOR_NAME');
    const pos = ArduinoGenerator.valueToCode(block, 'POS', 0) || '0';
    
    if (safeName !== 'NONE' && safeName && ArduinoGenerator.globals_.has(`long ${safeName}_pos = 0; // TRACKING_ACTIVE`)) {
        return `  ${safeName}_pos = ${pos};\n`;
    }
    return `  // Tracking für ${safeName} nicht aktiv oder Motor fehlt\n`;
};