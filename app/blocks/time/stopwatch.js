// Arduino R4_LogicKiste // © kreativekiste.de // 2026-05-19 // v9.1

// 1. DEFINIEREN (Die Uhr anlegen)
Blockly.defineBlocksWithJsonArray([{
    "type": "stopwatch_define",
    "message0": "Stoppuhr anlegen: %1",
    "args0": [
        {"type": "field_input", "name": "NAME", "text": "meineUhr"}
    ],
    "colour": 290,
    "tooltip": "Erstellt eine neue Stoppuhr. Der Name erscheint dann in den anderen Stoppuhr-Blöcken."
}]);

// Gemeinsame Funktion für das Dropdown-Menü
function generateWatchOptions() {
    let options = [];
    let ws = this.getSourceBlock() ? this.getSourceBlock().workspace : null;

    if (ws && ws.isFlyout) ws = ws.targetWorkspace;
    if (!ws) ws = Blockly.getMainWorkspace();

    if (ws) {
        let blocks = ws.getBlocksByType('stopwatch_define', false);
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

// DER ULTIMATIVE ANZEIGE-FIX
function applyDisplayOverride(dropdown) {
    // 1. Zwingt Blockly, jeden geladenen Wert zu akzeptieren
    dropdown.doClassValidation_ = function(newValue) {
        return newValue;
    };
    
    // 2. Überschreibt die interne Blockly-Funktion für die grafische Text-Anzeige!
    dropdown.getText = function() {
        let val = this.getValue();
        if (val && val !== 'NONE') {
            // Schneidet 'sw_' ab und zeigt direkt den reinen Namen an
            return val.startsWith('sw_') ? val.substring(3) : val;
        }
        return '-- Keine Uhr --';
    };
}

// 2. STEUERN (Start/Stop/etc)
Blockly.Blocks['stopwatch_command'] = {
    init: function() {
        let nameDropdown = new Blockly.FieldDropdown(generateWatchOptions);
        
        // Anzeige-Fix anwenden
        applyDisplayOverride(nameDropdown);

        this.appendDummyInput()
            .appendField("Stoppuhr")
            .appendField(nameDropdown, "NAME")
            .appendField(new Blockly.FieldDropdown([
                ["starten", "start()"],
                ["stoppen", "stop()"],
                ["zurücksetzen", "reset()"],
                ["neu starten", "restart()"]
            ]), "CMD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
    }
};

// 3. AUSLESEN
Blockly.Blocks['stopwatch_read'] = {
    init: function() {
        let nameDropdown = new Blockly.FieldDropdown(generateWatchOptions);
        
        // Anzeige-Fix anwenden
        applyDisplayOverride(nameDropdown);

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

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['stopwatch_define'] = function(block) {
    let rawName  = block.getFieldValue('NAME');
    let safeName = "sw_" + rawName.replace(/[^a-zA-Z0-9_]/g, '');
    if (safeName === 'sw_') return;

    ArduinoGenerator.globals_.add(`
#ifndef BLOCKSTOPWATCH_H
#define BLOCKSTOPWATCH_H
class BlockStopwatch {
  private:
    unsigned long startTime = 0;
    unsigned long elapsedTime = 0;
    bool running = false;
  public:
    void start()   { if (!running) { startTime = millis(); running = true; } }
    void stop()    { if (running)  { elapsedTime += millis() - startTime; running = false; } }
    void reset()   { startTime = running ? millis() : 0; elapsedTime = 0; }
    void restart() { elapsedTime = 0; startTime = millis(); running = true; }
    unsigned long elapsed() { return running ? (elapsedTime + millis() - startTime) : elapsedTime; }
};
#endif`);

    ArduinoGenerator.globals_.add(`BlockStopwatch ${safeName};`);
};

// GENERATOR
ArduinoGenerator.forBlock['stopwatch_define']  = function(block) { return ''; };

ArduinoGenerator.forBlock['stopwatch_command'] = function(block) {
    const safeName = block.getFieldValue('NAME');
    const cmd      = block.getFieldValue('CMD');
    return (safeName === 'NONE') ? '// Keine Uhr gewählt\n' : `  ${safeName}.${cmd};\n`;
};

ArduinoGenerator.forBlock['stopwatch_read'] = function(block) {
    const safeName = block.getFieldValue('NAME');
    const unit     = block.getFieldValue('UNIT');
    if (safeName === 'NONE') return ['0', 0];
    let code = `${safeName}.elapsed()`;
    if (unit === 'SECS') code = `(${code} / 1000.0)`;
    if (unit === 'MINS') code = `(${code} / 60000.0)`;
    return [code, 0];
};