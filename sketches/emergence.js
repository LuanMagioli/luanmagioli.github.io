const clrA = new Uint8Array([255, 255, 255, 255]);
const clrB = new Uint8Array([0, 0, 0, 255]);
const res = 300;
const brRadius = 10;
let grd = new Uint8Array(res * res);
let zm;

function setup() {
  const emergence = document.getElementById("emergence");
  emergence.innerHTML = "";
  const p5Canvas = createCanvas(emergence.clientWidth, emergence.clientWidth, WEBGL);
  p5Canvas.class("img-responsive");
  p5Canvas.parent(emergence);
  const minDim = emergence.clientWidth;
  createCanvas(minDim, minDim);
  background(255);
  pixelDensity(zm = res / minDim);
  loadPixels();
  grd.fill(0).map(() => floor(random(256)));
}

function draw() {
  const newGrd = grd.slice();
  for (let y = 1; y < res - 1; y++) {
    const offsetY = y * res;
    for (let x = 1; x < res - 1; x++) {
      const i = x + offsetY;
      const oldVal = grd[i];
      const sum = grd[i - res] + grd[i - 1] + grd[i + 1] + grd[i + res] + grd[i - 1 - res] + grd[i + 1 - res] + grd[i - 1 + res] + grd[i + 1 + res];
      const avg = floor(sum / 8);
      const newVal = (avg + 1) & 0xff;
      newGrd[i] = newVal;
      const col = sin(1 + newVal / 4) > sin(oldVal / 4) ? clrA : clrB;
      pixels.set(col, i * 4);
    }
  }
  grd = newGrd;
  updatePixels();
}

function mouseDragged() {
  for (let dy = -brRadius; dy <= brRadius; dy++) {
    const offsetY = (floor(mouseY * zm + dy)) * res;
    for (let dx = -brRadius; dx <= brRadius; dx++) {
      if (dx ** 2 + dy ** 2 > brRadius ** 2) continue;
      const x = floor(mouseX * zm + dx);
      if (x >= 0 && x < res) grd[x + offsetY] = floor(random(256));
    }
  }
}
