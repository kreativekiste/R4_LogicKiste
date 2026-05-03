## 📦 R4_LogicKiste
* Aktuelle Version: **0.7**
* mehr infos unter: www.kreativekiste.de


## 🚀 Was ist R4_LogicKiste?
R4_LogicKiste ist ein webbasierter, modularer Block-Editor, der speziell für den **Arduino UNO R4 (Minima & WiFi)** optimiert wurde, aber auch mit dem R3 benutz werden kann. Das Ziel des Projekts ist es, die Brücke zwischen kreativer Idee und funktionierender Hardware zu schlagen, ohne dass man sich mit Syntaxfehlern, fehlenden Semikolons oder komplexen Register-Einstellungen herumschlagen muss.

Das Tool generiert sauberen C++ Code in Echtzeit oder/und überträgt diesen über eine spezialisierte Python-Bridge direkt auf die Hardware.

## 🎯 Wofür ist es gedacht?
Dieses Projekt richtet sich an Bastler, Erfinder und Kreative, die:
* Die volle Power des 32-Bit Prozessors vom UNO R4 nutzen wollen.
* Komplexe Hardware wie die 12x8 LED-Matrix oder Drehencoder ohne Library-Chaos ansteuern möchten.
* Multitasking (nicht-blockierendes Programmieren) durch schwebende Logik-Blöcke erlernen oder anwenden wollen.
* Einen aufgeräumten, professionellen Workspace suchen, der sich dem eigenen Workflow anpasst.

## ⚙️ Kern-Features (v0.7)
* **Python-Bridge Integration:** Nahtloser Upload aus dem Browser via Flask-Server und Arduino-CLI.
* **Smart Port Memory:** Das System merkt sich den letzten COM-Port (`last_port.txt`) für einen Zero-Click-Start.
* **Hardware-Spezialisierung:** Dedizierte Blöcke für die R4 LED-Matrix und interrupt-gesteuerte Drehencoder.
* **Echtzeit-Vorschau:** Der generierte C++ Code ist jederzeit sichtbar und exportierbar.

## 🐛 Bekannte Bugs (Known Issues)
* **Encoder-Prellen:** 
* **Interrupt-Initialisierungs-Reihenfolge:** 

## 📅 Kommende Funktionen (To-Do Liste)
### UI & Workspace
- [ ] **🚀 Upload-Button:** Direkte Integration im Header-Menü.
- [ ] **🧹 Auto-Arrange:** Schwebende Blöcke automatisch am rechten Rand sortieren.
- [ ] **📋 Task-Dashboard:** Ausblendbare Liste aller aktiven Hintergrund-Prozesse.
- [ ] **🧘 Zen-Modus:** Workspace komplett leer räumen für maximale Konzentration.

### Hardware & Logik
- [ ] **⏱️ 3-Kanal Rechteck-Generator:** Nicht-blockierende Taktgeber auf `millis`-Basis.
- [ ] **🔄 Toggle-Block:** Einfaches Umschalten von Pin-Zuständen für Blinken ohne Aufwand.
- [ ] **🛠️ Encoder-Upgrade:** Variable Sockets statt Freitext und einstellbare Auflösung (z.B. /4).
- [ ] **💬 Fixer Serial-Text:** Nachrichten senden, ohne erst Variablen anlegen zu müssen.
- [ ] **💬 TM1638:** Einfache Integration für 7 SEG Anzeigen mit 2x4x7 und 4x7 mit Punkt und Doppelpunkt.
- [ ] **💬 Website:** Einfache Websiten erstellen.

## ⚖️ Lizenz & Nutzung
**Nutzung:** Das Tool darf von jedem ohne Einschränkungen für private oder gewerbliche Projekte verwendet werden.
**Quellcode:** Der zugrunde liegende Programmcode darf zum aktuellen Zeitpunkt **nicht geändert, modifiziert oder in veränderter Form neu verbreitet werden**. Das Projekt befindet sich in einer geschlossenen Entwicklungsphase (Closed Source / Restricted Modifications).

---
*© 2026 kreativekiste.de*
