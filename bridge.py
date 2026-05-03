import sys
from flask import Flask, request
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

CONFIG_FILE = "last_port.txt"
CLI_PATH = os.path.join("tools", "arduino-cli.exe")
BOARD = "arduino:renesas_uno:minima"

def load_last_port():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return f.read().strip()
    return "COM3"

def save_port(port):
    with open(CONFIG_FILE, "w") as f:
        f.write(port)

# LOGIK:
# Wenn ein Argument (Zahl) mitgegeben wurde (durch port_wechseln.bat)
if len(sys.argv) > 1:
    new_arg = sys.argv[1].strip()
    if not new_arg.upper().startswith("COM"):
        new_arg = "COM" + new_arg
    CURRENT_PORT = new_arg.upper()
    save_port(CURRENT_PORT) # Sofort für die Zukunft merken!
else:
    # Ansonsten einfach das nehmen, was in der Datei steht
    CURRENT_PORT = load_last_port()

@app.route('/upload', methods=['POST'])
def upload():
    code = request.data.decode('utf-8')
    sketch_dir = "temp_sketch"
    sketch_path = os.path.join(sketch_dir, "temp_sketch.ino")
    if not os.path.exists(sketch_dir): os.makedirs(sketch_dir)
    with open(sketch_path, "w", encoding="utf-8") as f: f.write(code)

    print(f"\n[+] Upload auf {CURRENT_PORT}...")
    cmd = f'"{CLI_PATH}" compile --upload -b {BOARD} -p {CURRENT_PORT} "{sketch_dir}"'
    process = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if process.returncode == 0:
        return f"✅ Upload auf {CURRENT_PORT} erfolgreich!", 200
    else:
        return f"❌ Fehler auf {CURRENT_PORT}:\n{process.stderr}", 500

if __name__ == '__main__':
    print(f"🚀 Bridge läuft auf {CURRENT_PORT}")
    app.run(port=5000)