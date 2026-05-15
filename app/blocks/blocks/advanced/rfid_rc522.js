// ==========================================
// kreativekiste.de | 2026-05-15 | v1.3
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
    // --- 2. ID LESEN & SERIAL AUSGABE ---
    {
        "type": "ard_rfid_read_to_serial",
        "message0": "RFID-Karte lesen und ID ausgeben (Serial)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Liest eine RFID Karte und gibt die ID direkt auf dem seriellen Monitor aus. Gehört in den LOOP."
    },
    // --- 3. WENN IRGENDEINE KARTE ANLIEGT (Boolean) ---
    {
        "type": "ard_rfid_on_card",
        "message0": "irgendeine RFID-Karte erkannt",
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Gibt WAHR zurück, wenn eine beliebige Karte auf dem Leser liegt. Passt in einen WENN-Block."
    },
    // --- 4. WENN SPEZIFISCHE KARTE ANLIEGT (Boolean) ---
    {
        "type": "ard_rfid_get_id",
        "message0": "RFID-Karte entspricht ID: %1",
        "args0": [
            { "type": "field_input", "name": "RFID_ID", "text": "33 0E B9 17" }
        ],
        "output": "Boolean",
        "colour": 160,
        "tooltip": "Gibt WAHR zurück, wenn exakt diese Karten-ID erkannt wird."
    }
]);

// --- DEZENTRALER SCANNER ---
const rfidScannerLogic = function(block) {
    let ssPin = 10;
    let rstPin = 9;
    
    // Versuche, den Setup-Block zu finden, um die Pins auszulesen
    const setupBlock = block.workspace.getBlocksByType('ard_rfid_setup', false)[0];
    if (setupBlock) {
        ssPin = setupBlock.getFieldValue('SS_PIN');
        rstPin = setupBlock.getFieldValue('RST_PIN');
    }

    // Zurück auf deine Original-Struktur mit .add() !
    ArduinoGenerator.globals_.add(`#include <SPI.h>`);
    ArduinoGenerator.globals_.add(`#include <MFRC522.h>`);
    ArduinoGenerator.globals_.add(`MFRC522 mfrc522(${ssPin}, ${rstPin});`);
    
    ArduinoGenerator.globals_.add(`
String getRFID_UID() {
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) uid += " ";
  }
  uid.toUpperCase();
  return uid;
}
`);
};

// Scanner an alle RFID-Blöcke binden
ArduinoGenerator.hardwareScanners['ard_rfid_setup'] = rfidScannerLogic;
ArduinoGenerator.hardwareScanners['ard_rfid_read_to_serial'] = rfidScannerLogic;
ArduinoGenerator.hardwareScanners['ard_rfid_on_card'] = rfidScannerLogic;
ArduinoGenerator.hardwareScanners['ard_rfid_get_id'] = rfidScannerLogic;

// --- GENERATOR LOGIK ---

ArduinoGenerator.forBlock['ard_rfid_setup'] = function(block) {
    return `  SPI.begin();\n  mfrc522.PCD_Init();\n`;
};

ArduinoGenerator.forBlock['ard_rfid_read_to_serial'] = function(block) {
    let code = `  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {\n`;
    code += `    Serial.println(getRFID_UID());\n`;
    code += `    mfrc522.PICC_HaltA();\n`;
    code += `    mfrc522.PCD_StopCrypto1();\n`;
    code += `  }\n`;
    return code;
};

ArduinoGenerator.forBlock['ard_rfid_on_card'] = function(block) {
    let code = `(mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial())`;
    return [code, 0];
};

ArduinoGenerator.forBlock['ard_rfid_get_id'] = function(block) {
    const expectedId = block.getFieldValue('RFID_ID');
    let code = `(mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial() && getRFID_UID() == "${expectedId}")`;
    return [code, 0];
};