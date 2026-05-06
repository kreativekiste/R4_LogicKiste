====================================================================
ARDUINO R4_LOGICKISTE - BENUTZERHANDBUCH & DOKUMENTATION
====================================================================

--------------------------------------------------------------------
1. EINLEITUNG: WAS IST DIE R4_LOGICKISTE?
--------------------------------------------------------------------
Die R4_LogicKiste ist eine visuelle Programmierumgebung, die speziell
für den Arduino UNO R4 WiFi entwickelt wurde. Anstatt komplizierten
C++ Code von Hand tippen zu müssen, steckst du dein Programm einfach
aus bunten Logik-Blöcken (basierend auf Google Blockly) zusammen.

Wie funktioniert das?
Das Herzstück der LogicKiste ist ein intelligenter Generator, der
direkt in deinem Browser läuft. Während du Blöcke auf die Arbeitsfläche
ziehst, übersetzt das System deine Logik im Hintergrund in fehlerfreien,
hochwertigen Arduino C++ Code. Du lernst also das EVA-Prinzip
(Eingabe, Verarbeitung, Ausgabe) intuitiv kennen und kannst dir
gleichzeitig den echten Code ansehen, um den Übergang zur
Textprogrammierung zu meistern.

--------------------------------------------------------------------
2. NUTZUNG: ONLINE VS. OFFLINE
--------------------------------------------------------------------
Die R4_LogicKiste ist extrem flexibel und passt sich deiner
Arbeitsumgebung an. Da die gesamte Code-Generierung lokal in deinem
Browser über JavaScript passiert, hast du zwei Möglichkeiten:

Variante A: Online nutzen (Im Browser) https://kreativekiste.github.io/R4_LogicKiste/
Du kannst die LogicKiste einfach über die bereitgestellte Webseite
aufrufen. Du brauchst keine Installation, um Programme zusammenzuklicken
und dir den C++ Code generieren zu lassen. Den generierten Code kannst
du dann über den Button "Code kopieren" in deine normale Arduino IDE
einfügen und von dort hochladen.
Ideal für: Tablets, Schulrechner mit Installationssperre oder schnelles
Ausprobieren.

Variante B: Offline nutzen (Lokal auf dem PC)
Du kannst dir den kompletten Ordner der LogicKiste herunterladen und
die Datei "index.html" einfach mit einem Doppelklick in deinem Browser
(z. B. Chrome, Firefox, Edge) öffnen. Auch ohne Internetverbindung
hast du vollen Zugriff auf alle Blöcke und Funktionen.
Ideal für: Werkstätten ohne WLAN, Ausflüge oder feste Arbeitsplätze.

--------------------------------------------------------------------
3. DER DIREKTE UPLOAD-BUTTON (DIE LOKALE BRIDGE)
--------------------------------------------------------------------
Der absolute Clou der R4_LogicKiste ist der "Upload"-Button. Anstatt
den Code mühsam in die Arduino IDE zu kopieren, kannst du dein Programm
mit nur einem Klick direkt auf deinen Arduino R4 flashen!

Warum brauche ich dafür ein Zusatzprogramm?
Aus Sicherheitsgründen dürfen Webbrowser nicht direkt auf die
USB-Anschlüsse deines Computers zugreifen. Damit der Upload-Button
funktioniert, nutzen wir ein kleines Hintergrundprogramm (die Bridge).
Sie nimmt den Code aus dem Browser entgegen, kompiliert ihn im Hintergrund
und schickt ihn über das USB-Kabel auf den Arduino.

ERSTMALIGE EINRICHTUNG DER BRIDGE (Nur einmalig nötig!):

Schritt 1: Arduino-CLI herunterladen
1. Gehe auf die Arduino Website.
2. Lade die passende Version für dein Betriebssystem herunter (z.B. Windows 64-bit).
3. Entpacke die heruntergeladene .zip-Datei.
4. Verschiebe die darin enthaltene Datei "arduino-cli.exe" exakt in
den Ordner "tools" deiner R4_LogicKiste.

Schritt 2: Python Vorbereitungen
Da die Bridge in Python geschrieben ist, muss Python auf deinem PC
installiert sein. Außerdem benötigt die Bridge zwei kleine Erweiterungen:
Öffne die Eingabeaufforderung (CMD) und tippe folgenden Befehl ein:
pip install flask flask-cors

Schritt 3: Welcher USB-Port?
Die Bridge muss wissen, an welchem COM-Port dein Arduino R4 hängt.
Öffne die Datei "last_port.txt" in einem Texteditor und trage dort
deinen aktuellen Port ein (z. B. COM3, COM11). Speichere die Datei ab.

SO STARTEST DU DIE BRIDGE IM ALLTAG:
Mache einfach einen Doppelklick auf die Datei "start_bridge.bat".
Es öffnet sich ein schwarzes Fenster, das anzeigt:
"Bridge laeuft — Port: COM11".
Lass dieses Fenster einfach im Hintergrund offen, während du programmierst!
Klickst du nun in der LogicKiste auf "Upload", übernimmt die Bridge
vollautomatisch den Rest.

====================================================================
4. BLÖCKE & FUNKTIONEN: KATEGORIE "BOARD"
====================================================================
In dieser Kategorie findest du das absolute Fundament für jedes deiner
Programme. Ohne den Programm-Start-Block läuft gar nichts!

--------------------------------------------------------------------
➔ Block: Programm Start (Main)
--------------------------------------------------------------------
Ordner/Datei: js/app.js (Basiert auf den Core-Generatoren)
Menü: Board ➔ Programm Start

