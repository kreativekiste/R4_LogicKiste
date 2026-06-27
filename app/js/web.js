
Blockly.defineBlocksWithJsonArray([
    {
        "type": "web_ip",
        "message0": "📌 Feste WLAN IP %1 IP %2 Gateway %3 Subnetz %4",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_input", "name": "IP", "text": "192.168.0.50"},
            {"type": "field_input", "name": "GW", "text": "192.168.0.1"},
            {"type": "field_input", "name": "SN", "text": "255.255.255.0"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "210",
        "tooltip": "Setzt eine feste IP-Adresse. Block muss in SETUP platziert werden (vor dem WLAN Setup)."
    },
    {
        "type": "web_setup",
        "message0": "🌐 WLAN Setup %1 SSID %2 PW %3",
        "args0": [
            {"type": "input_dummy"},
            {"type": "input_value", "name": "SSID", "check": "String"},
            {"type": "input_value", "name": "PASSWORD", "check": "String"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "210",
        "tooltip": "Initialisiert das WLAN-Modul (Muss ins SETUP)."
    },
    {
        "type": "web_listen",
        "message0": "🖥️ Webserver Lauscher & WLAN Überwachung",
        "previousStatement": null,
        "nextStatement": null,
        "colour": "210",
        "tooltip": "Hält den Server am Laufen. Muss in die LOOP!"
    },
    {
        "type": "web_status_read",
        "message0": "📶 WLAN Zustand abrufen (0-5)",
        "output": "Number",
        "colour": "330",
        "tooltip": "0=Getrennt, 1=Verbunden, 2=Keine SSID, 3=Abbruch, 4=Sonstiges, 5=Fehler"
    },
    {
        "type": "web_digital_write",
        "message0": "🔵 Web-Digital Schreiben %1 Feld %2 Status %3",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "SLOT", "options": [["Feld 1", "0"], ["Feld 2", "1"], ["Feld 3", "2"]]},
            {"type": "input_value", "name": "VAL", "check": "Boolean"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "45"
    },
    {
        "type": "web_digital_read",
        "message0": "🔴 Web-Digital Lesen %1 von Feld %2",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "SLOT", "options": [["Feld 1", "0"], ["Feld 2", "1"], ["Feld 3", "2"]]}
        ],
        "output": "Boolean",
        "colour": "160"
    },
    {
        "type": "web_analog_write",
        "message0": "🟡 Web-Analog Schreiben %1 Feld %2 Wert %3",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "SLOT", "options": [["Feld 1", "0"], ["Feld 2", "1"], ["Feld 3", "2"]]},
            {"type": "input_value", "name": "VAL", "check": "Number"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "45"
    },
    {
        "type": "web_analog_read",
        "message0": "🟢 Web-Analog Lesen %1 von Feld %2",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "SLOT", "options": [["Feld 1", "0"], ["Feld 2", "1"], ["Feld 3", "2"]]}
        ],
        "output": "Number",
        "colour": "160"
    }
]);

// HARDWARE SCANNER
ArduinoGenerator.hardwareScanners['web_setup'] = function(block) {
    ArduinoGenerator.includes_.add(`#include <LogicKisteWeb.h>`);
    ArduinoGenerator.globals_.add(`LogicKisteWeb web;`);
};

// C++ CODE GENERATOREN
ArduinoGenerator.forBlock['web_ip'] = function(block) {
    const ip = block.getFieldValue('IP').replace(/\./g, ', ');
    const gw = block.getFieldValue('GW').replace(/\./g, ', ');
    const sn = block.getFieldValue('SN').replace(/\./g, ', ');
    return `  web.setStaticIP(${ip}, ${gw}, ${sn});\n`;
};

ArduinoGenerator.forBlock['web_setup'] = function(block) {
    const ssid = ArduinoGenerator.valueToCode(block, 'SSID', 0) || '""';
    const pw = ArduinoGenerator.valueToCode(block, 'PASSWORD', 0) || '""';
    return `  web.begin(${ssid}, ${pw});\n`;
};

ArduinoGenerator.forBlock['web_listen'] = function(block) {
    return `  web.update();\n`;
};

ArduinoGenerator.forBlock['web_status_read'] = function(block) {
    return [`web.getStatus()`, 0];
};

ArduinoGenerator.forBlock['web_digital_write'] = function(block) {
    const slot = block.getFieldValue('SLOT');
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || 'false';
    return `  web.writeDigital(${slot}, ${val});\n`;
};

ArduinoGenerator.forBlock['web_digital_read'] = function(block) {
    const slot = block.getFieldValue('SLOT');
    return [`web.readDigital(${slot})`, 0];
};

ArduinoGenerator.forBlock['web_analog_write'] = function(block) {
    const slot = block.getFieldValue('SLOT');
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    return `  web.writeAnalog(${slot}, ${val});\n`;
};

ArduinoGenerator.forBlock['web_analog_read'] = function(block) {
    const slot = block.getFieldValue('SLOT');
    return [`web.readAnalog(${slot})`, 0];
};