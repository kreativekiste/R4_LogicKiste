

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

// 2. STEUERN (Start/Stop/etc)
Blockly.Blocks['stopwatch_command'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Stoppuhr")
            .appendField(new Blockly.FieldDropdown(this.getWatchOptions.bind(this)), "NAME")
            .appendField(new Blockly.FieldDropdown([
                ["starten", "start()"],
                ["stoppen", "stop()"],
                ["zurücksetzen", "reset()"],
                ["neu starten", "restart()"]
            ]), "CMD");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
    },
    getWatchOptions: function() {
        let options = [];
        if (this.workspace) {
            let blocks = this.workspace.getBlocksByType('stopwatch_define');
            blocks.forEach(b => {
                let n = b.getFieldValue('NAME');
                if (n) {
                    let safeName = "sw_" + n.replace(/[^a-zA-Z0-9_]/g, '');
                    options.push([n, safeName]);
                }
            });
        }
        return options.length > 0 ? options : [['-- Keine Uhr --', 'NONE']];
    }
};

// 3. AUSLESEN
Blockly.Blocks['stopwatch_read'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Zeit von")
            .appendField(new Blockly.FieldDropdown(this.getWatchOptions.bind(this)), "NAME")
            .appendField("in")
            .appendField(new Blockly.FieldDropdown([
                ["ms", "MILLIS"], ["Sek.", "SECS"], ["Min.", "MINS"]
            ]), "UNIT");
        this.setOutput(true, "Number");
        this.setColour(290);
    },
    getWatchOptions: Blockly.Blocks['stopwatch_command'].getWatchOptions
};

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['stopwatch_define'] = function(block) {
    let rawName = block.getFieldValue('NAME');
    let safeName = "sw_" + rawName.replace(/[^a-zA-Z0-9_]/g, '');
    
    if (safeName === 'sw_') return;

    // Klasse einmalig definieren
    ArduinoGenerator.globals_.add(`
#ifndef BLOCKSTOPWATCH_H
#define BLOCKSTOPWATCH_H
class BlockStopwatch {
  private:
    unsigned long startTime = 0;
    unsigned long elapsedTime = 0;
    bool running = false;
  public:
    void start() { if (!running) { startTime = millis(); running = true; } }
    void stop() { if (running) { elapsedTime += millis() - startTime; running = false; } }
    void reset() { startTime = running ? millis() : 0; elapsedTime = 0; }
    void restart() { elapsedTime = 0; startTime = millis(); running = true; }
    unsigned long elapsed() { return running ? (elapsedTime + millis() - startTime) : elapsedTime; }
};
#endif`);

    ArduinoGenerator.globals_.add(`BlockStopwatch ${safeName};`);
};

// GENERATOR
ArduinoGenerator.forBlock['stopwatch_define'] = function(block) { return ''; };

ArduinoGenerator.forBlock['stopwatch_command'] = function(block) {
    const safeName = block.getFieldValue('NAME');
    const cmd = block.getFieldValue('CMD');
    
    return (safeName === 'NONE') ? '// Keine Uhr gewählt\n' : `  ${safeName}.${cmd};\n`;
};

ArduinoGenerator.forBlock['stopwatch_read'] = function(block) {
    const safeName = block.getFieldValue('NAME');
    const unit = block.getFieldValue('UNIT');
    
    if (safeName === 'NONE') return ['0', 0];

    let code = `${safeName}.elapsed()`;
    if (unit === 'SECS') code = `(${code} / 1000.0)`;
    if (unit === 'MINS') code = `(${code} / 60000.0)`;
    
    return [code, 0];
};