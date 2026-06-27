#include "LogicKiste_PortControl.h"

// ==========================================
// 1. TCA9555 IMPLEMENTIERUNG (Wie vorher)
// ==========================================

LogicKiste_TCA9555::LogicKiste_TCA9555(uint8_t address) {
  _address = address;
  _config[0] = 0xFF; _config[1] = 0xFF;
  _output[0] = 0x00; _output[1] = 0x00;
}

void LogicKiste_TCA9555::begin() {
  Wire.begin();
  writeRegister(REG_CONFIG_P0, _config[0]); writeRegister(REG_CONFIG_P1, _config[1]);
  writeRegister(REG_OUTPUT_P0, _output[0]); writeRegister(REG_OUTPUT_P1, _output[1]);
}

void LogicKiste_TCA9555::pinMode(uint8_t port, uint8_t pin, uint8_t mode) {
  if (port > 1 || pin > 7) return;
  if (mode == OUTPUT) bitClear(_config[port], pin);
  else bitSet(_config[port], pin);
  writeRegister((port == 0) ? REG_CONFIG_P0 : REG_CONFIG_P1, _config[port]);
}

void LogicKiste_TCA9555::digitalWrite(uint8_t port, uint8_t pin, uint8_t val) {
  if (port > 1 || pin > 7) return;
  if (val == HIGH) bitSet(_output[port], pin);
  else bitClear(_output[port], pin);
  writeRegister((port == 0) ? REG_OUTPUT_P0 : REG_OUTPUT_P1, _output[port]);
}

bool LogicKiste_TCA9555::digitalRead(uint8_t port, uint8_t pin) {
  if (port > 1 || pin > 7) return false;
  return bitRead(readRegister((port == 0) ? REG_INPUT_P0 : REG_INPUT_P1), pin);
}

void LogicKiste_TCA9555::writePattern(uint8_t port, const char* pattern) {
  if (port > 1) return;
  uint8_t outByte = _output[port]; 
  for (int i = 0; i < 8; i++) {
    if (pattern[i] == '\0') break; 
    if (pattern[i] == '1') bitSet(outByte, i);
    else if (pattern[i] == '0') bitClear(outByte, i);
  }
  _output[port] = outByte; 
  writeRegister((port == 0) ? REG_OUTPUT_P0 : REG_OUTPUT_P1, _output[port]);
}

bool LogicKiste_TCA9555::checkPattern(uint8_t port, const char* pattern) {
  if (port > 1) return false;
  uint8_t inByte = readRegister((port == 0) ? REG_INPUT_P0 : REG_INPUT_P1);
  for (int i = 0; i < 8; i++) {
    if (pattern[i] == '\0') break;
    if (pattern[i] == 'X' || pattern[i] == 'x') continue; 
    bool bitState = bitRead(inByte, i);
    if (pattern[i] == '1' && !bitState) return false; 
    if (pattern[i] == '0' && bitState) return false;  
  }
  return true; 
}

void LogicKiste_TCA9555::writeRegister(uint8_t reg, uint8_t value) {
  Wire.beginTransmission(_address); Wire.write(reg); Wire.write(value); Wire.endTransmission();
}

uint8_t LogicKiste_TCA9555::readRegister(uint8_t reg) {
  Wire.beginTransmission(_address); Wire.write(reg); Wire.endTransmission();
  Wire.requestFrom(_address, (uint8_t)1);
  if (Wire.available()) return Wire.read();
  return 0;
}

// ==========================================
// 2. VIRTUELLE PORTS IMPLEMENTIERUNG
// ==========================================

LogicKiste_VirtualPort::LogicKiste_VirtualPort(int p0, int p1, int p2, int p3, int p4, int p5, int p6, int p7) {
  _pins[0] = p0; _pins[1] = p1; _pins[2] = p2; _pins[3] = p3;
  _pins[4] = p4; _pins[5] = p5; _pins[6] = p6; _pins[7] = p7;
  
  _pinCount = 0;
  for(int i=0; i<8; i++) {
    if(_pins[i] != -1) _pinCount++;
  }
}

void LogicKiste_VirtualPort::begin(uint8_t mode) {
  for(int i=0; i<_pinCount; i++) {
    if(_pins[i] != -1) {
      pinMode(_pins[i], mode);
    }
  }
}

void LogicKiste_VirtualPort::writePattern(const char* pattern) {
  for (int i = 0; i < _pinCount; i++) {
    if (pattern[i] == '\0') break; // Ende des Musters erreicht
    
    if (pattern[i] == '1') {
      digitalWrite(_pins[i], HIGH);
    } else if (pattern[i] == '0') {
      digitalWrite(_pins[i], LOW);
    }
    // Bei '_' überspringen wir den Pin (er bleibt wie er ist)
  }
}

bool LogicKiste_VirtualPort::checkPattern(const char* pattern) {
  for (int i = 0; i < _pinCount; i++) {
    if (pattern[i] == '\0') break;
    if (pattern[i] == 'X' || pattern[i] == 'x') continue; // Don't care
    
    bool bitState = digitalRead(_pins[i]);
    
    if (pattern[i] == '1' && !bitState) return false;
    if (pattern[i] == '0' && bitState) return false;
  }
  return true;
}