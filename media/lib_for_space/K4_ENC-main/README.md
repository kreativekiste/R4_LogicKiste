# K4_ENC Library

A minimalist and high-performance Arduino library for rotary encoders, specifically optimized for the **Arduino Uno R4** and other modern 32-bit architectures.

## Why K4_ENC?

Most legacy encoder libraries rely on direct register access (AVR-specific), which causes errors on newer boards like the Arduino R4. **K4_ENC** is built to be architecture-independent and lightweight, making it the perfect choice for modern projects.

## Features

* **Default Configuration:** Uses Pins 2 and 3 for the encoder and Pin 4 for the button by default.
* **Non-Blocking Logic:** Uses `millis()` for debouncing, ensuring your code stays responsive without using `delay()`.
* **Simple API:** Intuitive functions to get, set, or clear the counter value.
* **Modern Standards:** Written in clean C++ using `const int` instead of legacy macros.

## Installation

1.  Download this repository as a `.zip` file.
2.  In your Arduino IDE, go to **Sketch** -> **Include Library** -> **Add .ZIP Library...**
3.  Select the file you just downloaded.
4.  Restart the Arduino IDE to see the examples.

## Quick Start

```cpp
#include <K4_ENC.h>

// Create an instance (Default: A=2, B=3, Button=4)
K4_ENC myEncoder; 

void setup() {
  Serial.begin(9600);
  myEncoder.begin();
}

void loop() {
  // Update internal states (Must be called in every loop)
  myEncoder.update(); 

  // Check if the button is pressed
  if (myEncoder.isPressed()) {
    Serial.println("Button Pressed - Resetting counter.");
    myEncoder.clear(); 
  }

  // Get and print the current position
  static int lastPos = 0;
  if (myEncoder.getCount() != lastPos) {
    lastPos = myEncoder.getCount();
    Serial.print("Position: ");
    Serial.println(lastPos);
  }
}