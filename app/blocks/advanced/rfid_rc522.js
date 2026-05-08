// ==========================================
// BAUTEILE: RFID RC522 (Kartenleser)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. INITIALISIEREN (Setup) ---
    {
        "type": "ard_rfid_setup",
        "message0": "RFID-Leser starten (SDA/SS Pin: %1, RST Pin: %2)",
        "args0": [
            { "type": "field_number", "name": "SS_PIN", "value": 10, "min": 0, "max": 53 },
            { "type": "field_number", "name": "RST_PIN", "value": 9, "min": 0, "max": 53 }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Startet den RC522. Die Pins SCK, MOSI und MISO müssen an die festen SPI-Pins des Arduinos! Gehört ins SETUP."
    },
    // --- 2. EVENT: WENN KARTE ERKANNT ---
    {
        "type": "ard_rfid_on_card",
        "message0": "Wenn RFID-Karte erkannt: %1",
        "args0": [
            { "type": "input_statement", "name": "DO" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Prüft, ob eine Karte da ist. Alles hier drinnen wird nur ausgeführt, wenn eine Karte vorgehalten wird."
    },
    // --- 3. UID LESEN ---
    {
        "type": "ard_rfid_get_id",
        "message0": "Lese Karten-ID (UID) als Text",
        "output": "String",
        "colour": 160,
        "tooltip": "Gibt die einzigartige Nummer der Karte zurück (z.B. 'E3 2C C8 17'). Nutze dies INNEN im 'Wenn Karte erkannt'-Block!"
    }
]);

// --- DEZENTRALER SCANNER ---
ArduinoGenerator.hardwareScanners['ard_rfid_setup'] = function(block) {
    const ssPin = block.getFieldValue('SS_PIN');
    const rstPin = block.getFieldValue('RST_PIN');
    
    // Libraries und das globale Reader-Objekt
    ArduinoGenerator.globals_.add(`#include <SPI.h>\n#include <MFRC522.h>\n`);
    ArduinoGenerator.globals_.add(`MFRC522 mfrc522(${ssPin}, ${rstPin});\n`);
    
    // Eine versteckte Helfer-Funktion, die die UID schön als Hex-String formatiert (MIT LEERZEICHEN)
    ArduinoGenerator.globals_.add(`
String getRFID_UID() {
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) uid += " "; // Fügt das Leerzeichen zwischen den Blöcken ein
  }
  uid.toUpperCase();
  return uid;
}
`);
};

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['ard_rfid_setup'] = function(block) {
    // Die Initialisierung im Setup
    return `  SPI.begin();\n  mfrc522.PCD_Init();\n`;
};

ArduinoGenerator.forBlock['ard_rfid_on_card'] = function(block) {
    const branch = ArduinoGenerator.statementToCode(block, 'DO');
    
    // Die doppelte Prüfung ist bei der MFRC522 Library Pflicht!
    // 1. Ist eine neue Karte da? 2. Lässt sie sich lesen?
    let code = `  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {\n`;
    code += branch;
    // Wichtig: Karte in den Halt-Zustand versetzen, sonst liest er sie 1000x pro Sekunde
    code += `    mfrc522.PICC_HaltA();\n`; 
    code += `  }\n`;
    
    return code;
};

ArduinoGenerator.forBlock['ard_rfid_get_id'] = function(block) {
    // Ruft einfach unsere Helfer-Funktion aus den Globals auf
    return ['getRFID_UID()', 0];
};