Beschreibung:
Das ist das Herzstück deines Codes. Dieser Block ist unverwüstlich
(er kann nicht gelöscht werden) und unterteilt dein Programm in drei
wichtige Bereiche:
1. GLOBAL: Für Bibliotheken und Setup-Einstellungen, die ganz oben im
Code stehen müssen.
2. SETUP: Wird vom Arduino genau ein einziges Mal beim Starten (oder
nach einem Reset) ausgeführt. Perfekt, um Pins zu aktivieren oder
Bildschirme zu starten.
3. LOOP: Die Endlosschleife. Alles, was hier angedockt wird, wiederholt
der Arduino rasend schnell immer und immer wieder.

* Praxis-Beispiel: Hier klinkst du alle weiteren Blöcke deines
Programms ein.
* Wichtige Hinweise: Ohne diesen Block wird kein Code generiert!
* UNO R3 Kompatibel: ✅ JA. Dies ist die Standard-Struktur jedes Arduinos.

--------------------------------------------------------------------
➔ Block: Hardware Interrupt (PC Interrupt)
--------------------------------------------------------------------
Ordner/Datei: blocks/board/interrupts.js
Menü: Board ➔ PC Interrupt
Beschreibung:
Ein Interrupt ist der "Notfall-Plan" deines Arduinos. Dieser Block schwebt
frei auf der Arbeitsfläche und wartet auf ein Ereignis an einem Pin.
Sobald dieses eintritt, unterbricht der Arduino sofort seine aktuelle
Arbeit (die Loop-Schleife), springt blitzschnell in den Interrupt-Block,
führt den Code darin aus und kehrt danach exakt an die Stelle zurück,
an der er aufgehört hat.

* Die Einstellungen im Block:
1. Modus "Taster (Interner PULL-UP)": Nutze dies, wenn du einen Taster
direkt gegen GND (Minus) angeschlossen hast. Der Arduino aktiviert
den internen Widerstand für dich.
2. Modus "Sensor (Normaler INPUT)": Nutze dies für Sensoren, die ein
sauberes 5V/0V Signal liefern.
3. Auslösen: Bestimme, ob die Aktion beim Drücken (FALLING),
Loslassen (RISING) oder bei jeder Änderung (CHANGE) starten soll.

* Wichtige Hardware-Regel: Obwohl der R4 sehr flexibel ist, solltest du
für Interrupts bevorzugt die Pins 2, 3, 8 oder 13 nutzen. Diese sind
physikalisch am besten für Hochgeschwindigkeits-Signale geeignet.

* Die Goldene Regel für Variablen: Wenn du in einem Interrupt einen Wert
ändern willst (z.B. einen Zähler +1), MUSS diese Variable im Menü
"Variablen" mit dem speziellen Block "⚡ ERSTELLE INTERRUPT-VARIABLE"
angelegt werden. Nur so weiß der Computer, dass sich dieser Wert
jederzeit "flüchtig" (volatile) ändern kann.

* Achtung: Im Interrupt darfst du niemals "Warten"-Blöcke (delay) oder
komplizierte Dinge wie Laufschriften nutzen! Der Code muss extrem
kurz sein, damit das Hauptprogramm nicht ins Stocken gerät.

====================================================================
5. BLÖCKE & FUNKTIONEN: KATEGORIE "EINGÄNGE"
====================================================================
Eingänge sind die Sinnesorgane deines Arduinos. Hier liest du die
Außenwelt ein. Während normale Eingangs-Blöcke im Loop geduldig
darauf warten, dass sie an der Reihe sind, sind INTERRUPTS die
"Vordrängler", die sofortige Aufmerksamkeit erzwingen.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Standard Pins
--------------------------------------------------------------------

➔ Block: Aktiviere internen Pullup
Ordner/Datei: blocks/input/setup_pullup.js
Menü: Eingänge ➔ Standard Pins

Beschreibung:
Dieser Block schaltet den eingebauten Widerstand (Pullup) eines
digitalen Pins ein. Dadurch wird der Pin intern dauerhaft unter
Strom (HIGH) gesetzt. Das verhindert "flackernde" oder unsaubere
Signale, wenn ein Schalter gedrückt wird.
* Praxis-Beispiel: Perfekt, um nackte Taster direkt zwischen den
Pin und den Ground-Anschluss (GND) zu stecken ganz ohne externe
Widerstände verbauen zu müssen!
* Wichtige Hinweise: Muss zwingend in den SETUP-Block eingefügt werden!
Achtung: Die Logik dreht sich dadurch um. Ein gedrückter Taster
liefert nun FALSCH (LOW), ein losgelassener liefert WAHR (HIGH).
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Lese digitalen PIN
Ordner/Datei: blocks/input/read_digital.js
Menü: Eingänge ➔ Standard Pins

Beschreibung:
Liest den Zustand eines Pins aus. Die Antwort ist immer strikt digital,
also entweder WAHR (Strom fließt / HIGH) oder FALSCH (Kein Strom / LOW).
* Praxis-Beispiel: Auslesen, ob ein Schalter umgelegt, ein Taster
gedrückt oder ein digitaler Bewegungsmelder ausgelöst wurde.
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Lese analogen PIN (A0 - A5)
Ordner/Datei: blocks/input/read_analog.js
Menü: Eingänge ➔ Standard Pins

Beschreibung:
Im Gegensatz zu digitalen Pins, die nur "An" oder "Aus" kennen, misst
dieser Block Spannungen stufenlos und gibt sie als Zahlenwert zurück
(beim normalen Arduino von 0 bis 1023).
* Praxis-Beispiel: Die Stellung eines Drehreglers (Potentiometer)
bestimmen oder die Helligkeit eines einfachen Lichtsensors auslesen.
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Taster & Zähler
--------------------------------------------------------------------

