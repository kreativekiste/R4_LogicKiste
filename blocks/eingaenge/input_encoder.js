// ==========================================
// BAUTEIL: ROTARY ENCODER (Interrupt-gesteuert für R4)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "input_encoder",
    "message0": "Drehencoder (UNO R4) %1 CLK Pin: %2 %3 DT Pin: %4 %5 Zähle in Variable: %6",
    "args0": [
        {"type": "input_dummy"},
        {"type": "field_number", "name": "PIN_CLK", "value": 2, "min": 0},
        {"type": "input_dummy"},
        {"type": "field_number", "name": "PIN_DT", "value": 3, "min": 0},
        {"type": "input_dummy"},
        {"type": "field_input", "name": "VAR_NAME", "text": "encoderWert"}
    ],
    "colour": 45,
    "tooltip": "Liest einen Drehregler völlig im Hintergrund per Interrupt aus. Die Variable kann jederzeit ausgelesen oder überschrieben werden."
}]);

