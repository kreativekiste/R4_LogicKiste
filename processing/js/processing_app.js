let workspace;
let codeVisible = true;

document.addEventListener("DOMContentLoaded", () => {
    // 1. TOOLBOX SETUP (JSON) 
    const toolbox = {
        "kind": "categoryToolbox",
        "contents": [
            { 
                "kind": "category", "name": "Draw", "colour": "210",
                "contents": [
                    {"kind": "block", "type": "processing_main"}
                ] 
            },
			
          { 
                "kind": "category", "name": "Kommunikation", "colour": "130",
                "contents": [
                    {"kind": "block", "type": "processing_hmi_setup"},
                    {"kind": "label", "text": "--- Vom Arduino Empfangen ---"},
                    {"kind": "block", "type": "processing_hmi_receive"},
                    {"kind": "block", "type": "processing_hmi_get_number"},
                    {"kind": "block", "type": "processing_hmi_get_string"},
                    {"kind": "label", "text": "--- zum Arduino Senden ---"},
                    {"kind": "block", "type": "processing_hmi_send"}
                ] 
            },
			
            { 
                "kind": "category", "name": "Formen & Farben", "colour": "160",
                "contents": [
                    {"kind": "label", "text": "--- Stifte & Hintergrund ---"},
                    {"kind": "block", "type": "processing_background"},
                    {"kind": "block", "type": "processing_fill"},
                    {"kind": "block", "type": "processing_no_fill"},
                    {"kind": "block", "type": "processing_stroke"},
                    {"kind": "block", "type": "processing_no_stroke"},
                    {"kind": "block", "type": "processing_stroke_weight"},
                    {"kind": "label", "text": "--- Formen ---"},
                    {"kind": "block", "type": "processing_rect"},
                    {"kind": "block", "type": "processing_ellipse"},
                    {"kind": "block", "type": "processing_line"}
                ] 
            },
            { 
                "kind": "category", "name": "Texte", "colour": "160",
                "contents": [
                    {"kind": "label", "text": "--- Text eingeben ---"},
                    {"kind": "block", "type": "processing_text_val"},
                    {"kind": "block", "type": "processing_number"},
                    {"kind": "label", "text": "--- Text ändern ---"},
                    {"kind": "block", "type": "processing_text"},
                    {"kind": "block", "type": "processing_text_size"},
                    {"kind": "block", "type": "processing_text_align"},
                    {"kind": "block", "type": "processing_text_color"},
                    {"kind": "block", "type": "processing_text_font"}
                ] 
            },
            { 
                "kind": "category", "name": "Input", "colour": "120",
                "contents": [
                    {"kind": "block", "type": "processing_input_button"},
                    {"kind": "block", "type": "processing_input_slider"},
                    {"kind": "block", "type": "processing_input_number"},
                    {"kind": "block", "type": "processing_input_text"}
                ] 
            },
            { 
                "kind": "category", "name": "Output", "colour": "140",
                "contents": [
                    {"kind": "block", "type": "processing_output_digital_lamp"},
                    {"kind": "block", "type": "processing_output_analog_lamp"},
                    {"kind": "block", "type": "processing_output_bar"},
                    {"kind": "block", "type": "processing_output_dial"}
                ] 
            },
			
			{ 
                "kind": "category", "name": "Timer", "colour": "290",
                "contents": [
                    {"kind": "block", "type": "processing_timer_interval"},
                    {"kind": "block", "type": "processing_time_millis"},
                    {"kind": "label", "text": "--- Stoppuhr ---"},
                    {"kind": "block", "type": "processing_stopwatch_define"},
                    {"kind": "block", "type": "processing_stopwatch_command"},
                    {"kind": "block", "type": "processing_stopwatch_read"}
                ] 
            },
	
			{ 
                "kind": "category", "name": "Bilder", "colour": "70",
                "contents": [
                    {"kind": "label", "text": "--- Bilder laden & zeigen ---"},
                    {"kind": "block", "type": "processing_image_load"},
                    {"kind": "block", "type": "processing_image_show"},
                    {"kind": "label", "text": "--- Effekte (Transparenz & Farbe) ---"},
                    {"kind": "block", "type": "processing_image_tint"},
                    {"kind": "block", "type": "processing_image_tint_color"},
                    {"kind": "block", "type": "processing_image_no_tint"}
                ] 
            },
            { 
                "kind": "category", "name": "Sounds", "colour": "290",
                "contents": [
                    {"kind": "label", "text": "--- Audio laden (Setup) ---"},
                    {"kind": "block", "type": "processing_sound_load"},
                    {"kind": "label", "text": "--- Audio Abspielen ---"},
                    {"kind": "block", "type": "processing_sound_action"},
                    {"kind": "block", "type": "processing_sound_volume"},
					{"kind": "label", "text": "--- Synthesizer ---"},
                    {"kind": "block", "type": "processing_synth_init"},
                    {"kind": "block", "type": "processing_synth_freq"},
                    {"kind": "block", "type": "processing_synth_amp"},
                    {"kind": "block", "type": "processing_synth_control"}
                ] 
            },
			
			
            { 
                "kind": "category", "name": "Logik", "colour": "230",
                "contents": [
                    {"kind": "label", "text": "--- Logik ---"},
                    {"kind": "block", "type": "processing_if"},
                    {"kind": "block", "type": "processing_if_else"},
                    {"kind": "block", "type": "processing_compare"},
                    {"kind": "block", "type": "processing_boolean"},
                    {"kind": "label", "text": "--- Mathe ---"},
                    {"kind": "block", "type": "processing_math"},
                    {"kind": "block", "type": "processing_map"},
                    {"kind": "block", "type": "processing_constrain"},
                    {"kind": "block", "type": "processing_min_max"},
                    {"kind": "block", "type": "processing_round_abs"},
                    {"kind": "block", "type": "processing_power"},
                    {"kind": "block", "type": "processing_number"}
                ] 
            },
			
			
			
            { 
                "kind": "category", "name": "Variablen", "colour": "330",
                "contents": [
                    {"kind": "label", "text": "--- Variablen ---"},
                    {"kind": "block", "type": "processing_var_set"},
                    {"kind": "block", "type": "processing_var_get"},
                    {"kind": "label", "text": "--- Schnittstellen-Daten ---"},
                    {"kind": "block", "type": "processing_array_get_float"},
                    {"kind": "label", "text": "--- Text ---"},
                    {"kind": "block", "type": "processing_text_val"}
                ] 
            },
			
			{ 
    "kind": "category", "name": "Container", "colour": "250",
    "contents": [
        {"kind": "block", "type": "processing_container_red"},
        {"kind": "block", "type": "processing_container_orange"},
        {"kind": "block", "type": "processing_container_yellow"},
        {"kind": "block", "type": "processing_container_green"},
        {"kind": "block", "type": "processing_container_cyan"},
        {"kind": "block", "type": "processing_container_blue"},
        {"kind": "block", "type": "processing_container_purple"}
    ] 
},
			
			
			
			
			
			
			
			
			
		
        ]
    };

    // 2. Blockly injizieren
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        media: './media/',
        grid: {spacing: 20, length: 3, colour: '#ccc', snap: true},
        scrollbars: true
    });

    let debounceTimer = null;

    // 3. Code generieren
    function generateCode() {
        const root = workspace.getBlocksByType('processing_main')[0];
        const codeDisplay = document.getElementById('codeExport');

        if (root) {
            try {
                if (typeof ProcessingGenerator !== 'undefined') {
                    ProcessingGenerator.init(workspace);
                    codeDisplay.innerText = ProcessingGenerator.blockToCode(root);
                } else {
                    codeDisplay.innerText = "// WARNUNG: ProcessingGenerator fehlt.";
                }
            } catch (error) {
                console.error("Code-Generierungs-Fehler:", error);
                codeDisplay.innerText = "// FEHLER bei der Generierung.";
            }
        } else {
            codeDisplay.innerText = "// Bitte den Start-Block einfuegen";
        }
    }

    // 4. Auf Änderungen reagieren
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

    // 5. Standardmäßig den Start-Block laden
    Blockly.serialization.workspaces.load({
        "blocks": {
            "languageVersion": 0, 
            "blocks": [
                {
                    "type": "processing_main", 
                    "x": 50, 
                    "y": 50,
                    "deletable": false,
                    "movable": true
                }
            ]
        }
    }, workspace);
});

// --- UI FUNKTIONEN ---

function saveWorkspace() {
    const state = Blockly.serialization.workspaces.save(workspace);
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "processing_visu.json";
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
            alert("Fehler beim Laden der Datei. Ist es eine gueltige JSON Datei?");
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