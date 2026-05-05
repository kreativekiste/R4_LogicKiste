// ==========================================
// BAUTEILE: UNTERPROGRAMME (Funktionen)
// ==========================================

// --- 1. DEFINIEREN (Das Programm anlegen) ---
// Dieser Block bleibt als JSON, da er nur ein simples Textfeld für den Namen braucht.
Blockly.defineBlocksWithJsonArray([
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
    }
]);

// --- 2. AUFRUFEN (Das Programm starten) ---
// Dieser Block wird per JS definiert, damit das Dropdown dynamisch generiert werden kann.
Blockly.Blocks['ard_function_call'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Führe Unterprogramm aus:")
            .appendField(new Blockly.FieldDropdown(this.getDynamicOptions.bind(this)), "FUNC_NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("Führt das ausgewählte Unterprogramm aus. Die Liste aktualisiert sich automatisch.");
    },
    
    // Sucht alle "ard_function_define" Blöcke und baut daraus das Dropdown
    getDynamicOptions: function() {
        let options = [];
        
        // Sicherstellen, dass der Workspace schon geladen ist
        if (this.workspace) {
            let blocks = this.workspace.getBlocksByType('ard_function_define');
            blocks.forEach(function(block) {
                let name = block.getFieldValue('FUNC_NAME');
                if (name) {
                    // Anzeige-Name bleibt original, interner Wert wird C++ sicher gemacht
                    // KRITISCH: Wir hängen "func_" an, um reservierte Wörter und führende Zahlen abzufangen
                    let safeName = "func_" + name.replace(/[^a-zA-Z0-9_]/g, '');
                    if (safeName !== "func_") {
                        options.push([name, safeName]); 
                    }
                }
            });
        }
        
        // Fallback, falls noch kein Unterprogramm existiert
        if (options.length === 0) {
            options.push(['-- Kein Unterprogramm gefunden --', 'NONE']);
        }
        
        return options;
    }
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['ard_function_define'] = function(block) {
    let funcName = block.getFieldValue('FUNC_NAME');
    
    // Bereinigt den Namen von Leer- und Sonderzeichen und setzt den sicheren Prefix
    funcName = "func_" + funcName.replace(/[^a-zA-Z0-9_]/g, '');
    
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    if (!ArduinoGenerator.userFunctions) {
        ArduinoGenerator.userFunctions = new Map();
    }
    
    // Speichert den Code ab. Der Core-Scanner (generator_core.js) holt ihn sich am Ende.
    if (funcName !== "func_") {
        const functionCode = `void ${funcName}() {\n${branch}}\n`;
        ArduinoGenerator.userFunctions.set(funcName, functionCode);
    }
    
    return ''; 
};

ArduinoGenerator.forBlock['ard_function_call'] = function(block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    
    // Wenn kein gültiges Unterprogramm ausgewählt wurde, generiere keinen kaputten Code
    if (funcName === 'NONE' || !funcName) {
        return `  // WARNUNG: Kein Unterprogramm ausgewählt!\n`;
    }
    
    return `  ${funcName}();\n`;
};