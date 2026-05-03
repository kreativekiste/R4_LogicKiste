// ==========================================
// BAUTEILE: SMART STEPPER MOTOR (ULN2003 / 28BYJ-48)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SETUP BLOCK (Gehört ins SETUP) ---
    {
        "type": "stepper_setup",
        "message0": "⚙️ Stepper Setup: %1 | Pins IN1: %2 IN2: %3 IN3: %4 IN4: %5 | Schritte/Umdr.: %6 | 📍 Position tracken: %7",
        "args0": [
            {"type": "field_input", "name": "MOTOR_NAME", "text": "motor1"},
            {"type": "field_input", "name": "IN1", "text": "8"},
            {"type": "field_input", "name": "IN2", "text": "10"},
            {"type": "field_input", "name": "IN3", "text": "9"},
            {"type": "field_input", "name": "IN4", "text": "11"},
            {"type": "field_number", "name": "STEPS_REV", "value": 2048},
            {"type": "field_checkbox", "name": "TRACK_POS", "checked": true}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Gehört in den SETUP-Block. Konfiguriert die Hardware. Wenn 'Tracken' aktiv ist, wird die Variable [motorname]_pos erstellt."
    },

    // --- 2. MOVE BLOCK (Gehört in die LOOP) ---
    {
        "type": "stepper_move",
        "message0": "Bewege Motor %1 | Schritte %2 | Tempo (RPM) %3 | Richtung (1=Rechts, -1=Links) %4",
        "args0": [
            {"type": "field_input", "name": "MOTOR_NAME", "text": "motor1"},
            {"type": "input_value", "name": "STEPS"},
            {"type": "input_value", "name": "TEMPO"},
            {"type": "input_value", "name": "DIR"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Bewegt den Stepper. Alle Werte (Schritte, Tempo, Richtung) können Variablen sein!"
    },

    // --- 3. RESET POSITION BLOCK ---
    {
        "type": "stepper_reset",
        "message0": "Setze Position von Motor %1 auf %2",
        "args0": [
            {"type": "field_input", "name": "MOTOR_NAME", "text": "motor1"},
            {"type": "input_value", "name": "POS"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 180,
        "tooltip": "Überschreibt den internen Positionszähler (z.B. für Nullpunkt-Kalibrierung)."
    }
]);

// --- GENERATOR LOGIK ---

// init erweitern statt überschreiben — vorherige init-Funktion beibehalten
const _prevInit = ArduinoGenerator.init;
ArduinoGenerator.init = function(workspace) {
    if (_prevInit) _prevInit.call(this, workspace);
    if (!ArduinoGenerator.trackedSteppers) ArduinoGenerator.trackedSteppers = new Set();
    if (ArduinoGenerator.userFunctions === undefined) ArduinoGenerator.userFunctions = new Map();
};

ArduinoGenerator.forBlock['stepper_setup'] = function(block) {
    const name = block.getFieldValue('MOTOR_NAME');
    const in1 = block.getFieldValue('IN1');
    const in2 = block.getFieldValue('IN2');
    const in3 = block.getFieldValue('IN3');
    const in4 = block.getFieldValue('IN4');
    const stepsRev = block.getFieldValue('STEPS_REV');
    const trackPos = block.getFieldValue('TRACK_POS') === 'TRUE';

    // Pins als Output deklarieren
    ArduinoGenerator.usedPinsOutput.add(in1);
    ArduinoGenerator.usedPinsOutput.add(in2);
    ArduinoGenerator.usedPinsOutput.add(in3);
    ArduinoGenerator.usedPinsOutput.add(in4);

    // C++ Library und Objekt global definieren
    if (!ArduinoGenerator.includes_) ArduinoGenerator.includes_ = new Set();
    ArduinoGenerator.includes_.add('#include <Stepper.h>');

    if (!ArduinoGenerator.globals_) ArduinoGenerator.globals_ = new Set();
    // Beachte die Reihenfolge für den ULN2003 (IN1, IN3, IN2, IN4)
    ArduinoGenerator.globals_.add(`Stepper ${name}(${stepsRev}, pin${in1}, pin${in3}, pin${in2}, pin${in4});`);
    
    // Positions-Variable anlegen, falls gewünscht
    if (trackPos) {
        ArduinoGenerator.globals_.add(`long ${name}_pos = 0;`);
        if (!ArduinoGenerator.trackedSteppers) ArduinoGenerator.trackedSteppers = new Set();
        ArduinoGenerator.trackedSteppers.add(name);
    }

    return `  // Stepper ${name} ist konfiguriert\n`;
};

ArduinoGenerator.forBlock['stepper_move'] = function(block) {
    const name = block.getFieldValue('MOTOR_NAME');
    const steps = ArduinoGenerator.valueToCode(block, 'STEPS', ArduinoGenerator.PRECEDENCE) || '0';
    const tempo = ArduinoGenerator.valueToCode(block, 'TEMPO', ArduinoGenerator.PRECEDENCE) || '15';
    const dir = ArduinoGenerator.valueToCode(block, 'DIR', ArduinoGenerator.PRECEDENCE) || '1';

    let code = `  ${name}.setSpeed(${tempo});\n`;
    code += `  ${name}.step(${steps} * ${dir});\n`;

    // Wenn dieser Motor getrackt wird, rechne die Position automatisch mit!
    if (ArduinoGenerator.trackedSteppers && ArduinoGenerator.trackedSteppers.has(name)) {
        code += `  ${name}_pos += (${steps} * ${dir});\n`;
    }

    return code;
};

ArduinoGenerator.forBlock['stepper_reset'] = function(block) {
    const name = block.getFieldValue('MOTOR_NAME');
    const pos = ArduinoGenerator.valueToCode(block, 'POS', ArduinoGenerator.PRECEDENCE) || '0';

    // Nur generieren wenn Tracking aktiv ist — sonst Kompilierfehler wegen fehlender Variable
    if (!ArduinoGenerator.trackedSteppers || !ArduinoGenerator.trackedSteppers.has(name)) {
        return `  // HINWEIS: Position-Reset für ${name} ignoriert (Tracking ist deaktiviert)\n`;
    }
    return `  ${name}_pos = ${pos};\n`;
};