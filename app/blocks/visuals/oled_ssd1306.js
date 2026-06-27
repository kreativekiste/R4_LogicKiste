// =======================================================================
// OLED CUSTOM FIELD (POP-UP EDITOR)
// =======================================================================
class FieldCodeInputOLED extends Blockly.Field {
    constructor(code) {
        super(code || '');
        this.SERIALIZABLE = true;
        this.CURSOR = 'pointer';
    }

    static fromJson(options) {
        return new FieldCodeInputOLED(options['text'] || '');
    }

    initView() {
        this.borderRect_ = Blockly.utils.dom.createSvgElement('rect', {
            'rx': 4, 'ry': 4, 'x': 0, 'y': 0, 'height': 22,
            'fill': 'rgba(0,0,0,0.25)',
            'stroke': 'rgba(255,255,255,0.3)',
            'stroke-width': '1'
        }, this.fieldGroup_);

        this.textEl_ = Blockly.utils.dom.createSvgElement('text', {
            'class': 'blocklyText', 'x': 8, 'y': 15,
            'fill': '#fff', 'font-size': '11pt'
        }, this.fieldGroup_);

        this.updateSize_();
    }

    updateSize_() {
        const code  = this.getValue() || '';
        const lines = code.split('\n').filter(function(l) { return l.trim(); }).length;
        const preview = lines > 0
            ? ('✏️  ' + lines + ' Zeilen Code – klicken zum Bearbeiten')
            : '📋  Klicken zum Einfügen...';

        if (this.textEl_) this.textEl_.textContent = preview;

        const width = Math.max(220, preview.length * 7.5);
        if (this.borderRect_) this.borderRect_.setAttribute('width', width);
        this.size_ = { width: width, height: 22 };
    }

    doValueUpdate_(newValue) {
        super.doValueUpdate_(newValue);
        this.updateSize_();
    }

    showEditor_() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';

        const modal = document.createElement('div');
        modal.style.cssText = 'background:#1e1e2e;border-radius:10px;padding:20px;width:620px;max-width:95vw;box-shadow:0 12px 40px rgba(0,0,0,0.6);border:1px solid #444;';

        const title = document.createElement('div');
        title.style.cssText = 'color:#cdd6f4;font-size:15px;font-weight:bold;margin-bottom:6px;';
        title.textContent = '📋 OLED Code aus Pixel-Designer einfügen';

        const hint = document.createElement('div');
        hint.style.cssText = 'color:#a6adc8;font-size:12px;margin-bottom:10px;';
        hint.textContent = 'Pixel-Designer → Code kopieren → hier einfügen (Strg+V) → Übernehmen';

        const textarea = document.createElement('textarea');
        textarea.value = this.getValue();
        textarea.placeholder = 'static const uint8_t PROGMEM oled_bild[] = { ... };\noled.drawBitmap(0, 0, oled_bild, 16, 16, SSD1306_WHITE);';
        textarea.style.cssText = 'width:100%;height:280px;box-sizing:border-box;font-family:monospace;font-size:12px;background:#181825;color:#cdd6f4;border:1px solid #555;border-radius:6px;padding:10px;resize:vertical;outline:none;line-height:1.5;';

        const btnRow   = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:10px;margin-top:14px;justify-content:flex-end;';

        const btnOk     = document.createElement('button');
        const btnClear  = document.createElement('button');
        const btnCancel = document.createElement('button');

        btnOk.textContent     = '✅ Übernehmen';
        btnClear.textContent  = '🗑️ Leeren';
        btnCancel.textContent = 'Abbrechen';

        btnOk.style.cssText     = 'padding:9px 20px;background:#a6e3a1;color:#1e1e2e;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:13px;';
        btnClear.style.cssText  = 'padding:9px 16px;background:#f38ba8;color:#1e1e2e;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:bold;';
        btnCancel.style.cssText = 'padding:9px 16px;background:#45475a;color:#cdd6f4;border:none;border-radius:6px;cursor:pointer;font-size:13px;';

