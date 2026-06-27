// ==========================================
// PROCESSING BAUTEIL: STRUKTUR-CONTAINER 
// ==========================================

// Liste der 7 Farben für dein visuelles Leitsystem
const CONTAINER_COLORS = [
    { id: "red",    colour: 0,   text: "Gruppe Rot" },
    { id: "orange", colour: 30,  text: "Gruppe Orange" },
    { id: "yellow", colour: 60,  text: "Gruppe Gelb" },
    { id: "green",  colour: 120, text: "Gruppe Grün" },
    { id: "cyan",   colour: 180, text: "Gruppe Hellblau" },
    { id: "blue",   colour: 230, text: "Gruppe Blau" },
    { id: "purple", colour: 280, text: "Gruppe Lila" }
];

// Automatische Erstellung der 7 Blöcke
CONTAINER_COLORS.forEach(item => {
    const blockType = 'processing_container_' + item.id;

    Blockly.Blocks[blockType] = {
        init: function() {
            this.appendDummyInput()
                .appendField("📦")
                .appendField(new Blockly.FieldTextInput(item.text), "NAME");
            this.appendStatementInput("STACK")
                .setCheck(null);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(item.colour);
            this.setTooltip("Dient zum Gruppieren von Blöcken zum einfachen Kopieren. Hat keinen Einfluss auf den Java Code.");
        }
    };

    // --- GENERATOR LOGIK ---
    // Der Block selbst erzeugt keinen eigenen Java/Processing Code. 
    // Er reicht einfach nur den Code aller Blöcke durch, die in ihn hineingesteckt werden.
    ProcessingGenerator.forBlock[blockType] = function(block) {
        return ProcessingGenerator.statementToCode(block, 'STACK');
    };
});