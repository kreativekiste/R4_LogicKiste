#ifndef GENGINE_H
#define GENGINE_H

#include <Arduino.h>
#include <MD_MAX72xx.h>

// --- HARDWARE EINSTELLUNGEN ---
// Bevorzuge const int für absolute Konstanten (Performance)
const int MAX_DEVICES = 16; // 16 Stück 8x8 Matrizen = 32x32 Pixel
const int CS_PIN = 10;      // Standard Chip Select für Hardware SPI

// Tasten-Pins (INPUT_PULLUP wird genutzt)
const int PIN_BTN_LEFT = 2;
const int PIN_BTN_RIGHT = 3;
const int PIN_BTN_UP = 4;
const int PIN_BTN_DOWN = 5;
const int PIN_BTN_A = 6;
const int PIN_BTN_B = 7;

// Blockly Dropdown-IDs als Enums für bessere Lesbarkeit
enum SpriteID { PLAYER = 0, ENEMY = 1, PROJECTILE = 2 };
enum ButtonID { BTN_LEFT = 0, BTN_RIGHT = 1, BTN_UP = 2, BTN_DOWN = 3, BTN_A = 4, BTN_B = 5 };

// Struktur für unsere Akteure
struct Sprite {
    bool active;
    int x;
    int y;
    int w;
    int h;
};

class GEngine {
private:
    bool running;
    Sprite sprites[3]; // Platz für 0=Player, 1=Enemy, 2=Projectile
    
    // Arrays für die saubere Tasten-Entprellung
    bool btnState[6];
    bool lastBtnState[6];
    bool btnPressedEvent[6]; // Speichert die Flanke ("wurde neu gedrückt")
    unsigned long lastDebounceTime[6];
    const int debounceDelay = 50; // 50ms Entprell-Zeit

    void readButtons();
    void drawSprites();

public:
    GEngine();
    
    // System-Steuerung
    void init();
    void start();
    void stop();
    void update();
    bool isRunning();

    // Sprite-Steuerung
    void createSprite(int id, int x, int y, int w, int h);
    void moveSpriteX(int id, int steps);
    void moveSpriteY(int id, int steps);
    void destroySprite(int id);
    bool checkCollision(int idA, int idB);

    // Eingabe-Abfrage
    bool buttonPressed(int btn);
    bool buttonHeld(int btn);
};

#endif