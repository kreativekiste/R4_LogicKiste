// ==========================================
// KATEGORIE: ZEIT (Nicht-blockierend)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    {
        "type": "timer_interval",
        "message0": "⏰ Alle %1 ms mache: %2 %3",
        "args0": [
            { "type": "input_value", "name": "MS", "check": "Number" },
            { "type": "input_dummy" },
            { "type": "input_statement", "name": "DO" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "Führt den Code im Inneren alle X Millisekunden aus, ohne das Programm zu stoppen."
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['timer_interval'] = function(block) {
    // Wir brauchen für jeden Block eine eigene Zeit-Variable. 
    // Wir nutzen die block.id, um sie weltweit eindeutig zu machen.
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    
    // Registriert den Zeitstempel global (unsigned long ist wichtig für Millis!)
    ArduinoGenerator.globals_.add(`unsigned long lastTime_${safeId} = 0;`);
};

// --- GENERATOR LOGIK ---
ArduinoGenerator.forBlock['timer_interval'] = function(block) {
    const ms = ArduinoGenerator.valueToCode(block, 'MS', 0) || '1000';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');

    // Kritische Anpassung: = millis() verhindert das fehlerhafte "Aufholen" von Iterationen, 
    // falls das Hauptprogramm an anderer Stelle (z.B. durch delay) blockiert wurde.
    let code = `  if (millis() - lastTime_${safeId} >= ${ms}) {\n`;
    code += `    lastTime_${safeId} = millis();\n`;
    code += branch;
    code += `  }\n`;
    
    return code;
};