➔ Block: Tasterdruck Zähler
Ordner/Datei: blocks/input/input_counter.js
Menü: Eingänge ➔ Taster & Zähler

Beschreibung:
Ein intelligenter Block, der nicht nur merkt, dass ein Taster gedrückt
wurde, sondern direkt mitzählt, *wie oft*. Er besitzt eine integrierte
"Entprell"-Funktion (Debounce). Das verhindert, dass ein einzelner
Fingerdruck durch winzige mechanische Wackler im Schalter aus Versehen
doppelt oder dreifach gezählt wird.
* Praxis-Beispiel: Den Punktestand in einem Spiel hochzählen oder
durch verschiedene Menüseiten auf einem Display schalten.
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Drehgeber (Rotary Encoder)
Ordner/Datei: blocks/input/input_encoder.js
Menü: Eingänge ➔ Taster & Zähler

Beschreibung:
Liest die Drehbewegung eines "Endlos-Drehreglers" aus und speichert
die Position direkt in einer Variablen ab. Drehst du nach rechts,
steigt die Zahl, drehst du nach links, sinkt sie.
* Praxis-Beispiel: Perfekt, um die Helligkeit der LED-Matrix
anzupassen oder die Scrollgeschwindigkeit deiner Laufschrift fließend
einzustellen.
* Wichtige Hinweise: Benötigt zwei digitale Pins (CLK und DT).
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Sensoren
--------------------------------------------------------------------

➔ Block: Lese DHT (Temperatur/Feuchtigkeit)
Ordner/Datei: blocks/sensor/dht_sensor.js
Menü: Eingänge ➔ Sensoren

Beschreibung:
Liest die exakten Werte eines DHT11 oder DHT22 Sensors aus. Über
das Dropdown-Menü kannst du wählen, ob der Block die aktuelle
Temperatur (in °C) oder die Luftfeuchtigkeit (in %) als Zahl ausgeben
soll.
* Praxis-Beispiel: Bau einer eigenen Wetterstation oder Steuerung
einer Lüftung, wenn die Temperatur über 25 Grad steigt.
* Wichtige Hinweise: Benötigt im Hintergrund oft eine Sensor-Library.
DHT Sensoren sind etwas träge lies sie nicht öfter als einmal
pro Sekunde aus!
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Ultraschall Entfernung (HC-SR04)
Ordner/Datei: blocks/sensor/ultrasonic_hc_sr04.js
Menü: Eingänge ➔ Sensoren

Beschreibung:
Misst die Distanz zu einem Hindernis und gibt den Abstand direkt in
Zentimetern aus. Der Sensor sendet einen unhörbaren Ton (wie eine
Fledermaus) aus und stoppt die Zeit, bis das Echo zurückkommt.
* Praxis-Beispiel: Ein Roboterauto, das automatisch vor einer Wand
stoppt, oder eine Abstandswarnung per roter LED.
* Wichtige Hinweise: Benötigt immer zwei getrennte Pins, einen zum
Senden (Trigger) und einen zum Hören (Echo).
* UNO R3 Kompatibel: ✅ JA.

➔ Block-System: RFID (RC522)
Ordner/Datei: blocks/advanced/rfid_rc522.js
Menü: Eingänge ➔ Sensoren ➔ RFID

Beschreibung:
Das RFID-System in der LogicKiste besteht aus 3 perfekt aufeinander
abgestimmten Blöcken:
1. SETUP: Startet das System (muss zwingend in den Setup-Block).
2. WENN KARTE DA: Ein Prüfblock für deine Wenn-Dann-Abfragen. Er löst
nur aus, wenn ein Chip an den Leser gehalten wird.
3. HOLE ID: Gibt dir die einmalige, geheime Seriennummer (UID) des
Chips als Text zurück.
* Praxis-Beispiel: Eine Alarmanlage, die nur mit dem richtigen
Schlüsselchip deaktiviert werden kann, oder eine Kiste, die sich nur
für dich öffnet.
* Wichtige Hinweise: Der RFID-Leser kommuniziert über den extrem
schnellen SPI-Bus. Das bedeutet, einige Pins sind fest vorgegeben
(MISO, MOSI, SCK), während du andere (SDA/RST) frei wählen kannst.
* UNO R3 Kompatibel: ✅ JA.

====================================================================
6. BLÖCKE & FUNKTIONEN: KATEGORIE "AUSGÄNGE"
====================================================================
Während Eingänge die "Sinne" sind, sind die Ausgänge die "Muskeln"
und die "Stimme" deines Arduinos. Hier programmierst du alles, was
sich bewegen, leuchten oder Daten anzeigen soll.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Standard Pins
--------------------------------------------------------------------

➔ Block: Schreibe digitalen PIN
Ordner/Datei: blocks/output/write_digital.js
Menü: Ausgänge ➔ Standard Pins

Beschreibung:
Schaltet einen ausgewählten Pin entweder auf WAHR (An / 5V) oder
FALSCH (Aus / 0V). Das ist der grundlegendste Befehl, um in der
Elektronik Dinge zu steuern.
* Praxis-Beispiel: Eine LED einschalten, ein Relais für eine
Wasserpumpe klacken lassen oder einen Summer betätigen.
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Schreibe analogen PIN (PWM)
Ordner/Datei: blocks/output/write_analog.js
Menü: Ausgänge ➔ Standard Pins

