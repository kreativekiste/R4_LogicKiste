const ArduinoGenerator = new Blockly.Generator('Arduino');
ArduinoGenerator.PRECEDENCE = 0;
ArduinoGenerator.INDENT = '  ';

// Ein zentrales Register für Blöcke, die freischwebend Code generieren müssen
ArduinoGenerator.hardwareScanners = {};

ArduinoGenerator.init = function(workspace) {
    if (!ArduinoGenerator.userFunctions) ArduinoGenerator.userFunctions = new Map();
};

ArduinoGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = (nextBlock && !opt_thisOnly) ? ArduinoGenerator.blockToCode(nextBlock) : '';
    return code + nextCode;
};

// --- DER HAUPTRAHMEN (Das Gehirn der Arduino R4_LogicKiste) ---
Blockly.defineBlocksWithJsonArray([{
    "type": "arduino_main",
    "message0": "PROGRAMM START",
    "message1": "🌍 GLOBAL %1",
    "args1": [{"type": "input_statement", "name": "GLOBAL"}],
    "message2": "⚙️ SETUP %1",
    "args2": [{"type": "input_statement", "name": "SETUP"}],
    "message3": "🔁 LOOP %1",
    "args3": [{"type": "input_statement", "name": "LOOP"}],
    "colour": 210,
    "deletable": false,
    "tooltip": "Der unzerstörbare Hauptblock der Arduino R4_LogicKiste."
}]);

