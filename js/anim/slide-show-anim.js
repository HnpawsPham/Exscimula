const container = document.getElementById("anim-img");
let slides = Array.from(container.querySelectorAll("img"));
let cur = 0;
let len = slides.length;
const animTime = 2000;

function update() {
    let prev = (cur - 1 + len) % len;
    let next = (cur + 1) % len;

    slides[prev].className = "left";
    slides[cur].className = "middle";
    slides[next].className = "right";
}

function start() {
    update();
    setInterval(() => {
        cur = (cur + 1) % len;
        update();
    }, animTime); 
}
start();