Beschreibung:
Dieser Block schaltet einen Pin nicht nur strikt ein oder aus,
sondern kann Zwischenwerte von 0 (ganz aus) bis 255 (volle Power)
ausgeben. Der Arduino macht das über blitzschnelles Ein- und
Ausschalten (Pulsweitenmodulation / PWM).
* Praxis-Beispiel: Eine LED langsam dimmen oder die Geschwindigkeit
eines einfachen Gleichstrommotors (über einen Transistor) regeln.
* Wichtige Hinweise: Das funktioniert nur an Pins, die die PWM-Funktion
unterstützen (meist mit einer Tilde "~" auf dem Board markiert,
z. B. Pin 3, 5, 6, 9, 10, 11).
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Antrieb (Motoren)
--------------------------------------------------------------------

➔ Block: Servo steuern
Ordner/Datei: blocks/motor/motors.js
Menü: Ausgänge ➔ Antrieb (Motoren)

Beschreibung:
Steuert einen Modellbau-Servomotor präzise an. Du übergibst dem Block
einfach eine Gradzahl zwischen 0 und 180, und der Motorarm fährt
automatisch exakt in diese Position.
* Praxis-Beispiel: Eine Schranke öffnen, die Lenkung für ein
Roboterauto bauen oder ein Thermometer mit einem echten Zeiger
basteln.
* Wichtige Hinweise: Servos ziehen oft sehr viel Strom! Schließe große
Servos niemals direkt an den 5V Pin des Arduinos an, sondern nutze
eine externe Batterie.
* UNO R3 Kompatibel: ✅ JA.

➔ Block-System: Schrittmotoren (Stepper)
Ordner/Datei: blocks/motor/stepper_advanced.js
Menü: Ausgänge ➔ Antrieb (Motoren)

Beschreibung:
Schrittmotoren können (im Gegensatz zu Servos) endlos im Kreis
rotieren, wissen aber trotzdem jederzeit millimetergenau, wo sie
stehen. Das System besteht aus Blöcken zum Setup (wo Pins und
Geschwindigkeit festgelegt werden) und Move-Blöcken, um eine genaue
Anzahl an Schritten vorwärts oder rückwärts zu fahren.
* Praxis-Beispiel: Die Achsen eines 3D-Druckers steuern oder einen
Präzisions-Futterautomaten bauen.
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Licht & Matrix
--------------------------------------------------------------------

➔ Block-System: NeoPixel (WS2812)
Ordner/Datei: blocks/visuals/neopixel_basic.js
Menü: Ausgänge ➔ Licht & Matrix

Beschreibung:
Steuert intelligente RGB-LED-Streifen (NeoPixel). Das geniale daran:
Du brauchst nur einen einzigen Daten-Pin, um Hunderte von LEDs
einzeln in jeder beliebigen Farbe leuchten zu lassen. Zuerst
verwendest du den Setup-Block, definierst dann die Farben für einzelne
LEDs und schickst das fertige Bild mit dem "Show"-Block an den Streifen.
* Praxis-Beispiel: Eine coole Treppenbeleuchtung oder ein buntes
Stimmungslicht für den Schreibtisch.
* Wichtige Hinweise: Benötigt die Adafruit NeoPixel Bibliothek.
* UNO R3 Kompatibel: ✅ JA.

➔ Block-System: R4 Onboard Matrix (DAS HIGHLIGHT!)
Ordner/Datei: blocks/visuals/r4_matrix.js
Menü: Ausgänge ➔ Licht & Matrix

Beschreibung:
Diese Blöcke steuern die eingebaute 12x8 rote LED-Matrix, die sich
direkt auf der Platine des Arduino UNO R4 WiFi befindet. Das System
bietet dir 5 mächtige Werkzeuge:
1. Setup: Startet die Matrix (Muss in den Setup-Bereich!).
2. Symbol zeigen: Wähle aus fertigen Bildern (Herz, Smiley, X) im
Dropdown-Menü.
3. Statischer Text: Zeigt 2-3 Zeichen oder Zahlen blitzschnell auf der
Matrix an. Ideal für schnelle Sensordaten (z.B. vom Encoder), da
dieser Block das Programm NICHT blockiert!
4. Laufschrift: Lässt längere Texte oder Variablen sanft über den
Bildschirm scrollen. Das Tempo ist einstellbar.
ACHTUNG: Dies ist ein blockierender Befehl. Während der Text läuft,
wird das restliche Programm pausiert!
5. Pixel-Liste: Gib einfach Komma-getrennte Zahlen (0 bis 95) ein, um
bestimmte LEDs gezielt anzuschalten. Oben links ist 0, unten
rechts ist 95.
* Praxis-Beispiel: Den Punktestand für ein Spiel anzeigen, eine
"Bitte lächeln"-Nachricht scrollen lassen oder kleine Animationen
bauen.
* Wichtige Hinweise: Benötigt die "ArduinoGraphics" Bibliothek im
Arduino Bibliotheksverwalter.
* UNO R3 Kompatibel: ❌ NEIN. Diese Matrix existiert physisch nur auf
dem R4 WiFi!

➔ Block-System: MAX7219 Matrix
Ordner/Datei: blocks/visuals/max7219_matrix.js
Menü: Ausgänge ➔ Licht & Matrix

Beschreibung:
Mit diesen Blöcken steuerst du externe, rote 8x8 LED-Matrizen an. Du
kannst auch mehrere dieser Module aneinanderreihen. Sie sind der
klassische Vorgänger der R4-Onboard-Matrix.
* Praxis-Beispiel: Große Laufschriften für Schaufenster oder ein
digitales Tetris-Spiel.
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Displays
--------------------------------------------------------------------

