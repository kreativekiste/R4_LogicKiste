# 🛠️ Release & Beta-Ordner (LogicKiste)

Willkommen in der "Werkstatt" der LogicKiste! 

In diesem Ordner findest du alle **zukünftigen Funktionen**, die aktuell vorbereitet und getestet werden. Bevor neue Blöcke endgültig in das Hauptmenü und die offiziellen Ordner verschoben werden, landen sie zuerst hier.

## 🚧 Was passiert hier?
- **Vorbereitung:** Hier werden neue Ideen und Funktionen in Blockly-Code gegossen.
- **Testphase:** Du kannst diese Blöcke gefahrlos testen, indem du sie in deiner `index.html` einbindest. Solange sie dort nicht verlinkt sind, beeinflussen sie dein bestehendes Programm nicht.
- **Kommende Updates:** Alles, was sich in diesem Ordner befindet, kommt bald! Wenn ein Block fehlerfrei läuft, wird er in die regulären Kategorien (Sensoren, Mathe, Logik etc.) einsortiert.

## 📦 Aktuell im Test (Die neuen Beta-Blöcke)
Folgende Funktionen sind bereits vorbereitet und warten auf ihren Einsatz:

* **Tabellen (Arrays):** `array_tables.js` - Schlankes System zum Erstellen, Lesen und Schreiben von Datenlisten.
* **Zeit ohne Delay:** `time_interval.js` - Code in Intervallen ausführen, ohne den Arduino zu blockieren.
* **Sensor-Glättung:** `analog_smooth.js` - Unruhige Analogwerte (Poti, LDR) automatisch glätten (Averaging).
* **Gyro-Sensor (MPU6050):** `gyro_mpu6050.js` - Neigung, Beschleunigung und Temperatur auslesen.
* **Erweiterte Logik:** `logic_ternary.js` - Schnelle Wenn-Dann-Abfrage (Ternary) in einem winzigen Block.
* **Erweiterte Mathe:** `math_modulo.js` - Berechnet den Rest einer Division (perfekt für Takte oder gerade/ungerade).
* **Zählschleife:** `loop_for.js` - Flexibles Zählen (hoch und runter) mit variabler Schrittweite.
* **Systemzeit:** `time_micros.js` - Hochpräzise Zeit in Mikrosekunden (`micros()`).
* **Buzzer:** `output_tone.js` - Töne mit definierter Frequenz und Dauer abspielen.

---
*Hinweis für Entwickler: Keine Angst vor F12-Fehlern. Das reine Ablegen der Dateien in diesem Ordner zerstört nichts am Hauptprogramm.*