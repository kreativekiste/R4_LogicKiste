
// 1. DEFINIEREN (Den Blinker anlegen) 
Blockly.defineBlocksWithJsonArray([{
    "type": "ard_blinker_define",
    "message0": "Blinker anlegen: %1",
    "args0": [
        {"type": "field_input", "name": "VAR_NAME", "text": "meinBlinker"}
    ],
    "colour": 290,
    "tooltip": "Erstellt einen neuen Blinker-Namen. Dieser Name kann dann im Generator-Block ausgewählt werden."
}]);

// Gemeinsame Funktion für das Dropdown-Menü
function generateBlinkerOptions() {
    let options = [];
    let ws = this.getSourceBlock() ? this.getSourceBlock().workspace : null;

    // Flyout-Korrektur: Wenn der Block im Menü ist, echten Workspace nutzen
    if (ws && ws.isFlyout) ws = ws.targetWorkspace;
    if (!ws) ws = Blockly.getMainWorkspace();

    // Alle Blinker auf der Fläche suchen
    if (ws) {
        let blocks = ws.getBlocksByType('ard_blinker_define', false);
        blocks.forEach(b => {
            let rawName = b.getFieldValue('VAR_NAME');
            if (rawName) {
                let safeName = rawName.replace(/[^a-zA-Z0-9_]/g, '');
                options.push([rawName, safeName]);
            }
        });
    }

    // Lade-Fix: Zwingt den aktuell gespeicherten Wert in die Liste
    let currentVal = this.getValue();
    if (currentVal && currentVal !== 'NONE') {
        let exists = options.some(opt => opt[1] === currentVal);
        if (!exists) {
            options.unshift([currentVal, currentVal]);
        }
    }

    return options.length > 0 ? options : [['-- Kein Blinker --', 'NONE']];
}

// DER ULTIMATIVE ANZEIGE-FIX (Für den Blinker angepasst)
function applyBlinkerDisplayOverride(dropdown) {
    // 1. Zwingt Blockly, jeden geladenen Wert zu akzeptieren
    dropdown.doClassValidation_ = function(newValue) {
        return newValue;
    };
    
    // 2. Überschreibt die interne Text-Anzeige
    dropdown.getText = function() {
        let val = this.getValue();
        if (val && val !== 'NONE') {
            return val; // Beim Blinker haben wir kein Präfix, wir können den Namen direkt nutzen
        }
        return '-- Kein Blinker --';
    };
}

// 2. GENERATOR (Die Logik)
Blockly.Blocks['ard_blinker'] = {
    init: function() {
        let nameDropdown = new Blockly.FieldDropdown(generateBlinkerOptions);
        
        // Anzeige-Fix anwenden
        applyBlinkerDisplayOverride(nameDropdown);

        this.appendDummyInput()
            .appendField("Blinker-Logik für:")
            .appendField(nameDropdown, "VAR_NAME");
        this.appendValueInput("ON_TIME")
            .setCheck("Number")
            .appendField("AN-Zeit (ms):");
        this.appendValueInput("OFF_TIME")
            .setCheck("Number")
            .appendField("AUS-Zeit (ms):");
        this.setColour(290);
        this.setTooltip("Steuert die Zeiten für den ausgewählten Blinker. Dieser Block steht frei auf der Arbeitsfläche.");
    }
};

// 3. AUSLESEN (Der neue Block für IF-Bedingungen)
Blockly.Blocks['ard_blinker_get'] = {
    init: function() {
        let nameDropdown = new Blockly.FieldDropdown(generateBlinkerOptions);
        
        // Anzeige-Fix anwenden
        applyBlinkerDisplayOverride(nameDropdown);

        this.appendDummyInput()
            .appendField("Zustand von Blinker:")
            .appendField(nameDropdown, "VAR_NAME");
        this.setOutput(true, "Boolean");
        this.setColour(290);
        this.setTooltip("Gibt WAHR oder FALSCH zurück, je nachdem ob der Blinker gerade AN oder AUS ist.");
    }
};


// DEZENTRALER SCANNER

ArduinoGenerator.hardwareScanners['ard_blinker_define'] = function(block) {
    let varName = block.getFieldValue('VAR_NAME').replace(/[^a-zA-Z0-9_]/g, '');
    if (!varName) return;

    // 1. Die C++ Klassen-Definition
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

// GENERATOR LOGIK

ArduinoGenerator.forBlock['ard_blinker_define'] = function(block) { return ''; };
ArduinoGenerator.forBlock['ard_blinker'] = function(block) { return ''; };

// Generator für den neuen Auslese-Block
ArduinoGenerator.forBlock['ard_blinker_get'] = function(block) {
    let varName = block.getFieldValue('VAR_NAME');
    if (!varName || varName === 'NONE') return ['false', 0];
    
    // Gibt die boolesche Variable zurück
    return [varName, 0];
};