ArduinoGenerator.forBlock['arduino_main'] = function(block) {
    // 1. Alle Kisten (Sets und Maps) für die Blöcke bereitstellen
    ArduinoGenerator.usedPinsOutput = new Set();
    ArduinoGenerator.usedPinsInput = new Set();
    ArduinoGenerator.usedPinsAnalog = new Set();
    ArduinoGenerator.pinModes = new Map();
    ArduinoGenerator.customVariables = new Map();
    ArduinoGenerator.includes_ = new Set();
    ArduinoGenerator.globals_ = new Set();
    ArduinoGenerator.autoSetup_ = [];          // Array: Reihenfolge wichtig, kein Dedup-Risiko
    ArduinoGenerator.autoSetupInterrupts_ = []; // Interrupts IMMER nach pinMode
    ArduinoGenerator.autoLoop_ = [];            // Array: Reihenfolge wichtig
    ArduinoGenerator.isrFunctions_ = [];        // Array: ISR-Funktionen
    
    ArduinoGenerator.mx_modules = 0;
    ArduinoGenerator.useSerial = false;
    ArduinoGenerator.suppressedVars_ = new Set(); // ISR-Variablen die NICHT nochmal deklariert werden dürfen
    ArduinoGenerator._encoderCount = 0;              // Zähler für Encoder-ISR zurücksetzen
    ArduinoGenerator._counterCount = 0;              // Zähler für entprellte Counter zurücksetzen

    // Sicherheits-Reset: alle persistenten Flags löschen die Scanner-Deduplication steuern
    // Verhindert dass alte .js-Dateien mit "if (initializedXYZ) return" beim 2. Mal nichts tun
    ArduinoGenerator.initializedMPU6050 = false;
    ArduinoGenerator.dht_setup_done = {};
    
    // 2. Alle Blöcke auf dem Workspace durchsuchen und deren eigene Scanner aufrufen
    const allBlocks = block.workspace.getAllBlocks(false);
    allBlocks.forEach(b => {
        if (ArduinoGenerator.hardwareScanners[b.type]) {
            ArduinoGenerator.hardwareScanners[b.type](b);
        }
    });
    
    // 3. Den eigentlichen Code der angedockten Blöcke generieren
    const globalCode = ArduinoGenerator.statementToCode(block, 'GLOBAL');
    const setupCode = ArduinoGenerator.statementToCode(block, 'SETUP');
    const loopCode = ArduinoGenerator.statementToCode(block, 'LOOP');
    
    // 4. Alles zusammenbauen (Die Kisten ausleeren)
    let fullCode = "// Arduino R4_LogicKiste // © kreativekiste.de\n\n";
    
    if (ArduinoGenerator.includes_.size > 0) {
        ArduinoGenerator.includes_.forEach(inc => { fullCode += inc + "\n"; });
    }
    
    if (ArduinoGenerator.globals_.size > 0) {
        ArduinoGenerator.globals_.forEach(glob => { fullCode += glob + "\n"; });
    }

    if (ArduinoGenerator.useSerial) { ArduinoGenerator.autoSetup_.push("  Serial.begin(9600);\n"); }

    // Pins und Variablen verarbeiten
    let allPins = new Set([...ArduinoGenerator.usedPinsOutput, ...ArduinoGenerator.usedPinsInput, ...ArduinoGenerator.usedPinsAnalog]);
    if (allPins.size > 0) fullCode += "\n// --- PINS ---\n";
    allPins.forEach(pin => { fullCode += `const int pin${pin} = ${pin};\n`; });

    let autoSetupCode = "";
    ArduinoGenerator.usedPinsOutput.forEach(pin => { autoSetupCode += `  pinMode(pin${pin}, OUTPUT);\n`; });
    ArduinoGenerator.usedPinsInput.forEach(pin => {
        const mode = ArduinoGenerator.pinModes.has(pin) ? ArduinoGenerator.pinModes.get(pin) : 'INPUT';
        autoSetupCode += `  pinMode(pin${pin}, ${mode});\n`;
    });

    if (ArduinoGenerator.customVariables.size > 0) {
        fullCode += "\n// --- AUTOMATISCHE VARIABLEN ---\n";
        ArduinoGenerator.customVariables.forEach((type, name) => { fullCode += `${type} ${name};\n`; });
    }

    // Nutzer-Globals (Variablen, die im GLOBAL-Slot deklariert wurden)
    // Gesperrte Variablen (z.B. volatile ISR-Variablen) werden herausgefiltert
    // um doppelte Deklarationen zu verhindern (Compiler-Fehler "redefinition")
    let filteredGlobalCode = globalCode;
    if (ArduinoGenerator.suppressedVars_.size > 0) {
        filteredGlobalCode = globalCode.split('\n').filter(line => {
            for (const varName of ArduinoGenerator.suppressedVars_) {
                // Zeile überspringen wenn sie diese Variable deklariert
                const pattern = new RegExp('\\b' + varName + '\\b.*=');
                if (pattern.test(line)) return false;
            }
            return true;
        }).join('\n');
    }
    if (filteredGlobalCode.trim().length > 0) {
        fullCode += "\n// --- BENUTZER GLOBALS ---\n";
        fullCode += filteredGlobalCode;
    }

    // Auto-Setup: erst allgemeines Setup, dann Interrupts (NACH allen pinMode-Aufrufen!)
    ArduinoGenerator.autoSetup_.forEach(code => { autoSetupCode += code; });
    ArduinoGenerator.autoSetupInterrupts_.forEach(code => { autoSetupCode += code; });
    
    let autoLoopCode = "";
    ArduinoGenerator.autoLoop_.forEach(code => { autoLoopCode += code; });

    fullCode += "\nvoid setup() {\n" + autoSetupCode + setupCode + "}\n\n";
    fullCode += "void loop() {\n" + autoLoopCode + loopCode + "}\n\n";
    
    if (ArduinoGenerator.isrFunctions_.length > 0) {
        fullCode += "// --- INTERRUPTS (ISR) ---\n";
        ArduinoGenerator.isrFunctions_.forEach(isr => { fullCode += isr + "\n"; });
    }

    // --- UNTERPROGRAMME SCANNEN ---
    if (!ArduinoGenerator.userFunctions) ArduinoGenerator.userFunctions = new Map();
    ArduinoGenerator.userFunctions.clear();
    block.workspace.getBlocksByType('ard_function_define').forEach(funcBlock => {
        ArduinoGenerator.blockToCode(funcBlock);
    });

    if (ArduinoGenerator.userFunctions.size > 0) {
        fullCode += "\n// --- UNTERPROGRAMME ---\n";
        ArduinoGenerator.userFunctions.forEach((funcCode, name) => {
            fullCode += funcCode + "\n";
        });
    }

    return fullCode;
};