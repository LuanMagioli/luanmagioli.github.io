let s = [];

function setup() {
    const p5Div = document.getElementById("kinetic");
    p5Div.innerHTML = "";
    const p5Canvas = createCanvas(p5Div.clientWidth, p5Div.clientWidth, WEBGL);
    p5Canvas.class("img-responsive");
    p5Canvas.parent(p5Div);
    background(100);
    for (let x = 0; x < width; x += 130) {
        for (let y = 0; y < height; y += 120) {
            s.push(new Square(60));
        }
    }
}

function draw() {
    //background(0);
    push();
    for (let i = 0; i < s.length; i++) {
        translate((i * 0.5), -(i * 0.5));
        s[i].render();
    }
    pop();

    fill(255, 20); // Adjust the alpha value to control the fade effect
    rect(-width / 2, -height / 2, width, height);  
}

class Square {
    constructor(size) {
        this.size = size
    }

    render() {
        rotateX(frameCount * 0.001);
        rotateY(frameCount * 0.001);

        let pulse = sin(frameCount * 0.005) * 200;

        push();
        box(this.size);

        translate(-pulse, -60, -60);
        box(((pulse + 200) / 400) * this.size);
        pop();

        push();
        translate(pulse, 60, 60);
        box(((pulse + 200) / 400) * this.size);
        pop();
    }
}