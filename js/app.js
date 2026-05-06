let workspace;
let codeVisible = true;

document.addEventListener("DOMContentLoaded", () => {
    // --- TOOLBOX SETUP (JSON) ---
    const toolbox = {
        "kind": "categoryToolbox",
        "contents": [
            // 1. BOARD
            { 
                "kind": "category", "name": "Board", "colour": "210",
                "contents": [
                    {"kind": "block", "type": "arduino_main"},
                    {"kind": "block", "type": "board_pc_interrupt"}
                ] 
            },
            
            // 2. STEUERUNG
            { 
                "kind": "category", "name": "Steuerung", "colour": "290",
                "contents": [
                    {"kind": "block", "type": "logic_if"}, 
                    {"kind": "block", "type": "logic_if_else"}, 
                    {"kind": "block", "type": "loop_repeat"},
                    {"kind": "block", "type": "ard_loop_while"},
                    {"kind": "block", "type": "ard_time_sys"},
                    {"kind": "block", "type": "ard_switch"},
                    {"kind": "block", "type": "ard_case"},
                    {"kind": "block", "type": "ard_default"},
                    {"kind": "block", "type": "delay_ms"},
                    {"kind": "block", "type": "timer_interval"},
                    {"kind": "block", "type": "ard_blinker_define"},
                    {"kind": "block", "type": "ard_blinker"},
                    {"kind": "block", "type": "stopwatch_command"},
                    {"kind": "block", "type": "stopwatch_read"}
                ] 
            },

            // 3. EINGÄNGE
            { 
                "kind": "category", "name": "Eingänge", "colour": "45",
                "contents": [
                    {
                        "kind": "category", "name": "Standard Pins", "colour": "45",
                        "contents": [
                            {"kind": "block", "type": "ard_setup_pullup"}, 
                            {"kind": "block", "type": "ard_read_digital"}, 
                            {"kind": "block", "type": "read_analog"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Taster & Zähler", "colour": "65",
                        "contents": [
                            {"kind": "block", "type": "input_counter"},
                            {"kind": "block", "type": "input_encoder"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Sensoren", "colour": "85",
                        "contents": [
                            {"kind": "block", "type": "read_dht"},
                            {"kind": "block", "type": "read_ultrasonic"},
                            {"kind": "label", "text": "--- RFID (RC522) ---"},
                            {"kind": "block", "type": "ard_rfid_setup"},
                            {"kind": "block", "type": "ard_rfid_on_card"},
                            {"kind": "block", "type": "ard_rfid_get_id"}
                        ]
                    }
                ] 
            },

            // 4. AUSGÄNGE
            { 
                "kind": "category", "name": "Ausgänge", "colour": "160",
                "contents": [
                    {
                        "kind": "category", "name": "Standard Pins", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "write_digital"}, 
                            {"kind": "block", "type": "write_analog"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Antrieb (Motoren)", "colour": "180",
                        "contents": [
                            {"kind": "block", "type": "out_servo"},
                            {"kind": "block", "type": "stepper_setup"},
                            {"kind": "block", "type": "stepper_move"},
                            {"kind": "block", "type": "stepper_reset"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Licht & Matrix", "colour": "140",
                        "contents": [
                            {"kind": "block", "type": "neopixel_setup"},
                            {"kind": "block", "type": "neopixel_set_single"},
                            {"kind": "block", "type": "neopixel_set_list"},
                            {"kind": "block", "type": "neopixel_show"},
                            
                            // --- NEU: R4 ONBOARD MATRIX ---
                            {"kind": "label", "text": "--- R4 Onboard Matrix ---"},
                            {"kind": "block", "type": "r4_matrix_setup"},
                            {"kind": "block", "type": "r4_matrix_symbol"},
                            {"kind": "block", "type": "r4_matrix_print_static"}, // <-- HIER IST DER NEUE BLOCK!
                            {"kind": "block", "type": "r4_matrix_print"},
                            {"kind": "block", "type": "r4_matrix_pixels"},
                            {"kind": "block", "type": "r4_matrix_clear"},

                            // Bestehend: MAX7219
                            {"kind": "label", "text": "--- MAX7219 Matrix ---"},
                            {"kind": "block", "type": "max7219_setup"},
                            {"kind": "block", "type": "max7219_print"},
                            {"kind": "block", "type": "max7219_set_pixel"},
                            {"kind": "block", "type": "max7219_set_list"},
                            {"kind": "block", "type": "max7219_control"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Displays", "colour": "120",
                        "contents": [
                            {"kind": "block", "type": "out_lcd_i2c"},
                            {"kind": "block", "type": "out_lcd_clear"},
                            {"kind": "block", "type": "tft_setup_st7735"},
                            {"kind": "block", "type": "tft_setup_ili9486"},
                            {"kind": "block", "type": "tft_print_text"},
                            {"kind": "block", "type": "tft_draw_shape"},
                            {"kind": "block", "type": "tft_dimensions"},
                            {"kind": "label", "text": "--- TM Displays ---"},
                            {"kind": "block", "type": "ard_visu_tm1637_setup"},
                            {"kind": "block", "type": "ard_visu_tm1637_print"},
                            {"kind": "block", "type": "ard_visu_tm1638_setup"},
                            {"kind": "block", "type": "ard_visu_tm1638_print"},
                            {"kind": "block", "type": "ard_visu_tm1638_led"},
                            {"kind": "block", "type": "ard_visu_tm1638_button"}
                        ]
                    }
                ] 
            },

            // 5. LOGIK
            { 
                "kind": "category", "name": "Logik", "colour": "230",
                "contents": [
                    {"kind": "block", "type": "ard_logic_compare"},
                    {"kind": "block", "type": "ard_logic_operation"},
                    {"kind": "block", "type": "ard_logic_negate"},
                    {"kind": "block", "type": "ard_logic_boolean"},
                    {"kind": "block", "type": "ard_math_arithmetic"},
                    {"kind": "block", "type": "ard_math_number"},
                    {"kind": "block", "type": "ard_math_map"},
                    {"kind": "block", "type": "ard_math_constrain"},
                    {"kind": "block", "type": "ard_math_random_seed"},
                    {"kind": "block", "type": "ard_math_random_int"}
                ] 
            },

            // 6. VARIABLEN
            { 
                "kind": "category", "name": "Variablen", "colour": "330",
                "contents": [
                    {"kind": "block", "type": "var_text_literal"},
                    {"kind": "block", "type": "var_number_literal"},
                    {"kind": "block", "type": "var_declare"},
                    {"kind": "block", "type": "var_set"},
                    {"kind": "block", "type": "var_get"}
                ] 
            },

            // 7. UNTERPROGRAMME
            { 
                "kind": "category", "name": "Unterprogramme", "colour": "290",
                "contents": [
                    {"kind": "block", "type": "ard_function_define"},
                    {"kind": "block", "type": "ard_function_call"}
                ] 
            },

            // 8. ERWEITERT
            { 
                "kind": "category", "name": "Erweitert", "colour": "160",
                "contents": [
                    {"kind": "label", "text": "--- Serial ---"},
                    {"kind": "block", "type": "ard_serial_begin"},
                    {"kind": "block", "type": "ard_serial_print"},
                    {"kind": "block", "type": "ard_serial_available"},
                    {"kind": "block", "type": "ard_serial_read_string"},
                    {"kind": "label", "text": "--- Flash / EEPROM ---"},
                    {"kind": "block", "type": "ard_eeprom_write"},
                    {"kind": "block", "type": "ard_eeprom_read"},
                    {"kind": "label", "text": "--- SD Karte ---"},
                    {"kind": "block", "type": "ard_sd_begin"},
                    {"kind": "block", "type": "ard_sd_write"},
                    {"kind": "block", "type": "ard_sd_exists"},
                    {"kind": "block", "type": "ard_sd_remove"},
                    {"kind": "label", "text": "--- C++ Notausgang ---"},
                    {"kind": "block", "type": "ard_custom_code_inline"},
                    {"kind": "block", "type": "ard_custom_code_global"}
                ] 
            }
        ]
    };

    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        grid: {spacing: 20, length: 3, colour: '#ccc', snap: true},
        scrollbars: true
    });

    workspace.addChangeListener((event) => {
        const relevant = [
            Blockly.Events.BLOCK_CHANGE,
            Blockly.Events.BLOCK_MOVE,
            Blockly.Events.BLOCK_CREATE,
            Blockly.Events.BLOCK_DELETE,
        ];
        if (!relevant.includes(event.type)) return;
        const root = workspace.getBlocksByType('arduino_main')[0];
        document.getElementById('codeExport').innerText = root ? ArduinoGenerator.blockToCode(root) : "// Bitte Start-Block einfügen";
    });

    // --- Start-Block wird als "unzerstörbar" (deletable: false) geladen ---
    Blockly.serialization.workspaces.load({
        "blocks": {
            "languageVersion": 0, 
            "blocks": [
                {
                    "type": "arduino_main", 
                    "x": 50, 
                    "y": 50,
                    "deletable": false,
                    "movable": true
                }
            ]
        }
    }, workspace);
});

function saveWorkspace() {
    const state = Blockly.serialization.workspaces.save(workspace);
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mein_projekt.json";
    a.click();
    URL.revokeObjectURL(a.href);
}

function loadWorkspace(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            workspace.clear();
            Blockly.serialization.workspaces.load(json, workspace);
        } catch (err) {
            alert("Fehler beim Laden der Datei. Ist es eine gültige JSON Datei?");
            console.error(err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// --- Code in Zwischenablage kopieren ---
function copyGeneratedCode() {
    const code = document.getElementById('codeExport').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Kopiert!';
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    }).catch(err => {
        console.error('Fehler beim Kopieren: ', err);
    });
}

async function uploadCode() {
    const root = workspace.getBlocksByType('arduino_main')[0];
    if (!root) {
        alert("Kein PROGRAMM START Block gefunden!");
        return;
    }

    const code = ArduinoGenerator.blockToCode(root);
    const btn = document.getElementById('uploadBtn');
    const status = document.getElementById('uploadStatus');

    btn.disabled = true;
    btn.textContent = '⏳ Upload...';
    status.style.color = '#bdc3c7';
    status.textContent = 'Kompiliere...';

    try {
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: code
        });

        const text = await response.text();

        if (response.ok) {
            btn.textContent = '✅ Fertig!';
            status.style.color = '#1abc9c';
            status.textContent = text.split('\n')[0]; // Erste Zeile anzeigen
            setTimeout(() => {
                btn.textContent = '⬆️ Upload';
                status.textContent = '';
            }, 4000);
        } else {
            btn.textContent = '❌ Fehler';
            status.style.color = '#e74c3c';
            status.textContent = 'Siehe Konsole';
            console.error("Upload Fehler:\n" + text);
            setTimeout(() => {
                btn.textContent = '⬆️ Upload';
                status.textContent = '';
            }, 5000);
        }
    } catch (err) {
        btn.textContent = '❌ Keine Bridge';
        status.style.color = '#e74c3c';
        status.textContent = 'start_bridge.bat starten!';
        setTimeout(() => {
            btn.textContent = '⬆️ Upload';
            status.textContent = '';
        }, 5000);
    }

    btn.disabled = false;
}

function toggleCode() {
    const codeDiv = document.getElementById('codeExport');
    const headerText = document.getElementById('codeHeader');
    codeVisible = !codeVisible;
    if (codeVisible) {
        codeDiv.style.display = 'block';
        headerText.style.display = 'block';
    } else {
        codeDiv.style.display = 'none';
        headerText.style.display = 'none';
    }
    setTimeout(() => { Blockly.svgResize(workspace); }, 310);
}

function toggleGrid() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    blocklyDiv.classList.toggle('hide-grid');
}