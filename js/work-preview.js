import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { setData, getData } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { getImgBase64, searchQuery, shortenNum, loadStarRange, getDate, loadPreviewImg, defaultImg, unZip } from "./auth/storing.js";

// GET USER UID
let UID = null;
let userName = null;
const auth = getAuth();

auth.onAuthStateChanged(async (user) => {
    UID = user.uid;
    let data = await getData(`users/${UID}`);
    userName = data.name;
})

// LOAD SIM
const simId = searchQuery("id");
const curSim = await getData(`works/${simId}`);

// Load sim: Load main preview and queue
const screen = document.querySelector("#top>.screen>img");
const imgPreviewContainer = document.querySelector("#top>.img-query");

let previewImgs = curSim.preview || [defaultImg];
screen.src = previewImgs[0];

for (let pic of previewImgs) {
    let img = document.createElement("img");
    img.src = pic;

    img.addEventListener("click", function () {
        let chosen = document.querySelector(".preview-chosen");
        if (chosen) chosen.classList.remove("preview-chosen");

        img.classList.add("preview-chosen");
        screen.src = pic;
    })

    imgPreviewContainer.appendChild(img);
}
imgPreviewContainer.firstChild.classList.add("preview-chosen");

// Load sim: Load rated stars
const simStarRange = document.querySelector("#top>.star-range");


const rateVal = curSim.star.value / curSim.star.rate_times;
loadStarRange(rateVal, simStarRange);

if (curSim.star.rate_times > 0) {
    let rateTimes = document.createElement("b");
    rateTimes.innerHTML = `&ensp; ${rateVal.toFixed(1)} / ${shortenNum(curSim.star.rate_times)} rated`;
    simStarRange.appendChild(rateTimes);
}

// DISPLAY DISCUSS (RATES AND QUESTION) DATA
async function loadDiscuss() {
    discussContainer.replaceChildren();

    let h1 = document.createElement("h1");
    h1.innerHTML = "Discuss";
    discussContainer.appendChild(h1);

    const discussData = curSim[optionChosen];

    if (!discussData || Object.keys(discussData).length == 0) {
        let p = document.createElement("p");
        p.innerHTML = "There is nothing.";
        discussContainer.appendChild(p);
    }

    for (let i in discussData) {
        const mess = discussData[i];
        let person = await getData(`users/${mess.from}`);

        let div = document.createElement("div");

        let personAvt = document.createElement("img");
        personAvt.classList.add("avt");
        personAvt.src = person.avt;
        div.appendChild(personAvt);

        let personName = document.createElement("u");
        personName.innerHTML = person.name;
        div.appendChild(personName);

        let date = document.createElement("i");
        date.innerHTML = moment(mess.date, "MMDDYYYY").fromNow();
        div.appendChild(date);

        if (optionChosen == "rates") {
            let starRange = document.createElement("div");
            starRange.classList.add("star-range");
            loadStarRange(mess.star, starRange);
            div.appendChild(starRange);
        }

        let imgPreview = document.createElement("div");
        imgPreview.classList.add("img-preview");

        let imgs = mess.imgs || [];
        for (let pic of imgs) {
            let img = document.createElement("img");
            img.src = pic;
            imgPreview.appendChild(img);
        }
        div.appendChild(imgPreview);

        let content = document.createElement("p");
        content.innerHTML = mess.content;
        div.appendChild(content);

        discussContainer.appendChild(div);
    }
}

// CHANGE RATE OR ASK QUESTION
const optionBtns = document.querySelectorAll(".option-btn>button");
const containers = document.querySelectorAll(".container");
const discussContainer = document.querySelector("#discuss");

let optionChosen = "rates";
loadDiscuss();

for (let i in optionBtns) {
    try {
        i = parseInt(i);
        let btn = optionBtns[i];

        btn.addEventListener("click", function () {
            btn.classList.add("option-chosen");
            optionBtns[(i + 1) % optionBtns.length].classList.remove("option-chosen");

            optionChosen = btn.name;
            document.getElementById(optionChosen).classList.remove("hidden");
            containers[(i + 1) % 2].classList.add("hidden");

            loadDiscuss();
        })
    }
    catch { }
}

// CREATE PREVIEW IMAGES FOR RATE AND QUESTION CONTAINER
async function createPreviewImg(container, arr, inp) {
    const files = inp.files;

    if (files.length > 5) {
        visibleNoti("You can only upload maximum of 5 files.", 3000);
        return [];
    }
    return await loadPreviewImg(files, container, arr);
}

