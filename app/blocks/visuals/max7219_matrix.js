
Blockly.defineBlocksWithJsonArray([
    // 1. SETUP
    {
        "type": "max7219_setup",
        "message0": "Setup Dot-Matrix | CS Pin: %1 | Module: %2",
        "args0": [
            {"type": "field_input", "name": "CS", "text": "10"},
            {"type": "field_number", "name": "NUM", "value": 4, "min": 1}
        ],
        "message1": "Helligkeit (0-15): %1",
        "args1": [
            {"type": "field_number", "name": "INTENSITY", "value": 5, "min": 0, "max": 15}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Initialisiert die Matrix. SPI-Standard: DIN an 11, CLK an 13."
    },

    // 2. TEXT
    {
        "type": "max7219_print",
        "message0": "Matrix statischer Text: %1 | Ausrichtung: %2",
        "args0": [
            {"type": "input_value", "name": "TEXT"},
            {
                "type": "field_dropdown", "name": "ALIGN", "options": [
                    ["Links", "PA_LEFT"], ["Mitte", "PA_CENTER"], ["Rechts", "PA_RIGHT"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Zeigt statischen Text auf der Matrix an. Für Bewegung den Animations-Block nutzen!"
    },

    // 3. EINZEL-PIXEL
    {
        "type": "max7219_set_pixel",
        "message0": "Matrix Pixel X: %1 Y: %2 Status: %3",
        "args0": [
            {"type": "input_value", "name": "X", "check": "Number"},
            {"type": "input_value", "name": "Y", "check": "Number"},
            {"type": "field_dropdown", "name": "STATE", "options": [["AN", "true"], ["AUS", "false"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Schaltet einen einzelnen LED-Punkt."
    },

    // 4. PIXEL-LISTE
    {
        "type": "max7219_set_list",
        "message0": "Matrix Pixel-Liste: %1 Status: %2",
        "args0": [
            {"type": "field_input", "name": "LIST", "text": "0, 1, 2, 15"},
            {"type": "field_dropdown", "name": "STATE", "options": [["AN", "true"], ["AUS", "false"]]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Schaltet eine Liste von IDs (0 bis Max) gleichzeitig."
    },

    // 5. AKTIONEN
    {
        "type": "max7219_control",
        "message0": "Matrix Aktion: %1",
        "args0": [
            {
                "type": "field_dropdown", "name": "ACTION", "options": [
                    ["Alles löschen", "displayClear()"],
                    ["Invertieren", "setInvert(true)"],
                    ["Normalmodus", "setInvert(false)"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Steuert globale Anzeige-Parameter."
    },

    // 6. ANIMATION / LAUFSCHRIFT
    {
        "type": "max7219_animation",
        "message0": "Matrix Animation | Ausrichtung: %1",
        "args0": [
            {
                "type": "field_dropdown", "name": "ALIGN", "options": [
                    ["Links", "PA_LEFT"], ["Mitte", "PA_CENTER"], ["Rechts", "PA_RIGHT"]
                ]
            }
        ],
        "message1": "Text: %1",
        "args1": [{"type": "input_value", "name": "TEXT"}],
        "message2": "Tempo: %1 Pause (ms): %2",
        "args2": [
            {"type": "input_value", "name": "SPEED", "check": "Number"},
            {"type": "input_value", "name": "PAUSE", "check": "Number"}
        ],
        "message3": "Effekt REIN: %1 RAUS: %2",
        "args3": [
            {
                "type": "field_dropdown", "name": "EFF_IN", "options": [
                    ["Scroll Links", "PA_SCROLL_LEFT"], ["Scroll Rechts", "PA_SCROLL_RIGHT"],
                    ["Scroll Hoch", "PA_SCROLL_UP"], ["Scroll Runter", "PA_SCROLL_DOWN"],
                    ["Pacman", "PA_PACMAN"], ["Überblenden (Fade)", "PA_FADE"],
                    ["Wischen (Wipe)", "PA_WIPE"], ["Auflösen (Dissolve)", "PA_DISSOLVE"],
                    ["Schneiden (Slice)", "PA_SLICE"], ["Zufall", "PA_RANDOM"]
                ]
            },
            {
                "type": "field_dropdown", "name": "EFF_OUT", "options": [
                    ["Scroll Links", "PA_SCROLL_LEFT"], ["Scroll Rechts", "PA_SCROLL_RIGHT"],
                    ["Scroll Hoch", "PA_SCROLL_UP"], ["Scroll Runter", "PA_SCROLL_DOWN"],
                    ["Pacman", "PA_PACMAN"], ["Überblenden (Fade)", "PA_FADE"],
                    ["Wischen (Wipe)", "PA_WIPE"], ["Auflösen (Dissolve)", "PA_DISSOLVE"],
                    ["Schneiden (Slice)", "PA_SLICE"], ["Zufall", "PA_RANDOM"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Erstellt eine dynamische Laufschrift oder Animation. Muss zwingend in den Loop!"
    },

    // 7. HELLIGKEIT ÄNDERN
    {
        "type": "max7219_set_intensity",
        "message0": "Matrix Helligkeit setzen (0-15): %1",
        "args0": [
            {"type": "input_value", "name": "INTENSITY", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 140,
        "tooltip": "Ändert die Helligkeit im laufenden Betrieb (0 = dunkel, 15 = max)."
    }
]);

// DEZENTRALER SCANNER
ArduinoGenerator.hardwareScanners['max7219_setup'] = function(block) {
    const cs = block.getFieldValue('CS').trim(); // FIX A3: .trim() ergänzt
    const num = block.getFieldValue('NUM');
    const intensity = block.getFieldValue('INTENSITY');
    ArduinoGenerator.mx_modules = parseInt(num);
    if (!ArduinoGenerator.includes_.has('#include <MD_Parola.h>')) {

        ArduinoGenerator.includes_.add('#include <MD_Parola.h>');
        ArduinoGenerator.includes_.add('#include <MD_MAX72xx.h>');
        ArduinoGenerator.includes_.add('#include <SPI.h>');

        ArduinoGenerator.globals_.add(`const int MAX7219_CS = ${cs};`);
        ArduinoGenerator.globals_.add(`const int MAX7219_NUM = ${num};`);

        ArduinoGenerator.globals_.add(`MD_Parola P = MD_Parola(MD_MAX72XX::FC16_HW, MAX7219_CS, MAX7219_NUM);`);
        
        ArduinoGenerator.autoSetup_.push(`  P.begin();\n  P.setIntensity(${intensity});\n  P.displayClear();\n`);
    }
};

// GENERATOR LOGIK

ArduinoGenerator.forBlock['max7219_setup'] = function(block) {
    return ''; // Setup wird komplett im Scanner erledigt
};

ArduinoGenerator.forBlock['max7219_print'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '" "';
    const align = block.getFieldValue('ALIGN');
    return `  P.setTextAlignment(${align});\n  P.print(${text});\n`;
};

ArduinoGenerator.forBlock['max7219_set_pixel'] = function(block) {
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const state = block.getFieldValue('STATE');
    return `  P.getGraphicObject()->setPoint(${y}, ${x}, ${state});\n`;
};

ArduinoGenerator.forBlock['max7219_set_list'] = function(block) {
    const listStr = block.getFieldValue('LIST');
    const state = block.getFieldValue('STATE');
    const modules = ArduinoGenerator.mx_modules || 4;
    const totalWidth = modules * 8;

    const ids = listStr.split(',').map(p => p.trim()).filter(p => p !== '');
    let code = `  // --- Matrix Gruppe schalten ---\n`;
    
    ids.forEach(id => {
        const val = parseInt(id);
        if (!isNaN(val)) {
            const row = Math.floor(val / totalWidth);
            const col = val % totalWidth;
            code += `  P.getGraphicObject()->setPoint(${row}, ${col}, ${state});\n`;
        }
    });
    return code;
};

ArduinoGenerator.forBlock['max7219_control'] = function(block) {
    const action = block.getFieldValue('ACTION');
    return `  P.${action};\n`;
};

ArduinoGenerator.forBlock['max7219_animation'] = function(block) {
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const speed = ArduinoGenerator.valueToCode(block, 'SPEED', 0) || '50';
    const pause = ArduinoGenerator.valueToCode(block, 'PAUSE', 0) || '1000';
    const align = block.getFieldValue('ALIGN');
    const effIn = block.getFieldValue('EFF_IN');
    const effOut = block.getFieldValue('EFF_OUT');
    const safeId = block.id.replace(/[^a-zA-Z0-9]/g, '');
    const strVar = `t_str_${safeId}`;
    const charVar = `t_char_${safeId}`;
    
    let code = `  // --- Matrix Animation ---\n`;
    code += `  String ${strVar} = String(${text});\n`;
    code += `  static char ${charVar}[60];\n`;
    code += `  ${strVar}.toCharArray(${charVar}, 60);\n`;
    code += `  if (P.displayAnimate()) {\n`;
    code += `    P.displayText(${charVar}, ${align}, ${speed}, ${pause}, ${effIn}, ${effOut});\n`;
    code += `    P.displayReset();\n`;
    code += `  }\n`;
    
    return code;
};

ArduinoGenerator.forBlock['max7219_set_intensity'] = function(block) {
    const intensity = ArduinoGenerator.valueToCode(block, 'INTENSITY', 0) || '5';
    return `  P.setIntensity(${intensity});\n`;
};