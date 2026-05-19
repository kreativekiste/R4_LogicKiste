
Blockly.defineBlocksWithJsonArray([
    {
        "type": "ard_sys_reset",
        "message0": "Arduino neu starten (Reset)",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 290,
        "tooltip": "Startet den Arduino R4 per Software neu. Achtung: Nicht gespeicherte Daten gehen verloren!"
    }
]);

// GENERATOR LOGIK

ArduinoGenerator.forBlock['ard_sys_reset'] = function(block) {
    return '  NVIC_SystemReset();\n';
};