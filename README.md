# 📘 R4_LogicKiste - Professionelle Arduino Programmierung

**Aktuelle Version:** v1.1 (C++ Verifikationsphase)
**Hardware-Fokus:** Arduino UNO R4 Minima & WiFi (optimiert für RA4M1 32-Bit)
**Offizielle Webseite:** [https://logickiste.de](https://logickiste.de)

---

## 🚀 Das Konzept: Produktivität statt Spielerei
Die **R4_LogicKiste** ist kein klassischer "Lern-Editor", sondern ein **grafisches Entwicklungs-Tool für den produktiven Einsatz**. Während viele blockbasierte Editoren lediglich Code-Schnipsel aneinanderreihen, erzeugt dieses System eine technisch saubere, hochperformante C++ Architektur. 

Das Ziel ist es, professionelle Hardware-Projekte zu realisieren, ohne bei der Code-Qualität Kompromisse einzugehen. Das Tool richtet sich an Maker, Entwickler und Designer, die den Arduino R4 voll ausschöpfen wollen, dabei aber die Effizienz einer grafischen Oberfläche suchen.

* **Automatisierte Zeitsteuerung:** Das Programm übernimmt komplexe `millis()`-Berechnungen vollständig im Hintergrund (nicht-blockierende Timer, Entprellen von Tastern).
* **Ready-to-Use Hardware-Logik:** Fertige Funktionsblöcke für Hardware-Interrupts, Zähler und komplexe Sensorik eliminieren fehleranfällige Setup-Phasen.

## 🏗️ Die Technische Architektur
Das Programm basiert auf einer modularen, dezentralen Struktur, die maximale Stabilität garantiert.

### 📁 Autonome Block-Struktur
Jeder Block ist als eigene, vollständige `.js`-Datei aufgebaut. Diese Dateien agieren autonom und "melden" sich beim System an, was eine extrem hohe Wartbarkeit und einfache Erweiterbarkeit ermöglicht.

### 🛡️ Typensicherheit & Performance
* **Hardware-Konstanten:** Das System nutzt gezielt `const int`, um Compiler-Fehler frühzeitig abzufangen und den Speicher optimal zu nutzen.
* **Ressourcenschonung:** Die Code-Generierung ist auf Performance getrimmt, um auch komplexe Regelkreise ohne Overhead zu bewältigen.

### 🧩 Das 3-Säulen-Prinzip (Scanners)
Ein intelligentes **Hardware-Scanner-System** sortiert den Code automatisch dezentral in drei Ebenen:
1.  **GLOBAL:** Definitionen, Libraries und Objekt-Instanzen.
2.  **SETUP:** Einmalige Initialisierung der Hardware.
3.  **LOOP:** Die eigentliche, performante Programmlogik.

---

## 🧪 Aktueller Status: v1.1 (Compiler-Check)
Wir befinden uns aktuell in der **Version 1.1**. In dieser Phase liegt der Fokus auf der **Verifikation der C++ Ausgabe**. Der generierte Code wird kontinuierlich auf Vollständigkeit und Integrität gegenüber den strengen Anforderungen des Arduino-Compilers geprüft.

---

## ⚖️ Lizenz & Nutzung
* **Nutzung des Editors:** Die R4_LogicKiste darf von **jedem für alle Zwecke** (privat, gewerblich, Bildung) uneingeschränkt und kostenfrei verwendet werden.
* **Software & Quellcode:** Das Projekt ist **Closed Source**. Der zugrunde liegende Programmcode der LogicKiste (die Software selbst) ist **nicht freigegeben**. Er darf zum aktuellen Zeitpunkt nicht geändert, modifiziert, dekompiliert oder in irgendeiner Form neu verbreitet werden.

---
*© 2026 [kreativekiste.de](https://kreativekiste.de) – Engineering meets Creativity.*
