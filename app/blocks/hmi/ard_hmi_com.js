// =======================================================================
// ARDUINO LOGICKISTE: PC VISU (HMI KOMMUNIKATION MIT KANÄLEN)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // --- SETUP ---
    {
        "type": "ard_hmi_setup",
        "message0": "Starte HMI Verbindung Baudrate %1",
        "args0": [
            {"type": "field_dropdown", "name": "BAUD", "options": [
                ["9600", "9600"], ["19200", "19200"], ["38400", "38400"],
                ["57600", "57600"], ["115200", "115200"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Gehoert in den SETUP-Bereich. Oeffnet die USB-Verbindung zur Processing-Visu."
    },

    // --- EMPFANGEN (GRÜN) ---
    {
        "type": "ard_hmi_receive",
        "message0": "Wenn Datensatz auf Kanal %1 ankommt %2",
        "args0": [
            {"type": "field_dropdown", "name": "CHANNEL", "options": [
                ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"],
                ["F", "F"], ["G", "G"], ["H", "H"], ["I", "I"], ["J", "J"]
            ]},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 130,
        "tooltip": "Container: Reagiert nur, wenn der PC Daten auf diesem spezifischen Kanal sendet."
        // Kein previous/next -> schwebt frei als Event-Block!
    },
    {
        "type": "ard_hmi_get_number",
        "message0": "Lese Zahl aus Datensatz an Position %1",
        "args0": [
            {"type": "field_number", "name": "INDEX", "value": 1, "min": 1, "max": 20}
        ],
        "output": "Number",
        "colour": 130,
        "tooltip": "Holt direkt die Zahl aus dem aktuell empfangenen Kanal. 1 = Erster Wert."
    },
    {
        "type": "ard_hmi_get_string",
        "message0": "Lese Text aus Datensatz an Position %1",
        "args0": [
            {"type": "field_number", "name": "INDEX", "value": 1, "min": 1, "max": 20}
        ],
        "output": "String",
        "colour": 130,
        "tooltip": "Holt den Text aus dem aktuell empfangenen Kanal. 1 = Erster Wert."
    },

    // --- SENDEN (ROT) ---
    {
        "type": "ard_hmi_send",
        "message0": "Sende Datensatz auf Kanal %1 %2 Wert 1 %3 Wert 2 %4 Wert 3 %5 Wert 4 %6 Wert 5 %7",
        "args0": [
            {"type": "field_dropdown", "name": "CHANNEL", "options": [
                ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"],
                ["F", "F"], ["G", "G"], ["H", "H"], ["I", "I"], ["J", "J"]
            ]},
            {"type": "input_dummy"},
            {"type": "input_value", "name": "V1"},
            {"type": "input_value", "name": "V2"},
            {"type": "input_value", "name": "V3"},
            {"type": "input_value", "name": "V4"},
            {"type": "input_value", "name": "V5"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "Sendet Werte mit einer festen Kennung an den PC. Leere Felder werden uebersprungen."
    }
]);

// =======================================================================
// GENERATOREN (C++)
// =======================================================================

ArduinoGenerator.forBlock['ard_hmi_setup'] = function(block) {
    const baud = block.getFieldValue('BAUD');
    ArduinoGenerator.autoSetup_.push(`  Serial.begin(${baud});\n`);
    return ''; 
};

// Hilfsfunktion: Sorgt dafuer, dass der Puffer genau 1x pro Loop gelesen wird
function ensureHMIReader() {
    if (!ArduinoGenerator.globals_.has('hmi_reader_flag')) {
        ArduinoGenerator.globals_.add('hmi_reader_flag'); // Markierung setzen
        ArduinoGenerator.globals_.add('String lk_hmi_cmd = "";');
        
        // Helfer zum Zerstueckeln des Textes
        ArduinoGenerator.globals_.add(`
String lk_splitString(String data, char separator, int index) {
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length() - 1;
  for (int i = 0; i <= maxIndex && found <= index; i++) {
    if (data.charAt(i) == separator || i == maxIndex) {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }
  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}`);

        // Code fuer den Start der Loop
        ArduinoGenerator.autoLoop_.push(`
  lk_hmi_cmd = "";
  if (Serial.available() > 0) {
    lk_hmi_cmd = Serial.readStringUntil('\\n');
    lk_hmi_cmd.trim();
  }
`);
    }
}

ArduinoGenerator.forBlock['ard_hmi_receive'] = function(block) {
    ensureHMIReader();
    const channel = block.getFieldValue('CHANNEL');
    const doCode = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Prueft, ob die Zeile mit z z.B. "A," anfaengt ODER exakt "A" ist (wenn keine Werte folgten)
    const code = `
  if (lk_hmi_cmd.startsWith("${channel},") || lk_hmi_cmd == "${channel}") {
${doCode}  }
`;
    // Der Code laeuft normal im Hintergrund (autoLoop) mit
    ArduinoGenerator.autoLoop_.push(code);
    return ''; 
};

ArduinoGenerator.forBlock['ard_hmi_get_number'] = function(block) {
    ensureHMIReader();
    const index = block.getFieldValue('INDEX');
    // Die Kennung ist auf Position 0. Wert 1 ist also Position 1 im String. Das passt perfekt!
    return [`lk_splitString(lk_hmi_cmd, ',', ${index}).toFloat()`, ArduinoGenerator.PRECEDENCE];
};

ArduinoGenerator.forBlock['ard_hmi_get_string'] = function(block) {
    ensureHMIReader();
    const index = block.getFieldValue('INDEX');
    return [`lk_splitString(lk_hmi_cmd, ',', ${index})`, ArduinoGenerator.PRECEDENCE];
};

ArduinoGenerator.forBlock['ard_hmi_send'] = function(block) {
    const channel = block.getFieldValue('CHANNEL');
    let code = `  Serial.print("${channel}");\n`;
    
    for (let i = 1; i <= 5; i++) {
        let val = ArduinoGenerator.valueToCode(block, 'V' + i, ArduinoGenerator.PRECEDENCE);
        if (val) {
            code += `  Serial.print(",");\n`;
            code += `  Serial.print(${val});\n`;
        }
    }
    code += `  Serial.println();\n`; 
    
    return code;
};