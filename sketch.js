let nodes = [];
let labels = ["Productos", "CAD", "Interacción digital", "Visuales"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  textFont('monospace');

  let radius = min(width, height) * 0.28;

  for (let i = 0; i < labels.length; i++) {
    let angle = map(i, 0, labels.length, 0, TWO_PI);

    nodes.push({
      baseX: width / 2 + cos(angle) * radius,
      baseY: height / 2 + sin(angle) * radius,
      x: 0,
      y: 0,
      label: labels[i]
    });
  }
}

function draw() {
  background(250);

  let mx, my;

  if (touches.length > 0) {
    mx = touches[0].x;
    my = touches[0].y;
  } else {
    mx = mouseX;
    my = mouseY;
  }

  // movimiento suave de nodos
  for (let n of nodes) {
    let d = dist(mx, my, n.baseX, n.baseY);

    let force = map(d, 0, 300, 1.5, 0, true);
    let angle = atan2(my - n.baseY, mx - n.baseX);

    n.x = n.baseX + cos(angle) * force * 20;
    n.y = n.baseY + sin(angle) * force * 20;
  }

  // conexiones suaves
  stroke(0, 0, 0, 30);
  strokeWeight(1);

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let a = nodes[i];
      let b = nodes[j];

      let d = dist(a.x, a.y, b.x, b.y);

      if (d < 220) {
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  // nodos
  for (let n of nodes) {
    let d = dist(mx, my, n.x, n.y);

    // color sutil (identidad)
    let intensity = map(d, 0, 250, 0, 150, true);

    noStroke();
    fill(0, intensity, 120);
    circle(n.x, n.y, 12);

    // activación por proximidad (clave para celular)
    if (d < 90) {
      let alpha = map(d, 0, 90, 255, 0);

      fill(0, alpha);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      text(n.label, n.x, n.y + 40);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}