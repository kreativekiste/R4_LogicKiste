// ==========================================
// BAUTEIL: INTERVALL TIMER (Blink without delay)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "timer_interval",
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
}]);

ArduinoGenerator.forBlock['timer_interval'] = function(block) {
    // Holt das Intervall flexibel (Zahl, Variable, etc.)
    const interval = ArduinoGenerator.valueToCode(block, 'INTERVAL', 0) || '1000';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Eindeutige ID für die Zeitstempel-Variable
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const timerVar = `lastTime_${safeId}`;
    
    // Dezentrale Registrierung der Variable in den Globals
    // Da jeder Block eine eigene ID hat, gibt es hier keine Namenskollisionen.
    ArduinoGenerator.globals_.add(`unsigned long ${timerVar} = 0;`);
    
    // Generierung des asynchronen Zeit-Checks
    // KORREKTUR: Wir nutzen = millis(), um den "Catch-Up" Burst bei blockierendem Code zu verhindern
    let code = `  if (millis() - ${timerVar} >= ${interval}) {\n`;
    code += `    ${timerVar} = millis();\n`;
    code += `${branch}`;
    code += `  }\n`;
    
    return code;
};