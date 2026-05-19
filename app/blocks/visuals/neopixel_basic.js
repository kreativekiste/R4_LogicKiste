
Blockly.defineBlocksWithJsonArray([

    // 1. SETUP
    {
        "type": "neopixel_setup",
        "message0": "NeoPixel Setup | PIN: %1 | Anzahl LEDs: %2 | Typ: %3",
        "args0": [
            { "type": "field_input",  "name": "PIN",      "text": "6"  },
            { "type": "field_number", "name": "NUM_LEDS", "value": 16, "min": 1 },
            {
                "type": "field_dropdown", "name": "LED_TYPE",
                "options": [
                    ["WS2812B",  "WS2812B"],
                    ["WS2811",   "WS2811"],
                    ["WS2813",   "WS2813"],
                    ["SK6812",   "SK6812"],
                    ["NEOPIXEL", "NEOPIXEL"]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Initialisiert den NeoPixel-Streifen mit FastLED. Standard-Typ: WS2812B."
    },

    // 2. EINZELNEN PIXEL SCHALTEN
    {
        "type": "neopixel_set_single",
        "message0": "Pixel %1  🔴 %2  🟢 %3  🔵 %4",
        "args0": [
            { "type": "input_value", "name": "PIXEL", "check": "Number" },
            { "type": "input_value", "name": "R",     "check": "Number" },
            { "type": "input_value", "name": "G",     "check": "Number" },
            { "type": "input_value", "name": "B",     "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt die Farbe eines einzelnen Pixels (Zählung beginnt bei 0). Danach NeoPixel aktualisieren!"
    },

    // 3. PIXEL-LISTE SCHALTEN
    {
        "type": "neopixel_set_list",
        "message0": "Pixel-Liste %1  🔴 %2  🟢 %3  🔵 %4",
        "args0": [
            { "type": "field_input",  "name": "PIXEL_LIST", "text": "0, 1, 2, 5" },
            { "type": "input_value",  "name": "R", "check": "Number" },
            { "type": "input_value",  "name": "G", "check": "Number" },
            { "type": "input_value",  "name": "B", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Schaltet mehrere Pixel gleichzeitig auf dieselbe Farbe (z. B. 0, 2, 15)."
    },

    // 4. AKTUALISIEREN
    {
        "type": "neopixel_show",
        "message0": "NeoPixel aktualisieren (Show)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Überträgt alle Farbbefehle an die LEDs. Erst danach leuchten sie!"
    },

    // 5. HELLIGKEIT
    {
        "type": "neopixel_brightness",
        "message0": "NeoPixel Helligkeit %1",
        "args0": [
            { "type": "input_value", "name": "BRIGHTNESS", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Setzt die globale Helligkeit (0–255). Danach NeoPixel aktualisieren!"
    },

    // 6. ALLE AUSSCHALTEN
    {
        "type": "neopixel_clear",
        "message0": "NeoPixel alle ausschalten",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Schaltet alle Pixel aus und aktualisiert den Streifen sofort."
    }

]);


// HARDWARE SCANNER

ArduinoGenerator.hardwareScanners['neopixel_setup'] = function(block) {
    const pin  = block.getFieldValue('PIN');
    const num  = block.getFieldValue('NUM_LEDS');
    const type = block.getFieldValue('LED_TYPE');

    if (!ArduinoGenerator.includes_.has('#include <FastLED.h>')) {
        ArduinoGenerator.includes_.add('#include <FastLED.h>');
        ArduinoGenerator.globals_.add('#define NEOPIXEL_PIN ' + pin);
        ArduinoGenerator.globals_.add('#define NEOPIXEL_NUM ' + num);
        ArduinoGenerator.globals_.add('CRGB leds[NEOPIXEL_NUM];');
        ArduinoGenerator.autoSetup_.push(
            '  FastLED.addLeds<' + type + ', NEOPIXEL_PIN, GRB>(leds, NEOPIXEL_NUM);\n' +
            '  FastLED.clear();\n' +
            '  FastLED.show(); // Alle aus\n'
        );
    }
};


// GENERATOR LOGIK

ArduinoGenerator.forBlock['neopixel_setup'] = function(block) {
    return ''; 
};

ArduinoGenerator.forBlock['neopixel_set_single'] = function(block) {
    const pixel = ArduinoGenerator.valueToCode(block, 'PIXEL', 0) || '0';
    const r     = ArduinoGenerator.valueToCode(block, 'R', 0)     || '0';
    const g     = ArduinoGenerator.valueToCode(block, 'G', 0)     || '0';
    const b     = ArduinoGenerator.valueToCode(block, 'B', 0)     || '0';
    return '  leds[' + pixel + '] = CRGB(' + r + ', ' + g + ', ' + b + ');\n';
};

ArduinoGenerator.forBlock['neopixel_set_list'] = function(block) {
    const listStr = block.getFieldValue('PIXEL_LIST');
    const r = ArduinoGenerator.valueToCode(block, 'R', 0) || '0';
    const g = ArduinoGenerator.valueToCode(block, 'G', 0) || '0';
    const b = ArduinoGenerator.valueToCode(block, 'B', 0) || '0';

    const pixels = listStr.split(',').map(function(p) { return p.trim(); }).filter(function(p) { return p !== ''; });

    let code = '  // --- Pixel-Gruppe: ' + listStr + ' ---\n';
    pixels.forEach(function(p) {
        if (!isNaN(parseInt(p))) {
            code += '  leds[' + p + '] = CRGB(' + r + ', ' + g + ', ' + b + ');\n';
        }
    });
    return code;
};

ArduinoGenerator.forBlock['neopixel_show'] = function(block) {
    return '  FastLED.show();\n';
};

ArduinoGenerator.forBlock['neopixel_brightness'] = function(block) {
    const brightness = ArduinoGenerator.valueToCode(block, 'BRIGHTNESS', 0) || '128';
    return '  FastLED.setBrightness(' + brightness + ');\n';
};

ArduinoGenerator.forBlock['neopixel_clear'] = function(block) {
    return '  FastLED.clear();\n  FastLED.show();\n';
};

// NEOPIXEL BILD EINFÜGEN

class FieldCodeInput extends Blockly.Field {
    constructor(code) {
        super(code || '');
        this.SERIALIZABLE = true;
        this.CURSOR = 'pointer';
    }

    static fromJson(options) {
        return new FieldCodeInput(options['text'] || '');
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
        title.textContent = '📋 NeoPixel Code aus Pixel-Designer einfügen';

        const hint = document.createElement('div');
        hint.style.cssText = 'color:#a6adc8;font-size:12px;margin-bottom:10px;';
        hint.textContent = 'Pixel-Designer → Code kopieren → hier einfügen (Strg+V) → Übernehmen';

        const textarea = document.createElement('textarea');
        textarea.value = this.getValue();
        textarea.placeholder = 'leds[0] = CRGB(255, 0, 0);\nleds[1] = CRGB(0, 42, 255);\nFastLED.show();';
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

Blockly.fieldRegistry.register('field_code_input', FieldCodeInput);

// Block Definition
Blockly.defineBlocksWithJsonArray([
    {
        "type": "neopixel_custom_code",
        "message0": "📋 NeoPixel Bild einfügen  %1",
        "args0": [
            { "type": "field_code_input", "name": "CODE", "text": "" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Pixel-Designer → Code kopieren → Block anklicken → Einfügen. FastLED wird automatisch eingebunden."
    }
]);

// Hardware-Scanner: FastLED Library sicherstellen
ArduinoGenerator.hardwareScanners['neopixel_custom_code'] = function(block) {
    if (!ArduinoGenerator.includes_.has('#include <FastLED.h>')) {
        ArduinoGenerator.includes_.add('#include <FastLED.h>');
    }
};

// Generator
ArduinoGenerator.forBlock['neopixel_custom_code'] = function(block) {
    const raw = block.getFieldValue('CODE') || '';
    if (!raw.trim()) return '  // (Kein Code eingefügt)\n';

    const lines = raw.split('\n').map(function(line) {
        const t = line.trimStart();
        return t.length > 0 ? '  ' + t : '';
    }).join('\n');

    return '  // --- NeoPixel Bild ---\n' + lines + '\n';
};
