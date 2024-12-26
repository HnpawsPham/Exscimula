import { getData } from "./firebase.js";

const data = await getData("tags/") || [];

const container = document.getElementById("main");

// SUBJECT CHOOSING HANDLE
let subject = "chemis";

const optionBtns = document.querySelectorAll("#top>.option");

for (let btn of optionBtns) {
    btn.addEventListener("click", () => {
        let chosenBtn = document.querySelector("#top>.option-chosen");
        chosenBtn.classList.remove("option-chosen");

        btn.classList.add("option-chosen");
        subject = btn.name;
    })
}

// LOAD DATA
function emptyHandle() {
    let p = document.createElement("p");
    p.innerHTML = "There is no tag.";
    p.classList.add("no-result");
    container.appendChild(p);
}

function loadTagAlphabet(alpha, tags) {
    let detail = document.createElement("details");
    let summary = document.createElement("summary");
    summary.innerHTML = `${alpha}`;
    detail.appendChild(summary);

    for (let tag of tags) {
        let p = document.createElement("p");
        p.innerHTML = tag;
        detail.appendChild(p);

        p.addEventListener("click", function () {
            window.location.href = `topics?subject=${subject}?tag=${tag}`;
        })
    }

    container.appendChild(detail);
}

// MAIN HANDLE
if (!data) emptyHandle();

for (let alpha of Object.keys(data)) {
    let tags = data[alpha];
    loadTagAlphabet(alpha, tags);
}