➔ Block-System: LCD Display (I2C)
Ordner/Datei: blocks/visuals/lcd_i2c.js
Menü: Ausgänge ➔ Displays

Beschreibung:
Mit diesen Blöcken steuerst du die klassischen Text-Displays (meist
blau oder gelb-grün mit 16x2 oder 20x4 Zeichen). Dank des I2C-Moduls
auf der Rückseite des Displays benötigst du dafür nur noch 4 Kabel
(Strom, GND, SDA, SCL). Du startest das Display im Setup und kannst
dann mit dem Text-Block an einer bestimmten Zeile und Spalte schreiben.
* Praxis-Beispiel: Ausgabe von Sensordaten, Bau eines Taschenrechners
oder eines Menüs für eine Maschine.
* Wichtige Hinweise: Wenn das Display nur leuchtet, aber keinen Text
zeigt, drehe hinten am kleinen blauen Rädchen (Kontrast). Die
Standard-I2C-Adresse ist meistens 0x27, manchmal auch 0x3F.
* UNO R3 Kompatibel: ✅ JA.

➔ Block-System: Farbige TFT Displays
Ordner/Datei: blocks/visuals/tft_displays.js
Menü: Ausgänge ➔ Displays

Beschreibung:
Diese Blöcke bringen richtig Farbe ins Spiel! Du kannst grafische TFT
Bildschirme (ST7735 oder ILI9486) ansteuern, um bunten Text, Rechtecke,
Kreise oder Linien zu zeichnen. Zuerst wählst du den passenden
Setup-Block für deinen Bildschirm-Typ, danach stehen dir alle Zeichen-
Befehle frei zur Verfügung.
* Praxis-Beispiel: Eine bunte Wetterstation, ein kleines Oszilloskop
oder sogar kleine Videospiele.
* Wichtige Hinweise: TFT-Displays nutzen den SPI-Bus und benötigen
viele Kabel. Sie sind außerdem extrem speicherhungrig. Hier glänzt
der Arduino R4 mit seinem großen Speicher!
* UNO R3 Kompatibel: ✅ JA. (Achtung: Auf dem klassischen R3 wird bei
komplexen Grafiken sehr schnell der Speicherplatz knapp).

➔ Block-System: TM1637 & TM1638 (7-Segment Anzeigen)
Ordner/Datei: blocks/visuals/visu_tm.js
Menü: Ausgänge ➔ Displays

Beschreibung:
Das TM1637 ist eine klassische 4-stellige Digitaluhr-Anzeige (7-Segment).
Das TM1638 ist der große Bruder mit 8 Ziffern, 8 zusätzlichen roten LEDs
und 8 integrierten Tastern! Beide Module sind extrem leicht zu
verkabeln und eignen sich hervorragend für schnelle Zahlenausgaben.
* Praxis-Beispiel: Bau einer eigenen Stoppuhr, eines Weckers oder
eines Spielstand-Zählers für Tischkicker.
* Wichtige Hinweise: Auch hier gibt es einen Setup-Block, der die Pins
festlegt. Danach kannst du einfach Zahlen oder Variablen andocken.
* UNO R3 Kompatibel: ✅ JA.

====================================================================
7. BLÖCKE & FUNKTIONEN: KATEGORIE "LOGIK"
====================================================================
Die Logik-Kategorie ist das eigentliche Gehirn deines Codes. Hier
trifft der Arduino Entscheidungen, rechnet Werte um und vergleicht
Zustände miteinander.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Vergleiche & Logik
--------------------------------------------------------------------

➔ Block: Vergleichen (=, >, <, ≠)
Ordner/Datei: blocks/functions/logic_compare.js
Menü: Logik

Beschreibung:
Dieser Block vergleicht zwei Werte miteinander und gibt als Antwort
immer nur WAHR oder FALSCH zurück. Du kannst prüfen, ob eine Zahl
größer, kleiner oder exakt gleich einer anderen Zahl (oder Variable) ist.
* Praxis-Beispiel: Gehört in jede WENN-DANN-Abfrage! Zum Beispiel:
"WENN Temperatur > 25, DANN schalte Lüfter an".
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Logische Verknüpfung (UND / ODER)
Ordner/Datei: blocks/functions/logic_operation.js
Menü: Logik

Beschreibung:
Verbindet zwei Bedingungen miteinander. Bei "UND" müssen BEIDE
Bedingungen erfüllt sein, damit das Ergebnis WAHR ist. Bei "ODER"
reicht es, wenn nur eine von beiden zutrifft.
* Praxis-Beispiel: "WENN Taster1 gedrückt UND Taster2 gedrückt, DANN
starte die Rakete".
* UNO R3 Kompatibel: ✅ JA.

➔ Block: NICHT (Invertieren)
Ordner/Datei: blocks/functions/logic_negate.js
Menü: Logik

Beschreibung:
Dreht die Logik komplett um. Aus WAHR wird FALSCH und aus FALSCH
wird WAHR.
* Praxis-Beispiel: Sehr praktisch, wenn du mit internen Pullup-Tastern
arbeitest. Da diese gedrückt ein "LOW" (Falsch) liefern, kannst du
es mit diesem Block zu einem "WENN NICHT Pin 4, DANN..." umbauen.
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ UNTERKATEGORIE: Mathematik
--------------------------------------------------------------------

➔ Block: Grundrechenarten (+, -, *, /)
Ordner/Datei: blocks/functions/math_arithmetic.js
Menü: Logik

