// Emergence
// A cellular automaton that creates emergent patterns
var emergence = function (p) {
  const clrA = new Uint8Array([255, 255, 255, 255]);
  const clrB = new Uint8Array([0, 0, 0, 255]);
  const res = 200;
  const brRadius = 10;
  let grd = new Uint8Array(res * res);
  let zm;

  p.setup = function () {
    const emergenceDiv = document.getElementById("emergence");
    emergenceDiv.innerHTML = "";
    const emergence = p.createCanvas(emergenceDiv.clientWidth, emergenceDiv.clientWidth, p.WEBGL);
    emergence.parent("emergence");

    p.background(255);
    p.pixelDensity(zm = res / emergenceDiv.clientWidth);
    p.loadPixels();
    grd.fill(0).map(() => p.floor(p.random(256)));
    emergence.mouseMoved(p.dragged);
  }

  p.draw = function () {
    const newGrd = grd.slice();
    for (let y = 1; y < res - 1; y++) {
      const offsetY = y * res;
      for (let x = 1; x < res - 1; x++) {
        const i = x + offsetY;
        const oldVal = grd[i];
        const sum = grd[i - res] + grd[i - 1] + grd[i + 1] + grd[i + res] + grd[i - 1 - res] + grd[i + 1 - res] + grd[i - 1 + res] + grd[i + 1 + res];
        const avg = p.floor(sum / 8);
        const newVal = (avg + 1) & 0xff;
        newGrd[i] = newVal;
        const col = p.sin(1 + newVal / 4) > p.sin(oldVal / 4) ? clrA : clrB;
        p.pixels.set(col, i * 4);
      }
    }
    grd = newGrd;
    p.updatePixels();
  }

  p.dragged = function () {
    for (let dy = -brRadius; dy <= brRadius; dy++) {
      const offsetY = (p.floor(p.mouseY * zm + dy)) * res;
      for (let dx = -brRadius; dx <= brRadius; dx++) {
        if (dx ** 2 + dy ** 2 > brRadius ** 2) continue;
        const x = p.floor(p.mouseX * zm + dx);
        if (x >= 0 && x < res) grd[x + offsetY] = p.floor(p.random(256));
      }
    }
  }
}

// Kinetic
// A 3D animation that creates a kinetic effect
var kinetic = function (p) {
  let s = [];

  p.setup = function () {
    const kineticDiv = document.getElementById("kinetic");
    kineticDiv.innerHTML = "";
    const kinetic = p.createCanvas(kineticDiv.clientWidth, kineticDiv.clientWidth, p.WEBGL);
    kinetic.parent("kinetic");
    p.background(100);
    for (let x = 0; x < p.width; x += 130) {
      for (let y = 0; y < p.height; y += 120) {
        s.push(new Square(60));
      }
    }
  }

  p.draw = function () {
    //background(0);
    p.push();
    for (let i = 0; i < s.length; i++) {
      p.translate((i * 0.5), -(i * 0.5));
      s[i].render();
    }
    p.pop();

    p.fill(255, 20);
    p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
  }

  class Square {
    constructor(size) {
      this.size = size
    }

    render() {
      p.rotateX(p.frameCount * 0.001);
      p.rotateY(p.frameCount * 0.001);

      let pulse = p.sin(p.frameCount * 0.005) * 200;

      p.push();
      p.box(this.size);

      p.translate(-pulse, -60, -60);
      p.box(((pulse + 200) / 400) * this.size);
      p.pop();

      p.push();
      p.translate(pulse, 60, 60);
      p.box(((pulse + 200) / 400) * this.size);
      p.pop();
    }
  }
}

// Blobulation
// A physics-based animation that creates a blob-like effect
var blobulation = function (p) {
  let gWorld, gRadius, gDamping = 0.17, gFrequency = 0.0005, gBlobColor = "#000", allPoints = [], springs = [];

  p.setup = function () {
    const blobulationDiv = document.getElementById("blobulation");
    blobulationDiv.innerHTML = "";
    const blobulation = p.createCanvas(blobulationDiv.clientWidth, blobulationDiv.clientWidth);
    blobulation.parent("blobulation");
    gWorld = new c2.World(new c2.Rect(0, 0, p.width, p.height));
    gRadius = p.width * 0.2;
    addWorldForces();
    createBlob(p.width / 2, p.height / 2);
    p.strokeWeight(5);
  }

  p.draw = function () {
    p.background(255,80);
    gWorld.update();
    updateBlob();
    drawBlob();
  }

  function createBlob(posX, posY) {
    const count = p.floor(gRadius), angInc = p.TWO_PI / count;

    for (let i = 0; i < count; i++) {
      const angle = i * angInc, x = gRadius * p.cos(angle) + posX, y = gRadius * p.sin(angle) + posY, part = new c2.Particle(x, y);
      gWorld.addParticle(part);
      allPoints.push(part);
    }

    for (let i = 0; i < count; i++) {
      const currentPoint = allPoints[i], nextIndex = (i + 1) % count, nextPoint = allPoints[nextIndex], spring = new c2.Spring(currentPoint, nextPoint);
      spring.length = p.dist(currentPoint.position.x, currentPoint.position.y, nextPoint.position.x, nextPoint.position.y);
      spring.range(0.6 * spring.length, 50 * spring.length);
      gWorld.addSpring(spring);
      springs.push({ s: spring, l: spring.length });
    }
  }

  function updateBlob() {
    const amplitude = 0.2 * gRadius, timeFactor = p.min(p.frameCount * gFrequency, 1), expansionFactor = timeFactor * amplitude;

    for (let i = 0; i < allPoints.length; i++) {
      const point = allPoints[i];
      point.radius = 1.5 * expansionFactor;
      for (let j = 0; j < springs.length; j++) {
        const spring = springs[j];
        spring.s.length = spring.l * expansionFactor * gDamping;
      }
    }
  }

  function drawBlob() {
    p.beginShape();
    for (let point of allPoints) {
      p.curveVertex(point.position.x, point.position.y);
    }
    p.stroke(255, 80);
    p.fill(gBlobColor);
    p.endShape(p.CLOSE);
  }

  function addWorldForces() {
    let quadTree = new c2.QuadTree(new c2.Rect(0, 0, p.width, p.height)), collision = new c2.Collision(quadTree);
    collision.iterations = 2;
    gWorld.addInteractionForce(collision);
  }
}



var emergence = new p5(emergence);
var kinetic = new p5(kinetic);
var blobulation = new p5(blobulation);