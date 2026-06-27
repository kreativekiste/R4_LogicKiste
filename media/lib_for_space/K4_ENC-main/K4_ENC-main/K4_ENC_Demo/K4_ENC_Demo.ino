#include <K4_ENC.h>

// Automatically uses default pins 2 (A), 3 (B), and 4 (Button)
K4_ENC myEncoder; 

void setup() {
  Serial.begin(9600);
  myEncoder.begin();
  Serial.println("Encoder initialized.");
}

void loop() {
  // Works in the background using millis() for debouncing
  myEncoder.update(); 

  // Check button state
  if (myEncoder.isPressed()) {
    Serial.println("Button is pressed!");
    myEncoder.clear(); // Example: clear value on button press
  }

  // Print the value only when it changes
  static int lastValue = 0;
  if (myEncoder.getCount() != lastValue) {
    lastValue = myEncoder.getCount();
    Serial.print("Value: ");
    Serial.println(lastValue);
  }
}