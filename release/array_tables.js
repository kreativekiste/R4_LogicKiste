// ====================================================================
// BLOCK-SYSTEM: Tabellen (Arrays)
// ORDNER: release/array_tables.js
// ====================================================================

// --- 1. BLOCK DEFINITIONEN (Das visuelle Aussehen) ---

// 1. Tabelle Erstellen (Deklaration)
Blockly.Blocks['release_array_declare'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("🗄️ Erstelle Tabelle:")
        .appendField(new Blockly.FieldTextInput("MeineWerte"), "ARRAY_NAME")
        .appendField("Typ:")
        .appendField(new Blockly.FieldDropdown([
            ["Ganzzahl (int)", "int"], 
            ["Kommazahl (float)", "float"], 
            ["Text (String)", "String"]
        ]), "ARRAY_TYPE")
        .appendField("Größe (Fächer):")
        .appendField(new Blockly.FieldNumber(10, 1), "ARRAY_SIZE"); // Minimal 1 Fach
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(315); // Violett für Listen/Tabellen
    this.setTooltip("Erstellt eine neue Tabelle, die mehrere Werte speichern kann. Dieser Block gehört ganz nach oben in den Global-Bereich!");
    this.setHelpUrl("");
  }
};

// 2. Wert in Tabelle schreiben
Blockly.Blocks['release_array_write'] = {
  init: function() {
    this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("📥 Tabelle:")
        .appendField(new Blockly.FieldTextInput("MeineWerte"), "ARRAY_NAME")
        .appendField("schreibe in Fach Nr.");
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("den Wert:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(315);
    this.setTooltip("Speichert einen Wert in ein bestimmtes Fach der Tabelle. Achtung: In C++ ist das allererste Fach immer die Nummer 0!");
    this.setHelpUrl("");
  }
};

// 3. Wert aus Tabelle lesen
Blockly.Blocks['release_array_read'] = {
  init: function() {
    this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("📤 Lese Tabelle:")
        .appendField(new Blockly.FieldTextInput("MeineWerte"), "ARRAY_NAME")
        .appendField("das Fach Nr.");
    this.setOutput(true, null); // true bedeutet: Gibt einen Wert nach links zurück
    this.setColour(315);
    this.setTooltip("Holt den gespeicherten Wert aus einem bestimmten Fach der Tabelle heraus.");
    this.setHelpUrl("");
  }
};


// --- 2. C++ CODE GENERATOREN (Die Übersetzung für den Arduino) ---

Blockly.JavaScript['release_array_declare'] = function(block) {
  var array_name = block.getFieldValue('ARRAY_NAME');
  var array_type = block.getFieldValue('ARRAY_TYPE');
  var array_size = block.getFieldValue('ARRAY_SIZE');

  // Globale Deklaration für C++ erstellen (z.B. "int MeineWerte[10];")
  var globalCode = array_type + ' ' + array_name + '[' + array_size + '];';
  
  // Die Funktion addGlobal sorgt dafür, dass dieser Code IMMER ganz oben 
  // vor dem Setup() landet, egal wo der Nutzer den Block andockt.
  Blockly.JavaScript.addGlobal('array_' + array_name, globalCode);

  // Da die Deklaration oben landet, geben wir hier nur einen Kommentar aus.
  return '// Tabelle ' + array_name + ' mit ' + array_size + ' Fächern wurde global erstellt.\n';
};

Blockly.JavaScript['release_array_write'] = function(block) {
  var array_name = block.getFieldValue('ARRAY_NAME');
  var value_index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';

  // Code zusammenbauen: MeineWerte[0] = 5;
  var code = array_name + '[' + value_index + '] = ' + value_value + ';\n';
  return code;
};

Blockly.JavaScript['release_array_read'] = function(block) {
  var array_name = block.getFieldValue('ARRAY_NAME');
  var value_index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';

  // Code zusammenbauen: MeineWerte[0]
  var code = array_name + '[' + value_index + ']';
  
  // Da dieser Block einen Wert zurückgibt, nutzen wir ORDER_ATOMIC
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};