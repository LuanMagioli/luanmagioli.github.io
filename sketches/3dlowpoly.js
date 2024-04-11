let x = -.65;
let y = 0;
let z = .45;

let g;

let texturey;

let shovel;

function preload() {
	texturey = loadImage("texture.png");
	
	shovel = loadModel("lowpolyfox.obj");
}

function setup() {
	createCanvas(800, 800);
	
	noSmooth();
	
	g = createGraphics(128, 128, WEBGL);
}

function draw() {
	g.background(255);
	g.noStroke();
	g.normalMaterial();
	g.lights();
	
	g.push();
	
	g.scale(.8);
	g.translate(0, 0, 2);
	g.rotateZ(-frameCount/50);
	g.rotateY(-frameCount/50);
	g.rotateX(-frameCount/50);
	g.rotateX(PI/2);
	g.rotateZ(PI/2);
	g.translate(0, -55, -20);
	
	g.model(shovel);
	
	g.pop();
	
	if(keyIsDown(37)) {
		y += 0.1;
	}
	if(keyIsDown(39)) {
		y -= 0.1;
	}
	if(keyIsDown(38)) {
		x += 0.01;
	}
	if(keyIsDown(40)) {
		x -= 0.01;
	}
	if(keyIsDown(65)) {
		z += 0.01;
	}
	if(keyIsDown(68)) {
		z -= 0.01;
	}
	
	image(g, 0, 0, 800, 800);
}