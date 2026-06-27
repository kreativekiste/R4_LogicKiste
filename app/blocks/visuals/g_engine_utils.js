// =======================================================================
// G-ENGINE: Werkzeuge & Timer (g_engine_utils.js)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // BLOCK 1: AKTEUR ZERSTÖREN / VERSTECKEN
    {
        "type": "g_engine_sprite_destroy",
        "message0": "💥 Lösche %1 vom Spielfeld",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SPRITE_ID",
                "options": [
                    ["Spieler", "PLAYER"],
                    ["Gegner-Gruppe", "ENEMY"],
                    ["Projektil / Schuss", "PROJECTILE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Entfernt einen Akteur komplett aus dem Spiel (z.B. nach einem Treffer)."
    },

    // BLOCK 2: ENGINE TIMER (BUGFIX: Alles in message0)
    {
        "type": "g_engine_timer",
        "message0": "⏱️ Führe alle %1 Millisekunden aus %2 mache %3",
        "args0": [
            {"type": "input_value", "name": "INTERVAL", "check": "Number"},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Ein spezieller Timer für die Engine. Bremst nicht das restliche Spiel aus!"
    }
]);

// --- C++ GENERATOREN ---

ArduinoGenerator.forBlock['g_engine_sprite_destroy'] = function(block) {
    const spriteId = block.getFieldValue('SPRITE_ID');
    return `engine.destroySprite(${spriteId});\n`;
};

ArduinoGenerator.forBlock['g_engine_timer'] = function(block) {
    const interval = ArduinoGenerator.valueToCode(block, 'INTERVAL', 0) || '500';
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');
    
    const safeId = block.id.replace(/[^a-zA-Z0-9_]/g, 'x');
    const timerName = 'timer_engine_' + safeId;

    let code = `static unsigned long ${timerName} = 0;\n`;
    code += `if (millis() - ${timerName} >= ${interval}) {\n`;
    code += `  ${timerName} = millis();\n`;
    code += doCode;
    code += `}\n`;

    return code;
};