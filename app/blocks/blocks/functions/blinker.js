// ==========================================
// BAUTEIL: BLINKER GENERATOR (Modular & Sicher)
// ==========================================

// --- 1. DEFINIEREN (Den Blinker anlegen) ---
Blockly.defineBlocksWithJsonArray([{
    "type": "ard_blinker_define",
    "message0": "Blinker anlegen: %1",
    "args0": [
        {"type": "field_input", "name": "VAR_NAME", "text": "meinBlinker"}
    ],
    "colour": 290,
    "tooltip": "Erstellt einen neuen Blinker-Namen. Dieser Name kann dann im Generator-Block ausgewählt werden."
}]);

// --- 2. GENERATOR (Die Logik) ---
Blockly.Blocks['ard_blinker'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Blinker-Logik für:")
            .appendField(new Blockly.FieldDropdown(this.getBlinkerOptions.bind(this)), "VAR_NAME");
        this.appendValueInput("ON_TIME")
            .setCheck("Number")
            .appendField("AN-Zeit (ms):");
        this.appendValueInput("OFF_TIME")
            .setCheck("Number")
            .appendField("AUS-Zeit (ms):");
        this.setColour(290);
        this.setTooltip("Steuert die Zeiten für den ausgewählten Blinker. Dieser Block steht frei auf der Arbeitsfläche.");
    },
    getBlinkerOptions: function() {
        let options = [];
        let ws = this.workspace;
        
        // Anti-Crash-Fix: Wenn der Block im Menü (Flyout) ist, auf die echte Arbeitsfläche schauen
        if (ws && ws.isFlyout) {
            ws = ws.targetWorkspace;
        }

        if (ws) {
            let blocks = ws.getBlocksByType('ard_blinker_define');
            blocks.forEach(b => {
                let rawName = b.getFieldValue('VAR_NAME');
                let safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '');
                if (safeName) options.push([rawName, safeName]);
            });
        }

        // Dummy-Eintrag, falls wirklich gar kein Blinker existiert
        if (options.length === 0) {
            options.push(['-- Kein Blinker definiert --', 'NONE']);
        }

        // Anti-Crash-Fix 2: Den aktuellen Wert im Dropdown behalten, auch wenn der Define-Block fehlt
        let currentVal = this.getFieldValue ? this.getFieldValue('VAR_NAME') : null;
        if (currentVal && currentVal !== 'NONE') {
            let valueExists = options.some(opt => opt[1] === currentVal);
            if (!valueExists) {
                options.push([currentVal + ' (Fehlt!)', currentVal]);
            }
        }

        return options;
    }
};

// --- 3. AUSLESEN (Der neue Block für IF-Bedingungen) ---
Blockly.Blocks['ard_blinker_get'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Zustand von Blinker:")
            .appendField(new Blockly.FieldDropdown(this.getBlinkerOptions.bind(this)), "VAR_NAME");
        this.setOutput(true, "Boolean");
        this.setColour(290);
        this.setTooltip("Gibt WAHR oder FALSCH zurück, je nachdem ob der Blinker gerade AN oder AUS ist.");
    },
    // Nutzt exakt dieselbe sichere Dropdown-Logik wie oben
    getBlinkerOptions: Blockly.Blocks['ard_blinker'].getBlinkerOptions
};


// --- DEZENTRALER SCANNER ---

ArduinoGenerator.hardwareScanners['ard_blinker_define'] = function(block) {
    let varName = block.getFieldValue('VAR_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    if (!varName) return;

    // 1. Die C++ Klassen-Definition (nur 1x im Code)
    ArduinoGenerator.globals_.add(`
#ifndef BLOCKBLINKER_H
#define BLOCKBLINKER_H
class BlockBlinker {
  private:
    unsigned long t = 0;
  public:
    bool state = false;
    void update(unsigned long onT, unsigned long offT) {
      unsigned long current = millis();
      if (state) {
        if (current - t >= onT) { 
          t = current;
          state = false; 
        }
      } else {
        if (current - t >= offT) { 
          t = current;
          state = true; 
        }
      }
    }
};
#endif`);

    // 2. Nutzer-Variable und Objekt-Instanz anmelden
    ArduinoGenerator.customVariables.set(varName, 'bool');
    ArduinoGenerator.globals_.add(`BlockBlinker blinker_obj_${varName};`);
};

ArduinoGenerator.hardwareScanners['ard_blinker'] = function(block) {
    let varName = block.getFieldValue('VAR_NAME');
    if (!varName || varName === 'NONE') return;

    const onTime  = ArduinoGenerator.valueToCode(block, 'ON_TIME', 0) || '1000';
    const offTime = ArduinoGenerator.valueToCode(block, 'OFF_TIME', 0) || '500';

    let loopCode = `  // --- Blinker-Update: ${varName} ---\n`;
    loopCode += `  blinker_obj_${varName}.update(${onTime}, ${offTime});\n`;
    loopCode += `  ${varName} = blinker_obj_${varName}.state;\n`;
    
    if (ArduinoGenerator.autoLoop_) {
        ArduinoGenerator.autoLoop_.push(loopCode);
    }
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['ard_blinker_define'] = function(block) { return ''; };
ArduinoGenerator.forBlock['ard_blinker'] = function(block) { return ''; };

// Generator für den neuen Auslese-Block
ArduinoGenerator.forBlock['ard_blinker_get'] = function(block) {
    let varName = block.getFieldValue('VAR_NAME');
    if (!varName || varName === 'NONE') return ['false', 0];
    
    // Gibt die boolesche Variable zurück
    return [varName, 0];
};