// =======================================================================
// ARDUINO: INTERVALL TIMER (Ohne Delay) & ZÄHLER TIMER
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // 1. Der einfache Timer (von vorhin)
    {
        "type": "do_them_all", 
        "message0": "Alle %1 ms ausführen",
        "args0": [
            { 
                "type": "input_value", 
                "name": "INTERVAL",
                "check": "Number" 
            }
        ],
        "message1": "MACHE %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt den Code in regelmäßigen Abständen aus, ohne den restlichen Arduino zu blockieren."
    },
    
    // 2. Der neue Timer mit integriertem Zähler
    {
        "type": "timer_counter_main",
        "message0": "Alle %1 ms ausführen | Name: %2",
        "args0": [
            { "type": "input_value", "name": "INTERVAL", "check": "Number" },
            { "type": "field_input", "name": "NAME", "text": "Takt1" }
        ],
        "message1": "Zähle hoch & MACHE %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt den Code im Intervall aus und zählt automatisch eine Variable (Zähler) hoch."
    },

    // 3. Zählerwert auslesen
    {
        "type": "timer_counter_get",
        "message0": "Lese Zähler: %1",
        "args0": [
            { "type": "field_input", "name": "NAME", "text": "Takt1" }
        ],
        "output": "Number",
        "colour": 290,
        "tooltip": "Gibt den aktuellen Zählerstand des Timers zurück."
    },

    // 4. Zählerwert auf X setzen
    {
        "type": "timer_counter_set",
        "message0": "Setze Zähler: %1 auf %2",
        "args0": [
            { "type": "field_input", "name": "NAME", "text": "Takt1" },
            { "type": "input_value", "name": "VALUE", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Setzt den Zähler des Timers auf einen bestimmten Wert."
    },

    // 5. Zähler auf 0 zurücksetzen
    {
        "type": "timer_counter_reset",
        "message0": "Setze Zähler: %1 auf 0",
        "args0": [
            { "type": "field_input", "name": "NAME", "text": "Takt1" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Setzt den Zähler des Timers zurück auf 0."
    }
]);

// =======================================================================
// GENERATOREN (C++ FÜR ARDUINO)
// =======================================================================

// 1. Einfacher Timer
ArduinoGenerator.forBlock['do_them_all'] = function(block) { 
    const interval = ArduinoGenerator.valueToCode(block, 'INTERVAL', 0) || '1000';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const timerVar = `lastTime_${safeId}`;

    ArduinoGenerator.globals_.add(`unsigned long ${timerVar} = 0;`);
    
    let code = `  if (millis() - ${timerVar} >= ${interval}) {\n`;
    code += `    ${timerVar} = millis();\n`;
    code += `${branch}`;
    code += `  }\n`;
    
    return code;
};

// 2. Timer mit Zähler
ArduinoGenerator.forBlock['timer_counter_main'] = function(block) {
    const interval = ArduinoGenerator.valueToCode(block, 'INTERVAL', 0) || '1000';
    const rawName = block.getFieldValue('NAME');
    const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '_'); // Entfernt Sonderzeichen für saubere C++ Variablen
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    const timerVar = `lastTime_${safeName}`;
    const counterVar = `counter_${safeName}`;

    // Globale Variablen anlegen
    ArduinoGenerator.globals_.add(`unsigned long ${timerVar} = 0;`);
    ArduinoGenerator.globals_.add(`int ${counterVar} = 0;`); 
    
    let code = `  if (millis() - ${timerVar} >= ${interval}) {\n`;
    code += `    ${timerVar} = millis();\n`;
    code += `    ${counterVar}++;\n`;
    code += `${branch}`;
    code += `  }\n`;
    return code;
};

// 3. Zähler lesen
ArduinoGenerator.forBlock['timer_counter_get'] = function(block) {
    const rawName = block.getFieldValue('NAME');
    const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '_');
    return [`counter_${safeName}`, 0]; // 0 steht für die C++ Operator-Reihenfolge (Atomic)
};

// 4. Zähler auf Wert X setzen
ArduinoGenerator.forBlock['timer_counter_set'] = function(block) {
    const rawName = block.getFieldValue('NAME');
    const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '_');
    const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
    return `  counter_${safeName} = ${value};\n`;
};

// 5. Zähler auf 0 setzen
ArduinoGenerator.forBlock['timer_counter_reset'] = function(block) {
    const rawName = block.getFieldValue('NAME');
    const safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '_');
    return `  counter_${safeName} = 0;\n`;
};