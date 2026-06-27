Hier ist die passende `README.md` für deine neue TCA9555-Bibliothek. Du kannst sie direkt kopieren und als `README.md` in den Ordner `LogicKiste_TCA9555` legen.

---

# LogicKiste TCA9555 / PCA9555 Bibliothek

Eine extrem schlanke und für visuelle Programmierung optimierte C++ Bibliothek für I2C GPIO-Erweiterungsmodule mit dem TCA9555 oder PCA9555 Chip.

Diese Bibliothek wurde speziell für die **LogicKiste** entwickelt. Sie erweitert den Arduino über den I2C-Bus (nur 2 Pins!) um 16 vollwertige digitale Ein- und Ausgänge. Das Besondere: Sie verwaltet im Hintergrund einen intelligenten Schatten-Puffer. Dadurch kannst du nicht nur einzelne Pins wie gewohnt schalten, sondern auch komplexe Bit-Muster manipulieren, ohne den Zustand anderer Pins zu überschreiben.

## Features

* **Nahtlose Arduino-Logik:** Nutze `pinMode`, `digitalWrite` und `digitalRead` genau so, wie du es vom Arduino kennst – nur eben mit Angabe des Ports (0 oder 1).
* **Intelligenter Puffer:** Der Chip wird nicht bei jedem Befehl komplett neu beschrieben. Die Bibliothek merkt sich den Zustand und ändert wirklich nur das Bit, das du anfasst.
* **Muster-Manipulation (`writePattern`):** Sende komplette Strings wie `"10_1____"`. Die Bibliothek setzt Nullen und Einsen, ignoriert aber alle Pins mit einem Unterstrich (`_`). Ideal für Lauflicht-Muster!
* **Muster-Abfrage (`checkPattern`):** Prüfe blitzschnell komplexe Zustände wie `"11XXXXXX"`. Das `X` steht für "Egal" (Don't Care). Perfekt zum Auslesen von Tastenmatrizen.

## Installation

1. Lade dir die Dateien `LogicKiste_TCA9555.h` und `LogicKiste_TCA9555.cpp` herunter.
2. Gehe in deinen Arduino-Ordner (meist unter `Dokumente/Arduino/libraries`).
3. Erstelle dort einen neuen Ordner namens `LogicKiste_TCA9555`.
4. Kopiere die beiden Dateien in diesen neuen Ordner.
5. Starte die Arduino IDE (oder die LogicKiste-Bridge) neu.

## Minimales Beispiel: Einzelne Pins

```cpp
#include <LogicKiste_TCA9555.h>

// Modul auf Standard-Adresse 0x20 initialisieren
LogicKiste_TCA9555 tca(0x20);

void setup() {
  tca.begin();
  
  // Port 0, Pin 3 als Ausgang setzen
  tca.pinMode(0, 3, OUTPUT);
  // Port 1, Pin 0 als Eingang setzen
  tca.pinMode(1, 0, INPUT);
}

void loop() {
  // Taste an Port 1, Pin 0 auslesen
  if (tca.digitalRead(1, 0) == HIGH) {
    // LED an Port 0, Pin 3 einschalten
    tca.digitalWrite(0, 3, HIGH);
  } else {
    tca.digitalWrite(0, 3, LOW);
  }
}

```

## Erweitertes Beispiel: Muster (Patterns)

```cpp
#include <LogicKiste_TCA9555.h>

LogicKiste_TCA9555 tca(0x20);

void setup() {
  tca.begin();
  // Alle 8 Pins an Port 0 als Ausgang setzen
  for(int i=0; i<8; i++) tca.pinMode(0, i, OUTPUT);
}

void loop() {
  // Schaltet Pin 0 und 1 auf HIGH, Pin 2 und 3 auf LOW.
  // Die Pins 4 bis 7 bleiben völlig unberührt (werden ignoriert).
  tca.writePattern(0, "1100____");
  
  // Überprüft, ob an Port 1 die ersten beiden Tasten gedrückt sind.
  // Der Zustand der restlichen 6 Tasten wird komplett ignoriert.
  if (tca.checkPattern(1, "11XXXXXX")) {
    // Mach etwas Besonderes...
  }
}

```

## Autor

Erstellt und gepflegt von:

* [kreativekiste.de](https://kreativekiste.de)
* [logickiste.de](https://logickiste.de)