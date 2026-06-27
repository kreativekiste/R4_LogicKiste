// =======================================================================
// PROCESSING: PC VISU (HMI KOMMUNIKATION MIT KANÄLEN)
// =======================================================================

Blockly.defineBlocksWithJsonArray([
    // --- SETUP ---
    {
        "type": "processing_hmi_setup",
        "message0": "Starte HMI Verbindung %1 Baudrate %2",
        "args0": [
            {"type": "field_dropdown", "name": "PORT", "options": [
                ["COM1", "COM1"], ["COM2", "COM2"], ["COM3", "COM3"],
                ["COM4", "COM4"], ["COM5", "COM5"], ["COM6", "COM6"],
                ["COM7", "COM7"], ["COM8", "COM8"], ["COM9", "COM9"]
            ]},
            {"type": "field_dropdown", "name": "BAUD", "options": [
                ["9600", "9600"], ["19200", "19200"], ["38400", "38400"],
                ["57600", "57600"], ["115200", "115200"]
            ]}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Gehoert in den SETUP-Bereich. Verbindet den PC mit dem Arduino auf dem gewaehlten Port."
    },

    // --- EMPFANGEN (GRÜN) ---
    {
        "type": "processing_hmi_receive",
        "message0": "Wenn Datensatz auf Kanal %1 ankommt %2",
        "args0": [
            {"type": "field_dropdown", "name": "CHANNEL", "options": [
                ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"],
                ["F", "F"], ["G", "G"], ["H", "H"], ["I", "I"], ["J", "J"]
            ]},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 130,
        "tooltip": "Container: Reagiert nur, wenn der Arduino Daten auf diesem spezifischen Kanal sendet."
        // Kein previous/next -> schwebt frei als Event-Block!
    },
    {
        "type": "processing_hmi_get_number",
        "message0": "Lese Zahl aus Datensatz an Position %1",
        "args0": [
            {"type": "field_number", "name": "INDEX", "value": 1, "min": 1, "max": 20}
        ],
        "output": "Number",
        "colour": 130,
        "tooltip": "Holt direkt die Zahl aus dem aktuell empfangenen Kanal. 1 = Erster Wert."
    },
    {
        "type": "processing_hmi_get_string",
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
        "type": "processing_hmi_send",
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
        "tooltip": "Sendet Werte mit einer festen Kennung an den Arduino. Leere Felder werden uebersprungen."
    }
]);

// =======================================================================
// CODE-GENERATOREN FÜR PROCESSING (JAVA)
// =======================================================================

ProcessingGenerator.forBlock['processing_hmi_setup'] = function(block) {
    const port = block.getFieldValue('PORT');
    const baud = block.getFieldValue('BAUD');
    
    if (!ProcessingGenerator.globals_) ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.globals_.add(`Serial myPort;`);

    return `  try {
    myPort = new Serial(this, "${port}", ${baud});
    myPort.bufferUntil('\\n'); 
  } catch (Exception e) {
    println("ACHTUNG: Port ${port} nicht gefunden oder blockiert!");
  }\n`;
};

// Helfer für das Zerstueckeln
function ensureProcessingHMIHelpers() {
    if (!ProcessingGenerator.globals_.has('hmi_event_flag')) {
        ProcessingGenerator.globals_.add('hmi_event_flag');
        ProcessingGenerator.globals_.add('String lk_hmi_cmd = "";');
        
        ProcessingGenerator.globals_.add(`
String lk_splitString(String data, char separator, int index) {
  if (data == null || data.length() == 0) return "";
  String[] parts = split(data, separator);
  if (index >= 0 && index < parts.length) {
    return parts[index];
  }
  return "";
}`);
        
        ProcessingGenerator.hmi_event_code = "";
        ProcessingGenerator.events_.push("/*HMI_EVENT_PLACEHOLDER*/");
    }
}

ProcessingGenerator.forBlock['processing_hmi_receive'] = function(block) {
    ensureProcessingHMIHelpers();
    const channel = block.getFieldValue('CHANNEL');
    const doCode = ProcessingGenerator.statementToCode(block, 'DO');
    
    // Sammelt alle Bloecke und packt sie in eine einzige serialEvent Funktion
    ProcessingGenerator.hmi_event_code += `
    if (lk_hmi_cmd.startsWith("${channel},") || lk_hmi_cmd.equals("${channel}")) {
${doCode}    }`;

    // Aktualisiert den Platzhalter im Event-Array
    for(let i=0; i<ProcessingGenerator.events_.length; i++) {
        if(ProcessingGenerator.events_[i].startsWith("/*HMI_EVENT_PLACEHOLDER*/")) {
            ProcessingGenerator.events_[i] = `/*HMI_EVENT_PLACEHOLDER*/
void serialEvent(Serial myPort) {
  lk_hmi_cmd = myPort.readStringUntil('\\n');
  if (lk_hmi_cmd != null) {
    lk_hmi_cmd = trim(lk_hmi_cmd);${ProcessingGenerator.hmi_event_code}
  }
}`;
        }
    }
    return ''; 
};

ProcessingGenerator.forBlock['processing_hmi_get_number'] = function(block) {
    ensureProcessingHMIHelpers();
    const index = block.getFieldValue('INDEX');
    // float() macht aus dem Text sicher eine Kommazahl
    return [`float(lk_splitString(lk_hmi_cmd, ',', ${index}))`, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_hmi_get_string'] = function(block) {
    ensureProcessingHMIHelpers();
    const index = block.getFieldValue('INDEX');
    return [`lk_splitString(lk_hmi_cmd, ',', ${index})`, ProcessingGenerator.ORDER_ATOMIC];
};

ProcessingGenerator.forBlock['processing_hmi_send'] = function(block) {
    const channel = block.getFieldValue('CHANNEL');
    let code = `  if (myPort != null) {\n    String lk_out = "${channel}";\n`;
    
    for (let i = 1; i <= 5; i++) {
        let val = ProcessingGenerator.valueToCode(block, 'V' + i, ProcessingGenerator.ORDER_NONE);
        if (val) {
            code += `    lk_out += "," + str(${val});\n`;
        }
    }
    
    code += `    lk_out += "\\n";\n    myPort.write(lk_out);\n  }\n`;
    return code;
};