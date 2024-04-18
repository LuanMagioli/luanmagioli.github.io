// Resolution
// A simple sketch that changes the resolution of an image
var resolution = function (p) {
    let img;
    let imgCopy;
    let factor, mouseFactor, mouseOver = false;
    p.preload = function () {
      img = p.loadImage('../assets/artwork/largato.jpg');
    }
  
    p.setup = function () {
      const resolutionDiv = document.getElementById("resolution");
      resolutionDiv.innerHTML = "";
      const resolution = p.createCanvas(resolutionDiv.clientWidth, resolutionDiv.clientWidth/2);
      resolution.parent("resolution");

      p.fill(255);
      p.stroke(0);
      p.strokeWeight(1);

      p.noSmooth();
      p.frameRate(10);

      resolution.mouseMoved(mouseOv);
      resolution.mouseOut(mouseOu);
    }

    function mouseOv() {
      mouseFactor = p.map(p.mouseX, 0, p.width, 5, 100);
      mouseOver = true;
    }

    function mouseOu() {
      mouseOver = false;
    }
    
    p.draw = function () {
      p.background(255);
      imgCopy = img.get();
      
      factor = 5 + p.abs(p.sin(p.frameCount * 0.05) * 100);
      if(mouseOver) {
        factor = mouseFactor;
      }
      
      imgCopy.resize(factor, factor);
      p.copy(imgCopy, 0, 0, imgCopy.width, imgCopy.height, 0, 0, p.floor(p.width / 2), p.height);
    
      for (let i = 1; i < imgCopy.height; i++) {
        p.line(p.width / 2, i * (p.height / imgCopy.height), p.width, i * (p.height / imgCopy.height));
        p.line(p.width / 2 + i * (p.height / imgCopy.height), 0, p.width / 2 + i * (p.height / imgCopy.height), p.height)
      }
    }
}
var posterize = function (p) {
  let img1;
  let img2;
  let factor, mouseFactor, mouseOver = false;

  p.preload = function () {
    img1 = p.loadImage('../assets/artwork/agua.jpg');
    img2 = p.loadImage('../assets/artwork/colores.jpg');
  }

  p.setup = function () {
    const posterizeDiv = document.getElementById("posterize");
    posterizeDiv.innerHTML = "";
    const posterize = p.createCanvas(posterizeDiv.clientWidth, posterizeDiv.clientWidth/2);
    posterize.parent("posterize");

    img1.resize(120, 120);
    img2.resize(120, 120);
    p.noSmooth();

    posterize.mouseMoved(mouseOv);
    posterize.mouseOut(mouseOu);
  }

  function mouseOv() {
    mouseFactor = p.map(p.mouseX, 0, p.width, 2, 30);
    mouseOver = true;
  }

  function mouseOu() {
    mouseOver = false;
  }

  p.draw = function () {
    p.background(255);
    
    factor = 2 + p.abs(p.sin(p.frameCount * 0.02) * 10);
    if(mouseOver) {
      factor = mouseFactor;
    }

    p.image(img1, 0,0, p.width/2, p.height);
    p.filter(p.GRAY);
    p.image(img2, p.width/2,0, p.width/2, p.height);
    p.filter(p.POSTERIZE, p.floor(factor));
  }
}

var posterize = new p5(posterize);
var resolution = new p5(resolution);