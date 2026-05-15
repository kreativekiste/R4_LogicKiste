let isEraserMode = false;

document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    setupEventListeners();
});

function setupEventListeners() {
    const inputs = ['gridW', 'gridH', 'startCorner', 'wiring', 'orientation'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            initGrid();
            updateOutput();
        });
    });
}

function initGrid() {
    const w = Math.min(32, Math.max(1, parseInt(document.getElementById('gridW').value) || 8));
    const h = Math.min(32, Math.max(1, parseInt(document.getElementById('gridH').value) || 8));
    
    const container = document.getElementById('pixel-grid');
    container.style.gridTemplateColumns = `repeat(${w}, 22px)`;
    container.innerHTML = '';

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const dot = document.createElement('div');
            dot.className = 'pixel-dot';
            dot.dataset.x = x;
            dot.dataset.y = y;
            
            dot.onmousedown = (e) => { colorize(dot); };
            dot.onmouseenter = (e) => { if(e.buttons === 1) colorize(dot); };
            
            container.appendChild(dot);
        }
    }
}

function colorize(dot) {
    if (isEraserMode) {
        dot.style.background = '';
        dot.removeAttribute('data-color');
    } else {
        const color = document.getElementById('colorPicker').value;
        dot.style.background = color;
        // Speichere Farbe als RGB für den C++ Export
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        dot.dataset.color = `${r}, ${g}, ${b}`;
    }
    updateOutput();
}

function getLEDIndex(x, y, w, h) {
    const start = document.getElementById('startCorner').value;
    const wiring = document.getElementById('wiring').value;
    const orient = document.getElementById('orientation').value;

    let tx = x, ty = y;

    // 1. Start-Ecke anpassen
    if (start.includes('R')) tx = (w - 1) - x;
    if (start.includes('B')) ty = (h - 1) - y;

    // 2. Index berechnen
    if (orient === 'horizontal') {
        if (wiring === 'zigzag' && ty % 2 !== 0) {
            return (ty * w) + ((w - 1) - tx);
        }
        return (ty * w) + tx;
    } else {
        if (wiring === 'zigzag' && tx % 2 !== 0) {
            return (tx * h) + ((h - 1) - ty);
        }
        return (tx * h) + ty;
    }
}

function updateOutput() {
    const w = parseInt(document.getElementById('gridW').value);
    const h = parseInt(document.getElementById('gridH').value);
    let code = "";
    
    document.querySelectorAll('.pixel-dot').forEach(dot => {
        if (dot.dataset.color) {
            const idx = getLEDIndex(parseInt(dot.dataset.x), parseInt(dot.dataset.y), w, h);
            code += `  leds[${idx}] = CRGB(${dot.dataset.color});\n`;
        }
    });

    if (code !== "") code += "  FastLED.show();";
    document.getElementById('output-string').value = code;
}

function toggleEraser() {
    isEraserMode = !isEraserMode;
    const btn = document.getElementById('btnEraser');
    btn.innerText = isEraserMode ? "🧽 Radieren" : "✏️ Zeichnen";
    btn.classList.toggle('eraser-active');
}

function clearGrid() {
    document.querySelectorAll('.pixel-dot').forEach(dot => {
        dot.style.background = '';
        dot.removeAttribute('data-color');
    });
    updateOutput();
}

function copyToClipboard() {
    const area = document.getElementById("output-string");
    area.select();
    document.execCommand("copy");
    alert("Code für LogicKiste kopiert!");
}