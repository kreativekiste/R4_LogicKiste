#include "GEngine.h"
#include <SPI.h>

// Matrix über Hardware SPI initialisieren
MD_MAX72XX mx = MD_MAX72XX(MD_MAX72XX::FC16_HW, CS_PIN, MAX_DEVICES);

// Hilfs-Array für die For-Schleifen der Taster
const int buttonPins[6] = {
    PIN_BTN_LEFT, PIN_BTN_RIGHT, PIN_BTN_UP, PIN_BTN_DOWN, PIN_BTN_A, PIN_BTN_B
};

GEngine::GEngine() {
    running = false;
    for (int i = 0; i < 3; i++) {
        sprites[i].active = false;
    }
    for (int i = 0; i < 6; i++) {
        btnState[i] = LOW;
        lastBtnState[i] = LOW;
        btnPressedEvent[i] = false;
        lastDebounceTime[i] = 0;
    }
}

void GEngine::init() {
    // Tasten als Inputs mit internem Pullup aktivieren
    for (int i = 0; i < 6; i++) {
        pinMode(buttonPins[i], INPUT_PULLUP);
    }
    
    // Matrix starten und leeren
    mx.begin();
    mx.control(MD_MAX72XX::INTENSITY, 5); // Mittlere Helligkeit (0-15)
    mx.clear();
}

void GEngine::start() {
    running = true;
}

void GEngine::stop() {
    running = false;
    mx.clear(); // Spielfeld beim Beenden räumen
}

bool GEngine::isRunning() {
    return running;
}

void GEngine::update() {
    readButtons();
    drawSprites();
}

void GEngine::readButtons() {
    for (int i = 0; i < 6; i++) {
        // Da INPUT_PULLUP gegen GND schaltet, invertieren wir das Signal (!),
        // damit ein gedrückter Taster in der Logik "true" ist.
        bool reading = !digitalRead(buttonPins[i]);

        // Entprellen (Debouncing)
        if (reading != lastBtnState[i]) {
            lastDebounceTime[i] = millis();
        }

        if ((millis() - lastDebounceTime[i]) > debounceDelay) {
            if (reading != btnState[i]) {
                btnState[i] = reading;
                
                // Flankenerkennung: Taste ist jetzt HIGH, war vorher LOW
                if (btnState[i] == true) {
                    btnPressedEvent[i] = true;
                }
            }
        }
        lastBtnState[i] = reading;
    }
}

bool GEngine::buttonHeld(int btn) {
    return btnState[btn];
}

bool GEngine::buttonPressed(int btn) {
    // Wenn das Flanken-Event anliegt, geben wir true zurück
    // und "verbrauchen" das Event sofort (wird wieder false)
    if (btnPressedEvent[btn]) {
        btnPressedEvent[btn] = false;
        return true;
    }
    return false;
}

void GEngine::createSprite(int id, int x, int y, int w, int h) {
    if (id >= 0 && id < 3) {
        sprites[id].active = true;
        sprites[id].x = x;
        sprites[id].y = y;
        sprites[id].w = w;
        sprites[id].h = h;
    }
}

void GEngine::moveSpriteX(int id, int steps) {
    if (id >= 0 && id < 3 && sprites[id].active) {
        sprites[id].x += steps;
    }
}

void GEngine::moveSpriteY(int id, int steps) {
    if (id >= 0 && id < 3 && sprites[id].active) {
        sprites[id].y += steps;
    }
}

void GEngine::destroySprite(int id) {
    if (id >= 0 && id < 3) {
        sprites[id].active = false;
    }
}

bool GEngine::checkCollision(int idA, int idB) {
    // Sicherheitsprüfung: Exisiteren die IDs und sind sie aktiv?
    if (idA < 0 || idA >= 3 || idB < 0 || idB >= 3) return false;
    if (!sprites[idA].active || !sprites[idB].active) return false;

    Sprite& a = sprites[idA];
    Sprite& b = sprites[idB];

    // Standard AABB Kollisionsberechnung (Überschneiden sich die Boxen?)
    bool collisionX = (a.x + a.w > b.x) && (b.x + b.w > a.x);
    bool collisionY = (a.y + a.h > b.y) && (b.y + b.h > a.y);

    return collisionX && collisionY;
}

void GEngine::drawSprites() {
    mx.clear(); // Virtuelles Spielfeld putzen
    
    // Alle aktiven Akteure auf die Matrix pinseln
    for (int i = 0; i < 3; i++) {
        if (sprites[i].active) {
            for (int dx = 0; dx < sprites[i].w; dx++) {
                for (int dy = 0; dy < sprites[i].h; dy++) {
                    // setPoint(Reihe/Y, Spalte/X, Status)
                    // Verhindert Abstürze, falls ein Sprite über den Rand fliegt
                    if ((sprites[i].y + dy) >= 0 && (sprites[i].x + dx) >= 0) {
                         mx.setPoint(sprites[i].y + dy, sprites[i].x + dx, true);
                    }
                }
            }
        }
    }
    // Keine mx.update() nötig, da Auto-Update bei MD_MAX72XX standardmäßig an ist.
}