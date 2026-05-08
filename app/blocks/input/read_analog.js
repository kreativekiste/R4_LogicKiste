// ==========================================
// BAUTEIL: ANALOG-EINGANG (Poti, LDR, etc.)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "read_analog",
    "message0": "Lese Analog-PIN %1",
    "args0": [
        {
            "type": "field_input", 
            "name": "PIN", 
            "text": "A0"
        }
    ],
    "output": "Number",
    "colour": 45,
    "tooltip": "Liest einen analogen Wert (0 bis 1023). Unterstützt A0 bis A5 und weitere analogfähige Pins des R4."
}]);

// FIX: Kein Scanner – Analogpins brauchen kein pinMode.
// Pin wird direkt in analogRead() genutzt, keine Core-Registrierung.

ArduinoGenerator.forBlock['read_analog'] = function(block) {
    const pin = block.getFieldValue('PIN');
    return [`analogRead(${pin})`, 0];
};
