const ArduinoGenerator = new Blockly.Generator('Arduino');
ArduinoGenerator.PRECEDENCE = 0;
ArduinoGenerator.INDENT = '  ';

ArduinoGenerator.init = function(workspace) {
    if (!ArduinoGenerator.userFunctions) ArduinoGenerator.userFunctions = new Map();
};

ArduinoGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = (nextBlock && !opt_thisOnly) ? ArduinoGenerator.blockToCode(nextBlock) : '';
    return code + nextCode;
};

// --- DER HAUPTRAHMEN (Das Gehirn) ---
Blockly.defineBlocksWithJsonArray([{
    "type": "arduino_main",
    "message0": "PROGRAMM START %1 SETUP %2 LOOP %3",
    "args0": [{"type": "input_dummy"}, {"type": "input_statement", "name": "SETUP"}, {"type": "input_statement", "name": "LOOP"}],
    "colour": 210
}]);

ArduinoGenerator.forBlock['arduino_main'] = function(block) {
    ArduinoGenerator.usedPinsOutput = new Set();
    ArduinoGenerator.usedPinsInput = new Set();
    ArduinoGenerator.usedPinsAnalog = new Set();
    ArduinoGenerator.pinModes = new Map();
    ArduinoGenerator.customVariables = new Map();
    ArduinoGenerator.includes_ = new Set();
    ArduinoGenerator.globals_ = new Set();
    ArduinoGenerator.mx_modules = 0;
    ArduinoGenerator.useSerial = false;
    ArduinoGenerator.needsSafeMillis = false;
    ArduinoGenerator.needsSafeMicros = false;
    
    if(ArduinoGenerator.usedTimers) ArduinoGenerator.usedTimers.clear();
    if(ArduinoGenerator.usedServos) ArduinoGenerator.usedServos.clear();
    if(ArduinoGenerator.usedSteppers) ArduinoGenerator.usedSteppers.clear();
    if(ArduinoGenerator.usedFastLEDs) ArduinoGenerator.usedFastLEDs.clear();
    if(ArduinoGenerator.usedMatrices) ArduinoGenerator.usedMatrices.clear();
    if(ArduinoGenerator.usedLCDs) ArduinoGenerator.usedLCDs.clear();
    if(ArduinoGenerator.usedDHTs) ArduinoGenerator.usedDHTs.clear();
    if(ArduinoGenerator.usedStopWatches) ArduinoGenerator.usedStopWatches.clear();
    if(ArduinoGenerator.trackedSteppers) ArduinoGenerator.trackedSteppers.clear();
    
    const setup = ArduinoGenerator.statementToCode(block, 'SETUP');
    const loop = ArduinoGenerator.statementToCode(block, 'LOOP');
    
    let includes = "";
    let globals = "";
    let autoSetup = "";
    let autoSetupInterrupts = ""; // Interrupts immer NACH pinMode einhängen
    let isrFunctions = "";
    
    // --- TFT ST7735 SCANNER ---
    const tftST = block.workspace.getBlocksByType('tft_setup_st7735');
    if (tftST.length > 0) {
        const tftBlock = tftST[0];
        const cs = tftBlock.getFieldValue('CS');
        const dc = tftBlock.getFieldValue('DC');
        const rst = tftBlock.getFieldValue('RST');
        const rot = tftBlock.getFieldValue('ROTATION');
        
        includes += "#include <Adafruit_GFX.h>\n#include <Adafruit_ST7735.h>\n#include <SPI.h>\n";
        globals += `Adafruit_ST7735 tft = Adafruit_ST7735(pin${cs}, pin${dc}, pin${rst});\n`;
        autoSetup += `  tft.initR(INITR_BLACKTAB);\n  tft.fillScreen(0x0000);\n  tft.setRotation(${rot});\n`;
        ArduinoGenerator.usedPinsOutput.add(cs); ArduinoGenerator.usedPinsOutput.add(dc); ArduinoGenerator.usedPinsOutput.add(rst);
    }
    
    // --- TFT ILI9486 SCANNER ---
    const tftILI = block.workspace.getBlocksByType('tft_setup_ili9486');
    if (tftILI.length > 0) {
        const tftBlock = tftILI[0];
        const cs = tftBlock.getFieldValue('CS');
        const dc = tftBlock.getFieldValue('DC');
        const rst = tftBlock.getFieldValue('RST');
        const rot = tftBlock.getFieldValue('ROTATION');
        const kludge = tftBlock.getFieldValue('KLUDGE') === 'TRUE' ? 'true' : 'false';
        
        includes += "#include <SPI.h>\n#include <ILI9486_SPI.h>\n";
        globals += `ILI9486_SPI tft(pin${cs}, pin${dc}, pin${rst});\n`;
        autoSetup += `  tft.setSpiKludge(${kludge});\n  tft.init();\n  tft.fillScreen(0x0000);\n  tft.setRotation(${rot});\n`;
        ArduinoGenerator.usedPinsOutput.add(cs); ArduinoGenerator.usedPinsOutput.add(dc); ArduinoGenerator.usedPinsOutput.add(rst);
    }

    // --- ENCODER SCANNER ---
    const encoders = block.workspace.getBlocksByType('input_encoder');
    encoders.forEach(encBlock => {
        const pinClk = encBlock.getFieldValue('PIN_CLK');
        const pinDt = encBlock.getFieldValue('PIN_DT');
        const varName = encBlock.getFieldValue('VAR_NAME');
        
        ArduinoGenerator.usedPinsInput.add(pinClk); ArduinoGenerator.usedPinsInput.add(pinDt);
        // Encoder-Pins brauchen immer INPUT_PULLUP
        ArduinoGenerator.pinModes.set(pinClk, 'INPUT_PULLUP');
        ArduinoGenerator.pinModes.set(pinDt, 'INPUT_PULLUP');
        ArduinoGenerator.customVariables.set(varName, "volatile int"); 
        
        const isrName = `isr_encoder_${pinClk}_${pinDt}`;
        autoSetupInterrupts += `  attachInterrupt(digitalPinToInterrupt(pin${pinClk}), ${isrName}, CHANGE);\n`;
        isrFunctions += `void ${isrName}() {\n  if (digitalRead(pin${pinClk}) == digitalRead(pin${pinDt})) {\n    ${varName}++;\n  } else {\n    ${varName}--;\n  }\n}\n`;
    });

    // --- STANDARD INTERRUPTS ---
    const hwInts = block.workspace.getBlocksByType('board_hw_interrupt');
    hwInts.forEach(isrBlock => {
        const pin = isrBlock.getFieldValue('PIN');
        const mode = isrBlock.getFieldValue('MODE');
        const funcName = `isr_hw_pin${pin}`;
        ArduinoGenerator.usedPinsInput.add(pin);
        autoSetupInterrupts += `  attachInterrupt(digitalPinToInterrupt(pin${pin}), ${funcName}, ${mode});\n`;
        isrFunctions += `void ${funcName}() {\n${ArduinoGenerator.statementToCode(isrBlock, 'DO')}}\n`;
    });

    // --- PIN CHANGE INTERRUPTS (PCINT) ---
    const pcInts = block.workspace.getBlocksByType('board_pc_interrupt');
    if (pcInts.length > 0) {
        includes += "#include <PinChangeInterrupt.h>\n";
        pcInts.forEach(isrBlock => {
            const pin = isrBlock.getFieldValue('PIN');
            const mode = isrBlock.getFieldValue('MODE');
            const funcName = `isr_pc_pin${pin}`;
            ArduinoGenerator.usedPinsInput.add(pin);
            autoSetupInterrupts += `  attachPCINT(digitalPinToPCINT(pin${pin}), ${funcName}, ${mode});\n`;
            isrFunctions += `void ${funcName}() {\n${ArduinoGenerator.statementToCode(isrBlock, 'DO')}}\n`;
        });
    }

    // --- LIBRARIES OBJEKTE ---
    if (ArduinoGenerator.usedDHTs && ArduinoGenerator.usedDHTs.size > 0) {
        includes += "#include <DHT.h>\n";
        ArduinoGenerator.usedDHTs.forEach((data, name) => {
            globals += `DHT ${name}(pin${data.pin}, ${data.type});\n`;
            autoSetup += `  ${name}.begin();\n`;
            ArduinoGenerator.usedPinsInput.add(data.pin);
        });
    }
    
    if (ArduinoGenerator.usedServos && ArduinoGenerator.usedServos.size > 0) {
        includes += "#include <Servo.h>\n";
        ArduinoGenerator.usedServos.forEach(pin => {
            globals += `Servo servo_${pin};\n`;
            autoSetup += `  servo_${pin}.attach(pin${pin});\n`;
            ArduinoGenerator.usedPinsOutput.add(pin);
        });
    }

    if (ArduinoGenerator.usedSteppers && ArduinoGenerator.usedSteppers.size > 0) {
        includes += "#include <Stepper.h>\n";
        ArduinoGenerator.usedSteppers.forEach((data, name) => {
            globals += `Stepper ${name}(2048, pin${data.in1}, pin${data.in3}, pin${data.in2}, pin${data.in4});\n`;
            autoSetup += `  ${name}.setSpeed(${data.speed});\n`;
            ArduinoGenerator.usedPinsOutput.add(data.in1); ArduinoGenerator.usedPinsOutput.add(data.in2);
            ArduinoGenerator.usedPinsOutput.add(data.in3); ArduinoGenerator.usedPinsOutput.add(data.in4);
        });
    }

    if (ArduinoGenerator.usedLCDs && ArduinoGenerator.usedLCDs.size > 0) {
        includes += "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n";
        ArduinoGenerator.usedLCDs.forEach((data, name) => {
            globals += `LiquidCrystal_I2C ${name}(${data.addr}, ${data.format});\n`;
            autoSetup += `  ${name}.init();\n  ${name}.backlight();\n`;
        });
    }

    // --- MODUL-INCLUDES & GLOBALS (von neopixel, max7219, stepper_advanced etc.) ---
    if (ArduinoGenerator.includes_.size > 0) {
        ArduinoGenerator.includes_.forEach(inc => { includes += inc + "\n"; });
    }
    if (ArduinoGenerator.globals_.size > 0) {
        ArduinoGenerator.globals_.forEach(glob => { globals += glob + "\n"; });
    }

    // --- EIGENE STOPPUHR KLASSE ---
    if (ArduinoGenerator.usedStopWatches && ArduinoGenerator.usedStopWatches.size > 0) {
        globals += `\n// --- Mini Stoppuhr Klasse ---\nclass BlockStopwatch {\n  private:\n    unsigned long startTime = 0;\n    unsigned long elapsedTime = 0;\n    bool running = false;\n  public:\n    void start() { if (!running) { startTime = millis(); running = true; } }\n    void stop() { if (running) { elapsedTime += millis() - startTime; running = false; } }\n    void reset() { startTime = running ? millis() : 0; elapsedTime = 0; }\n    void restart() { elapsedTime = 0; startTime = millis(); running = true; }\n    unsigned long elapsed() { return running ? (elapsedTime + millis() - startTime) : elapsedTime; }\n};\n`;
        ArduinoGenerator.usedStopWatches.forEach(name => { globals += `BlockStopwatch ${name};\n`; });
    }

    // --- GLOBALE PINS & VARIABLEN ---
    if (ArduinoGenerator.useSerial) { autoSetup += `  Serial.begin(9600);\n`; }

    let allPins = new Set([...ArduinoGenerator.usedPinsOutput, ...ArduinoGenerator.usedPinsInput, ...ArduinoGenerator.usedPinsAnalog]);
    if (allPins.size > 0) globals += "\n// --- PINS ---\n";
    allPins.forEach(pin => { globals += `const int pin${pin} = ${pin};\n`; });

    ArduinoGenerator.usedPinsOutput.forEach(pin => { autoSetup += `  pinMode(pin${pin}, OUTPUT);\n`; });
    
    ArduinoGenerator.usedPinsInput.forEach(pin => {
        const mode = ArduinoGenerator.pinModes.has(pin) ? ArduinoGenerator.pinModes.get(pin) : 'INPUT';
        autoSetup += `  pinMode(pin${pin}, ${mode});\n`;
    });
    // Interrupts NACH allen pinMode-Aufrufen einhängen
    autoSetup += autoSetupInterrupts;

    if (ArduinoGenerator.usedTimers && ArduinoGenerator.usedTimers.size > 0) {
        globals += "\n// --- TIMER ---\n";
        ArduinoGenerator.usedTimers.forEach(timer => { globals += `unsigned long ${timer} = 0;\n`; });
    }

    if (ArduinoGenerator.customVariables.size > 0) {
        globals += "\n// --- VARIABLEN ---\n";
        ArduinoGenerator.customVariables.forEach((type, name) => { globals += `${type} ${name};\n`; });
    }

    // --- BRANDING HEADER ---
    let fullCode = "// Generiert mit Ardublock Modular (R4 Edition)\n// © kreativekiste.de\n\n";
    
    if (includes !== "") fullCode += includes + "\n";
    fullCode += globals + "\n";
    fullCode += "void setup() {\n" + autoSetup + setup + "}\n\n";
    fullCode += "void loop() {\n" + loop + "}\n\n";
    
    if (isrFunctions !== "") fullCode += "// --- INTERRUPTS (ISR) ---\n" + isrFunctions;

    // --- UNTERPROGRAMME ANHÄNGEN ---
    // --- UNTERPROGRAMME SCANNEN (freischwebende Blöcke, nie in der Hauptkette) ---
    // blockToCode muss explizit aufgerufen werden, da diese Blöcke nicht mit arduino_main verbunden sind.
    // Der Generator von ard_function_define schreibt dann selbst in ArduinoGenerator.userFunctions.
    if (!ArduinoGenerator.userFunctions) ArduinoGenerator.userFunctions = new Map();
    ArduinoGenerator.userFunctions.clear();
    block.workspace.getBlocksByType('ard_function_define').forEach(funcBlock => {
        ArduinoGenerator.blockToCode(funcBlock);
    });

    if (ArduinoGenerator.userFunctions.size > 0) {
        fullCode += "\n// --- UNTERPROGRAMME ---\n";
        ArduinoGenerator.userFunctions.forEach((funcCode, name) => {
            fullCode += funcCode + "\n";
        });
    }

    if (ArduinoGenerator.needsSafeMillis) {
        fullCode += "// --- OVERFLOW-SICHERER MILLIS WRAPPER ---\n";
        fullCode += "unsigned long millis_safe() {\n  static unsigned long lastVal = 0;\n  unsigned long current = millis();\n  if (current < lastVal) { lastVal = 0; return 0; }\n  lastVal = current;\n  return current;\n}\n\n";
    }
    if (ArduinoGenerator.needsSafeMicros) {
        fullCode += "// --- OVERFLOW-SICHERER MICROS WRAPPER ---\n";
        fullCode += "unsigned long micros_safe() {\n  static unsigned long lastVal = 0;\n  unsigned long current = micros();\n  if (current < lastVal) { lastVal = 0; return 0; }\n  lastVal = current;\n  return current;\n}\n\n";
    }
    
    return fullCode;
};