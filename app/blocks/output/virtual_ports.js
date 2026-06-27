// --- BLOCK DEFINITIONEN ---
Blockly.defineBlocksWithJsonArray([
  // 1. DEFINE BLOCK (Jetzt mit Modus-Auswahl!)
  {
    "type": "ard_virtual_port_define",
    "message0": "⚙️ Virtuellen Port %1 (Modus: %2) mit Pins: %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "GROUP",
        "options": [
          ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "MODE",
        "options": [
          ["Ausgang (OUTPUT)", "OUTPUT"],
          ["Eingang (INPUT)", "INPUT"],
          ["Eingang + Pullup (INPUT_PULLUP)", "INPUT_PULLUP"]
        ]
      },
      {
        "type": "field_input",
        "name": "PINS",
        "text": "3, 4, 5, 6, 7"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "Erstellt eine virtuelle Pin-Gruppe (A-F). Wähle den Modus (Ausgang für LEDs, Eingang für Taster) und gib die Pins kommagetrennt ein."
  },
  // 2. SCHREIBEN BLOCK
  {
    "type": "ard_virtual_port_write",
    "message0": "🎛️ Virtuellen Port %1 schalten | Muster: %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "GROUP",
        "options": [
          ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]
        ]
      },
      {
        "type": "field_input",
        "name": "PATTERN",
        "text": "1_01"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Schaltet die Pins der Gruppe nacheinander von links nach rechts. 1=An, 0=Aus, _=Ignorieren."
  },
  // 3. LESEN BLOCK
  {
    "type": "ard_virtual_port_read",
    "message0": "🎛️ Virtuellen Port %1 prüfen | Muster: %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "GROUP",
        "options": [
          ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"]
        ]
      },
      {
        "type": "field_input",
        "name": "PATTERN",
        "text": "10XXX"
      }
    ],
    "output": "Boolean",
    "colour": 160,
    "tooltip": "Prüft das Muster am Arduino Port. 1=HIGH erwartet, 0=LOW erwartet, X=Egal. Gibt WAHR zurück wenn es passt."
  }
]);

// --- GENERATOREN UND HARDWARE SCANNERS ---

// 1. SETUP BLOCK (Virtuellen Port definieren)
ArduinoGenerator.hardwareScanners['ard_virtual_port_define'] = function(block) {
    const group = block.getFieldValue('GROUP');
    const mode = block.getFieldValue('MODE'); // <-- Hier holen wir den Modus
    let pins = block.getFieldValue('PINS').trim();
    
    // Input-Sanitization: Komma am Ende entfernen
    pins = pins.replace(/,\s*$/, "");
    // Fallback bei leerem Feld
    if (!pins) pins = "-1"; 
    
    // Bibliothek einbinden
    ArduinoGenerator.globals_.add(`#include <LogicKiste_PortControl.h>`);
    
    // Objekt erstellen
    ArduinoGenerator.globals_.add(`LogicKiste_VirtualPort port${group}(${pins});`);
    
    // Den ausgewählten Modus im Setup verwenden!
    ArduinoGenerator.autoSetup_.push(`  port${group}.begin(${mode});\n`);
};

ArduinoGenerator.forBlock['ard_virtual_port_define'] = function(block) {
    return '';
};

// 2. SCHALT BLOCK (Muster an Port senden)
ArduinoGenerator.forBlock['ard_virtual_port_write'] = function(block) {
    const group = block.getFieldValue('GROUP');
    const pattern = block.getFieldValue('PATTERN');
    return `  port${group}.writePattern("${pattern}");\n`;
};

// 3. LESE BLOCK (Muster abfragen)
ArduinoGenerator.forBlock['ard_virtual_port_read'] = function(block) {
    const group = block.getFieldValue('GROUP');
    const pattern = block.getFieldValue('PATTERN');
    return [`port${group}.checkPattern("${pattern}")`, 0];
};