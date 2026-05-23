const ArduinoGenerator = new Blockly.Generator('Arduino');
ArduinoGenerator.PRECEDENCE = 0;
ArduinoGenerator.INDENT = '  ';

// Zentrales Register
ArduinoGenerator.hardwareScanners = {};

ArduinoGenerator.init = function(workspace) {
    if (!ArduinoGenerator.userFunctions) ArduinoGenerator.userFunctions = new Map();
};

ArduinoGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = (nextBlock && !opt_thisOnly) ? ArduinoGenerator.blockToCode(nextBlock) : '';
    return code + nextCode;
};

// DER HAUPTRAHMEN
Blockly.defineBlocksWithJsonArray([{
    "type": "arduino_main",
    "message0": "PROGRAMM START",
    "message1": "🌍 GLOBAL %1",
    "args1": [{"type": "input_statement", "name": "GLOBAL"}],
    "message2": "⚙️ SETUP %1",
    "args2": [{"type": "input_statement", "name": "SETUP"}],
    "message3": "🔁 LOOP %1",
    "args3": [{"type": "input_statement", "name": "LOOP"}],
    "colour": 210,
    "deletable": false,
    "tooltip": "Der unzerstörbare Hauptblock der Arduino R4_LogicKiste."
}]);

ArduinoGenerator.forBlock['arduino_main'] = function(block) {
    // 1. Alle Kisten (Sets und Maps) für die Blöcke bereitstellen
    ArduinoGenerator.usedPinsOutput = new Set();
    ArduinoGenerator.usedPinsInput = new Set();
    ArduinoGenerator.usedPinsAnalog = new Set();
    ArduinoGenerator.pinModes = new Map();
    ArduinoGenerator.customVariables = new Map();
    ArduinoGenerator.includes_ = new Set();
    ArduinoGenerator.globals_ = new Set();
    ArduinoGenerator.autoSetup_ = [];          
    ArduinoGenerator.autoSetupInterrupts_ = []; 
    ArduinoGenerator.autoLoop_ = [];            
    ArduinoGenerator.isrFunctions_ = [];        
    
    ArduinoGenerator.mx_modules = 0;
    ArduinoGenerator.suppressedVars_ = new Set(); 
    ArduinoGenerator._encoderCount = 0;              
    ArduinoGenerator._counterCount = 0;             
    ArduinoGenerator._repeatCount = 0;              

    // Sicherheits-Reset
    ArduinoGenerator.initializedMPU6050 = false;
    ArduinoGenerator.dht_setup_done = {};
    
    // 2. Alle Blöcke auf dem Workspace durchsuchen und deren eigene Scanner aufrufen
    const allBlocks = block.workspace.getAllBlocks(false);
    allBlocks.forEach(b => {
        if (ArduinoGenerator.hardwareScanners[b.type]) {
            ArduinoGenerator.hardwareScanners[b.type](b);
        }
    });
    
    // 3. Den eigentlichen Code der angedockten Blöcke generieren
    const globalCode = ArduinoGenerator.statementToCode(block, 'GLOBAL');
    const setupCode = ArduinoGenerator.statementToCode(block, 'SETUP');
    const loopCode = ArduinoGenerator.statementToCode(block, 'LOOP');
    
    // 4. Alles zusammenbauen (Die Kisten ausleeren)
    let fullCode = "// Arduino R4_LogicKiste // © kreativekiste.de // \n\n";
    
    if (ArduinoGenerator.includes_.size > 0) {
        ArduinoGenerator.includes_.forEach(inc => { fullCode += inc + "\n"; });
    }
    
    if (ArduinoGenerator.globals_.size > 0) {
        ArduinoGenerator.globals_.forEach(glob => { fullCode += glob + "\n"; });
    }

    // Pins und Variablen verarbeiten
    let allPins = new Set([...ArduinoGenerator.usedPinsOutput, ...ArduinoGenerator.usedPinsInput, ...ArduinoGenerator.usedPinsAnalog]);
    if (allPins.size > 0) fullCode += "\n// --- PINS ---\n";
    allPins.forEach(pin => { fullCode += `const int pin${pin} = ${pin};\n`; });

    let autoSetupCode = "";
    ArduinoGenerator.usedPinsOutput.forEach(pin => { autoSetupCode += `  pinMode(pin${pin}, OUTPUT);\n`; });
    ArduinoGenerator.usedPinsInput.forEach(pin => {
        const mode = ArduinoGenerator.pinModes.has(pin) ? ArduinoGenerator.pinModes.get(pin) : 'INPUT';
        autoSetupCode += `  pinMode(pin${pin}, ${mode});\n`;
    });

    if (ArduinoGenerator.customVariables.size > 0) {
        fullCode += "\n// --- AUTOMATISCHE VARIABLEN ---\n";
        ArduinoGenerator.customVariables.forEach((type, name) => { fullCode += `${type} ${name};\n`; });
    }

    // Nutzer-Globals
    let filteredGlobalCode = globalCode;
    if (ArduinoGenerator.suppressedVars_.size > 0) {
        filteredGlobalCode = globalCode.split('\n').filter(line => {
            const trimmed = line.trim();            
            const tokens = trimmed.split(/[\s;,()\[\]*&]+/).filter(Boolean);
            for (const varName of ArduinoGenerator.suppressedVars_) {
                if (tokens.includes(varName) && trimmed.includes('=')) return false;
            }
            return true;
        }).join('\n');
    }
    if (filteredGlobalCode.trim().length > 0) {
        fullCode += "\n// --- BENUTZER GLOBALS ---\n";
        fullCode += filteredGlobalCode;
    }

    // Auto-Setup: erst allgemeines Setup, dann Interrupts (NACH allen pinMode-Aufrufen!)
    ArduinoGenerator.autoSetup_.forEach(code => { autoSetupCode += code; });
    ArduinoGenerator.autoSetupInterrupts_.forEach(code => { autoSetupCode += code; });
    
    let autoLoopCode = "";
    ArduinoGenerator.autoLoop_.forEach(code => { autoLoopCode += code; });

    fullCode += "\nvoid setup() {\n" + autoSetupCode + setupCode + "}\n\n";
    fullCode += "void loop() {\n" + autoLoopCode + loopCode + "}\n\n";
    
    if (ArduinoGenerator.isrFunctions_.length > 0) {
        fullCode += "// --- INTERRUPTS (ISR) ---\n";
        ArduinoGenerator.isrFunctions_.forEach(isr => { fullCode += isr + "\n"; });
    }

    // UNTERPROGRAMME SCANNEN
    if (!ArduinoGenerator.userFunctions) ArduinoGenerator.userFunctions = new Map();
    ArduinoGenerator.userFunctions.clear();
    block.workspace.getBlocksByType('ard_function_define').forEach(funcBlock => {
        ArduinoGenerator.blockToCode(funcBlock);
    });

    block.workspace.getBlocksByType('ard_function_define_return').forEach(funcBlockReturn => {
        ArduinoGenerator.blockToCode(funcBlockReturn);
    });

    if (ArduinoGenerator.userFunctions.size > 0) {
        fullCode += "\n// --- UNTERPROGRAMME ---\n";
        ArduinoGenerator.userFunctions.forEach((funcCode, name) => {
            fullCode += funcCode + "\n";
        });
    }

    block.workspace.getBlocksByType('board_pc_interrupt').forEach(isrBlock => {
        ArduinoGenerator.blockToCode(isrBlock);
    });

    return fullCode;
};

