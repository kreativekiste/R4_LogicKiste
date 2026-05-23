
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

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['timer_interval'] = function(block) {
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    ArduinoGenerator.globals_.add(`unsigned long lastTime_${safeId} = 0;`);
};

// GENERATOR LOGIK
ArduinoGenerator.forBlock['timer_interval'] = function(block) {
    const ms = ArduinoGenerator.valueToCode(block, 'MS', 0) || '1000';
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    let code = `  {\n`;
    code += `    unsigned long currentMillis = millis();\n`;
    code += `    if (currentMillis - lastTime_${safeId} >= (${ms})) {\n`;
    code += `      lastTime_${safeId} = currentMillis;\n`;
    code += branch;
    code += `    }\n`;
    code += `  }\n`;
    
    return code;
};