        const self = this;
        btnOk.onclick     = function() { self.setValue(textarea.value.trim()); document.body.removeChild(overlay); };
        btnClear.onclick  = function() { textarea.value = ''; textarea.focus(); };
        btnCancel.onclick = function() { document.body.removeChild(overlay); };
        overlay.onclick   = function(e) { if (e.target === overlay) document.body.removeChild(overlay); };

        btnRow.appendChild(btnCancel);
        btnRow.appendChild(btnClear);
        btnRow.appendChild(btnOk);
        modal.appendChild(title);
        modal.appendChild(hint);
        modal.appendChild(textarea);
        modal.appendChild(btnRow);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        setTimeout(function() { textarea.focus(); textarea.select(); }, 60);
    }
}

Blockly.fieldRegistry.register('field_code_input_oled', FieldCodeInputOLED);


// =======================================================================
// BLOCK-DEFINITIONEN
// =======================================================================
Blockly.defineBlocksWithJsonArray([
    // 1. OLED SETUP BLOCK
    {
        "type": "ard_oled_setup",
        "message0": "🖥️ Setup OLED Größe: %1 (I2C) Takt: %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SIZE",
                "options": [
                    ["0.96 Zoll (128x64)", "64"],
                    ["0.91 Zoll (128x32)", "32"]
                ]
            },
            {
                "type": "field_dropdown",
                "name": "CLOCK",
                "options": [
                    ["400 kHz (Schnell)", "400000L"],
                    ["100 kHz (Standard)", "100000L"],
                    ["1000 kHz (Ultra)", "1000000L"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Initialisiert das SSD1306 OLED-Display über I2C mit der Adafruit Bibliothek."
    },

    // 2. SCHRIFTART UND GRÖSSE SETZEN
    {
        "type": "ard_oled_set_font",
        "message0": "OLED Schriftart auf %1 setzen",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "FONT",
                "options": [
                    ["Normal (System5x7)", "System5x7"],
                    ["Schmal (font5x7)", "font5x7"],
                    ["Groß (lcd5x7)", "lcd5x7"],
                    ["Retro (font8x8)", "font8x8"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Legt die aktuelle Schriftart bzw. Skalierung für den nachfolgenden Text fest."
    },

    // 3. DISPLAY LÖSCHEN (Klassisch)
    {
        "type": "ard_oled_clear",
        "message0": "OLED Display löschen",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Löscht den gesamten aktuellen Bildschirminhalt des OLEDs (setzt alles auf Schwarz)."
    },

    // 3b. NEU: HINTERGRUNDFARBE SETZEN
    {
        "type": "ard_oled_fill",
        "message0": "OLED Hintergrundfarbe: %1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "COLOR",
                "options": [
                    ["Schwarz", "SSD1306_BLACK"],
                    ["Weiß", "SSD1306_WHITE"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Füllt das gesamte Display mit der gewählten Farbe."
    },

    // 4. TEXT / VARIABLE SCHREIBEN (Klassisch, immer Weiß)
    {
        "type": "ard_oled_print",
        "message0": "OLED schreibe Text/Zahl: %1 neue Zeile: %2",
        "args0": [
            {
                "type": "input_value",
                "name": "VAL"
            },
            {
                "type": "field_checkbox",
                "name": "NEW_LINE",
                "checked": true
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Gibt Text in Weiß aus (alte Pixel bleiben sichtbar)."
    },

    // 5. TEXT / VARIABLE AN X/Y SCHREIBEN (Klassisch, immer Weiß)
    {
        "type": "ard_oled_print_xy",
        "message0": "OLED schreibe an X: %1 Y: %2 Text/Zahl: %3",
        "args0": [
            { "type": "input_value", "name": "X" },
            { "type": "input_value", "name": "Y" },
            { "type": "input_value", "name": "VAL" }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Setzt den Cursor auf X/Y und schreibt in Weiß."
    },

    // 6. NEU: TEXT / VARIABLE AN X/Y SCHREIBEN MIT FARBAUSWAHL (S/W)
    {
        "type": "ard_oled_print_xy_color",
        "message0": "OLED schreibe an X: %1 Y: %2 Text/Zahl: %3 Farbe: %4",
        "args0": [
            { "type": "input_value", "name": "X" },
            { "type": "input_value", "name": "Y" },
            { "type": "input_value", "name": "VAL" },
            {
                "type": "field_dropdown",
                "name": "COLOR",
                "options": [
                    ["Weiß", "SSD1306_WHITE"],
                    ["Schwarz", "SSD1306_BLACK"]
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Schreibt an X/Y in der gewählten Farbe. Perfekt, um alten Text mit Schwarz wieder wegzuradieren!"
    },

    // 7. FORMEN ZEICHNEN (Mit Farbauswahl)
    {
        "type": "ard_oled_draw_shape",
        "message0": "OLED Form: %1 X: %2 Y: %3 B / X2 / Rad: %4 H / Y2: %5 X3: %6 Y3: %7 Farbe: %8",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "SHAPE",
                "options": [
                    ["Linie", "line"],
                    ["Rechteck (Rand)", "rect"],
                    ["Rechteck (Voll)", "fillRect"],
                    ["Kreis (Rand)", "circle"],
                    ["Kreis (Voll)", "fillCircle"],
                    ["Dreieck (Rand)", "triangle"],
                    ["Dreieck (Voll)", "fillTriangle"]
                ]
            },
            { "type": "input_value", "name": "X" },
            { "type": "input_value", "name": "Y" },
            { "type": "input_value", "name": "P3" },
            { "type": "input_value", "name": "P4" },
            { "type": "input_value", "name": "P5" },
            { "type": "input_value", "name": "P6" },
            {
                "type": "field_dropdown",
                "name": "COLOR",
                "options": [
                    ["Weiß", "SSD1306_WHITE"],
                    ["Schwarz", "SSD1306_BLACK"]
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Zeichnet eine geometrische Form in der gewählten Farbe."
    },

    // 8. OLED BILD EINFÜGEN
    {
        "type": "ard_oled_draw_picture",
        "message0": "🖼️ OLED Bild einfügen %1",
        "args0": [
            {
                "type": "field_code_input_oled",
                "name": "PIXEL_CODE",
                "text": ""
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Klicke hier, um den Code aus dem OLED Pixel-Designer einzufügen."
    }
]);


// =======================================================================
// C++ GENERATOREN & HARDWARE-SCANNER
// =======================================================================

ArduinoGenerator.hardwareScanners['ard_oled_setup'] = function(block) {
    const size = block.getFieldValue('SIZE');

    ArduinoGenerator.includes_.add('#include <Wire.h>');
    ArduinoGenerator.includes_.add('#include <Adafruit_GFX.h>');
    ArduinoGenerator.includes_.add('#include <Adafruit_SSD1306.h>');
    
    ArduinoGenerator.globals_.add(`#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT ${size}\n#define OLED_RESET -1\n#define SCREEN_ADDRESS 0x3C`);
    ArduinoGenerator.globals_.add('Adafruit_SSD1306 oled(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);');
};

ArduinoGenerator.forBlock['ard_oled_setup'] = function(block) {
    ArduinoGenerator.autoSetup_.push(`  if(!oled.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {\n    for(;;); // Endlosschleife bei Fehler\n  }\n  oled.clearDisplay();\n  oled.setTextColor(SSD1306_WHITE);\n  oled.display();\n`);
    return '';
};

ArduinoGenerator.forBlock['ard_oled_set_font'] = function(block) {
    const font = block.getFieldValue('FONT');
    let size = 1;
    if (font === 'lcd5x7' || font === 'font8x8') {
        size = 2;
    }
    return `  oled.setTextSize(${size});\n`;
};

// Klassisches Löschen (Setzt Bildschirm physikalisch auf Schwarz)
ArduinoGenerator.forBlock['ard_oled_clear'] = function(block) {
    return '  oled.clearDisplay();\n  oled.display();\n';
};

// Neuer Hintergrund-Farben Block
ArduinoGenerator.forBlock['ard_oled_fill'] = function(block) {
    const color = block.getFieldValue('COLOR');
    return `  oled.fillScreen(${color});\n  oled.display();\n`;
};

// Klassischer Text (Immer Weiß)
ArduinoGenerator.forBlock['ard_oled_print'] = function(block) {
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '" "';
    const newLine = block.getFieldValue('NEW_LINE') === 'TRUE';
    const printFunction = newLine ? 'println' : 'print';
    return `  oled.setTextColor(SSD1306_WHITE);\n  oled.${printFunction}(${value});\n  oled.display();\n`;
};

// Klassischer Text an X/Y (Immer Weiß)
ArduinoGenerator.forBlock['ard_oled_print_xy'] = function(block) {
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '" "';
    return `  oled.setTextColor(SSD1306_WHITE);\n  oled.setCursor(${x}, ${y});\n  oled.print(${value});\n  oled.display();\n`;
};

// Neuer Text an X/Y mit Farbauswahl (S/W)
ArduinoGenerator.forBlock['ard_oled_print_xy_color'] = function(block) {
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    let value = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '" "';
    const color = block.getFieldValue('COLOR');
    return `  oled.setTextColor(${color});\n  oled.setCursor(${x}, ${y});\n  oled.print(${value});\n  oled.display();\n`;
};

// Formen mit dynamischer Farbe
ArduinoGenerator.forBlock['ard_oled_draw_shape'] = function(block) {
    const shape = block.getFieldValue('SHAPE');
    const x = ArduinoGenerator.valueToCode(block, 'X', 0) || '0';
    const y = ArduinoGenerator.valueToCode(block, 'Y', 0) || '0';
    const p3 = ArduinoGenerator.valueToCode(block, 'P3', 0) || '0';
    const p4 = ArduinoGenerator.valueToCode(block, 'P4', 0) || '0';
    const p5 = ArduinoGenerator.valueToCode(block, 'P5', 0) || '0';
    const p6 = ArduinoGenerator.valueToCode(block, 'P6', 0) || '0';
    const color = block.getFieldValue('COLOR');

    let code = '';
    
    if (shape === 'line') {
        code = `  oled.drawLine(${x}, ${y}, ${p3}, ${p4}, ${color});\n`;
    } else if (shape === 'rect') {
        code = `  oled.drawRect(${x}, ${y}, ${p3}, ${p4}, ${color});\n`;
    } else if (shape === 'fillRect') {
        code = `  oled.fillRect(${x}, ${y}, ${p3}, ${p4}, ${color});\n`;
    } else if (shape === 'circle') {
        code = `  oled.drawCircle(${x}, ${y}, ${p3}, ${color});\n`;
    } else if (shape === 'fillCircle') {
        code = `  oled.fillCircle(${x}, ${y}, ${p3}, ${color});\n`;
    } else if (shape === 'triangle') {
        code = `  oled.drawTriangle(${x}, ${y}, ${p3}, ${p4}, ${p5}, ${p6}, ${color});\n`;
    } else if (shape === 'fillTriangle') {
        code = `  oled.fillTriangle(${x}, ${y}, ${p3}, ${p4}, ${p5}, ${p6}, ${color});\n`;
    }

    return code + '  oled.display();\n';
};

// Bild
ArduinoGenerator.forBlock['ard_oled_draw_picture'] = function(block) {
    const raw = block.getFieldValue('PIXEL_CODE') || '';
    if (!raw.trim()) return '  // (Kein Code eingefügt)\n';

    const lines = raw.split('\n').map(function(line) {
        const t = line.trimStart();
        return t.length > 0 ? '  ' + t : '';
    }).join('\n');

    return '  // --- OLED Bild ---\n' + lines + '\n';
};