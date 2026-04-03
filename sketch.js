let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
}

function draw() {
  background(255, 255, 12, 50);

  t += 0.02;

  drawSystemPulse();
  drawNodes();
}

// ----------------------
// SISTEMA BASE (SIEMPRE ACTIVO)
// ----------------------
function drawSystemPulse() {
  noFill();
  strokeWeight(1);

  let centerX = width / 2;
  let centerY = height / 2;

  let pulse = sin(t) * 100;

  stroke(255, 80, 180, 40);

  // círculos concéntricos (latido)
  for (let i = 1; i < 5; i++) {
    ellipse(centerX, centerY, 200 + i * 80 + pulse);
  }
}

// ----------------------
// NODOS (RESPUESTA AL USUARIO)
// ----------------------
function drawNodes() {
  let influenceX = mouseX || width / 2;
  let influenceY = mouseY || height / 2;

  for (let i = 0; i < 40; i++) {
    let angle = map(i, 0, 40, 0, TWO_PI);

    let radius = 40+ sin(t + i) * 20;

    let x = influenceX + cos(angle + t) * radius;
    let y = influenceY + sin(angle + t) * radius;

    let d = dist(influenceX, influenceY, x, y);

    let alpha = map(d, 0, width / 2, 180, 40);

    stroke(255, 100, 200, alpha);
    strokeWeight(1);

    point(x, y);

    // conexión suave
    if (d < 120) {
      line(influenceX, influenceY, x, y);
    }
  }
}

// ----------------------
// TOUCH (MÓVIL)
// ----------------------
function touchMoved() {
  return false; // evita scroll
}

// ----------------------
// RESPONSIVE
// ----------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}