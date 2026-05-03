// ==========================================
// BAUTEIL: INTERRUPTS (Hardware & Pin Change)
// ==========================================

Blockly.defineBlocksWithJsonArray([
    // --- 1. HARDWARE INTERRUPT ---
    {
        "type": "board_hw_interrupt",
        "message0": "Hardware Interrupt (Pin 2,3) %1 PIN: %2 %3 Auslöser: %4 %5 MACHE %6",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_number", "name": "PIN", "value": 2, "min": 0},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "MODE", "options": [
                ["Steigend (RISING)", "RISING"], 
                ["Fallend (FALLING)", "FALLING"], 
                ["Wechsel (CHANGE)", "CHANGE"], 
                ["Tief (LOW)", "LOW"],
                ["Hoch (HIGH)", "HIGH"]
            ]},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 210,
        "tooltip": "Wird sofort ausgeführt, wenn das Signal am Pin sich ändert. Unterbricht das restliche Programm."
    },

    // --- 2. PIN CHANGE INTERRUPT (PCINT) ---
    {
        "type": "board_pc_interrupt",
        "message0": "Pin Change Interrupt (Alle Pins) %1 PIN: %2 %3 Auslöser: %4 %5 MACHE %6",
        "args0": [
            {"type": "input_dummy"},
            {"type": "field_number", "name": "PIN", "value": 8, "min": 0},
            {"type": "input_dummy"},
            {"type": "field_dropdown", "name": "MODE", "options": [
                ["Steigend (RISING)", "RISING"], 
                ["Fallend (FALLING)", "FALLING"], 
                ["Wechsel (CHANGE)", "CHANGE"]
            ]},
            {"type": "input_dummy"},
            {"type": "input_statement", "name": "DO"}
        ],
        "colour": 210,
        "tooltip": "Benötigt die Bibliothek PinChangeInterrupt! Erlaubt Interrupts auf fast allen Pins."
    }
]);

// HINWEIS: Es gibt hier keinen ArduinoGenerator.forBlock! 
// Warum? Weil das keine Blöcke sind, die "in" der Kette laufen. 
// Der Hauptblock (arduino_main) sucht sich diese Blöcke selbst auf der Fläche zusammen!