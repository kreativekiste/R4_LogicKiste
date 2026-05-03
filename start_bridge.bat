@echo off
title Ardublock Bridge - AUTO
cd /d "%~dp0"

:: Startet Python direkt ohne Umwege
python bridge.py
pause