Beschreibung:
Der klassische Taschenrechner. Nimmt zwei Zahlen oder Variablen und
addiert, subtrahiert, multipliziert oder dividiert sie.
* Praxis-Beispiel: Ausrechnen von Distanzen oder Umrechnen von
Sensorwerten (z. B. Sensorwert minus 10).
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Wertebereich umschreiben (Map-Funktion)
Ordner/Datei: blocks/functions/math_map.js
Menü: Logik

Beschreibung:
Einer der wichtigsten Befehle in der Arduino-Welt! Er nimmt einen
Zahlenwert aus einem bestimmten Bereich und quetscht oder dehnt ihn
proportional in einen völlig neuen Bereich.
* Praxis-Beispiel: Ein analoger Regler liefert Werte von 0 bis 1023.
Ein Servomotor braucht aber Werte von 0 bis 180. Der Map-Block
rechnet das automatisch und völlig fehlerfrei für dich um!
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Wert begrenzen (Constrain)
Ordner/Datei: blocks/functions/math_constrain.js
Menü: Logik

Beschreibung:
Dieser Block fungiert als "Sicherheits-Türsteher" für deine Zahlen.
Du gibst einen Mindest- und einen Maximalwert an. Ist deine Zahl zu
klein, wird sie auf das Minimum angehoben. Ist sie zu groß, wird sie
auf das Maximum gekappt.
* Praxis-Beispiel: Verhindert, dass ein Motor kaputtgeht, weil der
Code aus Versehen versucht, eine Geschwindigkeit von 300 statt
maximal 255 zu senden.
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Zufallszahl (Random)
Ordner/Datei: blocks/functions/math_random.js
Menü: Logik

Beschreibung:
Wirft einen unsichtbaren Würfel und liefert dir eine zufällige Zahl
zwischen einem Minimum und einem Maximum.
* Praxis-Beispiel: Bau eines digitalen Würfels (1 bis 6) oder zufällige
Farbwechsel bei einem NeoPixel-Streifen.
* UNO R3 Kompatibel: ✅ JA.

====================================================================
8. BLÖCKE & FUNKTIONEN: KATEGORIE "VARIABLEN"
====================================================================
Variablen sind wie beschriftete Schubladen in deinem Arduino. Du
kannst dort Zahlen oder Texte hineinlegen, sie dir später wieder
herausholen, sie verändern oder löschen. Sie sind unverzichtbar, um
sich Dinge im Programmablauf zu merken.

--------------------------------------------------------------------
➔ Block: Variable deklarieren (Erstellen)
Ordner/Datei: blocks/board/variables_basic.js
Menü: Variablen

Beschreibung:
Bevor du eine Schublade nutzen kannst, musst du sie bauen und
beschriften. Mit diesem Block erstellst du eine neue Variable und
legst fest, ob sie Text (String), ganze Zahlen (int) oder
Kommazahlen (float) speichern soll.
* Praxis-Beispiel: Eine Variable namens "Punktestand" als Zahl (int)
erstellen und ihr am Start den Wert 0 geben.
* Wichtige Hinweise: Variablen sollten am besten ganz oben in den
GLOBAL-Bereich deines "Programm Start"-Blocks gepackt werden, damit
das gesamte Programm jederzeit darauf zugreifen kann.
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Setze Variable / Lese Variable
Ordner/Datei: blocks/board/variables_basic.js
Menü: Variablen

Beschreibung:
Der "Setze"-Block legt einen neuen Wert in deine Schublade (überschreibt
den alten). Der "Lese"-Block holt den aktuellen Wert aus der Schublade
heraus, um ihn zum Beispiel auf einem Display anzuzeigen oder in einer
Rechnung zu verwenden.
* Praxis-Beispiel: "Setze [Punktestand] auf [Punktestand + 1]".
* UNO R3 Kompatibel: ✅ JA.

➔ Block: Text / Zahl (Eingabefelder)
Ordner/Datei: blocks/board/var_literals.js
Menü: Variablen

Beschreibung:
Das sind deine rohen Bausteine. Ein einfacher Block, in den du eine
Zahl oder ein Wort eintippst, um diesen an andere Blöcke (wie Displays,
Laufschriften oder Variablen) anzudocken.
* Praxis-Beispiel: Den Text "Hallo Welt" in einen Laufschrift-Block
stecken.
* UNO R3 Kompatibel: ✅ JA.

====================================================================
9. BLÖCKE & FUNKTIONEN: KATEGORIE "UNTERPROGRAMME"
====================================================================
Wenn dein Programm riesig wird, verliert man schnell den Überblick.
Unterprogramme (Funktionen) helfen dir, deinen Code aufzuräumen,
indem du wiederkehrende Aufgaben auslagerst.

--------------------------------------------------------------------
➔ Block: Unterprogramm definieren & aufrufen
Ordner/Datei: blocks/functions/functions_custom.js
Menü: Unterprogramme

Beschreibung:
Mit dem "Definiere"-Block baust du eine eigene Mini-Maschine. Du gibst
ihr einen Namen (z.B. "AlarmAusloesen") und packst dort Blöcke rein
(Rotes Licht an, Summer an, Text auf Display). Im normalen Loop-Programm
ziehst du dann nur noch den kleinen "Aufrufen"-Block rein. Der Arduino
springt dann zum Unterprogramm, arbeitet es ab und springt zurück.
* Praxis-Beispiel: Komplexe Lauflicht-Muster für die NeoPixel bauen und
sie mit einem einzigen kleinen Block immer wieder aufrufen.
* Wichtige Hinweise: Definiere Unterprogramme immer außerhalb deiner
Haupt-Schleife (Loop).
* UNO R3 Kompatibel: ✅ JA.

