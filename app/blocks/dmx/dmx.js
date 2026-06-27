// =======================================================================
// dmx.js - Tri-Mode DMX Blöcke für Arduino UNO R4
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // -------------------------------------------------------------------
    // WELT 1: DIRECT-MODE 
    // -------------------------------------------------------------------
    {
        "type": "dmx_setup_direct",
        "message0": "DMX Direkt-Modus starten | Kanäle: %1",
        "args0": [
            { "type": "input_value", "name": "CHANNELS", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 240,
        "tooltip": "Startet DMX (Pin 4). Werte werden sofort gesendet.",
        "helpUrl": ""
    },
    {
        "type": "dmx_write_direct",
        "message0": "DMX Live-Kanal %1 sofort auf Wert %2 setzen",
        "args0": [
            { "type": "input_value", "name": "CHANNEL", "check": "Number" },
            { "type": "input_value", "name": "VALUE", "check": "Number" }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 240,
        "tooltip": "Schreibt und sendet sofort. ACHTUNG: Nicht in schnelle Wiederhol-Schleifen einbauen!",
        "helpUrl": ""
    },

    // -------------------------------------------------------------------
    // WELT 2: BUFFERED-MODE
    // -------------------------------------------------------------------
    {
        "type": "dmx_setup_buffered",
        "message0": "DMX Puffer-Modus starten | Kanäle: %1",
        "args0": [
            { "type": "input_value", "name": "CHANNELS", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 280,
        "tooltip": "Startet DMX für flüssige Shows (Pin 4).",
        "helpUrl": ""
    },
    {
        "type": "dmx_frame_buffered",
        "message0": "DMX Paket senden %1 %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "input_statement", "name": "DO" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 280,
        "tooltip": "Klammert die Schreib-Befehle ein: Öffnet das Paket, schreibt und sendet es.",
        "helpUrl": ""
    },
    {
        "type": "dmx_write_buffered",
        "message0": "In DMX-Puffer Kanal %1 den Wert %2 schreiben",
        "args0": [
            { "type": "input_value", "name": "CHANNEL", "check": "Number" },
            { "type": "input_value", "name": "VALUE", "check": "Number" }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 280,
        "tooltip": "Ändert den Wert unsichtbar im Speicher. Gehört in die lila Klammer!",
        "helpUrl": ""
    },

    // -------------------------------------------------------------------
    // WELT 3: SIMPLE-MODE 
    // -------------------------------------------------------------------
    {
        "type": "dmx_setup_simple",
        "message0": "DMX Simple-Modus starten | Kanäle: %1",
        "args0": [
            { "type": "input_value", "name": "CHANNELS", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Startet DMX (Pin 4). Maximale Flexibilität für Profis.",
        "helpUrl": ""
    },
    {
        "type": "dmx_begin_simple",
        "message0": "DMX Paket öffnen (Start)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Öffnet die DMX-Übertragung. Zwingend erforderlich vor dem Schreiben!",
        "helpUrl": ""
    },
    {
        "type": "dmx_write_simple",
        "message0": "DMX Kanal %1 auf Wert %2 schreiben",
        "args0": [
            { "type": "input_value", "name": "CHANNEL", "check": "Number" },
            { "type": "input_value", "name": "VALUE", "check": "Number" }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Schreibt einen Wert in das geöffnete Paket.",
        "helpUrl": ""
    },
    {
        "type": "dmx_end_simple",
        "message0": "DMX Paket schließen & senden (Ende)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Schließt das Paket ab und schickt die Daten auf den Bus.",
        "helpUrl": ""
    },

    // -------------------------------------------------------------------
    // WELT 4: EMPFÄNGER UND SYSTEM 
    // -------------------------------------------------------------------
    {
        "type": "dmx_read",
        "message0": "Lese Wert von DMX-Kanal %1",
        "args0": [
            { "type": "input_value", "name": "CHANNEL", "check": "Number" }
        ],
        "output": "Number",
        "colour": 250,
        "tooltip": "Gibt den aktuellen Wert (0-255) des gewählten Kanals zurück.",
        "helpUrl": ""
    },
    {
        "type": "dmx_available",
        "message0": "DMX Signal vorhanden?",
        "output": "Boolean",
        "colour": 250,
        "tooltip": "Prüft, ob aktuell fehlerfreie DMX-Pakete empfangen werden.",
        "helpUrl": ""
    },
    {
        "type": "dmx_stop",
        "message0": "DMX Signal stoppen (Pausieren)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 250,
        "tooltip": "Stoppt die DMX-Übertragung und gibt die Leitung für andere Geräte frei.",
        "helpUrl": ""
    }
]);

// =======================================================================
// GENERATOREN (C++ Export für Arduino)
// =======================================================================

// Gemeinsame Setup-Funktion für alle 3 Modi
function GEN_DMX_SETUP(block) {
    const channels = ArduinoGenerator.valueToCode(block, 'CHANNELS', 0) || '512';
    
    ArduinoGenerator.includes_.add('#include <ArduinoRS485.h>');
    ArduinoGenerator.includes_.add('#include <ArduinoDMX.h>');
    
    // Performante Definition des Enable-Pins per Precompiler
    ArduinoGenerator.globals_.add('#define DMX_EN_PIN 4');
    
    // Hart codiert für maximale Stabilität
    let setupCode = `  RS485.setPins(1, 0, DMX_EN_PIN);\n  DMX.begin(${channels});\n`;
    ArduinoGenerator.autoSetup_.push(setupCode);
    return '';
}

// --- WELT 1: DIRECT ---
ArduinoGenerator.forBlock['dmx_setup_direct'] = function(block) { return GEN_DMX_SETUP(block); };
ArduinoGenerator.forBlock['dmx_write_direct'] = function(block) {
    const channel = ArduinoGenerator.valueToCode(block, 'CHANNEL', 0) || '1';
    const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
    let code = '';
    code += `  DMX.beginTransmission();\n`;
    code += `  DMX.write(${channel}, ${value});\n`;
    code += `  DMX.endTransmission();\n`;
    return code;
};

// --- WELT 2: BUFFERED ---
ArduinoGenerator.forBlock['dmx_setup_buffered'] = function(block) { return GEN_DMX_SETUP(block); };
ArduinoGenerator.forBlock['dmx_frame_buffered'] = function(block) {
    var statements = ArduinoGenerator.statementToCode(block, 'DO');
    let code = '  DMX.beginTransmission();\n';
    code += statements;
    code += '  DMX.endTransmission();\n';
    return code;
};
ArduinoGenerator.forBlock['dmx_write_buffered'] = function(block) {
    const channel = ArduinoGenerator.valueToCode(block, 'CHANNEL', 0) || '1';
    const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
    return `  DMX.write(${channel}, ${value});\n`;
};

// --- WELT 3: SIMPLE (DIE NEUEN BLÖCKE) ---
ArduinoGenerator.forBlock['dmx_setup_simple'] = function(block) { return GEN_DMX_SETUP(block); };
ArduinoGenerator.forBlock['dmx_begin_simple'] = function(block) {
    return `  DMX.beginTransmission();\n`;
};
ArduinoGenerator.forBlock['dmx_write_simple'] = function(block) {
    const channel = ArduinoGenerator.valueToCode(block, 'CHANNEL', 0) || '1';
    const value = ArduinoGenerator.valueToCode(block, 'VALUE', 0) || '0';
    return `  DMX.write(${channel}, ${value});\n`;
};
ArduinoGenerator.forBlock['dmx_end_simple'] = function(block) {
    return `  DMX.endTransmission();\n`;
};

// --- WELT 4: EMPFÄNGER / SYSTEM ---
ArduinoGenerator.forBlock['dmx_read'] = function(block) {
    const channel = ArduinoGenerator.valueToCode(block, 'CHANNEL', 0) || '1';
    const code = `DMX.read(${channel})`;
    return [code, 0];
};
ArduinoGenerator.forBlock['dmx_available'] = function(block) {
    const code = `(DMX.parsePacket() > 0)`;
    return [code, 0];
};
ArduinoGenerator.forBlock['dmx_stop'] = function(block) {
    return `  DMX.endTransmission();\n`;
};