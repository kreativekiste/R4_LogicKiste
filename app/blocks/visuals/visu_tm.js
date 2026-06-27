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
        "type": "ard_visu_tm1637_brightn",
        "message0": "TM1637 Helligkeit auf %1 setzen (0-7)",
        "args0": [
            { "type": "field_number", "name": "BRIGHTNESS", "value": 7, "min": 0, "max": 7 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Ändert die Helligkeit des Displays. 0 ist dunkel, 7 ist sehr hell."
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


    // 2. TM1638 MODELL 1 (8 LEDs & 8 Tasten)
    {
        "type": "ard_visu_tm1638_setup_mod1",
        "message0": "Setup TM1638 (Modell 1) STB: %1 CLK: %2 DIO: %3",
        "args0": [
            { "type": "field_number", "name": "STB", "value": 4, "min": 0, "max": 53 },
            { "type": "field_number", "name": "CLK", "value": 5, "min": 0, "max": 53 },
            { "type": "field_number", "name": "DIO", "value": 6, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Startet das TM1638 Modell 1. Gehört ins SETUP!"
    },
    {
        "type": "ard_visu_tm1638_brightn_mod1",
        "message0": "TM1638 (Modell 1) Helligkeit auf %1 setzen (0-7)",
        "args0": [
            { "type": "field_number", "name": "BRIGHTNESS", "value": 2, "min": 0, "max": 7 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Ändert die Helligkeit der LEDs und Siebensegment-Anzeigen (0-7)."
    },
    {
        "type": "ard_visu_tm1638_print_mod1",
        "message0": "TM1638 (Mod 1) zeige Zahl: %1 Führende Nullen: %2 Ausrichtung: %3",
        "args0": [
            { "type": "input_value", "name": "NUM", "check": "Number" },
            { "type": "field_dropdown", "name": "LEAD_ZERO", "options": [
                ["aus", "false"],
                ["ein", "true"]
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
        "tooltip": "Zeigt eine Zahl auf dem Modell 1 an. Ausrichtung und führende Nullen können angepasst werden."
    },
    // LED BLOCK Feste Zahl
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
        "tooltip": "Schaltet eine spezifische LED (1-8) über dem Display an oder aus."
    },
    // LED BLOCK Mit Variable/Andockpunkt
    {
        "type": "ard_visu_tm1638_led_var",
        "message0": "TM1638 LED Nr. %1 schalten auf %2",
        "args0": [
            { "type": "input_value", "name": "LED_NUM", "check": "Number" },
            { "type": "input_value", "name": "STATE", "check": "Boolean" }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Schaltet eine LED an oder aus. Die LED-Nummer (1-8) kann über eine Variable gesteuert werden."
    },
    {
        "type": "ard_visu_tm1638_read_key_mod1",
        "message0": "Lese TM1638 (Mod 1) Taste → speichere in %1",
        "args0": [
            { "type": "field_variable", "name": "VAR", "variable": "taste" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Liest die aktuell gedrückte Taste (0 = keine, 1–8) und speichert den Wert in der Variable."
    },
    {
        "type": "ard_visu_tm1638_key_pressed_mod1",
        "message0": "TM1638 (Mod 1) Taste %1 gedrückt?",
        "args0": [
            { "type": "field_number", "name": "KEY_NUM", "value": 1, "min": 1, "max": 8 }
        ],
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn genau diese Taste (1–8) gerade gedrückt ist. Passend für WENN-Blöcke."
    },
    {
        "type": "ard_visu_tm1638_any_key_mod1",
        "message0": "TM1638 (Mod 1) irgendeine Taste gedrückt?",
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn mindestens eine der 8 Tasten gedrückt ist."
    },


    // 3. TM1638 MODELL 2 (16 Tasten)
    {
        "type": "ard_visu_tm1638_setup",
        "message0": "Setup TM1638 (Modell 2) STB: %1 CLK: %2 DIO: %3",
        "args0": [
            { "type": "field_number", "name": "STB", "value": 4, "min": 0, "max": 53 },
            { "type": "field_number", "name": "CLK", "value": 5, "min": 0, "max": 53 },
            { "type": "field_number", "name": "DIO", "value": 6, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Startet das TM1638 Modell 2. Gehört ins SETUP!"
    },
    {
        "type": "ard_visu_tm1638_brightn",
        "message0": "TM1638 (Modell 2) Helligkeit auf %1 setzen (0-7)",
        "args0": [
            { "type": "field_number", "name": "BRIGHTNESS", "value": 2, "min": 0, "max": 7 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Ändert die Helligkeit des Displays (0-7)."
    },
    {
        "type": "ard_visu_tm1638_print",
        "message0": "TM1638 (Mod 2) zeige Zahl: %1 Punkte: %2 Führende Nullen: %3 Ausrichtung: %4",
        "args0": [
            { "type": "input_value", "name": "NUM", "check": "Number" },
            { "type": "field_number", "name": "DOTS", "value": 0, "min": 0, "max": 255 },
            { "type": "field_dropdown", "name": "LEAD_ZERO", "options": [
                ["aus", "false"],
                ["ein", "true"]
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
        "tooltip": "Zeigt einen Wert auf dem Modell 2 an. Punkte: 0 bis 255 (z. B. 255 = alle an)."
    },
    {
        "type": "ard_visu_tm1638_read_key",
        "message0": "Lese TM1638 (Mod 2) Taste → speichere in %1",
        "args0": [
            { "type": "field_variable", "name": "VAR", "variable": "taste" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Liest die aktuell gedrückte Taste (0 = keine, 1–16) und speichert den Wert in der Variablen."
    },
    {
        "type": "ard_visu_tm1638_key_pressed",
        "message0": "TM1638 (Mod 2) Taste %1 gedrückt?",
        "args0": [
            { "type": "field_number", "name": "KEY_NUM", "value": 1, "min": 1, "max": 16 }
        ],
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn genau diese Taste (1–16) gerade gedrückt ist."
    },
    {
        "type": "ard_visu_tm1638_any_key",
        "message0": "TM1638 (Mod 2) irgendeine Taste gedrückt?",
        "output": "Boolean",
        "colour": 45,
        "tooltip": "Gibt WAHR zurück, wenn mindestens eine der 16 Tasten gedrückt ist."
    }
]);