// RATE HANDLE
const rateInput = document.querySelector("#rates>.prompt>input");
const rateStarRange = document.querySelectorAll("#rates>.star-range>.star");
const rateFileAttach = document.querySelector("#rates>.prompt>.file-attach>input");
const rateSendBtn = document.querySelector("#rates>.prompt>svg");
const rateImgContainer = document.querySelector("#rates>.img-preview");

const ratesData = await getData(`works/${simId}/rates/`) || [];
let rateId = ratesData.length;
let rateImgs = [];
let rated = false;

async function sendRate() {
    if (!UID || !userName) {
        visibleNoti("Please log in to rate.", 2000);
        return;
    }

    if (!rated) {
        visibleNoti("Please rate first.", 1000);
        return;
    }

    let star = document.querySelectorAll("#bottom>#rates>.star-range>.full").length;

    let rate = {
        id: ++rateId,
        from: UID,
        content: rateInput.value,
        imgs: rateImgs,
        star: star,
        date: getDate(),
    }

    curSim.star.rate_times++;
    curSim.star.value += star;
    if (!curSim.rates) curSim[`rates`] = {};
    curSim.rates[rateId] = rate;

    await setData(`works/${simId}`, curSim);

    // Reset
    rateInput.value = "";
    rateImgs.splice(0, rateImgs.length);
    rateImgContainer.replaceChildren();
    for (let star of rateStarRange) star.classList.remove("full");

    visibleNoti("Rated successfully", 2000);
}

rateSendBtn.addEventListener("click", () => sendRate());
rateInput.addEventListener("keypress", function (e) {
    if (e.key == "Enter") sendRate();
})

// Rate: Input images
rateFileAttach.addEventListener("change", async () => {
    rateImgs = await createPreviewImg(rateImgContainer, rateImgs, rateFileAttach);
    console.log(rateImgs)
})

// Rate: Stars display
for (let i in rateStarRange) {
    i = parseInt(i);
    let star = rateStarRange[i];

    try {
        star.addEventListener("click", function () {
            star.classList.add("full");

            for (let j = 0; j < i; j++) rateStarRange[j].classList.add("full");
            for (let j = i + 1; j < rateStarRange.length; j++) rateStarRange[j].classList.remove("full");

            rated = true;
        });
    }
    catch { };
}

// ASK QUESTION HANDLE
const questionInput = document.querySelector("#questions>.prompt>input");
const questionSendBtn = document.querySelector("#questions>.prompt>svg");
const questionFileAttach = document.querySelector("#questions>.prompt>.file-attach>input");
const questionImgContainer = document.querySelector("#questions>.img-preview");

let questionsData = await getData(`works/${simId}/questions/`) || [];
let questionId = questionsData.length;
let questionImgs = [];

// Question: Send questions
async function sendQuestion() {
    if (!UID) {
        visibleNoti("Please log in to ask.", 2000);
        return;
    }

    if (questionInput.value.trim().length == 0) {
        visibleNoti("Please type something first.", 1500);
        return;
    }

    let ques = {
        id: ++questionId,
        from: UID,
        content: questionInput.value,
        imgs: questionImgs,
        date: getDate(),
        like: 0,
        reply: []
    }

    await setData(`works/${simId}/questions/${questionId}`, ques);

    // Reset
    questionInput.value = "";
    questionImgs.splice(0, questionImgs.length);
    questionImgContainer.replaceChildren();

    visibleNoti("Asked successfully.", 2000);
}

questionInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") sendQuestion();
})

questionSendBtn.addEventListener("click", () => sendQuestion());

// Question: Attach files
questionFileAttach.addEventListener("change", async () => {
    questionImgs = await createPreviewImg(questionImgContainer, questionImgs, questionFileAttach);
})

// PLAY SIM
const playSimBtn = document.querySelector("#top>.screen>svg");
const zipFile = curSim.zip;
console.log(zipFile) // NEED STORAGE HERE

playSimBtn.addEventListener("click", async function () {
    const srcCode = await unZip(zipFile);
    const indexFile = srcCode.index;

    // Create url for index.html
    const blob = new Blob([indexFile], {type: "text/html"});
    const url = URL.createObjectURL(blob);

    // Create new tab
    const tab = window.open();
    tab.document.open();
    tab.document.write(`<html><head><title>${"name here"}</title></head><body></body></html>`);
    tab.document.close();

    // Add content to new tab
    tab.document.body.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100vh;"></iframe>`;

    tab.onload = () => {
        const doc = tab.document;

        // Add files (html,css,...) 
        console.log(srcCode.code);

        
    }
})

