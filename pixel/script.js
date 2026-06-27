const MAX_8X8_UNITS = 16;
let current8x8Count = 0;
let placedModules = []; 

function updateUI() {
    const spawnArea = document.getElementById('spawn-area');
    const isSpawnFull = spawnArea.children.length > 0;
    
    document.getElementById('btnAddSingle').disabled = isSpawnFull || (current8x8Count + 1 > MAX_8X8_UNITS);
    document.getElementById('btnAddQuad').disabled = isSpawnFull || (current8x8Count + 4 > MAX_8X8_UNITS);
}

function spawnModule(type) {
    const spawnArea = document.getElementById('spawn-area');
    const count = (type === '8x8') ? 1 : 4;
    
    if (current8x8Count + count > MAX_8X8_UNITS) {
        alert("Maximum von 16 Einheiten (8x8) erreicht!");
        return;
    }

    current8x8Count += count;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'module-wrapper';
    wrapper.style.position = 'relative'; 
    wrapper.dataset.unitCount = count;

    for(let i = 0; i < count; i++) {
        const grid = document.createElement('div');
        grid.className = 'matrix-block';
        
        const bgNum = document.createElement('div');
        bgNum.className = 'bg-number';
        bgNum.innerText = '?';
        grid.appendChild(bgNum);

        for (let j = 0; j < 64; j++) {
            const dot = document.createElement('div');
            dot.className = 'pixel-dot';
            dot.onclick = (e) => {
                dot.classList.toggle('active');
                updateOutput();
            };
            grid.appendChild(dot);
        }
        wrapper.appendChild(grid);
    }

    spawnArea.appendChild(wrapper);
    makeDraggable(wrapper);
    updateUI();
}

function makeDraggable(element) {
    const canvas = document.getElementById('canvas');

    element.onmousedown = function(e) {
        // Pixel-Klicks ignorieren, nur das Modul greifen
        if(e.target.classList.contains('pixel-dot')) return;
        e.preventDefault();

        // 1. Berechne den Abstand vom Cursor zur oberen linken Ecke des Moduls
        let shiftX = e.clientX - element.getBoundingClientRect().left;
        let shiftY = e.clientY - element.getBoundingClientRect().top;

        // 2. Modul IMMER an den Body heften während des Ziehens, um globale Koordinaten zu nutzen
        document.body.appendChild(element);
        element.style.position = 'absolute';
        element.style.zIndex = 1000;

        // Direkt unter die Maus setzen, um Sprünge zu vermeiden
        moveAt(e.pageX, e.pageY);

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.onmouseup = function(e) {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;

            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // 3. Prüfen: Wurde das Modul über der grauen Arbeitsfläche losgelassen?
            if (mouseX >= canvasRect.left && mouseX <= canvasRect.right &&
                mouseY >= canvasRect.top && mouseY <= canvasRect.bottom) {
                
                // Modul in den Canvas-Container verschieben
                canvas.appendChild(element);
                
                if (!placedModules.includes(element)) {
                    placedModules.push(element);
                }

                // Koordinaten relativ zur Arbeitsfläche berechnen
                let newLeft = mouseX - canvasRect.left - shiftX;
                let newTop = mouseY - canvasRect.top - shiftY;

                // Snap-to-Grid (Einrasten im 20px Raster)
                newLeft = Math.round(newLeft / 20) * 20;
                newTop = Math.round(newTop / 20) * 20;

                // Modul nicht über den Rand hinausschieben lassen
                newLeft = Math.max(0, Math.min(newLeft, canvas.offsetWidth - element.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, canvas.offsetHeight - element.offsetHeight));

                element.style.position = 'absolute';
                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';
                element.style.zIndex = ''; // Z-Index zurücksetzen

                recalculateModuleNumbers();
                updateOutput();
                updateUI();

            } else {
                // Modul wurde AUSSERHALB der grauen Fläche losgelassen -> Zurück in den Wartebereich
                if (placedModules.includes(element)) {
                    const index = placedModules.indexOf(element);
                    placedModules.splice(index, 1);
                }
                
                document.getElementById('spawn-area').appendChild(element);
                element.style.position = 'relative';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '';
                
                const bgNums = element.querySelectorAll('.bg-number');
                bgNums.forEach(num => num.innerText = '?');

                recalculateModuleNumbers();
                updateOutput();
                updateUI();
            }
        };
    };

    element.ondragstart = function() { return false; };
}

function recalculateModuleNumbers() {
    let globalCounter = 1;
    placedModules.forEach(wrapper => {
        const grids = wrapper.querySelectorAll('.matrix-block');
        grids.forEach(grid => {
            const bgNum = grid.querySelector('.bg-number');
            bgNum.innerText = globalCounter;
            globalCounter++;
        });
    });
}

function updateOutput() {
    const activeIndices = [];
    let currentBlockIndex = 0;
    
    placedModules.forEach((wrapper) => {
        const grids = wrapper.querySelectorAll('.matrix-block');
        grids.forEach((grid) => {
            const dots = grid.querySelectorAll('.pixel-dot');
            dots.forEach((dot, dotIdx) => {
                if (dot.classList.contains('active')) {
                    activeIndices.push((currentBlockIndex * 64) + dotIdx);
                }
            });
            currentBlockIndex++;
        });
    });

    document.getElementById('output-string').value = activeIndices.join(', ');
}

function clearCanvas() {
    document.getElementById('canvas').innerHTML = '';
    document.getElementById('spawn-area').innerHTML = '';
    placedModules = [];
    current8x8Count = 0;
    updateOutput();
    updateUI();
}

function copyToClipboard() {
    const copyText = document.getElementById("output-string");
    copyText.select();
    document.execCommand("copy");
    
    const btn = document.querySelector('.copy-wrapper button');
    const originalText = btn.innerText;
    btn.innerText = "Kopiert!";
    btn.style.backgroundColor = "#28a745";
    setTimeout(() => { 
        btn.innerText = originalText; 
        btn.style.backgroundColor = "";
    }, 1500);
}

// Initialer Start
updateUI();