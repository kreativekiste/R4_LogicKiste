import sys
import os
import shutil
import subprocess
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Alle Pfade relativ zum Speicherort dieser Datei — nicht zum CWD
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "last_port.txt")
CLI_PATH    = os.path.join(BASE_DIR, "tools", "arduino-cli.exe")
SKETCH_DIR  = os.path.join(BASE_DIR, "temp_sketch")
BOARD       = "arduino:renesas_uno:minima"

def load_last_port():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return f.read().strip()
    return "COM3"

def save_port(port):
    with open(CONFIG_FILE, "w") as f:
        f.write(port)

# Port aus Argument oder gespeicherter Datei laden
if len(sys.argv) > 1:
    new_arg = sys.argv[1].strip()
    if not new_arg.upper().startswith("COM"):
        new_arg = "COM" + new_arg
    CURRENT_PORT = new_arg.upper()
    save_port(CURRENT_PORT)
else:
    CURRENT_PORT = load_last_port()

@app.route('/upload', methods=['POST'])
def upload():
    code = request.data.decode('utf-8')
    sketch_path = os.path.join(SKETCH_DIR, "temp_sketch.ino")

    # Temp-Ordner frisch anlegen
    if os.path.exists(SKETCH_DIR):
        shutil.rmtree(SKETCH_DIR)
    os.makedirs(SKETCH_DIR)

    with open(sketch_path, "w", encoding="utf-8") as f:
        f.write(code)

    print(f"\n[+] Kompiliere und lade hoch auf {CURRENT_PORT}...")
    cmd = [CLI_PATH, "compile", "--upload", "-b", BOARD, "-p", CURRENT_PORT, SKETCH_DIR]

    try:
        process = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    except subprocess.TimeoutExpired:
        return "Timeout: arduino-cli hat nach 60s nicht geantwortet.", 500
    except FileNotFoundError:
        return f"arduino-cli nicht gefunden unter: {CLI_PATH}", 500

    output = (process.stdout + "\n" + process.stderr).strip()

    if process.returncode == 0:
        return f"Upload auf {CURRENT_PORT} erfolgreich!\n\n{output}", 200
    else:
        return f"Fehler auf {CURRENT_PORT}:\n\n{output}", 500

@app.route('/port', methods=['GET'])
def get_port():
    return CURRENT_PORT, 200

if __name__ == '__main__':
    print(f"Bridge laeuft — Port: {CURRENT_PORT}")
    print(f"   CLI:   {CLI_PATH}")
    print(f"   Board: {BOARD}")
    app.run(port=5000)
