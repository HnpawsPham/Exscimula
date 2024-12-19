import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import moment from 'https://cdn.skypack.dev/moment';
import { setData, getData } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { getBase64, searchQuery, shortenNum, loadStarRange, getDate, loadPreviewImg, defaultImg, unZip, getZip, sleep } from "./auth/storing.js";

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
let curSim = await getData(`works/${simId}`);
let sim_from_au = simId.includes("au");

// Load chosen preview image
const screen = document.querySelector("#top>.screen>img");
const imgPreviewContainer = document.querySelector("#top>.img-query");

// Upload sims from src code if it doesnt exist (for rating and asking questions)
if (!curSim && sim_from_au) {
    let previewsParam = searchQuery("previews"); // search from the url if it exists
    previewsParam = Array.isArray(previewsParam) ? previewsParam : [previewsParam];

    let tagsParam = searchQuery("tags");
    tagsParam = Array.isArray(tagsParam) ? tagsParam : [tagsParam];

    const sim = {
        id: simId,
        author: {
            uid: "au",
            name: "admin"
        },
        star: {
            rate_times: 0,
            value: 0,
        },
        preview: previewsParam,
        tags: tagsParam
    }

    await setData(`works/${simId}`, sim);
    curSim = sim;
}

let previewImgs = curSim?.preview ?? [defaultImg];
screen.src = previewImgs[0];

// Load preview images queue
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
const simStarRange = document.querySelector("#top>.row>.star-range");
const rateVal = curSim.star.value / curSim.star.rate_times;
loadStarRange(rateVal, simStarRange);

if (curSim.star.rate_times > 0) {
    let rateTimes = document.createElement("b");
    rateTimes.innerHTML = `&ensp; ${rateVal.toFixed(1)} / ${shortenNum(curSim.star.rate_times)} rated`;
    simStarRange.appendChild(rateTimes);
}

function emptyHandle(container) {
    let p = document.createElement("p");
    p.innerHTML = "There is nothing.";
    container.appendChild(p);
}

// DISPLAY DISCUSS (RATES AND QUESTION) DATA
async function loadDiscuss() {
    discussContainer.replaceChildren();

    let h1 = document.createElement("h1");
    h1.innerHTML = "Discuss";
    discussContainer.appendChild(h1);

    const discussData = curSim[optionChosen];

    if (!discussData || Object.keys(discussData).length == 0) {
        emptyHandle(discussContainer);
        return;
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

// DISPLAY SUGGESTIONS (BEST SUIT SIMS)
function loadSugg(data) {
    suggesContainer.replaceChildren();

    let h1 = document.createElement("h1");
    h1.innerHTML = "You might like!";
    suggesContainer.appendChild(h1);

    if (!data || Object.keys(data).length == 0) {
        emptyHandle(suggesContainer);
        return;
    }

    let div = document.createElement("div");
    div.classList.add("custom-scrollbar")

    for (let i = 0; i < 10; i++) {
        let work = data[i];
        if (!work) continue;

        let card = document.createElement("div");
        card.classList.add("card");

        let name = document.createElement("p");
        name.innerHTML = work.name;
        card.appendChild(name);

        card.addEventListener("click", () => {
            window.location.href = `/preview?id=${work.id}&subject=${encodeURIComponent(curSim.subject)}`;
        })

        div.appendChild(card);
    }
    suggesContainer.appendChild(div);
}

// CHANGE RATE OR ASK QUESTION
const optionBtns = document.querySelectorAll(".option-btn>button");
const containers = document.querySelectorAll(".container");
const discussContainer = document.querySelector("#discuss");
const suggesContainer = document.querySelector("#suggestion");

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

// REPORT ERROR HANDLE
const reportBtn = document.getElementById("report");
reportBtn.addEventListener("click", function () {
    visibleNoti("Thanks for letting us know. We'll check it soon.", 4000);
})

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

// Submit rate data
rateSendBtn.addEventListener("click", () => sendRate());
rateInput.addEventListener("keypress", function (e) {
    if (e.key == "Enter") sendRate();
})

// Rate: Input images
rateFileAttach.addEventListener("change", async () => {
    rateImgs = await createPreviewImg(rateImgContainer, rateImgs, rateFileAttach);
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

// Submit question
questionInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") sendQuestion();
})
questionSendBtn.addEventListener("click", () => sendQuestion());

// Question: Attach files
questionFileAttach.addEventListener("change", async () => {
    questionImgs = await createPreviewImg(questionImgContainer, questionImgs, questionFileAttach);
})

// SUGGESTIONS HANDLE
function getSuggestionPoint(x) {
    let point = 0;
    if (x.subject == curSim.subject) point += 2;
    if (x.author.uid == curSim.author.uid) point += 2;

    for (let tag of curSim.tags) {
        for (let tag1 of x.tags) point += (tag1 == tag);
    }
    return point;
}
function compare(a, b) {
    return getSuggestionPoint(b) - getSuggestionPoint(a);
}

const works = await getData(`works/`);
const sortedByPoint = [...Object.values(works)].sort(compare);
loadSugg(sortedByPoint);

// PLAY SIM
const playSimBtn = document.querySelector("#top>.screen>svg");

if(sim_from_au){
    const res = await fetch(`public/${subject.toLowerCase()}/${"name"}`, {
        method: "GET",
    })

    if(!res.ok) {
        visibleNoti("There was an error occur. Please try again.", 4000);
        throw new Error("can't fetch sim id");
    }
    else{
        console.log("fetched successfully");
    }
}
else{
    const zipFile = await getZip(simId);

    // Navigate to sim page when click play button
    playSimBtn.addEventListener("click", async function () {
        const srcCode = await unZip(zipFile);
    
        // Create new tab
        const tab = window.open();
        tab.document.open();
        tab.document.write(srcCode.index);
        tab.document.close();
    
        tab.onload = async () => {
            const doc = tab.document;
    
            // Add js and css 
            for (let [name, val] of Object.entries(srcCode.code)) {
                name = name.split('/').pop();
    
                if (name.endsWith(".css")) {
                    const link = doc.createElement("link");
                    link.rel = "stylesheet";
                    link.href = val;
                    doc.head.appendChild(link);
                }
                else if (name.endsWith(".js")) {
                    const script = doc.createElement("script");
                    script.src = val;
                    doc.head.appendChild(script);
                }
            }
    
            // Add assets
            await sleep(500);
    
            for (let [name, val] of Object.entries(srcCode.images)) {
                doc.querySelectorAll("img").forEach(img => {
                    if (img.src.split("/").pop() == name.split('/').pop()) img.src = val;
                })
            }
    
            for (let [name, val] of Object.entries(srcCode.sounds)) {
                doc.querySelectorAll("audio").forEach(sound => {
                    if (sound.src.split('/').pop() == name.split('/').pop()) sound.src = val;
                })
            }
        }
    })    
}

