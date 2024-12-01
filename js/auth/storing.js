import * as unzipit from 'https://unpkg.com/unzipit@1.4.0/dist/unzipit.module.js';

export const defaultImg = "/assets/default.jpg";

export function forkOff() {
    window.location.href = "/index";
}

export async function getImgBase64(file) {
    const reader = new FileReader();
    return new Promise(r => {
        reader.onload = e => {
            r(e.target.result);
        }
        reader.readAsDataURL(file);
    });
}

export function searchQuery(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function loadStarRange(value, container) {
    if (isNaN(value)) {
        let b = document.createElement("b");
        b.innerHTML = "This simulation is unrated.";
        container.appendChild(b);
        return;
    }

    let full = Math.floor(value);

    for (let i = 0; i < full; i++) {
        let star = document.createElement("span");
        star.innerHTML = "☆";
        star.classList.add("star", "full");
        container.appendChild(star);
    }

    if (value != full) {
        let star = document.createElement("span");
        star.innerHTML = "☆";
        star.style.setProperty("--percentage", `${(value - full) * 100}%`);
        star.classList.add("star", "half");
        container.appendChild(star);
    }

    for (let i = 0; i < 5 - Math.ceil(value); i++) {
        let star = document.createElement("span");
        star.innerHTML = "☆";
        star.classList.add("star");
        container.appendChild(star);
    }
}

export function shortenNum(num) {
    if (num < 1000) return num;
    if (num < 1000000) return `${(num / 1000).toFixed(1)} K`;
    if (num < 1000000000) return `${(num / 1000000).toFixed(1)} M`;
    if (num < 1000000000000) return `${(num / 1000000000).toFixed(1)} B`;
    // ...
}

export async function unZip(file) {
    const data = await unzipit.unzip(file);
    let res = {};
    let fnames = [];
    let urls = [];

    for (let [filename, entry] of Object.entries(data.entries)) {
        if (!entry.directory) {
            const buffer = await entry.arrayBuffer();
            const blob = new Blob([buffer]);
            const url = URL.createObjectURL(blob);
            urls.push(url);
            fnames.push(filename);
        }
    }

    res["url"] = urls;
    res["fname"] = fnames;

    return res;
}

export function getDate() {
    let date = new Date();
    return date.toLocaleDateString();
}

export async function loadPreviewImg(files, container, arr) {
    container.replaceChildren();
    arr = arr.splice(0, arr.length);

    for (let file of files) {
        let base64 = await getImgBase64(file);

        let div = document.createElement("div");

        let img = document.createElement("img");
        img.src = base64;
        div.appendChild(img);

        let delImgBtn = document.createElement("span");
        delImgBtn.innerHTML = "x";
        div.appendChild(delImgBtn);

        delImgBtn.addEventListener("click", () => container.removeChild(div));

        container.appendChild(div);
        arr.push(base64);
    }
    return arr;
}
