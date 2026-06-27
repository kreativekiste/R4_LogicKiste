#include "Arduino_LED_Matrix.h"
#include <K4_ENC.h>

ArduinoLEDMatrix matrix;
K4_ENC enc; // Default Pins: 2, 3 (Encoder) und 4 (Taster)

const int matrixWidth = 12;
const int matrixHeight = 8;
const unsigned long gameSpeedStart = 200; // Startgeschwindigkeit

// Puffer für das Spielfeld (Bitmap)
uint8_t frame[8][12]; 

// Spiel-Variablen
int playerY = 4;
bool enemies[8][12];
unsigned long lastMoveTime = 0;
unsigned long gameSpeed = gameSpeedStart;
bool gameActive = false;
bool gameOver = false;

// Zähler für die Geschwindigkeits-Erhöhung
int moveCounter = 0;

void setup() {
  Serial.begin(9600);
  matrix.begin();
  enc.begin();
  
  randomSeed(analogRead(0));
  
  // Zeige den Bereit-Zustand (nur das Raumschiff)
  showReadyScreen();
}

void loop() {
  enc.update(); // Background work for encoder and button

  // Wenn der Taster gedrückt wird
  if (enc.isPressed()) {
    if (gameOver) {
      resetGame(); // Setzt alles zurück und startet sofort
    } else {
      gameActive = !gameActive;
      if (gameActive) Serial.println("Spiel gestartet!");
      else Serial.println("Spiel pausiert.");
    }
  }

  // Spiellogik läuft nur, wenn aktiv und nicht Game Over
  if (gameActive && !gameOver) {
    handleMovement();
    handleEnemies();
    drawFrame();
  }
}

void handleMovement() {
  int val = enc.getCount();
  playerY = val % matrixHeight;
  if (playerY < 0) playerY += matrixHeight; 
}

void handleEnemies() {
  if (millis() - lastMoveTime > gameSpeed) {
    lastMoveTime = millis();
    moveCounter++; // Zähle jede Verschiebung

    // 1. Gegner verschieben
    for (int y = 0; y < matrixHeight; y++) {
      for (int x = 0; x < matrixWidth - 1; x++) {
        enemies[y][x] = enemies[y][x + 1];
      }
      enemies[y][matrixWidth - 1] = false;
    }

    // 2. Kollision überprüfen (NEU: Prüfe beide LEDs des Raumschiffs!)
    if (enemies[playerY][0] || enemies[playerY][1]) {
      endGame();
      return; // Sofort abbrechen!
    }

    // 3. Neue Gegner spawnen
    if (random(0, 10) > 7) { 
      enemies[random(0, matrixHeight)][matrixWidth - 1] = true;
    }
    
    // 4. Geschwindigkeit langsam erhöhen (Alle 5 Verschiebungen)
    if (moveCounter % 5 == 0 && gameSpeed > 60) {
      gameSpeed -= 1;
    }
  }
}

void drawFrame() {
  // 1. Spielfeld komplett löschen
  for (int y = 0; y < matrixHeight; y++) {
    for (int x = 0; x < matrixWidth; x++) frame[y][x] = 0; 
  }

  // 2. Spieler-Raumschiff setzen (Spalte 0 UND 1, Zeile playerY)
  if (playerY >= 0 && playerY < matrixHeight) {
    frame[playerY][0] = 1;
    frame[playerY][1] = 1;
  }

  // 3. Gegner zeichnen
  for (int y = 0; y < matrixHeight; y++) {
    for (int x = 0; x < matrixWidth; x++) {
      if (enemies[y][x]) {
        frame[y][x] = 1;
      }
    }
  }

  // 4. Das Bild auf die Matrix schieben
  matrix.renderBitmap(frame, 8, 12);
}

void clearEnemies() {
  for (int y = 0; y < matrixHeight; y++) {
    for (int x = 0; x < matrixWidth; x++) enemies[y][x] = false;
  }
}

// Hilfsfunktion zum sicheren Setzen von Pixeln im Frame-Puffer
void setPixel(int x, int y) {
  if (x >= 0 && x < matrixWidth && y >= 0 && y < matrixHeight) {
    frame[y][x] = 1;
  }
}

