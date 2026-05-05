// ==========================================
// BAUTEILE: MAX7219 DOT-MATRIX (MD_Parola)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. SETUP ---
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

    // --- 2. TEXT ---
    {
        "type": "max7219_print",
        "message0": "Matrix Text: %1 | Ausrichtung: %2",
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
        "tooltip": "Zeigt statischen Text auf der Matrix an."
    },

    // --- 3. EINZEL-PIXEL ---
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

    // --- 4. PIXEL-LISTE ---
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

    // --- 5. AKTIONEN ---
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
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['max7219_setup'] = function(block) {
    const cs = block.getFieldValue('CS');
    const num = block.getFieldValue('NUM');
    const intensity = block.getFieldValue('INTENSITY');

    // 1. Pin beim Core anmelden (Sichert pinMode und Variable)
    ArduinoGenerator.usedPinsOutput.add(cs);
    
    // Zwischenspeichern der Modulanzahl für die Listen-Berechnung
    ArduinoGenerator.mx_modules = parseInt(num);

    // 2. Setup-Wächter: Nur einmal C++ Code generieren, egal wie viele Setup-Blöcke da sind!
    if (!ArduinoGenerator.initializedParola) {
        ArduinoGenerator.initializedParola = true;

        // Bibliotheken einzeln registrieren, um JS-Fehler zu vermeiden
        ArduinoGenerator.includes_.add('#include <MD_Parola.h>');
        ArduinoGenerator.includes_.add('#include <MD_MAX72xx.h>');
        ArduinoGenerator.includes_.add('#include <SPI.h>');

        // Hardware-Objekt global anlegen (Nutzt die vom Core erzeugte Variable pinX)
        ArduinoGenerator.globals_.add(`MD_Parola P = MD_Parola(MD_MAX72XX::FC16_HW, pin${cs}, ${num});`);
        
        // Setup-Code
        ArduinoGenerator.autoSetup_.push(`  P.begin();\n  P.setIntensity(${intensity});\n  P.displayClear();`);
    }
};

// --- GENERATOR LOGIK ---

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
    // MD_Parola Grafik-Zugriff: setPoint(row, col, state)
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