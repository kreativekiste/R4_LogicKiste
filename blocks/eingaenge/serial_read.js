// ==========================================
// BAUTEILE: SERIELLER EMPFANG (Lesen vom PC)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. PRÜFEN OB DATEN DA SIND ---
    {
        "type": "ard_serial_available",
        "message0": "Serielle Daten vom PC verfügbar?",
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Gibt WAHR zurück, wenn Daten über USB vom Computer empfangen wurden. Nutze dies immer in einer WENN-Abfrage, bevor du liest!"
    },
    // --- 2. DATEN ALS TEXT LESEN ---
    {
        "type": "ard_serial_read_string",
        "message0": "Lese Serielle Daten als Text",
        "output": "String",
        "colour": 160,
        "tooltip": "Liest den gesendeten Text aus dem Seriellen Monitor bis zum Zeilenumbruch (Enter)."
    },
    // --- 3. DATEN ALS ZAHL LESEN ---
    {
        "type": "ard_serial_read_int",
        "message0": "Lese Serielle Daten als Zahl",
        "output": "Number",
        "colour": 160,
        "tooltip": "Filtert die nächste Zahl aus den empfangenen Daten. Achtung: Blockiert den Arduino bis zu 1 Sekunde wenn keine Zahl ankommt — immer hinter 'Serielle Daten verfügbar?' nutzen!"
    }
]);

ArduinoGenerator.forBlock['ard_serial_available'] = function(block) {
    ArduinoGenerator.useSerial = true; // Aktiviert Serial.begin() im Setup-Scanner
    return ["(Serial.available() > 0)", 0];
};

ArduinoGenerator.forBlock['ard_serial_read_string'] = function(block) {
    ArduinoGenerator.useSerial = true;
    // readStringUntil('\n') ist viel sicherer als readString(), da es nicht auf ein Timeout wartet
    return ["Serial.readStringUntil('\\n')", 0];
};

ArduinoGenerator.forBlock['ard_serial_read_int'] = function(block) {
    ArduinoGenerator.useSerial = true;
    return ["Serial.parseInt()", 0];
};