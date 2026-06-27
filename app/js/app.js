let workspace;
let codeVisible = true;

document.addEventListener("DOMContentLoaded", () => {
    // TOOLBOX SETUP (JSON)
    const toolbox = {
        "kind": "categoryToolbox",
        "contents": [
            // 1. BOARD
            { 
                "kind": "category", "name": "Board", "colour": "210",
                "contents": [
                    {"kind": "block", "type": "arduino_main"},
                    {"kind": "block", "type": "board_pc_interrupt"},
					{"kind": "block", "type": "kommentar"}, 
					{"kind": "label", "text": "--- Farb-Container ---"},
					{"kind": "block", "type": "ard_container_red"},
					{"kind": "block", "type": "ard_container_orange"},
					{"kind": "block", "type": "ard_container_yellow"},
					{"kind": "block", "type": "ard_container_green"},
					{"kind": "block", "type": "ard_container_cyan"},
					{"kind": "block", "type": "ard_container_blue"},
					{"kind": "block", "type": "ard_container_purple"}
                ] 
            },
			
            // 2. STEUERUNG
            {
                "kind": "category", "name": "Steuerung", "colour": "290",
                "contents": [
                    {"kind": "block", "type": "logic_if"},
                    {"kind": "block", "type": "logic_if_else"},
                    {"kind": "block", "type": "loop_repeat"},
                    {"kind": "block", "type": "loop_for"},
                    {"kind": "block", "type": "ard_loop_while"},
                    {"kind": "block", "type": "ard_switch"},
                    {"kind": "block", "type": "ard_case"},
                    {"kind": "block", "type": "ard_default"}
                ]
            },

            // 2b. Zeiten
            {
                "kind": "category", "name": "Zeit", "colour": "290",
                "contents": [
                    {
                        "kind": "category", "name": "Zeiten", "colour": "290",
                        "contents": [
                            {"kind": "block", "type": "delay_ms"},
                            {"kind": "block", "type": "delay_micros"},
                            {"kind": "block", "type": "ard_time_sys"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Generatoren", "colour": "290",
                        "contents": [
                            {"kind": "label", "text": "--- Mache alle X ---"},
                            {"kind": "block", "type": "do_them_all"},
							{"kind": "label", "text": "--- Mache alle X zähle ---"},
                            {"kind": "block", "type": "timer_counter_main"},
                            {"kind": "block", "type": "timer_counter_get"},
                            {"kind": "block", "type": "timer_counter_set"},
                            {"kind": "block", "type": "timer_counter_reset"},
                            {"kind": "label", "text": "--- Stoppuhr ---"},
                            {"kind": "block", "type": "stopwatch_define"},
                            {"kind": "block", "type": "stopwatch_command"},
                            {"kind": "block", "type": "stopwatch_read"},
                            {"kind": "label", "text": "--- Blinker ---"},
                            {"kind": "block", "type": "ard_blinker_define"},
                            {"kind": "block", "type": "ard_blinker"},
                            {"kind": "block", "type": "ard_blinker_get"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Echtzeituhr", "colour": "290",
                        "contents": [
                            {"kind": "block", "type": "ard_rtc_setup"},
                            {"kind": "block", "type": "ard_rtc_read"},
                            {"kind": "block", "type": "ard_rtc_write"}
                        ]
                    }
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
                            {"kind": "block", "type": "read_analog"},
                            {"kind": "block", "type": "analog_smooth"} 
                        ]
                    },
                    {
                        "kind": "category", "name": "Taster & Zähler", "colour": "65",
                        "contents": [
                            {"kind": "block", "type": "input_counter"},
                            {"kind": "block", "type": "input_encoder"},
							{"kind": "label", "text": "--- Tasterfunktionen ---"},
							{"kind": "block", "type": "ard_button_event"},
							{"kind": "block", "type": "ard_button_get_counter"}, 
							{"kind": "block", "type": "ard_button_set_counter"}, 
							{"kind": "block", "type": "ard_button_reset_counter"}
                        ]
                    },
					
					
                    {
                        "kind": "category", "name": "Sensoren", "colour": "85",
                        "contents": [
                            {"kind": "block", "type": "read_dht"},
                            {"kind": "block", "type": "read_ultrasonic"},
                            {"kind": "label", "text": "--- Gyro (MPU6050) ---"},
                            {"kind": "block", "type": "gyro_setup"}, 
                            {"kind": "block", "type": "gyro_read"},  
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
                            {"kind": "block", "type": "write_analog"},
                            {"kind": "block", "type": "output_tone"} 
                        ]
                    },
					
					{
                        "kind": "category", "name": "Audio", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "mp3_setup"},
                            {"kind": "block", "type": "mp3_volume"},
                            {"kind": "block", "type": "mp3_play_folder"},
                            {"kind": "block", "type": "mp3_control"}
                        ]
                    },

                   {
                        "kind": "category", "name": "Motoren", "colour": "180",
                        "contents": [
						    {"kind": "label", "text": "--- Servo ---"},
                            {"kind": "block", "type": "out_servo"},
                            {"kind": "block", "type": "out_servo_ramp"},
                            {"kind": "block", "type": "out_servo_attach"},
                            {"kind": "block", "type": "out_servo_detach"},
							{"kind": "label", "text": "--- Stepper ---"},
                            {"kind": "block", "type": "stepper_setup"},
                            {"kind": "block", "type": "stepper_move"},
                            {"kind": "block", "type": "stepper_reset"},
							{"kind": "label", "text": "--- Nema ---"},
                            {"kind": "block", "type": "stepper_nema_control"},
                            {"kind": "block", "type": "stepper_nema_coop"},
							{"kind": "block", "type": "stepper_nema_position"},
							{"kind": "block", "type": "stepper_nema_reset"}
                        ]
                    },
                    {
                        "kind": "category", "name": "Licht & Matrix", "colour": "140",
                        "contents": [
                            {"kind": "label", "text": "--- NeoPixel (FastLED) ---"},
                            {"kind": "block", "type": "neopixel_setup"},
                            {"kind": "block", "type": "neopixel_set_single"},
                            {"kind": "block", "type": "neopixel_set_list"},
                            {"kind": "block", "type": "neopixel_show"},
                            {"kind": "block", "type": "neopixel_brightness"},
                            {"kind": "block", "type": "neopixel_clear"},
                            {"kind": "block", "type": "neopixel_custom_code"},

                            // --- R4 ONBOARD MATRIX ---
                            {"kind": "label", "text": "--- R4 Onboard Matrix ---"},
                            {"kind": "block", "type": "r4_matrix_setup"},
                            {"kind": "block", "type": "r4_matrix_symbol"},
                            {"kind": "block", "type": "r4_matrix_print_static"}, 
                            {"kind": "block", "type": "r4_matrix_print"},
                            {"kind": "block", "type": "r4_matrix_pixels"},
                            {"kind": "block", "type": "r4_matrix_clear"},

                            // --- MAX7219  ---
                            {"kind": "label", "text": "--- MAX7219 Matrix ---"},
                            {"kind": "block", "type": "max7219_setup"},
                            {"kind": "block", "type": "max7219_print"},
                            {"kind": "block", "type": "max7219_animation"},  
                            {"kind": "block", "type": "max7219_set_intensity"},
                            {"kind": "block", "type": "max7219_set_pixel"},
                            {"kind": "block", "type": "max7219_set_list"},
                            {"kind": "block", "type": "max7219_control"}
										
                        ]
                    },
					
                 {
                        "kind": "category", "name": "Displays", "colour": "120",
                        "contents": [
                            {"kind": "label", "text": "--- I2C LCD ---"},
                            {"kind": "block", "type": "setup_lcd_i2c"},
                            {"kind": "block", "type": "out_lcd_i2c"},
                            {"kind": "block", "type": "out_lcd_clear"},
                            {"kind": "block", "type": "out_lcd_action"},
                            {"kind": "label", "text": "--- TFT Displays ---"},
                            {"kind": "block", "type": "tft_setup_st7735"},
                            {"kind": "block", "type": "tft_setup_ili9486"},
                            {"kind": "block", "type": "tft_print_text"},
                            {"kind": "block", "type": "tft_draw_shape"},
                            {"kind": "block", "type": "tft_dimensions"},						
                            {"kind": "label", "text": "--- TM Displays ---"},
                            {"kind": "block", "type": "ard_visu_tm1637_setup"},  
							{"kind": "block", "type": "ard_visu_tm1637_brightn"},  
                            {"kind": "block", "type": "ard_visu_tm1637_print"},      
                            {"kind": "label", "text": "--- TM1638 Modell 1  ---"},
							{"kind": "block", "type": "ard_visu_tm1638_setup_mod1"},   
							{"kind": "block", "type": "ard_visu_tm1638_brightn_mod1"},  
							{"kind": "block", "type": "ard_visu_tm1638_print_mod1"},     
                            {"kind": "block", "type": "ard_visu_tm1638_read_key_mod1"},   
                            {"kind": "block", "type": "ard_visu_tm1638_key_pressed_mod1"},   
                            {"kind": "block", "type": "ard_visu_tm1638_any_key_mod1"},      
                            {"kind": "block", "type": "ard_visu_tm1638_led"},  
                            {"kind": "block", "type": "ard_visu_tm1638_led_var"},							
                            {"kind": "label", "text": "--- TM1638 Modell 2  ---"},
							{"kind": "block", "type": "ard_visu_tm1638_setup"},          
							{"kind": "block", "type": "ard_visu_tm1638_brightn"},  
							{"kind": "block", "type": "ard_visu_tm1638_print"},     
                            {"kind": "block", "type": "ard_visu_tm1638_read_key"},     
                            {"kind": "block", "type": "ard_visu_tm1638_key_pressed"}, 
                            {"kind": "block", "type": "ard_visu_tm1638_any_key"},
                            {"kind": "label", "text": "--- OLED Display ---"},
                            {"kind": "block", "type": "ard_oled_setup"},
                            {"kind": "block", "type": "ard_oled_set_font"},
                            {"kind": "block", "type": "ard_oled_clear"},
                            {"kind": "block", "type": "ard_oled_fill"},
                            {"kind": "block", "type": "ard_oled_print"},
                            {"kind": "block", "type": "ard_oled_print_xy"},
                            {"kind": "block", "type": "ard_oled_print_xy_color"},
                            {"kind": "block", "type": "ard_oled_draw_shape"},
                            {"kind": "block", "type": "ard_oled_draw_picture"}
                        ]
                    },
					
				{
    "kind": "category", "name": "DMX", "colour": "250",
    "contents": [
		{"kind": "label", "text": "--- DMX direkt ---"},
        {"kind": "block", "type": "dmx_setup_direct"},
        {"kind": "block", "type": "dmx_write_direct"},
        {"kind": "label", "text": "--- DMX buffer ---"},
        {"kind": "block", "type": "dmx_setup_buffered"},
        {"kind": "block", "type": "dmx_frame_buffered"},
        {"kind": "block", "type": "dmx_write_buffered"},
        {"kind": "label", "text": "--- DMX einfach ---"},
        {"kind": "block", "type": "dmx_setup_simple"},
        {"kind": "block", "type": "dmx_begin_simple"},
        {"kind": "block", "type": "dmx_write_simple"},
        {"kind": "block", "type": "dmx_end_simple"},
        {"kind": "label", "text": "--- DMX lesen---"},
        {"kind": "block", "type": "dmx_read"},
        {"kind": "block", "type": "dmx_available"},
        {"kind": "block", "type": "dmx_stop"}
    ]
}
							
					
                ] 
            },

			// NEUER REITER: P-Manipulation
            { 
                "kind": "category", "name": "P-Manipulation", "colour": "160",
                "contents": [
                    {
                        "kind": "category", "name": "Arduino Ports", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "ard_virtual_port_define"},
                            {"kind": "block", "type": "ard_virtual_port_write"},
                            {"kind": "block", "type": "ard_virtual_port_read"}
                        ]
                    },
                    {
                        "kind": "category", "name": "TCA9555", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "tca_write_pin"},
                            {"kind": "block", "type": "tca_read_pin"},
                            {"kind": "block", "type": "tca_write_pattern"},
                            {"kind": "block", "type": "tca_read_pattern"}
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
                    {"kind": "block", "type": "logic_ternary"}, 
                    {"kind": "block", "type": "ard_math_arithmetic"},
                    {"kind": "block", "type": "ard_math_number"},
                    {"kind": "block", "type": "ard_math_map"},
                    {"kind": "block", "type": "ard_math_constrain"},
                    {"kind": "block", "type": "ard_math_random_seed"},
                    {"kind": "block", "type": "ard_math_random_int"},
					{"kind": "label", "text": "--- Erweiterte Mathe ---"},
					{"kind": "block", "type": "math_correction_single"},
					{"kind": "block", "type": "math_correction_double"},
					{"kind": "block", "type": "math_trig_root"},
					{"kind": "block", "type": "math_power"},
					{"kind": "block", "type": "math_pi"}
                ] 
            },

            // 6. VARIABLEN
            { 
                "kind": "category", "name": "Variablen", "colour": "330",
                "contents": [
                    {
                        "kind": "button",
                        "text": "➕ Neue Variable erstellen...",
                        "callbackKey": "CREATE_VAR_BTN"
                    },
                    {"kind": "block", "type": "var_text_literal"},
                    {"kind": "block", "type": "var_number_literal"},
                    {"kind": "block", "type": "var_declare"},
                    {"kind": "block", "type": "var_declare_interrupt"},
                    {"kind": "block", "type": "var_set"},
                    {"kind": "block", "type": "var_get"},
                    {"kind": "label", "text": "--- Tabellen (Arrays) ---"},
                    {"kind": "block", "type": "array_declare"}, 
                    {"kind": "block", "type": "array_write"},   
                    {"kind": "block", "type": "array_read"}     
                ] 
            },

            // 7. UNTERPROGRAMME
            { 
                "kind": "category", "name": "Unterprogramme", "colour": "290",
                "contents": [
                    {"kind": "label", "text": "--- Ohne Rückgabewert ---"},
                    {"kind": "block", "type": "ard_function_define"},
                    {"kind": "block", "type": "ard_function_call"},
                    {"kind": "label", "text": "--- Mit Rückgabewert ---"},
                    {"kind": "block", "type": "ard_function_define_return"},
                    {"kind": "block", "type": "ard_function_return"},
                    {"kind": "block", "type": "ard_function_call_return"}
                ] 
            },

          // 8. ERWEITERT
            { 
                "kind": "category", "name": "Erweitert", "colour": "160",
                "contents": [
                    {
                        "kind": "category", "name": "Serial (PC)", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "ard_serial_begin"},
                            {"kind": "block", "type": "ard_serial_print"},
                            {"kind": "block", "type": "ard_serial_available"},
                            {"kind": "block", "type": "ard_serial_read_string"},
                            {"kind": "block", "type": "ard_serial_read_number"}
                        ]
                    },
                    {
                        "kind": "category", "name": "EEPROM", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "ard_eeprom_write"},
                            {"kind": "block", "type": "ard_eeprom_read"}
                        ]
                    },
                    {
                        "kind": "category", "name": "SD Karte", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "ard_sd_begin"},
                            {"kind": "block", "type": "ard_sd_write"},
                            {"kind": "block", "type": "ard_sd_exists"},
                            {"kind": "block", "type": "ard_sd_remove"}
                        ]
                    },
                    {
                        "kind": "category", "name": "C++", "colour": "160",
                        "contents": [
                            {"kind": "block", "type": "ard_custom_code_inline"},
                            {"kind": "block", "type": "ard_custom_code_global"}
                        ]
                    }
                ] 
            },
			
			{ 
                "kind": "category", "name": "WLAN", "colour": "210",
                "contents": [
                    {"kind": "block", "type": "web_setup"},
                    {"kind": "block", "type": "web_listen"},
					{"kind": "block", "type": "web_ip"},
                    {"kind": "block", "type": "web_status_read"},
                    {"kind": "label", "text": "--- Daten senden (zu Web) ---"},
                    {"kind": "block", "type": "web_digital_write"},
                    {"kind": "block", "type": "web_analog_write"},
                    {"kind": "label", "text": "--- Daten empfangen (von Web) ---"},
                    {"kind": "block", "type": "web_digital_read"},
                    {"kind": "block", "type": "web_analog_read"}
                ] 
            },
			
			// Processing APP

         { 
                "kind": "category", "name": "Processing", "colour": "130",
                "contents": [
                    {"kind": "block", "type": "ard_hmi_setup"},
                    {"kind": "label", "text": "--- von PC Empfangen ---"},
                    {"kind": "block", "type": "ard_hmi_receive"},
                    {"kind": "block", "type": "ard_hmi_get_number"},
                    {"kind": "block", "type": "ard_hmi_get_string"},
                    {"kind": "label", "text": "--- zu PC Senden ---"},
                    {"kind": "block", "type": "ard_hmi_send"}
                ] 
            },
			
			
			// G-ENGINE KATEGORIE
            { 
                "kind": "category", "name": "G-Engine", "colour": "160",
                "contents": [
                    {"kind": "label", "text": "--- System ---"},
                    {"kind": "block", "type": "g_engine_main"},
                    {"kind": "block", "type": "g_engine_timer"},
                    {"kind": "block", "type": "g_engine_game_over"},
                    
                    {"kind": "label", "text": "--- Akteure (Sprites) ---"},
                    {"kind": "block", "type": "g_engine_sprite_create"},
                    {"kind": "block", "type": "g_engine_sprite_move"},
                    {"kind": "block", "type": "g_engine_sprite_destroy"},

                    {"kind": "label", "text": "--- Steuerung ---"},
                    {"kind": "block", "type": "g_engine_input_button"},
                    
                    {"kind": "label", "text": "--- Logik & Events ---"},
                    {"kind": "block", "type": "g_engine_collision_check"}
                ] 
            }
				
        ]
    };

    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        media: './media/',
        grid: {spacing: 20, length: 3, colour: '#ccc', snap: true},
        scrollbars: true
    });

    workspace.registerButtonCallback('CREATE_VAR_BTN', function(button) {
        Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, '');
    });

    let debounceTimer = null;

    function generateCode() {
        const root = workspace.getBlocksByType('arduino_main')[0];
        const codeDisplay = document.getElementById('codeExport');

        if (root) {
            try {
                if (typeof ArduinoGenerator !== 'undefined') {
                    ArduinoGenerator.init(workspace);
                    codeDisplay.innerText = ArduinoGenerator.blockToCode(root);
                } else {
                    codeDisplay.innerText = "// WARNUNG: ArduinoGenerator ist nicht definiert.";
                }
            } catch (error) {
                console.error("Code-Generierungs-Fehler:", error);
                codeDisplay.innerText = "// FEHLER bei der C++ Generierung.\n// Bitte öffne die F12 Entwicklerkonsole für Details.";
            }
        } else {
            codeDisplay.innerText = "// Bitte Start-Block einfügen";
        }
    }

    workspace.addChangeListener((event) => {
        const relevant = [
            Blockly.Events.BLOCK_CHANGE,
            Blockly.Events.BLOCK_MOVE,
            Blockly.Events.BLOCK_CREATE,
            Blockly.Events.BLOCK_DELETE,
        ];
        if (!relevant.includes(event.type)) return;

        if (workspace.isDragging && workspace.isDragging()) return;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(generateCode, 250);
    });

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