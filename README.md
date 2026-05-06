# 📦 R4_LogicKiste
* **Aktuelle Version:** 1.0 (Prerelease / C++ Compiler Testphase)
* **Hardware-Fokus:** Arduino UNO R4 Minima & WiFi (teilweise kompatibel zu R3)
* **Webseite und Kontakt:** [www.kreativekiste.de]

## 🚀 Das Konzept: Produktivität statt Spielerei
Die **R4_LogicKiste** ist kein klassischer "Lern-Editor" für Kinder und Schule, sondern ein **grafisches Entwicklungs-Tool für den produktiven Einsatz**. Während viele blockbasierte Editoren lediglich Code-Schnipsel aneinanderreihen, erzeugt dieses System eine technisch saubere, hochperformante C++ Architektur. 

Das Ziel ist es, professionelle Hardware-Projekte von Makern realisieren, ohne bei der Code-Qualität Kompromisse einzugehen. Das Tool richtet sich an Maker, Entwickler und Designer, die den **32-Bit RA4M1 Prozessors** voll ausschöpfen wollen, dabei aber die Effizienz einer grafischen Oberfläche suchen.

* **Automatisierte Zeitsteuerung:** Das Programm übernimmt komplexe `millis()`-Berechnungen vollständig im Hintergrund. Aufgaben wie nicht-blockierende Timer, präzise Taktgeber oder das Entprellen von Tastern werden über einfache Blöcke gelöst, ohne dass manuelle Zeitstempel-Vergleiche im Code nötig sind.
* **Ready-to-Use Hardware-Logik:** Standard-Herausforderungen wie die Konfiguration von Hardware-Interrupts oder das Implementieren von Zählern stehen als fertige Funktionsblöcke zur Verfügung. Dies eliminiert fehleranfällige Setup-Phasen und erlaubt den sofortigen Fokus auf die eigentliche Programmlogik.

## 🏗️ Die Technische Architektur
Das Programm basiert auf einer modularen, dezentralen Struktur, die maximale Stabilität und Übersichtlichkeit garantiert.

### 📁 Autonome Block-Struktur
Um bei neuen Blöcken oder Änderungen nicht an die Kern-Funktionen des Systems ran zu müssen, ist jeder Block als eigene, vollständige `.js`-Datei aufgebaut. Diese Dateien agieren autonom und "melden" sich lediglich beim System an, was eine extrem hohe Wartbarkeit und einfache Erweiterbarkeit ermöglicht. Ausnahme der Variablen Block. 

### 📁 Modulare Ordnerstruktur
Die Logik der Blöcke ist strikt in thematische Module unterteilt, was eine schnelle Erweiterung und Wartung ermöglicht:
* `blocks/board/`: Kernkomponenten wie Interrupts und Systemvariablen.
* `blocks/input/` & `output/`: Optimierte Standard-IO-Operationen.
* `blocks/advanced/`: Profi-Schnittstellen (Serial, SD-Karte, EEPROM/Flash, RFID).
* `blocks/visuals/`: Unterstützung für Displays (LCD, TFT, TM-Serie, Neopixel).
* `blocks/functions/`: Logik-Operatoren, Statemachines und mathematische Berechnungen.

### 🛡️ Typensicherheit & Performance
Ein zentraler Vorteil der R4_LogicKiste ist die **strikte Typensicherheit**. 
* **Hardware-Konstanten:** Wo sinnvoll, nutzt das System `const int` statt `#define`, um Compiler-Fehler frühzeitig abzufangen und den Speicher optimal zu nutzen.
* **Ressourcenschonung:** Die Code-Generierung ist auf Performance getrimmt, um auch komplexe Regelkreise und Multitasking-Aufgaben ohne Overhead zu bewältigen.

### 🧩 Das 3-Säulen-Prinzip (Scanners)
Im Gegensatz zu einfachen Editoren nutzt die LogicKiste ein intelligentes **Hardware-Scanner-System**. Dieses System erkennt automatisch, welche Bibliotheken oder globalen Definitionen benötigt werden, und sortiert den Code dezentral in drei Ebenen:
1. **GLOBAL:** Definitionen, Libraries und Objekt-Instanzen.
2. **SETUP:** Einmalige Initialisierung der Hardware.
3. **LOOP:** Die eigentliche, performante Programmlogik.

## 🛠️ Profi-Features (v0.9)
* **Python-Bridge Integration:** Direkter Upload aus dem Browser via Flask-Server ohne manuelles Kopieren des Codes. (noch nicht ganz ausgereift aber mit bridge.ph, start_bridge.bat, last_port.txt und dem Ordner "tool" vorbereitet). 
* **C++ Notausgang (Custom Code):** Für Spezialfälle können eigene C++ Codeblöcke direkt in den grafischen Ablauf oder den globalen Bereich integriert werden.
* **Display Support:** Für TM1637/TM1638, 4 Zoll TFT, LDC Display mit 4 und 2 Zeilen. (Oled in Vorbereitung). 

## 🧪 Aktueller Status: Compiler-Testphase
Wir befinden uns aktuell in der **Version 0.9**. Diese Version ist explizit für die **C++ Compiler-Verifikation** gedacht. Hierbei wird die Integrität des generierten Codes gegen die strengen Anforderungen des Arduino-Compilers geprüft. Eine Freigabe für kritische Produktionsumgebungen erfolgt nach Abschluss dieser Testphase.

## ⚖️ Lizenz & Nutzung
* **Nutzung:** Das Tool darf uneingeschränkt für private und gewerbliche Projekte verwendet werden.
* **Quellcode:** Das Projekt befindet sich in einer geschlossenen Entwicklungsphase. Der zugrunde liegende Programmcode der LogicKiste darf zum aktuellen Zeitpunkt **nicht geändert, modifiziert oder in sonstiger Form neu verbreitet werden**.

---
*© 2026 kreativekiste.de – Engineering meets Creativity.*