====================================================================
10. BLÖCKE & FUNKTIONEN: KATEGORIE "ERWEITERT"
====================================================================
Hier liegen die Spezialwerkzeuge für fortgeschrittene Projekte.
Speichere Daten dauerhaft ab, kommuniziere mit dem PC oder greife
direkt in den C++ Code ein!

--------------------------------------------------------------------
➔ Block-System: Serial Communication (PC-Verbindung)
Ordner/Datei: blocks/advanced/serial_com.js
Menü: Erweitert ➔ Serial

Beschreibung:
Ermöglicht dem Arduino, über das USB-Kabel mit dem PC (dem Seriellen
Monitor in der Arduino IDE) zu sprechen. Du musst die Verbindung im
Setup starten (meist mit 9600 Baud) und kannst dann Texte und Zahlen
an den PC senden (Print) oder Befehle vom PC empfangen (Read).
* Praxis-Beispiel: Sensorwerte live am Computerbildschirm überwachen
oder den Arduino über Tastatureingaben vom PC aus steuern.
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ Block-System: Flash / EEPROM
Ordner/Datei: blocks/advanced/eeprom_r4.js
Menü: Erweitert ➔ Flash / EEPROM

Beschreibung:
Normale Variablen werden gelöscht, sobald der Arduino vom Strom
getrennt wird. Der EEPROM ist das Langzeitgedächtnis deines Boards.
Speicherst du hier eine Zahl ab, ist sie auch nach einem Stromausfall
oder Neustart noch da.
* Praxis-Beispiel: Den Highscore in einem Spiel speichern oder sich
merken, wie oft eine Tür geöffnet wurde.
* Wichtige Hinweise: Der EEPROM hat nur eine begrenzte Lebensdauer an
Schreibvorgängen (ca. 100.000 Mal). Speichere hier Daten also nur,
wenn sie sich ändern, nicht bei jedem Schleifendurchlauf in der Loop!
* UNO R3 Kompatibel: ✅ JA. (Achtung: Der R4 hat intern eine etwas
andere Speicherarchitektur als der R3, aber die Blöcke übernehmen
diese Anpassung im Hintergrund für dich).

--------------------------------------------------------------------
➔ Block-System: SD Karte
Ordner/Datei: blocks/advanced/sd_card.js
Menü: Erweitert ➔ SD Karte

Beschreibung:
Erlaubt das Lesen und Schreiben von Textdateien (.txt) auf einer
echten Micro-SD-Karte (über ein angeschlossenes SD-Modul).
* Praxis-Beispiel: Einen Datenlogger bauen, der alle 10 Minuten
Temperatur und Uhrzeit auf einer SD-Karte protokolliert, um sie
später in Excel auszuwerten.
* Wichtige Hinweise: SD-Karten-Module benötigen den SPI-Bus. Achte auf
die exakte Pin-Belegung für SCK, MISO, MOSI und CS.
* UNO R3 Kompatibel: ✅ JA.

--------------------------------------------------------------------
➔ Block-System: C++ Notausgang (Inline & Global)
Ordner/Datei: blocks/advanced/custom_cpp.js
Menü: Erweitert ➔ C++ Notausgang

Beschreibung:
Wenn du einen Befehl oder eine spezielle Bibliothek verwenden möchtest,
für die es in der LogicKiste (noch) keinen eigenen bunten Block gibt,
ist das dein Retter in der Not. Du tippst einfach reinen C++ Code in
das Textfeld des Blocks. Dieser Code wird dann 1:1 und ohne Prüfung
direkt in den generierten Arduino-Code übernommen.
* Praxis-Beispiel: Das Einbinden eines völlig neuen, unbekannten
Sensors aus dem Internet.
* Wichtige Hinweise: Hier musst du auf Semikolons (;) am Zeilenende
achten! Die LogicKiste kann Tippfehler in diesem Block nicht
abfangen.
* UNO R3 Kompatibel: ✅ JA. (Abhängig davon, welchen Code du eintippst!)
====================================================================

====================================================================
11. TROUBLESHOOTING & HÄUFIGE FEHLER (FAQ)
====================================================================
Programmieren bedeutet manchmal auch Fehlersuche. Keine Sorge, das
gehört dazu! Hier sind die häufigsten Stolperfallen und wie du sie
in Sekunden lösen kannst.

--------------------------------------------------------------------
❌ FEHLER: Klick auf "Upload" zeigt "Keine Bridge / Fehler"
--------------------------------------------------------------------
Ursache: Der Browser kann deinen Arduino nicht finden, weil das
Hintergrundprogramm (die Bridge) nicht läuft oder der falsche
USB-Port eingestellt ist.

Lösung:
1. Läuft die Bridge? Stelle sicher, dass du die "start_bridge.bat"
per Doppelklick gestartet hast und das schwarze Fenster im
Hintergrund geöffnet ist.
2. Stimmt der Port? Prüfe in deiner Arduino IDE, an welchem COM-Port
der "Arduino UNO R4 WiFi" angeschlossen ist. Öffne dann die Datei
"last_port.txt" im Ordner deiner LogicKiste, trage genau diesen
Port ein (z. B. COM5) und speichere die Datei. Starte die Bridge
danach neu.

--------------------------------------------------------------------
❌ FEHLER: "Kompilierungsfehler" beim Upload (Rote Fehlermeldung)
--------------------------------------------------------------------
Ursache: Der C++ Code ist fehlerfrei generiert worden, aber dem
Compiler auf deinem PC fehlt eine wichtige Bibliothek, um den Code
zu übersetzen. Das passiert oft bei der R4 Matrix oder NeoPixeln.

