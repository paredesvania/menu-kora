let spacing = 40;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
}

function draw() {
  background(12, 12, 16);

  t += 0.01;

  drawWarpGrid();
}

// ----------------------
// GRILLA DEFORMADA
// ----------------------
function drawWarpGrid() {
  stroke(255, 80, 180, 80);
  strokeWeight(1);

  let centerX, centerY;

  // 👉 soporte real para celular
  if (touches.length > 0) {
    centerX = touches[0].x;
    centerY = touches[0].y;
  } else {
    centerX = mouseX || width / 2 + sin(t) * 80;
    centerY = mouseY || height / 2 + cos(t) * 80;
  }

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {

      let d = dist(centerX, centerY, x, y);

      let force = map(d, 0, 250, 60, 0);

      let angle = atan2(y - centerY, x - centerX);

      let dx = cos(angle) * force;
      let dy = sin(angle) * force;

      let x2 = x + dx;
      let y2 = y + dy;

      // líneas horizontales
      if (x + spacing < width) {
        let dRight = dist(centerX, centerY, x + spacing, y);

        let forceR = map(dRight, 0, 250, 60, 0);
        let angleR = atan2(y - centerY, x + spacing - centerX);

        let x2r = (x + spacing) + cos(angleR) * forceR;
        let y2r = y + sin(angleR) * forceR;

        line(x2, y2, x2r, y2r);
      }

      // líneas verticales
      if (y + spacing < height) {
        let dDown = dist(centerX, centerY, x, y + spacing);

        let forceD = map(dDown, 0, 250, 60, 0);
        let angleD = atan2((y + spacing) - centerY, x - centerX);

        let x2d = x + cos(angleD) * forceD;
        let y2d = (y + spacing) + sin(angleD) * forceD;

        line(x2, y2, x2d, y2d);
      }
    }
  }
}

// ----------------------
// MOBILE INTERACTION
// ----------------------
function touchStarted() {
  return false;
}

function touchMoved() {
  return false;
}

// ----------------------
// RESPONSIVE
// ----------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}