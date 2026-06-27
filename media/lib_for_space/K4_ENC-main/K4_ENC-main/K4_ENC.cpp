#include "K4_ENC.h"

K4_ENC::K4_ENC(int pinA, int pinB, int pinBtn) {
  _pinA = pinA;
  _pinB = pinB;
  _pinBtn = pinBtn;
  _counter = 0;
  _btnState = HIGH;
  _lastBtnState = HIGH;
  _buttonJustPressed = false; // Startwert
  _lastDebounceTime = 0;
}

void K4_ENC::begin() {
  pinMode(_pinA, INPUT_PULLUP);
  pinMode(_pinB, INPUT_PULLUP);
  pinMode(_pinBtn, INPUT_PULLUP);
  _lastStateA = digitalRead(_pinA);
}

void K4_ENC::update() {
  // 1. Encoder Logik
  int currentStateA = digitalRead(_pinA);
  if (currentStateA != _lastStateA && currentStateA == LOW) {
    if (digitalRead(_pinB) != currentStateA) {
      _counter++;
    } else {
      _counter--;
    }
  }
  _lastStateA = currentStateA;

  // 2. Taster Logik mit Flankenerkennung
  int reading = digitalRead(_pinBtn);
  
  if (reading != _lastBtnState) {
    _lastDebounceTime = millis();
  }

  if ((millis() - _lastDebounceTime) > _debounceDelay) {
    // Wenn sich der stabile Zustand geändert hat
    if (reading != _btnState) {
      _btnState = reading;
      
      // Wenn der neue Zustand LOW (gedrückt) ist, setze den Merker auf true
      if (_btnState == LOW) {
        _buttonJustPressed = true;
      }
    }
  }
  _lastBtnState = reading;
}

int K4_ENC::getCount() { return _counter; }

void K4_ENC::setCount(int value) { _counter = value; }

void K4_ENC::clear() { _counter = 0; }

// 3. Auslese-Logik (Clear-on-Read)
bool K4_ENC::isPressed() { 
  if (_buttonJustPressed) {
    _buttonJustPressed = false; // Merker nach dem Auslesen sofort löschen!
    return true;                // Einmalig "wahr" zurückgeben
  }
  return false;
}