import * as unzipit from 'https://unpkg.com/unzipit@1.4.0/dist/unzipit.module.js';
import { getData, setData } from '../firebase.js';
import { visibleNoti } from '../notification.js';

export const defaultImg = "/assets/default.jpg";
export const defaultAvt = "/assets/default.jpg";

export const ranksList = {
    bronze: {
        min: 0,
        src: "/assets/ranks/bronze.png"
    },
    silver: {
        min: 10,
        src: "/assets/ranks/silver.png"
    },
    gold: {
        min: 20,
        src: "/assets/ranks/gold.png"
    },
    diamond: {
        min: 30,
        src: "/assets/ranks/diamond.png"
    },
    emerald: {
        min: 40,
        src: "/assets/ranks/emerald.png"
    },
    vip1: {
        min: 1000,
        src: "/assets/ranks/vip1.png"
    },
    vip2: {
        min: 10000,
        src: "/assets/ranks/vip2.png"
    },
    vip3: {
        min: 100000,
        src: "/assets/ranks/vip3.png"
    },
}

export function getUserRank(point) {
    let max;
    let imgSrc = "/assets/ranks/bronze.png";

    for (let rank in ranksList) {
        let min = ranksList[rank].min;
        if (point >= min) imgSrc = ranksList[rank].src;
        else {
            max = ranksList[rank].min - 1;
            break;
        }
    }
    return {
        max: max,
        img: imgSrc
    }
}

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

    let codeFiles = {};
    let assets = {};
    let indexFile;
    let found = false;

    for (let [name, entry] of Object.entries(data.entries)) {
        if (entry.directory) continue;

        if (/\.(html|css|js|txt)$/.test(name)) {
            codeFiles[name] = await entry.text();

            if (name.split('/').pop() == "index.html") {
                found = true;
                indexFile = codeFiles[name];
            }
        }
        else {
            const buffer = await entry.arrayBuffer();
            const blob = new Blob([buffer]);
            const url = URL.createObjectURL(blob);
            assets[name] = url;
        }
    }

    if (!found) {
        visibleNoti("Index.html not found! Please try again.", 5000);
        return null;
    }
    return {
        code: codeFiles,
        assets: assets,
        index: indexFile
    };
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

export function binarySearch(x, arr, compare){
    let l = 0;
    let r = arr.length - 1;

    while(l <= r){
        let mid = Math.floor(l + (r - l)/2);

        if(arr[mid] === x) return mid;
        if(compare(a[mid], x)) r = mid - 1;
        else l = mid + 1;
    }
    return -1;
}

// LEADERBOARD HANDLING METHODS
function sortLeaderBoardCompare(a, b) {
    return a.point > b.point;
}

export async function setToLeaderBoard(user) {
    const leaderboard_data = await getData(`leaderboard/`) || [];
    let leaderId = leaderboard_data.length;

    let person = {
        name: user.name,
        point: user.activities.point,
        avt: user.avt,
    }

    if (leaderId == 0) {
        await setData(`leaderboard/${++leaderId}`, person);
    }
    else {
        leaderboard_data.push(person);
        leaderboard_data.sort(sortLeaderBoardCompare);
        leaderId = leaderboard_data.indexOf(person);

        await setData(`leaderboard`, leaderboard_data);
    }
    await setData(`users/${user.uid}/activities/top/`, leaderId);
}

// .ZIP HANDLING METHODS FROM SERVER
export async function getZip(id) {
    const res = await fetch(`/get-zip?id=${id}`, {
        method: "GET"
    });

    if (res.ok) {
        const blob = await res.blob();
        return new File([blob], `${id}.zip`, { type: blob.type });
    }
    else throw new Error("Get zip failed.");
}

export async function postZip(data){
    const res = await fetch("/upload", {
        method: "POST",
        body: data,
    });

    if(!res.ok){
        visibleNoti("File uploaded failed. Please try again.", 4000);
        throw new Error("Posted zip failed.");
    }
}