// ==========================================================================
// LogicKiste - OLED Pixel Designer (oled.js)
// ==========================================================================

let isDrawing = false;
let currentTool = 'draw'; // 'draw' oder 'erase'
let gridWidth = 16;
let gridHeight = 16;

// Standard OLED Display Auflösung für die Positionsberechnung
const DISPLAY_WIDTH = 128;
const DISPLAY_HEIGHT = 64;

const canvas = document.getElementById('canvas');
const outputString = document.getElementById('output-string');
const gridSizeSelect = document.getElementById('grid-size');
const positionSelect = document.getElementById('image-position');
const btnDraw = document.getElementById('btn-draw');
const btnErase = document.getElementById('btn-erase');
const imageUpload = document.getElementById('image-upload');

// --- 1. Initialisierung & Event Listener ---

document.addEventListener('DOMContentLoaded', () => {
    // Standardmäßig den "Zeichnen" Button aktivieren
    btnDraw.classList.add('active');
    
    // Raster beim Start aufbauen
    updateGridSize();

    // Tools umschalten
    btnDraw.addEventListener('click', () => setTool('draw'));
    btnErase.addEventListener('click', () => setTool('erase'));

    // Größenänderung & Positionsänderung
    gridSizeSelect.addEventListener('change', updateGridSize);
    positionSelect.addEventListener('change', generateOutput); // Wenn Position geändert wird, Code neu berechnen

    // Verhindert das Standard-Drag-Verhalten des Browsers beim Zeichnen
    canvas.addEventListener('dragstart', (e) => e.preventDefault());
});

function setTool(tool) {
    currentTool = tool;
    if (tool === 'draw') {
        btnDraw.classList.add('active');
        btnErase.classList.remove('active');
    } else {
        btnErase.classList.add('active');
        btnDraw.classList.remove('active');
    }
}

// --- 2. Das Raster (Grid) aufbauen ---

function updateGridSize() {
    const sizeVal = gridSizeSelect.value;
    if (sizeVal === '128x64') {
        gridWidth = 128;
        gridHeight = 64;
        positionSelect.disabled = true; // Bei Vollbild macht Positionierung keinen Sinn
    } else {
        gridWidth = parseInt(sizeVal);
        gridHeight = parseInt(sizeVal);
        positionSelect.disabled = false;
    }

    // Canvas leeren
    canvas.innerHTML = '';
    
    // CSS Grid anpassen (Spalten und Reihen festlegen)
    canvas.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;

    // Pixel-Punkte generieren
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel-dot');
            pixel.dataset.x = x;
            pixel.dataset.y = y;
            
            // Maus-Events für das Zeichnen
            pixel.addEventListener('mousedown', handlePixelClick);
            pixel.addEventListener('mouseenter', handlePixelEnter);
            
            canvas.appendChild(pixel);
        }
    }
    
    // Generierung aktualisieren
    generateOutput();
}

// --- 3. Zeichnen & Radieren ---

// Erkennt, wenn die Maustaste gedrückt wird
canvas.addEventListener('mousedown', () => isDrawing = true);
// Erkennt, wenn die Maustaste losgelassen wird (überall auf der Seite)
document.addEventListener('mouseup', () => isDrawing = false);

function handlePixelClick(e) {
    isDrawing = true;
    applyTool(e.target);
}

function handlePixelEnter(e) {
    if (isDrawing) {
        applyTool(e.target);
    }
}

function applyTool(pixel) {
    if (currentTool === 'draw') {
        pixel.classList.add('active');
    } else {
        pixel.classList.remove('active');
    }
    // Nach jeder Änderung den Code neu generieren
    generateOutput();
}

function clearCanvas() {
    const pixels = document.querySelectorAll('.pixel-dot');
    pixels.forEach(p => p.classList.remove('active'));
    generateOutput();
}

// --- 4. Bild-Upload & Konvertierung ---

imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Ein unsichtbares HTML Canvas nutzen, um das Bild zu verkleinern
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = gridWidth;
            offscreenCanvas.height = gridHeight;
            const ctx = offscreenCanvas.getContext('2d');
            
            // Bild weiß hinterlegen (falls es ein transparentes PNG ist)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, gridWidth, gridHeight);
            
            // Bild auf die exakte Rastergröße zeichnen
            ctx.drawImage(img, 0, 0, gridWidth, gridHeight);
            
            // Pixeldaten auslesen
            const imageData = ctx.getImageData(0, 0, gridWidth, gridHeight);
            const data = imageData.data;
            
            const pixels = document.querySelectorAll('.pixel-dot');
            
            // Jeden Pixel prüfen und in Schwarz/Weiß umwandeln
            for (let i = 0; i < pixels.length; i++) {
                const r = data[i * 4];
                const g = data[i * 4 + 1];
                const b = data[i * 4 + 2];
                
                // Graustufe berechnen (einfacher Durchschnitt)
                const brightness = (r + g + b) / 3;
                
                // Schwellenwert: Dunkle Pixel im Original werden zu aktiven OLED Pixeln
                if (brightness < 128) {
                    pixels[i].classList.add('active');
                } else {
                    pixels[i].classList.remove('active');
                }
            }
            
            generateOutput();
            
            // Input-Feld zurücksetzen, damit man dasselbe Bild nochmal laden könnte
            imageUpload.value = ""; 
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// --- 5. C++ Hex-Array generieren (Adafruit Format) ---

function generateOutput() {
    const pixels = document.querySelectorAll('.pixel-dot');
    const bytesPerRow = Math.ceil(gridWidth / 8);
    let hexArray = [];

    // Zeile für Zeile durchgehen
    for (let y = 0; y < gridHeight; y++) {
        // In jeder Zeile Byte für Byte (8 Pixel) packen
        for (let b = 0; b < bytesPerRow; b++) {
            let currentByte = 0;
            
            // 8 Bits (Pixel) in das Byte schreiben
            for (let i = 0; i < 8; i++) {
                let x = b * 8 + i;
                
                if (x < gridWidth) {
                    let pixelIndex = y * gridWidth + x;
                    if (pixels[pixelIndex].classList.contains('active')) {
                        currentByte |= (1 << (7 - i));
                    }
                }
            }
            hexArray.push("0x" + currentByte.toString(16).padStart(2, '0'));
        }
    }

    // --- POSITIONS-BERECHNUNG ---
    const pos = positionSelect.value;
    let startX = 0;
    let startY = 0;

    if (pos === 'top-right') {
        startX = DISPLAY_WIDTH - gridWidth;
        startY = 0;
    } else if (pos === 'bottom-left') {
        startX = 0;
        startY = DISPLAY_HEIGHT - gridHeight;
    } else if (pos === 'bottom-right') {
        startX = DISPLAY_WIDTH - gridWidth;
        startY = DISPLAY_HEIGHT - gridHeight;
    } else if (pos === 'center') {
        startX = Math.floor((DISPLAY_WIDTH - gridWidth) / 2);
        startY = Math.floor((DISPLAY_HEIGHT - gridHeight) / 2);
    } else if (pos === 'top-center') {
        startX = Math.floor((DISPLAY_WIDTH - gridWidth) / 2);
        startY = 0;
    }
    
    // Sicherheitsprüfung (falls das Raster durch einen Fehler mal zu groß sein sollte)
    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;


    // --- CODE ZUSAMMENBAUEN ---
    let code = `// Automatisch generiertes OLED Bitmap (${gridWidth}x${gridHeight} Pixel)\n`;
    code += `static const uint8_t PROGMEM oled_bild[] = {\n  `;
    
    for (let i = 0; i < hexArray.length; i++) {
        code += hexArray[i];
        if (i < hexArray.length - 1) {
            code += ", ";
        }
        if ((i + 1) % (bytesPerRow > 12 ? 12 : bytesPerRow) === 0 && i < hexArray.length - 1) {
            code += "\n  ";
        }
    }
    
    code += `\n};\n\n`;
    code += `// Zeichen-Befehl für die LogicKiste:\n`;
    // Die berechneten X und Y Werte werden jetzt dynamisch in den C++ Code geschrieben!
    code += `oled.drawBitmap(${startX}, ${startY}, oled_bild, ${gridWidth}, ${gridHeight}, SSD1306_WHITE);\n`;
    code += `  oled.display();\n`;

    outputString.value = code;
}

// --- 6. Kopieren-Funktion ---

function copyToClipboard() {
    outputString.select();
    outputString.setSelectionRange(0, 99999); // Für mobile Geräte
    navigator.clipboard.writeText(outputString.value).then(() => {
        const btn = document.querySelector('.output-area .btn-copy');
        const originalText = btn.innerText;
        btn.innerText = '✅ Kopiert!';
        btn.style.background = '#27ae60';
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--color-mathe)';
        }, 2000);
    }).catch(err => {
        console.error('Kopieren fehlgeschlagen: ', err);
    });
}