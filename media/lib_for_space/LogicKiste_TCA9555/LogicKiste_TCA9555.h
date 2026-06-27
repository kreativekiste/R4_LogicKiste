#ifndef LOGICKISTE_TCA9555_H
#define LOGICKISTE_TCA9555_H

#include <Arduino.h>
#include <Wire.h>

class LogicKiste_TCA9555 {
  private:
    uint8_t _address;
    
    // Schatten-Puffer für die Ports (Index 0 = Port 0, Index 1 = Port 1)
    uint8_t _config[2]; 
    uint8_t _output[2]; 

    // Register-Adressen des TCA9555/PCA9555 (typsicher)
    static const uint8_t REG_INPUT_P0  = 0x00;
    static const uint8_t REG_INPUT_P1  = 0x01;
    static const uint8_t REG_OUTPUT_P0 = 0x02;
    static const uint8_t REG_OUTPUT_P1 = 0x03;
    static const uint8_t REG_CONFIG_P0 = 0x06;
    static const uint8_t REG_CONFIG_P1 = 0x07;

    // Interne I2C Hilfsfunktionen
    void writeRegister(uint8_t reg, uint8_t value);
    uint8_t readRegister(uint8_t reg);

  public:
    // Konstruktor (Standardadresse ist meist 0x20)
    LogicKiste_TCA9555(uint8_t address = 0x20);

    // Initialisierung
    void begin();

    // Standard Arduino-ähnliche Funktionen
    void pinMode(uint8_t port, uint8_t pin, uint8_t mode);
    void digitalWrite(uint8_t port, uint8_t pin, uint8_t val);
    bool digitalRead(uint8_t port, uint8_t pin);

    // Die mächtigen Muster-Funktionen (LogicKiste exklusiv)
    // pattern = "10_100__" (Pin 0 ist ganz links, Pin 7 ganz rechts)
    void writePattern(uint8_t port, const char* pattern);
    
    // pattern = "11XXXXXX" (Pin 0 ist ganz links, Pin 7 ganz rechts)
    bool checkPattern(uint8_t port, const char* pattern);
};

#endif