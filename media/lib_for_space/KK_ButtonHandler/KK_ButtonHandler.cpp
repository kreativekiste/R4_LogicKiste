#include "KK_ButtonHandler.h"

KK_ButtonHandler::KK_ButtonHandler(uint8_t pin, uint32_t debounceTime) {
  _pin = pin;
  _debounceTime = debounceTime;
  _lastDebounceTime = 0;
  _lastReading = HIGH;
  _currentState = HIGH;
  _wasPressed = false;
  _doubleClickDetected = false;
  _clickCount = 0;
  _pressStartTime = 0;
  _lastReleaseTime = 0;
  _clickStep = 0;
  _longPressFired = false; 
  _doubleClickGap = 300; // Standardwert in den Konstruktor verschoben
}

void KK_ButtonHandler::begin() {
  pinMode(_pin, INPUT_PULLUP);
}

void KK_ButtonHandler::update() {
  bool reading = digitalRead(_pin);
  _wasPressed = false;
  _doubleClickDetected = false;

  if (reading != _lastReading) {
    _lastDebounceTime = millis();
  }

  if ((millis() - _lastDebounceTime) > _debounceTime) {
    if (reading != _currentState) {
      _currentState = reading;
      
      if (_currentState == LOW) { 
        _wasPressed = true;
        _clickCount++;
        _pressStartTime = millis();
        _longPressFired = false; 
        
        if (_clickStep == 1 && (millis() - _lastReleaseTime) < _doubleClickGap) {
          _doubleClickDetected = true;
          _clickStep = 0;
        } else {
          _clickStep = 1;
        }
      } else { 
        _lastReleaseTime = millis();
      }
    }
  }
  _lastReading = reading;
}

bool KK_ButtonHandler::wasPressed() const { return _wasPressed; }
uint32_t KK_ButtonHandler::getClickCount() const { return _clickCount; }
bool KK_ButtonHandler::wasDoubleClicked() const { return _doubleClickDetected; }

void KK_ButtonHandler::setClickCount(uint32_t val) {
  _clickCount = val;
}

void KK_ButtonHandler::resetClickCount() { 
  _clickCount = 0; 
}

// NEUE FUNKTION: Wert zuweisen
void KK_ButtonHandler::setDoubleClickGap(uint32_t ms) {
  _doubleClickGap = ms;
}

bool KK_ButtonHandler::isLongPressed(uint32_t ms) const {
  return (_currentState == LOW && (millis() - _pressStartTime) >= ms);
}

KK_ClickEvent KK_ButtonHandler::getEvent(uint32_t longPressMs) {
  if (_doubleClickDetected) {
    return KK_DOUBLE_CLICK;
  }
  
  if (_wasPressed) {
    return KK_SINGLE_CLICK;
  }
  
  if (_currentState == LOW && !_longPressFired && (millis() - _pressStartTime) >= longPressMs) {
    _longPressFired = true; 
    return KK_LONG_PRESS;
  }
  
  return KK_NO_EVENT;
}