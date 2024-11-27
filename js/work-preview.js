import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { setData, getData } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { getImgBase64, searchQuery, shortenNum, loadStarRange } from "./auth/storing.js";

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
console.log(curSim)

// Load sim: Load main preview and queue
const screen = document.querySelector("#top>.screen>img");
const imgPreviewContainer = document.querySelector("#top>.img-query");

let previewImgs = curSim.preview;
screen.src = previewImgs[0];

for(let pic of previewImgs){
    let img = document.createElement("img");
    img.src = pic;

    img.addEventListener("click", function(){
        let chosen = document.querySelector(".preview-chosen");
        if(chosen) chosen.classList.remove("preview-chosen");
        
        img.classList.add("preview-chosen");
        screen.src = pic;
    })

    imgPreviewContainer.appendChild(img);
}
imgPreviewContainer.firstChild.classList.add("preview-chosen");

// Load sim: Load rated stars
const simStarRange = document.querySelector("#top>.star-range");

if(curSim.star.rate_times > 0){
    const rateVal = curSim.star.value / curSim.star.rate_times;
    loadStarRange(rateVal, simStarRange);

    let rateTimes = document.createElement("b");
    rateTimes.innerHTML = `&ensp; ${rateVal.toFixed(1)} / ${shortenNum(curSim.star.rate_times)} rated`;
    simStarRange.appendChild(rateTimes);
}
else{
    let b = document.createElement("b");
    b.innerHTML = "This simulation is unrated.";
    simStarRange.appendChild(b);
}

// CHANGE RATE OR ASK QUESTION
const optionBtns = document.querySelectorAll(".option-btn>button");
const containers = document.querySelectorAll(".container");
let optionChosen = "rates";

for(let i in optionBtns){
    try{
        i = parseInt(i);
        let btn = optionBtns[i];
        
        btn.addEventListener("click", function(){
            btn.classList.add("option-chosen");
            optionBtns[(i + 1) % optionBtns.length].classList.remove("option-chosen");
            
            for(let container of containers) container.classList.add("hidden");
            optionChosen = btn.name;
            document.getElementById(optionChosen).classList.remove("hidden");
        })
    }
    catch{}
}

// CREATE PREVIEW IMAGES FOR RATE AND QUESTION CONTAINER
async function createPreviewImg(container, arr, inp){
    container.replaceChildren();
    arr.splice(0, arr.length);

    const files = inp.files;
    console.log(files)

    if(files.length > 5){
        visibleNoti("You can only upload maximum of 5 files.", 3000);
        return;
    }

    for(let file of files){
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
}

// RATE HANDLE
const rateInput = document.querySelector("#rates>.prompt>input");
const rateStarRange = document.querySelectorAll("#rates>.star-range>.star");
const rateFileAttach = document.querySelector("#rates>.prompt>.file-attach>input");
const rateSendBtn = document.querySelector("#rates>.prompt>svg");
const rateImgContainer = document.querySelector("#rates>.img-preview");

const ratesData = await getData("rates/") || [];
let rateId = ratesData.length;
let rateImgs = [];
let rated = false;

async function sendRate(){
    if(!UID || !userName){
        visibleNoti("Please log in to rate.", 2000);
        return;
    }

    if(!rated){
        visibleNoti("Please rate first.", 1000);
        return;
    }

    let date = new Date();
    date = date.toLocaleDateString();
    
    let star = document.querySelectorAll("#bottom>#rates>.star-range>.full").length;

    let rate = {
        id: ++rateId,
        from: {
            uid: UID,
            name: userName,
        },
        comment: rateInput.value,
        imgs: rateImgs,
        star: star,   
        date: date, 
    }

    curSim.star.rate_times++;
    curSim.star.value += star;
    if(!curSim.rates) curSim[`rates`] = {};
    curSim.rates[rateId] = rate;

    await setData(`works/${simId}`, curSim);

    // Reset
    rateInput.value = "";
    rateImgs.splice(0, rateImgs.length);
    rateImgContainer.replaceChildren();
    for(let star of rateStarRange) star.classList.remove("full");

    visibleNoti("Rated successfully", 2000);
}

rateSendBtn.addEventListener("click", () => sendRate());
rateInput.addEventListener("keypress", function(e){
    if(e.key == "Enter") sendRate();
})

// Rate: Input images
rateFileAttach.addEventListener("change", async () => {
   createPreviewImg(rateImgContainer, rateImgs, rateFileAttach);
})

// Rate: Stars display
for(let i in rateStarRange){
    i = parseInt(i);
    let star = rateStarRange[i];
    
    try{
        star.addEventListener("click", function(){
            star.classList.add("full");
    
            for(let j = 0; j < i; j++) rateStarRange[j].classList.add("full");
            for(let j = i + 1; j < rateStarRange.length; j++) rateStarRange[j].classList.remove("full");
    
            rated = true;
        });
    }
    catch{};
}

// ASK QUESTION HANDLE
const questionInput = document.querySelector("#question>.prompt>input");
const questionSendBtn = document.querySelector("#question>.prompt>svg");
const questionFileAttach = document.querySelector("#question>.prompt>.file-attach>input");
const questionImgContainer = document.querySelector("#question>.img-preview");

let questionsData = await getData("questions/") || [];
let questionId = questionsData.length;
let questionImgs = [];

// Question: Send questions
async function sendQuestion(){
    if(!UID){
        visibleNoti("Please log in to ask.", 2000);
        return;
    }

    if(questionInput.value.trim().length == 0){
        visibleNoti("Please type something first.", 1500);
        return;
    }

    let date = new Date();
    date = date.toLocaleDateString();

    let ques = {
        id: ++questionId,
        from: {
            uid: UID,
            name: userName,
        },
        content: questionInput.value,
        imgs: questionImgs,
        date: date, 
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
    if(e.key == "Enter") sendQuestion();
})

questionSendBtn.addEventListener("click" , () => sendQuestion());

// Question: Attach files
questionFileAttach.addEventListener("change", async () => {
    createPreviewImg(questionImgContainer, questionImgs, questionFileAttach);
})


// DISPLAY DISCUSS (RATES AND QUESTION) DATA
const discussContainer = document.querySelector("#discuss");
const discussData = curSim[optionChosen];

for(let mess of discussData){
    console.log(mess)
    // let div = document.createElement("div");
    // loadStarRange(mess.star, div);
    // discussContainer.appendChild(div);
}