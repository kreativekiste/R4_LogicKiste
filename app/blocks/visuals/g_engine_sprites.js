// =======================================================================
// G-ENGINE: Akteure / Sprites (g_engine_sprites.js)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // BLOCK 1: AKTEUR ERZEUGEN
    {
        "type": "g_engine_sprite_create",
        "message0": "👾 Erzeuge %1 auf X: %2 Y: %3 | Größe (BxH): %4 x %5",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SPRITE_ID",
                "options": [
                    ["Spieler", "PLAYER"],
                    ["Gegner-Gruppe", "ENEMY"],
                    ["Projektil / Schuss", "PROJECTILE"]
                ]
            },
            {"type": "input_value", "name": "POS_X", "check": "Number"},
            {"type": "input_value", "name": "POS_Y", "check": "Number"},
            {"type": "input_value", "name": "WIDTH", "check": "Number"},
            {"type": "input_value", "name": "HEIGHT", "check": "Number"}
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Erschafft eine Spielfigur auf der Matrix. (Läuft am besten im SETUP-Teil der Engine)"
    },
    
    // BLOCK 2: AKTEUR BEWEGEN
    {
        "type": "g_engine_sprite_move",
        "message0": "🚀 Bewege %1 um %2 auf der %3 -Achse",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SPRITE_ID",
                "options": [
                    ["Spieler", "PLAYER"],
                    ["Gegner-Gruppe", "ENEMY"],
                    ["Projektil / Schuss", "PROJECTILE"]
                ]
            },
            {"type": "input_value", "name": "STEPS", "check": "Number"},
            {
                "type": "field_dropdown",
                "name": "AXIS",
                "options": [
                    ["X (Links/Rechts)", "X"],
                    ["Y (Oben/Unten)", "Y"]
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Bewegt einen Akteur relativ zur aktuellen Position (z.B. +1 für rechts, -1 für links)."
    }
]);

// --- C++ GENERATOREN ---

ArduinoGenerator.forBlock['g_engine_sprite_create'] = function(block) {
    const spriteId = block.getFieldValue('SPRITE_ID');
    const posX = ArduinoGenerator.valueToCode(block, 'POS_X', 0) || '0';
    const posY = ArduinoGenerator.valueToCode(block, 'POS_Y', 0) || '0';
    const width = ArduinoGenerator.valueToCode(block, 'WIDTH', 0) || '1';
    const height = ArduinoGenerator.valueToCode(block, 'HEIGHT', 0) || '1';

    // Ruft im Hintergrund die C-Funktion der Engine auf
    return `engine.createSprite(${spriteId}, ${posX}, ${posY}, ${width}, ${height});\n`;
};

ArduinoGenerator.forBlock['g_engine_sprite_move'] = function(block) {
    const spriteId = block.getFieldValue('SPRITE_ID');
    const axis = block.getFieldValue('AXIS');
    const steps = ArduinoGenerator.valueToCode(block, 'STEPS', 0) || '0';

    if (axis === "X") {
        return `engine.moveSpriteX(${spriteId}, ${steps});\n`;
    } else {
        return `engine.moveSpriteY(${spriteId}, ${steps});\n`;
    }
};