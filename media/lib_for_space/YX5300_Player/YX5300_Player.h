#ifndef YX5300_PLAYER_H
#define YX5300_PLAYER_H

#include <Arduino.h>

class YX5300_Player {
  private:
    Stream* _serial;

    // Hex Befehle
    static const byte CMD_NEXT        = 0x01;
    static const byte CMD_PREV        = 0x02;
    static const byte CMD_PLAY_TRACK  = 0x03;
    static const byte CMD_VOL_UP      = 0x04;
    static const byte CMD_VOL_DOWN    = 0x05;
    static const byte CMD_SET_VOL     = 0x06;
    static const byte CMD_SEL_DEV     = 0x09; 
    static const byte CMD_RESUME      = 0x0D; 
    static const byte CMD_PAUSE       = 0x0E;
    static const byte CMD_PLAY_FOLDER = 0x0F;
    static const byte CMD_STOP        = 0x16;
    static const byte CMD_FOLDER_LOOP = 0x17;

    // Zentrale Sende-Funktion intern
    void sendCommand(byte cmd, byte param1, byte param2);

  public:
    // Konstruktor
    YX5300_Player(Stream& serialPort);

    // Steuerung
    void begin();
    void setVolume(byte volume);
    void playFolder(byte folder);
    void playFolderLoop(byte folder);
    void playNext();
    void playPrev();
    void pause();
    void play();
    void stop();
};

#endif