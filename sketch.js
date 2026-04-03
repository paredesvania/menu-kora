// =====================================================
// KORA / INTERACCIÓN DIGITAL (rápido + sutil)
// =====================================================

let spacing = 28;
let cols, rows;

let zoff = 0;

let targetX, targetY;
let currentX, currentY;

let symbols = ["<3", "01", "//", "[]", "++", "--", "♡", "::"];
let activeSymbols = [];

let palettes = [
  { bg: "#ffffff", main: "#111111", accent: "#fe06d3" },
  { bg: "#f9f9f9", main: "#222222", accent: "#D4E157" }
];
let palette;

// =====================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // 👈 clave para rendimiento
  textAlign(CENTER, CENTER);
  textFont("monospace");

  palette = random(palettes);

  targetX = width / 2;
  targetY = height / 2;
  currentX = targetX;
  currentY = targetY;

  calculateGrid();
  generateSymbols();
}

// =====================================================

function draw() {
  background(palette.bg);

  currentX = lerp(currentX, targetX, 0.1);
  currentY = lerp(currentY, targetY, 0.1);

  zoff += 0.004;

  fill(palette.main);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      let d = dist(x, y, currentX, currentY);
      let n = noise(i * 0.1, j * 0.1, zoff);

      // tamaño base
      let size = map(n, 0, 1, 8, 15);

      // 👇 CAMBIO CLAVE: antes crecía mucho, ahora casi nada
      if (d < 140) {
        size *= map(d, 0, 140, 1.15, 1); // MUCHO más sutil
      }

      textSize(size);

      let index = i + j * cols;
      let sym = activeSymbols[index];

      // cambio leve de símbolo
      if (d < 90 && frameCount % 20 === 0) {
        sym = random(symbols);
        activeSymbols[index] = sym;
      }

      // 👇 ROSADO: mismo efecto pero sin agrandar
      if (d < 120) {
        fill(palette.accent);
      } else {
        fill(palette.main);
      }

      // micro movimiento
      let offsetX = map(noise(x * 0.01, y * 0.01, zoff), 0, 1, -1, 1);
      let offsetY = map(noise(x * 0.01 + 100, y * 0.01, zoff), 0, 1, -1, 1);

      text(sym, x + offsetX, y + offsetY);
    }
  }
}

// =====================================================

function calculateGrid() {
  cols = floor(width / spacing);
  rows = floor(height / spacing);
}

function generateSymbols() {
  activeSymbols = [];
  for (let i = 0; i < cols * rows; i++) {
    activeSymbols.push(random(symbols));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
  generateSymbols();
}

// =====================================================

function mouseMoved() {
  targetX = mouseX;
  targetY = mouseY;
}

function touchStarted() {
  if (touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }
  return false;
}

function touchMoved() {
  if (touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }
  return false;
}