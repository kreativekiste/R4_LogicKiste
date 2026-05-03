// ==========================================
// BAUTEIL: INTERVALL TIMER (Blink without delay)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "timer_interval",
    "message0": "Alle %1 ms ausführen",
    "args0": [
        { "type": "field_number", "name": "INTERVAL", "value": 1000, "min": 1 }
    ],
    "message1": "MACHE %1",
    "args1": [{ "type": "input_statement", "name": "DO" }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290,
    "tooltip": "Führt den Code in regelmäßigen Abständen aus, ohne den restlichen Arduino zu blockieren."
}]);

ArduinoGenerator.forBlock['timer_interval'] = function(block) {
    const interval = block.getFieldValue('INTERVAL');
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Wir erzeugen einen absolut eindeutigen Variablennamen für diesen einen Block
    // block.id ist z.B. "A3fg!9x". Wir filtern Sonderzeichen raus.
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const timerName = `lastTime_${safeId}`;
    
    // Wir merken uns den Timer, damit wir ihn später in der index.html 
    // als "unsigned long" Variable ganz oben eintragen können!
    if (!ArduinoGenerator.usedTimers) {
        ArduinoGenerator.usedTimers = new Set();
    }
    ArduinoGenerator.usedTimers.add(timerName);
    
    // += statt = millis(): Verhindert Drift, da der Zeitstempel absolut bleibt
    // und sich Ausführungszeit der Blöcke nicht aufaddiert.
    return `  if (millis() - ${timerName} >= ${interval}) {\n    ${timerName} += ${interval};\n${branch}  }\n`;
};