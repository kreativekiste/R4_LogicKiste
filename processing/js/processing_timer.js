// =======================================================================
// PROCESSING: TIMER, ZEIT & STOPPUHR
// =======================================================================

// Gemeinsame Funktion für das Dropdown-Menü der Stoppuhren
function generateProcessingWatchOptions() {
    let options = [];
    let ws = this.getSourceBlock() ? this.getSourceBlock().workspace : null;

    if (ws && ws.isFlyout) ws = ws.targetWorkspace;
    if (!ws) ws = Blockly.getMainWorkspace();

    if (ws) {
        let blocks = ws.getBlocksByType('processing_stopwatch_define', false);
        blocks.forEach(b => {
            let n = b.getFieldValue('NAME');
            if (n) {
                let safeName = "sw_" + n.replace(/[^a-zA-Z0-9_]/g, '');
                options.push([n, safeName]);
            }
        });
    }

    let currentVal = this.getValue();
    if (currentVal && currentVal !== 'NONE') {
        let exists = options.some(opt => opt[1] === currentVal);
        if (!exists) {
            let displayName = currentVal.startsWith('sw_') ? currentVal.substring(3) : currentVal;
            options.unshift([displayName, currentVal]);
        }
    }

    return options.length > 0 ? options : [['-- Keine Uhr --', 'NONE']];
}

// Anzeige-Fix für Dropdowns
function applyProcessingDisplayOverride(dropdown) {
    dropdown.doClassValidation_ = function(newValue) {
        return newValue;
    };
    dropdown.getText = function() {
        let val = this.getValue();
        if (val && val !== 'NONE') {
            return val.startsWith('sw_') ? val.substring(3) : val;
        }
        return '-- Keine Uhr --';
    };
}


Blockly.defineBlocksWithJsonArray([
    // --- 1. SYSTEMZEIT ---
    {
        "type": "processing_time_millis",
        "message0": "Systemzeit in Millisekunden (ms)",
        "output": "Number",
        "colour": 290,
        "tooltip": "Gibt die Zeit seit dem Start des Processing-Programms in ms zurueck."
    },

    // --- 2. INTERVALL TIMER (Blinken etc.) ---
    {
        "type": "processing_timer_interval",
        "message0": "Alle %1 ms ausfuehren",
        "args0": [
            { 
                "type": "input_value", 
                "name": "INTERVAL",
                "check": "Number" 
            }
        ],
        "message1": "MACHE %1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Fuehrt den Code in regelmaessigen Abstaenden aus, ohne das Programm einzufrieren."
    },

    // --- 3. STOPPUHR: DEFINIEREN ---
    {
        "type": "processing_stopwatch_define",
        "message0": "Stoppuhr anlegen: %1",
        "args0": [
            {"type": "field_input", "name": "NAME", "text": "meineUhr"}
        ],
        "colour": 290,
        "tooltip": "Erstellt eine neue Stoppuhr fuer Processing."
    }
]);

// --- 4. STOPPUHR: STEUERN ---
Blockly.Blocks['processing_stopwatch_command'] = {
    init: function() {
        let nameDropdown = new Blockly.FieldDropdown(generateProcessingWatchOptions);
        applyProcessingDisplayOverride(nameDropdown);

        this.appendDummyInput()
            .appendField("Stoppuhr")
            .appendField(nameDropdown, "NAME")
            .appendField(new Blockly.FieldDropdown([
                ["starten", "start()"],
                ["stoppen", "stop()"],
                ["zuruecksetzen", "reset()"],
                ["neu starten", "restart()"]
            ]), "CMD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
    }
};

// --- 5. STOPPUHR: AUSLESEN ---
Blockly.Blocks['processing_stopwatch_read'] = {
    init: function() {
        let nameDropdown = new Blockly.FieldDropdown(generateProcessingWatchOptions);
        applyProcessingDisplayOverride(nameDropdown);

        this.appendDummyInput()
            .appendField("Zeit von")
            .appendField(nameDropdown, "NAME")
            .appendField("in")
            .appendField(new Blockly.FieldDropdown([
                ["ms", "MILLIS"], ["Sek.", "SECS"], ["Min.", "MINS"]
            ]), "UNIT");
        this.setOutput(true, "Number");
        this.setColour(290);
    }
};


// =======================================================================
// GENERATOREN FÜR JAVA / PROCESSING
// =======================================================================

ProcessingGenerator.forBlock['processing_time_millis'] = function(block) {
    return ['millis()', ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_timer_interval'] = function(block) {
    const interval = ProcessingGenerator.valueToCode(block, 'INTERVAL', ProcessingGenerator.ORDER_NONE) || '1000';
    const branch = ProcessingGenerator.statementToCode(block, 'DO');
    
    // Eindeutige ID für die Zeitstempel-Variable
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const timerVar = `lastTime_${safeId}`;

    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    // In Processing (Java) nutzen wir int für millis()
    ProcessingGenerator.globals_.add(`int ${timerVar} = 0;`);
    
    // Generierung des asynchronen Zeit-Checks
    let code = `  if (millis() - ${timerVar} >= ${interval}) {\n`;
    code += `    ${timerVar} = millis();\n`;
    code += `${branch}`;
    code += `  }\n`;
    
    return code;
};

// --- STOPPUHR GENERATOREN ---

ProcessingGenerator.forBlock['processing_stopwatch_define'] = function(block) {
    let rawName  = block.getFieldValue('NAME');
    let safeName = "sw_" + rawName.replace(/[^a-zA-Z0-9_]/g, '');
    if (safeName === 'sw_') return '';

    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    
    // Java-Klasse für die Stoppuhr injizieren (ähnlich wie C++, aber Java-Syntax)
    ProcessingGenerator.globals_.add(`
class BlockStopwatch {
  int startTime = 0;
  int elapsedTime = 0;
  boolean running = false;
  
  void start()   { if (!running) { startTime = millis(); running = true; } }
  void stop()    { if (running)  { elapsedTime += millis() - startTime; running = false; } }
  void reset()   { startTime = running ? millis() : 0; elapsedTime = 0; }
  void restart() { elapsedTime = 0; startTime = millis(); running = true; }
  int elapsed()  { return running ? (elapsedTime + millis() - startTime) : elapsedTime; }
}`);

    // Instanz der Uhr anlegen
    ProcessingGenerator.globals_.add(`BlockStopwatch ${safeName} = new BlockStopwatch();`);
    
    return '';
};

ProcessingGenerator.forBlock['processing_stopwatch_command'] = function(block) {
    const safeName = block.getFieldValue('NAME');
    const cmd      = block.getFieldValue('CMD');
    return (safeName === 'NONE') ? '// Keine Uhr gewählt\n' : `  ${safeName}.${cmd};\n`;
};

ProcessingGenerator.forBlock['processing_stopwatch_read'] = function(block) {
    const safeName = block.getFieldValue('NAME');
    const unit     = block.getFieldValue('UNIT');
    
    if (safeName === 'NONE') return ['0', ProcessingGenerator.ORDER_ATOMIC];
    
    let code = `${safeName}.elapsed()`;
    
    // Umwandlung in Sekunden oder Minuten (als float/double damit Kommastellen bleiben)
    if (unit === 'SECS') code = `(${code} / 1000.0)`;
    if (unit === 'MINS') code = `(${code} / 60000.0)`;
    
    return [code, ProcessingGenerator.ORDER_ATOMIC];
};