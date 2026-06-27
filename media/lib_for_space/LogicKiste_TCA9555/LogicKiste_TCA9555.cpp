#include "LogicKiste_TCA9555.h"

LogicKiste_TCA9555::LogicKiste_TCA9555(uint8_t address) {
  _address = address;
  // Standardmäßig sind beim TCA9555 alle Pins Eingänge (0xFF)
  _config[0] = 0xFF; 
  _config[1] = 0xFF;
  // Ausgänge standardmäßig auf LOW (0x00)
  _output[0] = 0x00;
  _output[1] = 0x00;
}

void LogicKiste_TCA9555::begin() {
  Wire.begin();
  
  // Sende die initialen Konfigurationen an den Chip
  writeRegister(REG_CONFIG_P0, _config[0]);
  writeRegister(REG_CONFIG_P1, _config[1]);
  writeRegister(REG_OUTPUT_P0, _output[0]);
  writeRegister(REG_OUTPUT_P1, _output[1]);
}

void LogicKiste_TCA9555::pinMode(uint8_t port, uint8_t pin, uint8_t mode) {
  if (port > 1 || pin > 7) return;
  
  if (mode == OUTPUT) {
    bitClear(_config[port], pin); // 0 = Ausgang
  } else {
    bitSet(_config[port], pin);   // 1 = Eingang
  }
  
  writeRegister((port == 0) ? REG_CONFIG_P0 : REG_CONFIG_P1, _config[port]);
}

void LogicKiste_TCA9555::digitalWrite(uint8_t port, uint8_t pin, uint8_t val) {
  if (port > 1 || pin > 7) return;

  if (val == HIGH) {
    bitSet(_output[port], pin);
  } else {
    bitClear(_output[port], pin);
  }
  
  writeRegister((port == 0) ? REG_OUTPUT_P0 : REG_OUTPUT_P1, _output[port]);
}

bool LogicKiste_TCA9555::digitalRead(uint8_t port, uint8_t pin) {
  if (port > 1 || pin > 7) return false;
  
  uint8_t currentStates = readRegister((port == 0) ? REG_INPUT_P0 : REG_INPUT_P1);
  return bitRead(currentStates, pin);
}

// --- LOGICKISTE MUSTER FUNKTIONEN ---

void LogicKiste_TCA9555::writePattern(uint8_t port, const char* pattern) {
  if (port > 1) return;
  
  uint8_t outByte = _output[port]; // Lade den Schatten-Puffer
  
  for (int i = 0; i < 8; i++) {
    if (pattern[i] == '\0') break; // Ende des Strings erreicht
    
    if (pattern[i] == '1') {
      bitSet(outByte, i);
    } else if (pattern[i] == '0') {
      bitClear(outByte, i);
    }
    // Bei '_' machen wir gar nichts, das Bit bleibt wie im Puffer!
  }
  
  _output[port] = outByte; // Puffer aktualisieren
  writeRegister((port == 0) ? REG_OUTPUT_P0 : REG_OUTPUT_P1, _output[port]);
}

bool LogicKiste_TCA9555::checkPattern(uint8_t port, const char* pattern) {
  if (port > 1) return false;
  
  uint8_t inByte = readRegister((port == 0) ? REG_INPUT_P0 : REG_INPUT_P1);
  
  for (int i = 0; i < 8; i++) {
    if (pattern[i] == '\0') break;
    if (pattern[i] == 'X' || pattern[i] == 'x') continue; // Don't Care -> Überspringen
    
    bool bitState = bitRead(inByte, i);
    
    if (pattern[i] == '1' && !bitState) return false; // Erwartet 1, ist aber 0
    if (pattern[i] == '0' && bitState) return false;  // Erwartet 0, ist aber 1
  }
  
  // Wenn die Schleife ohne 'false' durchläuft, stimmt das Muster perfekt überein
  return true; 
}

// --- I2C HILFSFUNKTIONEN ---

void LogicKiste_TCA9555::writeRegister(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(_address);
  Wire.write(reg);
  Wire.write(value);
  Wire.endTransmission();
}

uint8_t LogicKiste_TCA9555::readRegister(uint8_t reg) {
  Wire.beginTransmission(_address);
  Wire.write(reg);
  Wire.endTransmission();
  
  Wire.requestFrom(_address, (uint8_t)1);
  if (Wire.available()) {
    return Wire.read();
  }
  return 0;
}