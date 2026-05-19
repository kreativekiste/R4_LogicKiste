
Blockly.defineBlocksWithJsonArray([
    // TEXT EINGABE
    {
        "type": "var_text_literal",
        "message0": "\" %1 \"",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": ""
            }
        ],
        "output": "String",
        "colour": 160,
        "tooltip": "Ein einfacher Textbaustein. Schreibe hier deinen Text rein."
    },
    
    // ZAHLEN EINGABE
    {
        "type": "var_number_literal",
        "message0": "%1",
        "args0": [
            {
                "type": "field_number",
                "name": "NUM",
                "value": 0
            }
        ],
        "output": "Number",
        "colour": 230,
        "tooltip": "Ein einfacher Zahlenwert."
    }
]);


// C++ GENERATOREN

ArduinoGenerator.forBlock['var_text_literal'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = '"' + textValue + '"'; 
    return [code, 0];
};

ArduinoGenerator.forBlock['var_number_literal'] = function(block) {
    const numberValue = block.getFieldValue('NUM');
    return [String(numberValue), 0];
};