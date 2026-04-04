let spacing = 28;
let cols, rows;
let zoff = 0;
let targetX, targetY;
let currentX, currentY;
let symbols = ["<3", "01", "//", "[]", "++", "--", "♡", "::"];
let activeSymbols = [];
let noiseCache = [];
let palettes = [
  { bg: "#ffffff", main: "#111111", accent: "#fe06d3" },
  { bg: "#f9f9f9", main: "#222222", accent: "#D4E157" }
];
let palette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let dpr = isMobile() ? min(window.devicePixelRatio || 1, 1.5) : 1;
  pixelDensity(dpr);
  textAlign(CENTER, CENTER);
  textFont("monospace");
  frameRate(30);
  palette = random(palettes);
  targetX = width / 2;
  targetY = height / 2;
  currentX = targetX;
  currentY = targetY;
  calculateGrid();
  generateSymbols();
}

function draw() {
  background(palette.bg);
  currentX = lerp(currentX, targetX, 0.1);
  currentY = lerp(currentY, targetY, 0.1);
  zoff += 0.004;

  // precalcular todo el noise una vez por frame
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noiseCache[i + j * cols] = noise(i * 0.1, j * 0.1, zoff);
    }
  }

  let lastFill = null;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      // skip celdas fuera del canvas
      if (x < -spacing || x > width + spacing || y < -spacing || y > height + spacing) continue;

      let index = i + j * cols;
      let d = dist(x, y, currentX, currentY);
      let n = noiseCache[index];
      let size = map(n, 0, 1, 8, 15);

      if (d < 140) size *= map(d, 0, 140, 1.15, 1);
      textSize(size);

      let sym = activeSymbols[index];

      // mutar símbolo solo cerca del cursor y con menos frecuencia
      if (d < 90 && frameCount % 30 === 0 && random() > 0.7) {
        sym = random(symbols);
        activeSymbols[index] = sym;
      }

      // agrupar cambios de fill para reducir llamadas al GPU
      let newFill = d < 120 ? palette.accent : palette.main;
      if (newFill !== lastFill) {
        fill(newFill);
        lastFill = newFill;
      }

      // micro offset solo cerca del cursor
      if (d < 200) {
        let offsetX = map(noise(x * 0.01, y * 0.01, zoff), 0, 1, -1, 1);
        let offsetY = map(noise(x * 0.01 + 100, y * 0.01, zoff), 0, 1, -1, 1);
        text(sym, x + offsetX, y + offsetY);
      } else {
        text(sym, x, y);
      }
    }
  }
}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent) || windowWidth < 768;
}

function calculateGrid() {
  // en móvil spacing más grande = menos celdas = más liviano
  spacing = isMobile() ? 36 : 28;
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  noiseCache = new Array(cols * rows);
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