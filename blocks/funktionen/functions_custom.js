// ==========================================
// BAUTEILE: UNTERPROGRAMME (Funktionen)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. DEFINIEREN (Das Programm anlegen) ---
    // Dieser Block steht wie der Hauptrahmen völlig frei auf der Arbeitsfläche
    {
        "type": "ard_function_define",
        "message0": "Unterprogramm: %1",
        "args0": [
            {"type": "field_input", "name": "FUNC_NAME", "text": "meinRadarMenue"}
        ],
        "message1": "Mache: %1",
        "args1": [
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 290,
        "tooltip": "Erstellt ein neues Unterprogramm. Dieser Block wird NICHT in die Loop gesteckt, sondern steht frei auf dem Raster."
    },

    // --- 2. AUFRUFEN (Das Programm starten) ---
    // Dieser Block kommt in deine Loop oder in eine WENN-Bedingung
    {
        "type": "ard_function_call",
        "message0": "Führe Unterprogramm %1 aus",
        "args0": [
            {"type": "field_input", "name": "FUNC_NAME", "text": "meinRadarMenue"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Führt den Code aus, den du im Unterprogramm definiert hast. Achte auf die genaue Schreibweise des Namens!"
    }
]);

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['ard_function_define'] = function(block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    // Hole den gesamten Code, der in diesem Unterprogramm steckt
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Wir speichern die fertige Funktion in einer internen Liste
    // Unser Hauptscanner (in der index.html) wird diese später abholen und ganz nach unten in den C++ Code schreiben
    if (!ArduinoGenerator.userFunctions) {
        ArduinoGenerator.userFunctions = new Map();
    }
    
    // C++ Grundgerüst für die Funktion bauen
    const functionCode = `void ${funcName}() {\n${branch}}\n`;
    ArduinoGenerator.userFunctions.set(funcName, functionCode);
    
    // Da dieser Block frei auf der Arbeitsfläche steht, geben wir hier "null" zurück,
    // damit er nicht aus Versehen mitten im Code auftaucht.
    return null; 
};

ArduinoGenerator.forBlock['ard_function_call'] = function(block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    
    // Der einfache C++ Aufruf-Befehl
    return `  ${funcName}();\n`;
};