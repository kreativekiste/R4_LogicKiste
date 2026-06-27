#ifndef KK_BUTTONHANDLER_H
#define KK_BUTTONHANDLER_H

#include <Arduino.h>

enum KK_ClickEvent {
  KK_NO_EVENT = 0,
  KK_SINGLE_CLICK,
  KK_DOUBLE_CLICK,
  KK_LONG_PRESS
};

class KK_ButtonHandler {
  public:
    KK_ButtonHandler(uint8_t pin, uint32_t debounceTime = 50);
    void begin();
    void update();
    
    bool wasPressed() const;
    bool wasDoubleClicked() const;
    bool isLongPressed(uint32_t ms) const;
    
    KK_ClickEvent getEvent(uint32_t longPressMs = 3000); 
    
    uint32_t getClickCount() const;
    void setClickCount(uint32_t val);
    void resetClickCount();
    
    // NEU: Damit Blockly die Doppelklick-Zeit verändern kann
    void setDoubleClickGap(uint32_t ms);

  private:
    uint8_t _pin;
    uint32_t _debounceTime;
    uint32_t _lastDebounceTime;
    bool _currentState;
    bool _lastReading;
    bool _wasPressed;
    bool _doubleClickDetected;
    uint32_t _clickCount;
    uint32_t _pressStartTime;
    uint32_t _lastReleaseTime;
    uint8_t _clickStep;
    
    // const entfernt, damit es veränderbar wird
    uint32_t _doubleClickGap; 
    
    bool _longPressFired; 
};

#endif