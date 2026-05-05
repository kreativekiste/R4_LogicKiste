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
                let n = b.getFieldValue('VAR_NAME');
                if (n) options.push([n, n.replace(/[^a-zA-Z0-9_]/g, '')]);
            });
        }
        return options.length > 0 ? options : [['-- Kein Blinker definiert --', 'NONE']];
    }
};

// --- DEZENTRALER SCANNER ---

// Der Definition-Block kümmert sich um die Klasse und die Variable
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
          t = current; // Korrigiert für robuste Dynamik
          state = false; 
        }
      } else {
        if (current - t >= offT) { 
          t = current; // Korrigiert für robuste Dynamik
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

// Der Logik-Block kümmert sich um den Code in der loop()
ArduinoGenerator.hardwareScanners['ard_blinker'] = function(block) {
    let varName = block.getFieldValue('VAR_NAME');
    if (varName === 'NONE') return;

    const onTime  = ArduinoGenerator.valueToCode(block, 'ON_TIME', 0) || '1000';
    const offTime = ArduinoGenerator.valueToCode(block, 'OFF_TIME', 0) || '500';

    let loopCode = `  // --- Blinker-Update: ${varName} ---\n`;
    loopCode += `  blinker_obj_${varName}.update(${onTime}, ${offTime});\n`;
    loopCode += `  ${varName} = blinker_obj_${varName}.state;\n`;
    
    // KORREKTUR: .push() statt .add(), da autoLoop_ ein Array ist
    if (ArduinoGenerator.autoLoop_) {
        ArduinoGenerator.autoLoop_.push(loopCode);
    }
};

// Generatoren für die Blöcke (da sie frei stehen, geben sie keinen direkten Code zurück)
ArduinoGenerator.forBlock['ard_blinker_define'] = function(block) { return ''; };
ArduinoGenerator.forBlock['ard_blinker'] = function(block) { return ''; };