import { setKeySession } from "./auth/storing.js";
import { getData } from "./firebase.js";

const data = await getData("tags/") || ['test'];

const container = document.getElementById("main");

let tags = {
    A: {
        all: [1, 2, 3, ,4],
        ana: [4, 2, 7]
    },
    B: {
        blast: [2, 6, 3],
    },
    C: {
        all: [1, 2, 3, ,4],
        ana: [4, 2, 7]
    },
    D: {
        blast: [2, 6, 3],
    },
    E: {
        all: [1, 2, 3, ,4],
        ana: [4, 2, 7]
    },
    F: {
        blast: [2, 6, 3],
    },
    G: {
        all: [1, 2, 3, ,4],
        ana: [4, 2, 7]
    },
    H: {
        blast: [2, 6, 3],
    },
}

function emptyHandle(){
    let p = document.createElement("p");
    p.innerHTML = "There is no tag.";
    p.classList.add("no-result");
    container.appendChild(p);
}

function loadTagAlphabet(alpha, name){
    let detail = document.createElement("details");
    let summary = document.createElement("summary");
    summary.innerHTML = `${name.toUpperCase()} (${Object.keys(alpha).length})`;
    detail.appendChild(summary);

    for(let tagName in alpha){
        let p = document.createElement("p");
        p.innerHTML = tagName;
        detail.appendChild(p);

        p.addEventListener("click", function(){
            setKeySession("viewing-tag", tagName);
            window.location.href = "/topic-menu";
        })
    }

    container.appendChild(detail);
}

// MAIN HANDLE
if(!data) emptyHandle();

for(let alphaName in tags){
    let alpha = tags[alphaName];
    loadTagAlphabet(alpha, alphaName);
}