Lösung:
1. Öffne die normale Arduino IDE auf deinem PC.
2. Klicke links auf das "Bibliotheksverwalter"-Symbol (die Bücher).
3. Suche nach der fehlenden Bibliothek und klicke auf "Installieren".
- Für die R4 Text-Laufschrift suche nach: "ArduinoGraphics"
- Für bunte LED-Streifen suche nach: "Adafruit NeoPixel"
- Für den Temperatursensor suche nach: "DHT sensor library" (von Adafruit)
4. Gehe zurück in die LogicKiste und drücke erneut auf Upload.

--------------------------------------------------------------------
❌ FEHLER: Das Programm "hängt" (Taster reagieren nicht mehr)
--------------------------------------------------------------------
Ursache: Du verwendest wahrscheinlich einen Block, der das Programm
"blockiert", zum Beispiel den "Laufschrift"-Block für die Matrix oder
zu viele lange "Warte (Delay)"-Blöcke.

Lösung:
Während eine Laufschrift über das Display wandert oder ein Delay abläuft,
ist der Arduino taub! Tausche für schnelle Messwerte (wie Drehencoder
oder fließende Sensordaten) den Laufschrift-Block gegen den Block
"Zeige statisch:" aus. Dieser zeigt Werte blitzschnell an, ohne den
Code anzuhalten.

--------------------------------------------------------------------
❌ FEHLER: Ich habe neue Blöcke hinzugefügt, sehe sie aber nicht
--------------------------------------------------------------------
Ursache: Dein Webbrowser hat sich eine alte Version der Seite
gemerkt (Browser-Cache), um Ladezeiten zu sparen.

Lösung:
Drücke auf deiner Tastatur gleichzeitig "Strg + F5" (Windows) oder
"Cmd + Shift + R" (Mac). Das zwingt den Browser, den Speicher zu
leeren und die allerneueste Version deiner LogicKiste zu laden.

--------------------------------------------------------------------
❌ FEHLER: Export sagt "Kein PROGRAMM START Block gefunden!"
--------------------------------------------------------------------
Ursache: Du hast den blauen Hauptblock gelöscht oder er wurde beim
Laden eines alten Projekts nicht richtig wiederhergestellt.

Lösung:
Ohne den "Programm Start"-Block kann kein C++ Code gebaut werden.
Lade die Seite neu (F5), um einen frischen Start-Block zu erhalten,
und baue dein Programm direkt in diesen Block hinein.
====================================================================

====================================================================
DISCLAIMER / HAFTUNGSAUSSCHLUSS FÜR DIE R4_LOGICKISTE
====================================================================

WICHTIGER HINWEIS (Bitte vor der Nutzung lesen):

Die "R4_LogicKiste" befindet sich aktuell in einer frühen
Entwicklungsphase (PRE-BETA). Das Tool und der darin generierte
C++ Code dienen ausschließlich zu Bildungszwecken und zum
privaten Basteln.

Die Nutzung der Software sowie des generierten Codes erfolgt
absolut auf eigene Gefahr. Ich übernehme keine Haftung für Schäden
an Hardware (wie defekte Arduinos oder Sensoren), Datenverlust
oder sonstige Folgeschäden, die durch die Nutzung dieses Tools
entstehen.

--------------------------------------------------------------------
AUSFÜHRLICHER HAFTUNGSAUSSCHLUSS
--------------------------------------------------------------------

1. Entwicklungsstatus (Pre-Beta)
Die R4_LogicKiste ist ein laufendes Hobby-Projekt und befindet sich
derzeit in einer Pre-Beta-Phase. Das bedeutet, dass Funktionen
möglicherweise fehlerhaft sind, Blöcke unerwartete Ergebnisse
liefern können und das System noch nicht vollständig getestet
wurde.

2. Generierter C++ Code
Der durch das Google Blockly System generierte C++ Code wird
automatisch erstellt. Obwohl die Generatoren sorgfältig programmiert
wurden, kann es vorkommen, dass der Code Fehler enthält (Bugs),
den Arduino blockiert oder bei falscher Beschaltung der Hardware
Komponenten beschädigt (z. B. durch Kurzschlüsse oder falsche
Pin-Zuweisungen). Der Anwender ist in jedem Fall verpflichtet, den
generierten Code vor dem Upload zu prüfen und die elektronische
Schaltung abzusichern. Der C++ Code wird kontinuierlich
geprüft und optimiert, eine Garantie für fehlerfreie Funktion
gibt es jedoch nicht.

3. Haftung für Sach- und Folgeschäden
Ich stelle lediglich dieses Software-Werkzeug kostenfrei zur
Verfügung. Ich hafte nicht für:
* Zerstörte oder beschädigte Mikrocontroller (Arduino), Sensoren,
Motoren oder PC-Schnittstellen (USB).
* Ausfallzeiten oder Datenverluste, die durch die lokale Bridge
oder den Upload-Prozess entstehen.
* Schäden jeglicher Art, die durch fehlerhaft generierten Code
verursacht werden.

4. Gewerbliche und kritische Nutzung untersagt
Die mit der R4_LogicKiste erstellten Programme dürfen nicht für
sicherheitskritische Anlagen (z. B. Maschinensteuerungen,
Alarmanlagen für Wertgegenstände, medizinische Geräte oder
Fahrzeugtechnik) eingesetzt werden. Die Nutzung ist rein für den
Hobby-, Schul- und Maker-Bereich gedacht.

Mit der Nutzung der R4_LogicKiste erklärst du dich mit diesem
Haftungsausschluss einverstanden.
====================================================================