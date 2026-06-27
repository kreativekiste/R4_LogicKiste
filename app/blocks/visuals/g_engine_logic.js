// =======================================================================
// G-ENGINE: Spielelogik & Events (g_engine_logic.js)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // BLOCK 1: KOLLISIONSABFRAGE (EVENT)
    {
        "type": "g_engine_collision_check",
        "message0": "💥 Wenn %1 trifft auf %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SPRITE_A",
                "options": [
                    ["Spieler", "PLAYER"],
                    ["Gegner-Gruppe", "ENEMY"],
                    ["Projektil / Schuss", "PROJECTILE"]
                ]
            },
            {
                "type": "field_dropdown",
                "name": "SPRITE_B",
                "options": [
                    ["Spieler", "PLAYER"],
                    ["Gegner-Gruppe", "ENEMY"],
                    ["Projektil / Schuss", "PROJECTILE"]
                ]
            }
        ],
        "message1": "mache %1",
        "args1": [
            {"type": "input_statement", "name": "DO"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Prüft im aktuellen Frame, ob zwei Akteure ineinanderkrachen. Perfekt für Trefferabfragen."
    },

    // BLOCK 2: GAME OVER AUSLÖSEN
    {
        "type": "g_engine_game_over",
        "message0": "💀 Beende Spiel (Game Over)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Stoppt die G-Engine sofort und bricht aus der Spielschleife aus."
    }
]);

// --- C++ GENERATOREN ---

ArduinoGenerator.forBlock['g_engine_collision_check'] = function(block) {
    const spriteA = block.getFieldValue('SPRITE_A');
    const spriteB = block.getFieldValue('SPRITE_B');
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');

    // Baut die Kollisionsprüfung der C++ Bibliothek in ein If-Statement
    let code = `if (engine.checkCollision(${spriteA}, ${spriteB})) {\n`;
    code += doCode;
    code += `}\n`;

    return code;
};

ArduinoGenerator.forBlock['g_engine_game_over'] = function(block) {
    // Ruft die Stop-Funktion auf, wodurch isRunning() false wird
    return `engine.stop();\n`;
};