// =======================================================================
// G-ENGINE: Eingabe & Steuerung (g_engine_input.js)
// =======================================================================

Blockly.defineBlocksWithJsonArray([{
    "type": "g_engine_input_button",
    "message0": "🎮 Falls Taste %1 %2",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "BUTTON",
            "options": [
                ["⬅️ Links", "BTN_LEFT"],
                ["➡️ Rechts", "BTN_RIGHT"],
                ["⬆️ Oben", "BTN_UP"],
                ["⬇️ Unten", "BTN_DOWN"],
                ["🔴 Aktion A", "BTN_A"],
                ["🔵 Aktion B", "BTN_B"]
            ]
        },
        {
            "type": "field_dropdown",
            "name": "MODE",
            "options": [
                ["wurde neu gedrückt (Einzelaktion)", "PRESSED_NEW"],
                ["wird gehalten (Dauerhaft)", "PRESSED_HELD"]
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
    "tooltip": "Prüft die Arcade-Taster. Nutze 'neu gedrückt' für Schießen/Springen und 'wird gehalten' für Laufen.",
    "helpUrl": ""
}]);

ArduinoGenerator.forBlock['g_engine_input_button'] = function(block) {
    const button = block.getFieldValue('BUTTON');
    const mode = block.getFieldValue('MODE');
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');

    // Entscheiden, welche C++ Funktion der Engine im Hintergrund aufgerufen wird
    let condition = "";
    if (mode === "PRESSED_NEW") {
        // Flankenerkennung: Taste wurde in diesem Frame frisch gedrückt
        condition = `engine.buttonPressed(${button})`;
    } else {
        // Zustandserkennung: Taste wird permanent runtergedrückt
        condition = `engine.buttonHeld(${button})`;
    }

    // Die If-Schleife für den C-Code bauen
    let code = `if (${condition}) {\n`;
    code += doCode;
    code += `}\n`;

    return code;
};