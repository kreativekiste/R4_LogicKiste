Hier ist die passende `README.md` für deine neue Bibliothek. Der Text ist natürlich in der "Du"-Form geschrieben, damit du ihn direkt für deine Webseiten oder GitHub übernehmen kannst.

---

# YX5300_Player Bibliothek für Arduino

Eine schlanke, objektorientierte und absolut zuverlässige C++ Bibliothek für das YX5300 (Catalex) MP3 TTL Serial Modul. Diese Bibliothek wurde entwickelt, um robuster und einfacher zu sein als die gängigen Standard-Bibliotheken.

Anstatt Befehle global und unsicher zu verstreuen, kapselt diese Bibliothek alle Hex-Befehle typsicher im Hintergrund. Du übergibst einfach deine serielle Schnittstelle (`HardwareSerial` oder `SoftwareSerial`) und kannst sofort loslegen.

## Features

* **Modular & Objektorientiert:** Keine fest verdrahteten Serial-Ports.
* **Typsicher:** Alle Hex-Befehle sind intern gekapselt (`static const byte`).
* **Einfach:** Nur die Befehle, die du wirklich brauchst – ohne unnötigen Ballast.
* **Kompatibel:** Funktioniert mit jedem Arduino-Board (Uno, Mega, ESP32, ESP8266 etc.), das serielle Kommunikation unterstützt.

## Installation

1. Lade dir die Dateien `YX5300_Player.h` und `YX5300_Player.cpp` herunter.
2. Gehe in deinen Arduino-Ordner (meist unter `Dokumente/Arduino/libraries`).
3. Erstelle dort einen neuen Ordner namens `YX5300_Player`.
4. Kopiere die beiden Dateien in diesen neuen Ordner.
5. Starte die Arduino IDE neu.

## Minimales Beispiel

Hier siehst du, wie einfach du den Player in deinem Projekt initialisierst und die Lautstärke setzt:

```cpp
#include <Arduino.h>
#include <YX5300_Player.h>

// MP3 Objekt global anlegen und z.B. Serial1 übergeben
YX5300_Player mp3(Serial1);

void setup() {
  Serial.begin(9600);
  
  // Serielle Verbindung zum MP3-Modul starten
  Serial1.begin(9600);
  
  // Player initialisieren (wählt automatisch die SD-Karte aus)
  mp3.begin();
  
  // Lautstärke auf 20 setzen (Werte von 0 bis 30 möglich)
  mp3.setVolume(20);
  
  Serial.println("MP3 Player ist bereit!");
}

void loop() {
  // Dein Code hier...
}

```

## Verfügbare Befehle

Sobald du dein Objekt (z.B. `mp3`) erstellt hast, stehen dir folgende Funktionen zur Verfügung:

* `mp3.begin()`: Initialisiert das Modul und wählt die SD-Karte aus. (Braucht ca. 1,5 Sekunden Zeit).
* `mp3.setVolume(byte volume)`: Setzt die Lautstärke (0 bis 30).
* `mp3.playFolder(byte folder)`: Spielt den Inhalt eines bestimmten Ordners ab.
* `mp3.playFolderLoop(byte folder)`: Spielt einen Ordner in Dauerschleife.
* `mp3.playNext()`: Springt zum nächsten Titel.
* `mp3.playPrev()`: Springt zum vorherigen Titel.
* `mp3.pause()`: Pausiert die aktuelle Wiedergabe.
* `mp3.play()`: Setzt die pausierte Wiedergabe fort.
* `mp3.stop()`: Stoppt die Wiedergabe komplett.

## Autor

Erstellt und gepflegt von:

* [kreativekiste.de](https://kreativekiste.de)
* [logickiste.de](https://logickiste.de)