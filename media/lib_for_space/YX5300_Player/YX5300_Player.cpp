#include "YX5300_Player.h"

// Konstruktor
YX5300_Player::YX5300_Player(Stream& serialPort) {
  _serial = &serialPort;
}

// Zentrale Sende-Funktion
void YX5300_Player::sendCommand(byte cmd, byte param1, byte param2) {
  byte command_buffer[8] = { 0x7E, 0xFF, 0x06, cmd, 0x00, param1, param2, 0xEF };
  _serial->write(command_buffer, 8);
}

// Setup Sequenz
void YX5300_Player::begin() {
  delay(1000); 
  sendCommand(CMD_SEL_DEV, 0, 0x02); // SD-Karte wählen
  delay(500);
}

// Komfort-Funktionen
void YX5300_Player::setVolume(byte volume) {
  if(volume > 30) volume = 30; 
  sendCommand(CMD_SET_VOL, 0, volume);
}

void YX5300_Player::playFolder(byte folder) {
  sendCommand(CMD_PLAY_FOLDER, folder, 1);
}

void YX5300_Player::playFolderLoop(byte folder) {
  sendCommand(CMD_FOLDER_LOOP, folder, 0);
}

void YX5300_Player::playNext() {
  sendCommand(CMD_NEXT, 0, 0);
}

void YX5300_Player::playPrev() {
  sendCommand(CMD_PREV, 0, 0);
}

void YX5300_Player::pause() {
  sendCommand(CMD_PAUSE, 0, 0);
}

void YX5300_Player::play() {
  sendCommand(CMD_RESUME, 0, 0);
}

void YX5300_Player::stop() {
  sendCommand(CMD_STOP, 0, 0);
}