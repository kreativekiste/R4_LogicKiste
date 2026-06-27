// =======================================================================
// G-ENGINE: Der Haupt-Rahmen (Sandbox)
// =======================================================================

Blockly.defineBlocksWithJsonArray([{
    "type": "g_engine_main",
    "message0": "🕹️ G-ENGINE START (Matrix: 32x32)",
    "message1": "⚙️ SETUP (Einmalig) %1",
    "args1": [{"type": "input_statement", "name": "SETUP"}],
    "message2": "🔄 FRAME LOOP (Spiellogik) %1",
    "args2": [{"type": "input_statement", "name": "LOOP"}],
    "message3": "💀 GAME OVER %1",
    "args3": [{"type": "input_statement", "name": "GAMEOVER"}],
    "colour": 160,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Der geschützte Sandkasten für Arcade-Spiele. Nichts bremst diesen Block!"
}]);

ArduinoGenerator.forBlock['g_engine_main'] = function(block) {
    const setupCode = ArduinoGenerator.statementToCode(block, 'SETUP');
    const loopCode = ArduinoGenerator.statementToCode(block, 'LOOP');
    const gameOverCode = ArduinoGenerator.statementToCode(block, 'GAMEOVER');

    // BUGFIX: Normale Anführungszeichen und ein sauberer String, damit JS nicht abstürzt
    ArduinoGenerator.globals_.add("#include <GEngine.h>\nGEngine engine;");

    let code = "// --- G-ENGINE SANDBOX START ---\n";
    code += "engine.init();\n";
    code += setupCode;
    
    code += "\n// Startet die Engine und setzt Status auf 'running'\n";
    code += "engine.start();\n";
    
    code += "while(engine.isRunning()) {\n";
    code += "  engine.update(); // Display zeichnen & Taster entprellen\n\n";
    code += loopCode;
    code += "}\n";
    
    code += "\n// --- G-ENGINE BEENDET ---\n";
    code += gameOverCode;

    return code;
};