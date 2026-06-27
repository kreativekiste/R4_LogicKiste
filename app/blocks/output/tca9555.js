// --- GEMEINSAME DROPDOWNS ---
const TCA_ADDRESSES = [
    ["0x20 (Standard)", "0x20"], ["0x21", "0x21"], ["0x22", "0x22"], ["0x23", "0x23"], 
    ["0x24", "0x24"], ["0x25", "0x25"], ["0x26", "0x26"], ["0x27", "0x27"]
];
const TCA_PORTS = [ ["0", "0"], ["1", "1"] ];
const TCA_PINS = [
    ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], 
    ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"]
];

// --- BLOCK DEFINITIONEN ---
Blockly.defineBlocksWithJsonArray([
    // 1. Einzelnen Pin Senden
    {
        "type": "tca_write_pin",
        "message0": "🎛️ TCA Senden | Adresse %1 Port %2 Pin %3 auf %4",
        "args0": [
            { "type": "field_dropdown", "name": "ADDR", "options": TCA_ADDRESSES },
            { "type": "field_dropdown", "name": "PORT", "options": TCA_PORTS },
            { "type": "field_dropdown", "name": "PIN", "options": TCA_PINS },
            { "type": "input_value", "name": "STATE", "check": ["Number", "Boolean"] }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Schaltet einen einzelnen Pin auf dem TCA9555 Modul."
    },
    // 2. Einzelnen Pin Empfangen
    {
        "type": "tca_read_pin",
        "message0": "🎛️ TCA Empfangen | Adresse %1 Port %2 Pin %3",
        "args0": [
            { "type": "field_dropdown", "name": "ADDR", "options": TCA_ADDRESSES },
            { "type": "field_dropdown", "name": "PORT", "options": TCA_PORTS },
            { "type": "field_dropdown", "name": "PIN", "options": TCA_PINS }
        ],
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Liest den Zustand (WAHR/FALSCH) eines einzelnen Pins aus."
    },
    // 3. Muster Senden
    {
        "type": "tca_write_pattern",
        "message0": "🎛️ TCA Muster Senden | Adresse %1 Port %2 Muster %3",
        "args0": [
            { "type": "field_dropdown", "name": "ADDR", "options": TCA_ADDRESSES },
            { "type": "field_dropdown", "name": "PORT", "options": TCA_PORTS },
            { "type": "field_input", "name": "PATTERN", "text": "10_1____" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Sendet ein 8-Bit Muster. 1=HIGH, 0=LOW, _=Ignorieren. Von links (Pin 0) nach rechts (Pin 7)."
    },
    // 4. Muster Empfangen
    {
        "type": "tca_read_pattern",
        "message0": "🎛️ TCA Muster Prüfen | Adresse %1 Port %2 Muster %3",
        "args0": [
            { "type": "field_dropdown", "name": "ADDR", "options": TCA_ADDRESSES },
            { "type": "field_dropdown", "name": "PORT", "options": TCA_PORTS },
            { "type": "field_input", "name": "PATTERN", "text": "11XXXXXX" }
        ],
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Prüft ein 8-Bit Muster. 1=HIGH erwartet, 0=LOW erwartet, X=Egal. Gibt WAHR zurück wenn es passt."
    }
]);

// --- GENERATOREN UND HARDWARE SCANNERS ---

// Hilfsfunktion: Übernimmt das automatische #include und .begin() für alle Blöcke
function setupTCAGlobals(block) {
    const addrStr = block.getFieldValue('ADDR');
    const objName = 'tca_' + addrStr.replace('0x', ''); // Aus 0x20 wird "tca_20"

    // Schreibe Objekt global
    ArduinoGenerator.globals_.add(`#include <LogicKiste_TCA9555.h>`);
    ArduinoGenerator.globals_.add(`LogicKiste_TCA9555 ${objName}(${addrStr});`);

    // Starte Objekt im Setup (mit Set-Deduplizierung)
    if (!ArduinoGenerator._tcaStarted) ArduinoGenerator._tcaStarted = new Set();
    if (!ArduinoGenerator._tcaStarted.has(addrStr)) {
        ArduinoGenerator.autoSetup_.push(`  ${objName}.begin();\n`);
        ArduinoGenerator._tcaStarted.add(addrStr);
    }
    return { objName, port: block.getFieldValue('PORT') };
}

// --- 1. Senden (Einzeln) ---
ArduinoGenerator.hardwareScanners['tca_write_pin'] = function(block) {
    const { objName, port } = setupTCAGlobals(block);
    const pin = block.getFieldValue('PIN');
    
    // Setze exakt diesen Pin automatisch auf OUTPUT
    if (!ArduinoGenerator._tcaPins) ArduinoGenerator._tcaPins = new Set();
    const pinKey = `${objName}_${port}_${pin}_OUT`;
    if (!ArduinoGenerator._tcaPins.has(pinKey)) {
        ArduinoGenerator.autoSetup_.push(`  ${objName}.pinMode(${port}, ${pin}, OUTPUT);\n`);
        ArduinoGenerator._tcaPins.add(pinKey);
    }
};

ArduinoGenerator.forBlock['tca_write_pin'] = function(block) {
    const addrStr = block.getFieldValue('ADDR');
    const objName = 'tca_' + addrStr.replace('0x', '');
    const port = block.getFieldValue('PORT');
    const pin = block.getFieldValue('PIN');
    const state = ArduinoGenerator.valueToCode(block, 'STATE', 0) || 'LOW';
    return `  ${objName}.digitalWrite(${port}, ${pin}, ${state});\n`;
};

// --- 2. Empfangen (Einzeln) ---
ArduinoGenerator.hardwareScanners['tca_read_pin'] = function(block) {
    const { objName, port } = setupTCAGlobals(block);
    const pin = block.getFieldValue('PIN');
    
    if (!ArduinoGenerator._tcaPins) ArduinoGenerator._tcaPins = new Set();
    const pinKey = `${objName}_${port}_${pin}_IN`;
    if (!ArduinoGenerator._tcaPins.has(pinKey)) {
        ArduinoGenerator.autoSetup_.push(`  ${objName}.pinMode(${port}, ${pin}, INPUT);\n`);
        ArduinoGenerator._tcaPins.add(pinKey);
    }
};

ArduinoGenerator.forBlock['tca_read_pin'] = function(block) {
    const addrStr = block.getFieldValue('ADDR');
    const objName = 'tca_' + addrStr.replace('0x', '');
    const port = block.getFieldValue('PORT');
    const pin = block.getFieldValue('PIN');
    return [`${objName}.digitalRead(${port}, ${pin})`, 0];
};

// --- 3. Senden (Muster) ---
ArduinoGenerator.hardwareScanners['tca_write_pattern'] = function(block) {
    const { objName, port } = setupTCAGlobals(block);
    const pattern = block.getFieldValue('PATTERN');
    
    // Scanner liest das Muster und setzt automatisch alle betroffenen Pins auf OUTPUT
    if (!ArduinoGenerator._tcaPins) ArduinoGenerator._tcaPins = new Set();
    for (let i = 0; i < 8; i++) {
        if (pattern[i] === '1' || pattern[i] === '0') {
            const pinKey = `${objName}_${port}_${i}_OUT`;
            if (!ArduinoGenerator._tcaPins.has(pinKey)) {
                ArduinoGenerator.autoSetup_.push(`  ${objName}.pinMode(${port}, ${i}, OUTPUT);\n`);
                ArduinoGenerator._tcaPins.add(pinKey);
            }
        }
    }
};

ArduinoGenerator.forBlock['tca_write_pattern'] = function(block) {
    const addrStr = block.getFieldValue('ADDR');
    const objName = 'tca_' + addrStr.replace('0x', '');
    const port = block.getFieldValue('PORT');
    const pattern = block.getFieldValue('PATTERN');
    return `  ${objName}.writePattern(${port}, "${pattern}");\n`;
};

// --- 4. Empfangen (Muster) ---
ArduinoGenerator.hardwareScanners['tca_read_pattern'] = function(block) {
    const { objName, port } = setupTCAGlobals(block);
    const pattern = block.getFieldValue('PATTERN');
    
    if (!ArduinoGenerator._tcaPins) ArduinoGenerator._tcaPins = new Set();
    for (let i = 0; i < 8; i++) {
        if (pattern[i] === '1' || pattern[i] === '0') { // X wird ignoriert
            const pinKey = `${objName}_${port}_${i}_IN`;
            if (!ArduinoGenerator._tcaPins.has(pinKey)) {
                ArduinoGenerator.autoSetup_.push(`  ${objName}.pinMode(${port}, ${i}, INPUT);\n`);
                ArduinoGenerator._tcaPins.add(pinKey);
            }
        }
    }
};

ArduinoGenerator.forBlock['tca_read_pattern'] = function(block) {
    const addrStr = block.getFieldValue('ADDR');
    const objName = 'tca_' + addrStr.replace('0x', '');
    const port = block.getFieldValue('PORT');
    const pattern = block.getFieldValue('PATTERN');
    return [`${objName}.checkPattern(${port}, "${pattern}")`, 0];
};