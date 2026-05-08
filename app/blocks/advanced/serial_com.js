// ==========================================
// BAUTEILE: SERIAL (Senden & Empfangen)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- STARTEN (Ins Setup) ---
    {
        "type": "ard_serial_begin",
        "message0": "Start Serial Monitor (Baudrate: %1)",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BAUD",
                "options": [
                    ["9600", "9600"],
                    ["115200", "115200"],
                    ["38400", "38400"],
                    ["921600", "921600"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Startet die serielle Kommunikation. Gehört zwingend in den SETUP-Block!"
    },
    // --- SENDEN ---
    {
        "type": "ard_serial_print",
        "message0": "Sende an Serial: %1 %2 Neue Zeile am Ende",
        "args0": [
            { "type": "input_value", "name": "TEXT" },
            { "type": "field_checkbox", "name": "NEWLINE", "checked": true }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Sendet Text, Zahlen oder Variablen an den Serial Monitor."
    },
    // --- VERFÜGBAR PRÜFEN ---
    {
        "type": "ard_serial_available",
        "message0": "Serial Daten empfangen?",
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Gibt WAHR zurück, wenn Daten vom PC eingetroffen sind."
    },
    // --- LESEN ---
    {
        "type": "ard_serial_read_string",
        "message0": "Lese Serial Daten (als Text)",
        "output": "String",
        "colour": 160,
        "tooltip": "Liest den empfangenen Text aus dem Puffer."
    }
]);

ArduinoGenerator.forBlock['ard_serial_begin'] = function(block) {
    const baud = block.getFieldValue('BAUD');
    return `  Serial.begin(${baud});\n`;
};

ArduinoGenerator.forBlock['ard_serial_print'] = function(block) {
    // FIX A4: Wir nutzen die rohe Zahl 0 für die Order, da das System die Konstante nicht kennt.
    const text = ArduinoGenerator.valueToCode(block, 'TEXT', 0) || '""';
    const newline = block.getFieldValue('NEWLINE') === 'TRUE';
    const command = newline ? 'Serial.println' : 'Serial.print';
    return `  ${command}(${text});\n`;
};

ArduinoGenerator.forBlock['ard_serial_available'] = function(block) {
    // FIX A4: Array mit 0 zurückgeben
    return ['(Serial.available() > 0)', 0];
};

ArduinoGenerator.forBlock['ard_serial_read_string'] = function(block) {
    // FIX A4: Array mit 0 zurückgeben
    return ['Serial.readStringUntil(\'\\n\')', 0];
};