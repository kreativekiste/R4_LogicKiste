// ==========================================
// BAUTEIL: TASTER & EVENTS INKL. ZÄHLER
// ==========================================

// Zentrales Dropdown für die gängigen Pins (Sorgt für Fehlerfreiheit und Konsistenz)
const BUTTON_PIN_DROPDOWN = [
    ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"],
    ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
    ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"],
    ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], 
    ["A4", "A4"], ["A5", "A5"]
];

// ---------------------------------------------------------
// 1. DER HAUPTBLOCK: EVENTS (Einfach, Doppelt, Lang)
// ---------------------------------------------------------

Blockly.Blocks['ard_button_event'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Taster an PIN")
            .appendField(new Blockly.FieldDropdown(BUTTON_PIN_DROPDOWN), "PIN")
            .appendField("erkennt")
            .appendField(new Blockly.FieldDropdown([
                ["Einfachklick", "SINGLE"],
                ["Doppelklick", "DOUBLE"],
                ["Halten", "LONG"]
            ], this.updateShape_.bind(this)), "EVENT");
            
        this.setOutput(true, "Boolean");
        this.setColour(65); 
        this.setTooltip("Erkennt Klicks, Doppelklicks und langes Halten.");
        this.needsTime_ = false;
    },
    
    mutationToDom: function() {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('event_type', this.getFieldValue('EVENT'));
        return container;
    },
    
    domToMutation: function(xmlElement) {
        var eventType = xmlElement.getAttribute('event_type');
        this.updateShape_(eventType);
    },
    
    updateShape_: function(eventType) {
        var needsTime = (eventType === 'DOUBLE' || eventType === 'LONG');
        var hasTime = this.getInput('TIME');
        
        if (needsTime && !hasTime) {
            this.appendValueInput("TIME")
                .setCheck("Number")
                .appendField("Zeit (ms):");
        } else if (!needsTime && hasTime) {
            this.removeInput('TIME');
        }
        this.needsTime_ = needsTime;
    }
};

// ---------------------------------------------------------
// 2. DIE ZÄHLER-BLÖCKE (Auslesen, Setzen, Zurücksetzen)
// ---------------------------------------------------------

Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_button_get_counter",
        "message0": "Lese Klickzähler von PIN %1",
        "args0": [
            {
                "type": "field_dropdown", 
                "name": "PIN", 
                "options": BUTTON_PIN_DROPDOWN
            }
        ],
        "output": "Number",
        "colour": 30,
        "tooltip": "Gibt die aktuelle Anzahl der Klicks als Zahl zurück."
    },
    {
        "type": "ard_button_set_counter",
        "message0": "Setze Klickzähler von PIN %1 auf %2",
        "args0": [
            {
                "type": "field_dropdown", 
                "name": "PIN", 
                "options": BUTTON_PIN_DROPDOWN
            },
            {
                "type": "input_value",
                "name": "VAL",
                "check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 30,
        "tooltip": "Überschreibt den aktuellen Klickzähler mit einem neuen Wert."
    },
    {
        "type": "ard_button_reset_counter",
        "message0": "Setze Klickzähler von PIN %1 auf 0 zurück",
        "args0": [
            {
                "type": "field_dropdown", 
                "name": "PIN", 
                "options": BUTTON_PIN_DROPDOWN
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 30,
        "tooltip": "Setzt den Klickzähler sofort auf Null zurück."
    }
]);

// ---------------------------------------------------------
// 3. HARDWARE SCANNER (Zentral für alle Taster-Blöcke)
// ---------------------------------------------------------

// Diese Funktion wird aufgerufen, egal welchen der 4 Blöcke der Nutzer verwendet.
// Sie sorgt dafür, dass die Library geladen und das Objekt (z.B. btn_pin2) erzeugt wird.
const buttonHardwareScanner = function(block) {
    const pin = block.getFieldValue('PIN');
    
    ArduinoGenerator.usedPinsInput.add(pin);
    
    ArduinoGenerator.globals_.add(`#include <KK_ButtonHandler.h>`);
    ArduinoGenerator.globals_.add(`KK_ButtonHandler btn_pin${pin}(${pin});`);
    
    let setupCall = `  btn_pin${pin}.begin();\n`;
    if (!ArduinoGenerator.autoSetup_.includes(setupCall)) {
        ArduinoGenerator.autoSetup_.push(setupCall);
    }
    
    let updateCall = `  btn_pin${pin}.update();\n`;
    if (!ArduinoGenerator.autoLoop_.includes(updateCall)) {
        ArduinoGenerator.autoLoop_.push(updateCall);
    }
};

// Den Scanner an alle 4 Blöcke binden
ArduinoGenerator.hardwareScanners['ard_button_event'] = buttonHardwareScanner;
ArduinoGenerator.hardwareScanners['ard_button_get_counter'] = buttonHardwareScanner;
ArduinoGenerator.hardwareScanners['ard_button_set_counter'] = buttonHardwareScanner;
ArduinoGenerator.hardwareScanners['ard_button_reset_counter'] = buttonHardwareScanner;

// ---------------------------------------------------------
// 4. GENERATOR LOGIK FÜR DEN C++ CODE
// ---------------------------------------------------------

ArduinoGenerator.forBlock['ard_button_event'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const event = block.getFieldValue('EVENT');
    
    let timeCode = '300'; 
    if (block.needsTime_) {
        timeCode = ArduinoGenerator.valueToCode(block, 'TIME', 0) || '300';
    }
    
    if (event === 'SINGLE') {
        return [`btn_pin${pin}.wasPressed()`, 0];
        
    } else if (event === 'DOUBLE') {
        let gapCall = `  btn_pin${pin}.setDoubleClickGap(${timeCode});\n`;
        if (!ArduinoGenerator.autoLoop_.includes(gapCall)) {
            ArduinoGenerator.autoLoop_.unshift(gapCall); 
        }
        return [`btn_pin${pin}.wasDoubleClicked()`, 0];
        
    } else if (event === 'LONG') {
        return [`btn_pin${pin}.isLongPressed(${timeCode})`, 0];
    }
    
    return ['false', 0];
};

ArduinoGenerator.forBlock['ard_button_get_counter'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return [`btn_pin${pin}.getClickCount()`, 0];
};

ArduinoGenerator.forBlock['ard_button_set_counter'] = function(block) {
    const pin = block.getFieldValue('PIN');
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    return `  btn_pin${pin}.setClickCount(${val});\n`;
};

ArduinoGenerator.forBlock['ard_button_reset_counter'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return `  btn_pin${pin}.resetClickCount();\n`;
};