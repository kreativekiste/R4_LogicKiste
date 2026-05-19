
Blockly.defineBlocksWithJsonArray([
    // 1. TM1637 (Kleines 4-Digit Display)
    {
        "type": "ard_visu_tm1637_setup",
        "message0": "Setup 4-Digit (TM1637) CLK: %1 DIO: %2",
        "args0": [
            { "type": "field_number", "name": "CLK", "value": 2, "min": 0, "max": 53 },
            { "type": "field_number", "name": "DIO", "value": 3, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Startet das kleine 4-stellige Display. Gehört ins SETUP!"
    },
    {
        "type": "ard_visu_tm1637_print",
        "message0": "TM1637 zeige Zahl: %1 Doppelpunkt: %2",
        "args0": [
            { "type": "input_value", "name": "NUM", "check": "Number" },
            { "type": "field_checkbox", "name": "COLON", "checked": false }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Zeigt eine Zahl auf dem TM1637 Display an. Mit Option für den Doppelpunkt in der Mitte."
    },

    // 2. TM1638 (Großes 8-Digit Pult mit LEDs & Tasten)
    {
        "type": "ard_visu_tm1638_setup",
        "message0": "Setup 8-Digit Pult (TM1638) STB: %1 CLK: %2 DIO: %3",
        "args0": [
            { "type": "field_number", "name": "STB", "value": 4, "min": 0, "max": 53 },
            { "type": "field_number", "name": "CLK", "value": 5, "min": 0, "max": 53 },
            { "type": "field_number", "name": "DIO", "value": 6, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Startet das TM1638 Modul. Gehört ins SETUP!"
    },
    {
        "type": "ard_visu_tm1638_print",
        "message0": "TM %1 Punkte: %2 Führende Nullen: %3 Ausrichtung: %4",
        "args0": [
            { "type": "input_value", "name": "NUM", "check": "Number" },
            { "type": "field_number", "name": "DOTS", "value": 0, "min": 0, "max": 255 },
            { "type": "field_dropdown", "name": "LEAD_ZERO", "options": [
                ["Falsch", "false"],
                ["Wahr", "true"]
            ]},
            { "type": "field_dropdown", "name": "ALIGN", "options": [
                ["Rechts", "TMAlignTextRight"],
                ["Links", "TMAlignTextLeft"]
            ]}
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Zeigt einen Wert auf dem TM-Display an. Punkte: 0 bis 255 (z. B. 255 = alle an)."
    },
    {
        "type": "ard_visu_tm1638_led",
        "message0": "TM1638 LED Nr. %1 schalten auf %2",
        "args0": [
            { "type": "field_number", "name": "LED_NUM", "value": 1, "min": 1, "max": 8 },
            { "type": "input_value", "name": "STATE", "check": "Boolean" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Schaltet eine der 8 LEDs über dem Display an oder aus."
    },

    // 3. TM1638 Taster-Blöcke (3 Varianten)

    // Block 1: Taste lesen und in Variable speichern
    {
        "type": "ard_visu_tm1638_read_key",
        "message0": "Lese TM1638 Taste → speichere in %1",
        "args0": [
            { "type": "field_variable", "name": "VAR", "variable": "taste" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Liest die aktuell gedrückte Taste (0 = keine, 1–16) und speichert den Wert in der gewählten Variable."
    },

    // Block 2: Wurde genau Taste X gedrückt?
    {
        "type": "ard_visu_tm1638_key_pressed",
        "message0": "TM1638 Taste %1 gedrückt?",
        "args0": [
            { "type": "field_number", "name": "KEY_NUM", "value": 1, "min": 1, "max": 16 }
        ],
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn genau diese Taste (1–16) gerade gedrückt ist. Passend für WENN-Blöcke."
    },

    // Block 3: Irgendeine Taste gedrückt?
    {
        "type": "ard_visu_tm1638_any_key",
        "message0": "TM1638 irgendeine Taste gedrückt?",
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn mindestens eine der 16 Tasten gedrückt ist."
    }
]);