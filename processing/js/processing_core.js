// =======================================================================
// PROCESSING: CORE GENERATOR & HAUPTBLOCK
// =======================================================================

// 1. Generator Instanz erstellen
const ProcessingGenerator = new Blockly.Generator('Processing');

// Reihenfolgen (Order) fuer mathematische und logische Operationen definieren
ProcessingGenerator.ORDER_ATOMIC = 0;
ProcessingGenerator.ORDER_MEMBER = 1;
ProcessingGenerator.ORDER_FUNCTION_CALL = 2;
ProcessingGenerator.ORDER_INCREMENT = 3;
ProcessingGenerator.ORDER_DECREMENT = 3;
ProcessingGenerator.ORDER_LOGICAL_NOT = 4;
ProcessingGenerator.ORDER_MULTIPLY = 5;
ProcessingGenerator.ORDER_DIVIDE = 5;
ProcessingGenerator.ORDER_ADD = 6;
ProcessingGenerator.ORDER_SUBTRACT = 6;
ProcessingGenerator.ORDER_RELATIONAL = 7;
ProcessingGenerator.ORDER_EQUALITY = 8;
ProcessingGenerator.ORDER_LOGICAL_AND = 9;
ProcessingGenerator.ORDER_LOGICAL_OR = 10;
ProcessingGenerator.ORDER_NONE = 99;

// ---> HIER IST DER NEUE SCRUB-BEFEHL <---
// Zwingt den Generator, alle aneinandergehefteten Bloecke nacheinander abzuarbeiten
ProcessingGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : ProcessingGenerator.blockToCode(nextBlock);
    return code + nextCode;
};
// ----------------------------------------

// 2. Initialisierung vor jeder Code-Generierung
ProcessingGenerator.init = function(workspace) {
    // Sets und Arrays leeren, damit sich der Code bei jedem Aendern der Bloecke nicht verdoppelt
    ProcessingGenerator.globals_ = new Set();
    ProcessingGenerator.events_ = [];
};

// 3. Definition des Hauptblocks (Angepasst für Fenstergröße und Hintergrund)
Blockly.defineBlocksWithJsonArray([
    {
        "type": "processing_main",
        "message0": "PROCESSING START %1 Hintergrund %2 | Breite %3 Höhe %4 | Vollbild %5 %6 GLOBAL %7 SETUP %8 DRAW (Dauerhaft) %9",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_colour", "name": "BG_COLOR", "colour": "#000000"},
            {"type": "field_number", "name": "WIDTH", "value": 800, "min": 10},
            {"type": "field_number", "name": "HEIGHT", "value": 600, "min": 10},
            {"type": "field_checkbox", "name": "FULLSCREEN", "checked": false},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "GLOBAL"},
            {"type": "input_statement", "name": "SETUP"},
            {"type": "input_statement", "name": "DRAW"}
        ],
        "colour": 210,
        "tooltip": "Der Hauptblock fuer das Processing-Programm inkl. Fenster- und Farbeinstellungen."
    }
]);

// 4. Code-Generierung fuer den Hauptblock
ProcessingGenerator.forBlock['processing_main'] = function(block) {
    const globalCode = ProcessingGenerator.statementToCode(block, 'GLOBAL');
    const setupCode = ProcessingGenerator.statementToCode(block, 'SETUP');
    const drawCode = ProcessingGenerator.statementToCode(block, 'DRAW');

    // Neue Werte aus den Feldern auslesen
    const bgColor = block.getFieldValue('BG_COLOR');
    const width = block.getFieldValue('WIDTH');
    const height = block.getFieldValue('HEIGHT');
    const isFullscreen = block.getFieldValue('FULLSCREEN') === 'TRUE';

    let out = "// Processing Visu // (c) kreativekiste.de //\n";
    out += "import processing.serial.*;\n\n";

    // Globale Variablen aus den Helfer-Funktionen (Slider, Input, etc.) einfuegen
    if (ProcessingGenerator.globals_ && ProcessingGenerator.globals_.size > 0) {
        ProcessingGenerator.globals_.forEach(function(g) {
            out += g + "\n";
        });
        out += "\n";
    }

    // Globale Variablen aus dem GLOBAL-Bereich des Blocks (vom Nutzer)
    if (globalCode) {
        out += globalCode + "\n";
    }

    // Setup-Bereich aufbauen
    out += "void setup() {\n";
    
    // Entscheidung: Vollbild oder feste Groesse
    if (isFullscreen) {
        out += "  fullScreen();\n";
    } else {
        out += `  size(${width}, ${height});\n`;
    }
    
    // Hintergrundfarbe direkt ins Setup setzen
    out += `  background(${bgColor});\n\n`;
    
    out += setupCode;
    out += "}\n\n";

    // Draw-Bereich aufbauen
    out += "void draw() {\n";
    out += drawCode;
    out += "}\n\n";

    // Freischwebende Event-Funktionen (wie serialEvent) ganz unten anhaengen
    if (ProcessingGenerator.events_ && ProcessingGenerator.events_.length > 0) {
        ProcessingGenerator.events_.forEach(function(e) {
            out += e + "\n";
        });
    }

    return out;
};