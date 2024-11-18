const container = document.getElementById("anim-img");
let slides = Array.from(container.querySelectorAll("img"));
let currentIndex = 0;

const anim = setInterval(() => {
    const topElm = slides.shift();
    container.appendChild(topElm);
    slides.push(topElm);
}, 2000); 