// =======================================================================
// DEZENTRALE SCANNER & GENERATOREN FÜR DISPLAYS (TM1637 & TM1638)
// =======================================================================

// --- 1. TM1637 ---
ArduinoGenerator.hardwareScanners['ard_visu_tm1637_setup'] = function(block) {
    const clk = block.getFieldValue('CLK');
    const dio = block.getFieldValue('DIO');
    
    ArduinoGenerator.globals_.add(`#include <TM1637Display.h>`);
    ArduinoGenerator.globals_.add(`const int TM1637_CLK = ${clk};\nconst int TM1637_DIO = ${dio};`);
    ArduinoGenerator.globals_.add(`TM1637Display displayTM(TM1637_CLK, TM1637_DIO);`);
};

ArduinoGenerator.forBlock['ard_visu_tm1637_setup'] = function(block) {
    ArduinoGenerator.autoSetup_.push(`  displayTM.setBrightness(0x0f);\n`);
    return '';
};

ArduinoGenerator.forBlock['ard_visu_tm1637_brightn'] = function(block) {
    const bright = block.getFieldValue('BRIGHTNESS');
    return `  displayTM.setBrightness(${bright});\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1637_print'] = function(block) {
    const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
    const colon = block.getFieldValue('COLON') === 'TRUE';
    if (colon) {
        return `  displayTM.showNumberDecEx(${num}, 0b01000000, false);\n`; 
    } else {
        return `  displayTM.showNumberDec(${num}, false);\n`; 
    }
};

// --- 2. TM1638 MODELL 1 (8 LEDs & 8 Tasten) ---
ArduinoGenerator.hardwareScanners['ard_visu_tm1638_setup_mod1'] = function(block) {
    const stb = block.getFieldValue('STB');
    const clk = block.getFieldValue('CLK');
    const dio = block.getFieldValue('DIO');
    
    ArduinoGenerator.globals_.add(`#include <TM1638plus.h>`);
    ArduinoGenerator.globals_.add(`#define STROBE_TM ${stb}\n#define CLOCK_TM  ${clk}\n#define DIO_TM    ${dio}`);
    ArduinoGenerator.globals_.add(`TM1638plus tm(STROBE_TM, CLOCK_TM, DIO_TM, false);`);
    
    // Hilfsfunktion: Konvertiert die Bit-Maske der Tasten (Modell 1) in saubere Zahlen 1-8
    ArduinoGenerator.globals_.add(`
uint8_t lk_readKeyMod1() {
  uint8_t buttons = tm.readButtons();
  for (int i = 0; i < 8; i++) {
    if (buttons & (1 << i)) return i + 1;
  }
  return 0;
}`);
};

