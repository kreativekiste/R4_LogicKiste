#ifndef K4_ENC_H
#define K4_ENC_H

#include "Arduino.h"

class K4_ENC {
  public:
    K4_ENC(int pinA = 2, int pinB = 3, int pinBtn = 4);

    void begin();
    void update();               
    int getCount();
    void setCount(int value);    
    void clear();                
    bool isPressed();            

  private:
    int _pinA, _pinB, _pinBtn;
    int _counter;
    int _lastStateA;
    
    // Taster Variablen
    int _btnState;             // Speichert den stabilen Zustand
    int _lastBtnState;         // Für die Entprellung
    bool _buttonJustPressed;   // NEU: Merker für einen einzelnen Druck
    
    unsigned long _lastDebounceTime;
    const unsigned long _debounceDelay = 50; 
};

#endif