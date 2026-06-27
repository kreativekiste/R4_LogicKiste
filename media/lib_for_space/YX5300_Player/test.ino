#include <Arduino.h>
#include <YX5300_Player.h>

// MP3 Objekt global anlegen und z.B. Serial1 übergeben
YX5300_Player mp3(Serial1);

void setup() {
  // Debug Serial
  Serial.begin(9600);
  
  // MP3 Serial starten
  Serial1.begin(9600);
  
  // Modul initialisieren (wählt die SD-Karte aus)
  mp3.begin();
  
  // Lautstärke senden (0 bis 30)
  mp3.setVolume(20);
  
  Serial.println("MP3 Player bereit und Lautstärke gesetzt.");
}

void loop() {
  // Hier passiert aktuell nichts, System wartet auf weitere Befehle
}