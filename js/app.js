let workspace;

document.addEventListener("DOMContentLoaded", () => {
    // --- TOOLBOX SETUP (JSON) ---
    const toolbox = {
        "kind": "categoryToolbox",
        "contents": [
            { 
                "kind": "category", "name": "Board", "colour": "210",
                "contents": [
                    {"kind": "block", "type": "arduino_main"},
                    {"kind": "block", "type": "board_hw_interrupt"},
                    {"kind": "block", "type": "board_pc_interrupt"}
                ] 
            },
            { 
                "kind": "category", "name": "Eingänge", "colour": "45",
                "contents": [
                    {"kind": "block", "type": "ard_setup_pullup"}, 
                    {"kind": "block", "type": "ard_read_digital"}, 
                    {"kind": "block", "type": "read_analog"},
                    {"kind": "block", "type": "input_counter"},
                    {"kind": "block", "type": "input_encoder"},
                    {"kind": "block", "type": "read_dht"},
                    {"kind": "block", "type": "ard_serial_available"},
                    {"kind": "block", "type": "ard_serial_read_string"},
                    {"kind": "block", "type": "ard_serial_read_int"},
                    {"kind": "block", "type": "read_ultrasonic"}
                ] 
            },
            { 
                "kind": "category", "name": "Ausgänge", "colour": "160",
                "contents": [
                    {
                        "kind": "category", "name": "Standard Pins", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "write_digital"}, 
                            {"kind": "block", "type": "write_analog"},
                            {"kind": "block", "type": "serial_print"}
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
                            {"kind": "block", "type": "text_string"},
                            {"kind": "block", "type": "tft_draw_shape"},
                            {"kind": "block", "type": "tft_dimensions"}
                        ]
                    }
                ] 
            },
            { 
                "kind": "category", "name": "Unterprogramme", "colour": "290",
                "contents": [
                    {"kind": "block", "type": "ard_function_define"},
                    {"kind": "block", "type": "ard_function_call"}
                ] 
            },
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
                    {"kind": "block", "type": "stopwatch_command"},
                    {"kind": "block", "type": "stopwatch_read"}
                ] 
            },
            { 
                "kind": "category", "name": "Logik & Mathe", "colour": "230",
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
            { 
                "kind": "category", "name": "Variablen", "colour": "330",
                "contents": [
                    {"kind": "block", "type": "var_declare"},
                    {"kind": "block", "type": "var_get"}
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

    Blockly.serialization.workspaces.load({
        "blocks": {"languageVersion": 0, "blocks": [{"type": "arduino_main", "x": 50, "y": 50}]}
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

let codeVisible = true;
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