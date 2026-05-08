// ==========================================
// BAUTEIL: DELAY (Warteschleife)
// ==========================================

Blockly.defineBlocksWithJsonArray([{
    "type": "delay_ms",
    "message0": "Warten %1 ms",
    "args0": [
        {
            "type": "input_value",
            "name": "TIME",
            "check": "Number"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290,
    "tooltip": "ACHTUNG: Pausiert den gesamten Arduino. Besser millis() oder Timer verwenden!"
}]);

// Dieser Block braucht KEINEN dezentralen Scanner (hardwareScanners), 
// da er keine Globals, Includes oder Setup-Befehle generiert.
ArduinoGenerator.forBlock['delay_ms'] = function(block) {
    // Holt die Zeit flexibel (Zahl, Variable, Sensorwert etc.)
    // Standard-Fallback ist 1000, falls der Nutzer nichts andockt
    const time = ArduinoGenerator.valueToCode(block, 'TIME', 0) || '1000';
    
    return `  delay(${time});\n`;
};