ArduinoGenerator.forBlock['ard_visu_tm1638_setup_mod1'] = function(block) {
    ArduinoGenerator.autoSetup_.push(`  tm.displayBegin();\n  tm.reset();\n`);
    return '';
};

ArduinoGenerator.forBlock['ard_visu_tm1638_brightn_mod1'] = function(block) {
    const bright = block.getFieldValue('BRIGHTNESS');
    return `  tm.brightness(${bright});\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_print_mod1'] = function(block) {
    const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
    const leadZero = block.getFieldValue('LEAD_ZERO');
    const align = block.getFieldValue('ALIGN');
    // Wichtig: Modell 1 nutzt displayIntNum statt DisplayDecNum!
    return `  tm.displayIntNum(${num}, ${leadZero}, ${align});\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_read_key_mod1'] = function(block) {
    const field = block.getField('VAR');
    const varName = field ? field.getText() : 'unbekannt';
    // Nutzt unsere Hilfsfunktion für 1-8
    return `  ${varName} = lk_readKeyMod1();\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_key_pressed_mod1'] = function(block) {
    const keyNum = block.getFieldValue('KEY_NUM');
    // Fragt direkt das spezifische Bit ab (erlaubt auch das Erkennen von Mehrfachtasten)
    return [`(tm.readButtons() & (1 << (${keyNum} - 1)))`, 0];
};

ArduinoGenerator.forBlock['ard_visu_tm1638_any_key_mod1'] = function(block) {
    return [`(tm.readButtons() != 0)`, 0];
};

// --- 3. TM1638 MODELL 2 (16 Tasten) ---
ArduinoGenerator.hardwareScanners['ard_visu_tm1638_setup'] = function(block) {
    const stb = block.getFieldValue('STB');
    const clk = block.getFieldValue('CLK');
    const dio = block.getFieldValue('DIO');
    
    ArduinoGenerator.globals_.add(`#include <TM1638plus_Model2.h>`);
    ArduinoGenerator.globals_.add(`#define STROBE_TM ${stb}\n#define CLOCK_TM  ${clk}\n#define DIO_TM    ${dio}`);
    ArduinoGenerator.globals_.add(`TM1638plus_Model2 tm(STROBE_TM, CLOCK_TM, DIO_TM, false, false);`);
};

ArduinoGenerator.forBlock['ard_visu_tm1638_setup'] = function(block) {
    ArduinoGenerator.autoSetup_.push(`  tm.displayBegin();\n  tm.reset();\n`);
    return '';
};

ArduinoGenerator.forBlock['ard_visu_tm1638_brightn'] = function(block) {
    const bright = block.getFieldValue('BRIGHTNESS');
    return `  tm.brightness(${bright});\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_print'] = function(block) {
    const num = ArduinoGenerator.valueToCode(block, 'NUM', 0) || '0';
    const dots = block.getFieldValue('DOTS');
    const leadZero = block.getFieldValue('LEAD_ZERO');
    const align = block.getFieldValue('ALIGN');
    return `  tm.DisplayDecNum(${num}, ${dots}, ${leadZero}, ${align});\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_read_key'] = function(block) {
    const field = block.getField('VAR');
    const varName = field ? field.getText() : 'unbekannt';
    return `  ${varName} = tm.ReadKey16();\n`;
};

ArduinoGenerator.forBlock['ard_visu_tm1638_key_pressed'] = function(block) {
    const keyNum = block.getFieldValue('KEY_NUM');
    return [`(tm.ReadKey16() == ${keyNum})`, 0];
};

ArduinoGenerator.forBlock['ard_visu_tm1638_any_key'] = function(block) {
    return [`(tm.ReadKey16() != 0)`, 0];
};



// GEMEINSAM: LED Block (funktioniert für Modell 1 und 2)
ArduinoGenerator.forBlock['ard_visu_tm1638_led'] = function(block) {
    const ledIndex = block.getFieldValue('LED_NUM') - 1;
    const state = ArduinoGenerator.valueToCode(block, 'STATE', 0) || 'false';
    return `  tm.setLED(${ledIndex}, ${state});\n`;
};

// NEU: LED Block mit Variablen-Eingang
ArduinoGenerator.forBlock['ard_visu_tm1638_led_var'] = function(block) {
    const ledNumCode = ArduinoGenerator.valueToCode(block, 'LED_NUM', 0) || '1';
    const state = ArduinoGenerator.valueToCode(block, 'STATE', 0) || 'false';
    return `  tm.setLED((${ledNumCode}) - 1, ${state});\n`;
};