// Hilfsfunktion zum Löschen des Frames
void clearFrame() {
  for (int y = 0; y < matrixHeight; y++) {
    for (int x = 0; x < matrixWidth; x++) frame[y][x] = 0;
  }
}

void endGame() {
  gameActive = false;
  gameOver = true;
  Serial.println("Kollision! GAME OVER!");

  // --- NEU: DIE EXPLOSIONS-ANIMATION ---
  // Wir nutzen playerY als Zentrum der Explosion

  // Schritt 1: Der Kern (Das Schiff blitzt auf)
  // Wir setzen das Schiff und ein paar Nachbarn
  setPixel(0, playerY);
  setPixel(1, playerY);
  setPixel(0, playerY - 1);
  setPixel(0, playerY + 1);
  matrix.renderBitmap(frame, 8, 12);
  delay(150); // Kurz warten

  // Schritt 2: Kleiner Kreis (Ring 1)
  clearFrame();
  setPixel(0, playerY - 1); // Oben
  setPixel(0, playerY + 1); // Unten
  setPixel(2, playerY);     // Rechts
  setPixel(1, playerY - 1); // Diagonal
  setPixel(1, playerY + 1); // Diagonal
  matrix.renderBitmap(frame, 8, 12);
  delay(150);

  // Schritt 3: Mittlerer Kreis (Ring 2)
  clearFrame();
  // Ein paar Pixel, die einen Ring andeuten
  setPixel(0, playerY - 2);
  setPixel(0, playerY + 2);
  setPixel(3, playerY);
  setPixel(2, playerY - 1);
  setPixel(2, playerY + 1);
  setPixel(1, playerY - 2);
  setPixel(1, playerY + 2);
  matrix.renderBitmap(frame, 8, 12);
  delay(150);

  // Schritt 4: Großer Kreis & Trümmer fliegen (Ring 3)
  clearFrame();
  setPixel(0, playerY - 3);
  setPixel(0, playerY + 3);
  setPixel(5, playerY); // Fliegt weit nach rechts
  setPixel(3, playerY - 2);
  setPixel(3, playerY + 2);
  setPixel(2, playerY - 3);
  setPixel(2, playerY + 3);
  setPixel(4, playerY - 1);
  setPixel(4, playerY + 1);
  matrix.renderBitmap(frame, 8, 12);
  delay(200);

  // Schritt 5: Trümmer fliegen aus dem Bild
  clearFrame();
  // Nur noch ein paar weit entfernte Pixel
  setPixel(7, playerY); 
  setPixel(5, playerY - 2);
  setPixel(5, playerY + 2);
  setPixel(6, playerY - 1);
  setPixel(6, playerY + 1);
  setPixel(4, playerY - 3);
  setPixel(4, playerY + 3);
  matrix.renderBitmap(frame, 8, 12);
  delay(250);

  // Schritt 6: Letzter Blitz & Ausklingen
  clearFrame();
  setPixel(10, playerY);
  setPixel(8, playerY - 1);
  setPixel(8, playerY + 1);
  matrix.renderBitmap(frame, 8, 12);
  delay(300);

  // Letzte Pause um die 2 Sekunden zu füllen
  clearFrame();
  matrix.renderBitmap(frame, 8, 12);
  delay(650); 
  // Gesamtverzögerung ca.: 150+150+150+200+250+300+650 = 1850ms 
  // Der Rest kommt durch die Rechenzeit zustande.

  // Nach der Explosion in den Bereit-Zustand zurückkehren
  showReadyScreen();
}

void resetGame() {
  clearEnemies();
  gameSpeed = gameSpeedStart;
  gameOver = false;
  gameActive = true;
  moveCounter = 0;
  enc.clear();
  Serial.println("Neustart!");
}

void showReadyScreen() {
  // Nur das Raumschiff anzeigen, keine Gegner
  clearEnemies(); // Sicherstellen, dass keine Gegner da sind
  drawFrame();    // Zeichnet das Raumschiff an seiner aktuellen Position
  Serial.println("Bereit zum Start - Taster druecken!");
}