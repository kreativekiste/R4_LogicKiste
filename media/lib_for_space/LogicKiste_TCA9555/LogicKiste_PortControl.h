#ifndef LOGICKISTE_PORTCONTROL_H
#define LOGICKISTE_PORTCONTROL_H

#include <Arduino.h>
#include <Wire.h>

// ==========================================
// 1. KLASSE: TCA9555 / PCA9555 (I2C Modul)
// ==========================================
class LogicKiste_TCA9555 {
  private:
    uint8_t _address;
    uint8_t _config[2]; 
    uint8_t _output[2]; 

    static const uint8_t REG_INPUT_P0  = 0x00;
    static const uint8_t REG_INPUT_P1  = 0x01;
    static const uint8_t REG_OUTPUT_P0 = 0x02;
    static const uint8_t REG_OUTPUT_P1 = 0x03;
    static const uint8_t REG_CONFIG_P0 = 0x06;
    static const uint8_t REG_CONFIG_P1 = 0x07;

    void writeRegister(uint8_t reg, uint8_t value);
    uint8_t readRegister(uint8_t reg);

  public:
    LogicKiste_TCA9555(uint8_t address = 0x20);
    void begin();
    void pinMode(uint8_t port, uint8_t pin, uint8_t mode);
    void digitalWrite(uint8_t port, uint8_t pin, uint8_t val);
    bool digitalRead(uint8_t port, uint8_t pin);
    void writePattern(uint8_t port, const char* pattern);
    bool checkPattern(uint8_t port, const char* pattern);
};

// ==========================================
// 2. KLASSE: VIRTUELLE ARDUINO PORTS
// ==========================================
class LogicKiste_VirtualPort {
  private:
    int _pins[8]; // Speichert bis zu 8 Arduino Pins
    uint8_t _pinCount;

  public:
    // Nimmt bis zu 8 Pins entgegen. -1 bedeutet "nicht belegt".
    LogicKiste_VirtualPort(int p0, int p1=-1, int p2=-1, int p3=-1, int p4=-1, int p5=-1, int p6=-1, int p7=-1);
    
    // Setzt alle definierten Pins auf OUTPUT (oder INPUT)
    void begin(uint8_t mode);
    
    // Sendet ein Muster, z.B. "10_1"
    void writePattern(const char* pattern);
    
    // Prüft ein Muster, z.B. "11XX"
    bool checkPattern(const char* pattern);
};

#endif