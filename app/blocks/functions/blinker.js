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
        if (this.workspace) {
            let blocks = this.workspace.getBlocksByType('ard_blinker_define');
            blocks.forEach(b => {
                let rawName = b.getFieldValue('VAR_NAME');
                // FIX: Bereinigung hier identisch zum Scanner → konsistenter Name
                let safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '');
                if (safeName) options.push([rawName, safeName]);
            });
        }
        return options.length > 0 ? options : [['-- Kein Blinker definiert --', 'NONE']];
    }
};

// --- DEZENTRALER SCANNER ---

ArduinoGenerator.hardwareScanners['ard_blinker_define'] = function(block) {
    // FIX: Dropdown-Value direkt nutzen (bereits bereinigt durch getBlinkerOptions)
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
    // FIX: Dropdown-Value direkt nutzen (bereits bereinigt)
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

ArduinoGenerator.forBlock['ard_blinker_define'] = function(block) { return ''; };
ArduinoGenerator.forBlock['ard_blinker'] = function(block) { return ''; };
