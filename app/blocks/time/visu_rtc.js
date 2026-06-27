// kreativekiste.de | 2026-05-20 | v1.1

Blockly.defineBlocksWithJsonArray([
    // 1. RTC Setup (Mit Smart Restart Logik)
    {
        "type": "ard_rtc_setup",
        "message0": "🕒 Setup Interne RTC (R4) %1 Auto-Zeit beim ersten Start: %2",
        "args0": [
            { "type": "input_dummy" },
            { "type": "field_checkbox", "name": "AUTO_SET", "checked": true }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 120,
        "tooltip": "Startet die interne Uhr. Smart-Restart: Überschreibt eine bestehende Zeit (durch Batterie) nicht!"
    },

    // 2. RTC Lesen (Mit Dropdown)
    {
        "type": "ard_rtc_read",
        "message0": "Lese RTC: %1",
        "args0": [
            { "type": "field_dropdown", "name": "PART", "options": [
                ["Stunde", "3"],
                ["Minute", "4"],
                ["Sekunde", "5"],
                ["Tag", "2"],
                ["Monat", "1"],
                ["Jahr", "0"],
                ["Wochentag (1-7)", "6"]
            ]}
        ],
        "output": "Number",
        "colour": 160,
        "tooltip": "Liest einen bestimmten Teil der aktuellen Uhrzeit aus."
    },

    // 3. RTC Schreiben / Setzen (Mit Dropdown)
    {
        "type": "ard_rtc_write",
        "message0": "Setze RTC %1 auf %2",
        "args0": [
            { "type": "field_dropdown", "name": "PART", "options": [
                ["Stunde", "3"],
                ["Minute", "4"],
                ["Sekunde", "5"],
                ["Tag", "2"],
                ["Monat", "1"],
                ["Jahr", "0"]
            ]},
            { "type": "input_value", "name": "VAL", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "Überschreibt gezielt einen Teil der Uhrzeit (z.B. über ein TFT-Menü)."
    }
]);


// C++ GENERATOREN: RTC
ArduinoGenerator.hardwareScanners['ard_rtc_setup'] = function(block) {
    ArduinoGenerator.includes_.add('#include "RTC.h"');
    
    // Hilfsfunktion zum LESEN global anlegen
    ArduinoGenerator.globals_.add(`
int lk_getRTC(int part) {
  RTCTime t;
  RTC.getTime(t);
  switch(part) {
    case 0: return t.getYear();
    case 1: return (int)Month2int(t.getMonth());
    case 2: return t.getDayOfMonth();
    case 3: return t.getHour();
    case 4: return t.getMinutes();
    case 5: return t.getSeconds();
    case 6: return (int)t.getDayOfWeek();
  }
  return 0;
}
`);

    // Hilfsfunktion zum SCHREIBEN global anlegen
    ArduinoGenerator.globals_.add(`
void lk_setRTC(int part, int val) {
  RTCTime t;
  RTC.getTime(t);
  int y = t.getYear();
  int m = (int)Month2int(t.getMonth());
  int d = t.getDayOfMonth();
  int h = t.getHour();
  int min = t.getMinutes();
  int s = t.getSeconds();
  
  switch(part) {
    case 0: y = val; break;
    case 1: m = val; break;
    case 2: d = val; break;
    case 3: h = val; break;
    case 4: min = val; break;
    case 5: s = val; break;
  }
  RTCTime newTime(d, (Month)m, y, h, min, s, DayOfWeek::WEDNESDAY, SaveLight::SAVING_TIME_INACTIVE);
  RTC.setTime(newTime);
}
`);

    // NEU: Übersetzer-Funktion für die Compiler-Zeit (R4 kompatibel)
    ArduinoGenerator.globals_.add(`
RTCTime lk_getCompileTime() {
  char s_month[5];
  int year, day, h, min, s;
  sscanf(__DATE__, "%s %d %d", s_month, &day, &year);
  sscanf(__TIME__, "%d:%d:%d", &h, &min, &s);
  
  int month = 1;
  if (strcmp(s_month, "Jan") == 0) month = 1;
  else if (strcmp(s_month, "Feb") == 0) month = 2;
  else if (strcmp(s_month, "Mar") == 0) month = 3;
  else if (strcmp(s_month, "Apr") == 0) month = 4;
  else if (strcmp(s_month, "May") == 0) month = 5;
  else if (strcmp(s_month, "Jun") == 0) month = 6;
  else if (strcmp(s_month, "Jul") == 0) month = 7;
  else if (strcmp(s_month, "Aug") == 0) month = 8;
  else if (strcmp(s_month, "Sep") == 0) month = 9;
  else if (strcmp(s_month, "Oct") == 0) month = 10;
  else if (strcmp(s_month, "Nov") == 0) month = 11;
  else if (strcmp(s_month, "Dec") == 0) month = 12;
  
  return RTCTime(day, (Month)month, year, h, min, s, DayOfWeek::WEDNESDAY, SaveLight::SAVING_TIME_INACTIVE);
}
`);
};

ArduinoGenerator.forBlock['ard_rtc_setup'] = function(block) {
    const autoSet = block.getFieldValue('AUTO_SET') === 'TRUE';
    let code = `  RTC.begin();\n`;
    
    if (autoSet) {
        code += `  
  // Smart Restart Logik: Nur Zeit setzen, wenn die RTC leer ist (Jahr < 2024)
  RTCTime checkTime;
  RTC.getTime(checkTime);
  if (checkTime.getYear() < 2024) {
    RTCTime compileTime = lk_getCompileTime();
    RTC.setTime(compileTime);
  }
`;
    }
    return code;
};

ArduinoGenerator.forBlock['ard_rtc_read'] = function(block) {
    const part = block.getFieldValue('PART');
    return [`lk_getRTC(${part})`, 0];
};

ArduinoGenerator.forBlock['ard_rtc_write'] = function(block) {
    const part = block.getFieldValue('PART');
    const val = ArduinoGenerator.valueToCode(block, 'VAL', 0) || '0';
    return `  lk_setRTC(${part}, ${val});\n`;
};