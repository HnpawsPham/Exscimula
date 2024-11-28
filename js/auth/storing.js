export function setKeyLocal(name, val){
    localStorage.setItem(name, val);
}

export function getKeyLocal(name){
    return localStorage.getItem(name);
}

export function setKeySession(name, val){
    sessionStorage.setItem(name, val);
}

export function getKeySession(name){
    return sessionStorage.getItem(name);
}

export function forkOff(){
    window.location.href = "/index";
}

export async function getImgBase64(file){
    const reader = new FileReader();
    return new Promise(r => {
        reader.onload = e => {
          r(e.target.result);
        }
        reader.readAsDataURL(file);
    });
}

export function searchQuery(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function loadStarRange(value, container){
    let full = Math.floor(value);
    
    for(let i = 0; i < full; i++){
        let star = document.createElement("span");
        star.innerHTML = "☆";
        star.classList.add("star", "full");
        container.appendChild(star);
    }
    
    if(value != full){
        let star = document.createElement("span");
        star.innerHTML = "☆";
        star.style.setProperty("--percentage", `${(value - full) * 100}%`);
        star.classList.add("star", "half");
        container.appendChild(star);
    }
    
    for(let i = 0; i < 5 - Math.ceil(value); i++){
        let star = document.createElement("span");
        star.innerHTML = "☆";
        star.classList.add("star");
        container.appendChild(star);
    }
}

export function shortenNum(num){
    if(num < 1000) return num;
    if(num < 1000000) return `${(num / 1000).toFixed(1)} K`;
    if(num < 1000000000) return `${(num / 1000000).toFixed(1)} M`;
    if(num < 1000000000000) return `${(num / 1000000000).toFixed(1)} B`;
    // ...
}