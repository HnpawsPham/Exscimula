const heartContainer = document.querySelector(".heart-container");
const btn = document.querySelector(".heart-btn");
const heartNum = 7;

btn.addEventListener("mouseover", function () {
    for (let i = 0; i < heartNum; i++) {
        let heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512">
            <path fill="#ff0000" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
        </svg>`;

        let t = document.createElement("div");
        t.innerHTML = heartSvg;

        let heart = t.firstChild;
        heart.classList.add("heart");

        let pos = Math.floor(Math.random() * 100);
        heart.style.left = `${pos}%`;

        let lifespan = Math.floor(Math.random() * 1000) + 500; 
        heart.style.animationDuration = `${lifespan / 1000}s`;

        heartContainer.appendChild(heart);

        // REMOVE AFTER DONE FLYING
        setTimeout(() => {
            heart.remove();
        }, lifespan);
    }
});
