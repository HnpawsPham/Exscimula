import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { setData, getData } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { getImgBase64} from "./auth/storing.js";

// GET USER UID
let UID = null;
const auth = getAuth();

auth.onAuthStateChanged((user) => {
    UID = user.uid;
})

// CHANGE RATE OR ASK QUESTION
const optionBtns = document.querySelectorAll(".option-btn>button");
const containers = document.querySelectorAll(".container");

for(let btn of optionBtns){
    btn.addEventListener("click", function(){
        for(let container of containers) container.classList.add("hidden");
        document.getElementById(btn.name).classList.remove("hidden");
    })
}

// RATE HANDLE
const rateInput = document.querySelector("#rating>.prompt>input");
const rateStarRange = document.querySelectorAll("#rating>.star-range>.star");
const rateFileAttach = document.querySelector("#rating>.prompt>.file-attach>input");
const rateSendBtn = document.querySelector("#rating>.prompt>svg");
const rateImgContainer = document.querySelector("#rating>.img-preview");

const ratesData = await getData("rates/") || [];
let rateId = ratesData.length;
let rateImgs = [];
let rated = false;

async function sendRate(){
    if(!UID){
        visibleNoti("Please log in to rate.", 2000);
        return;
    }

    if(!rated){
        visibleNoti("Please rate first.", 1000);
        return;
    }

    let date = new Date();
    date = date.toLocaleDateString();

    let rate = {
        id: ++rateId,
        from: UID,
        comment: rateInput.value,
        imgs: rateImgs,
        star: document.querySelectorAll(".full").length,   
        date: date, 
    }

    await setData(`rates/${rateId}`, rate);
    visibleNoti("Rated successfully", 2000);

    // Reset
    rateInput.value = "";
    rateImgContainer.replaceChildren();
    for(let star of rateStarRange) star.classList.remove("full");
}

rateSendBtn.addEventListener("click", () => sendRate());
rateInput.addEventListener("keypress", function(e){
    if(e.key == "Enter") sendRate();
})

// Rate: Input images
rateFileAttach.addEventListener("change", async function(){
    rateImgContainer.replaceChildren();
    rateImgs.splice(0, rateImgs.length);

    const files = rateFileAttach.files;

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

        delImgBtn.addEventListener("click", () => rateImgContainer.removeChild(div));

        rateImgContainer.appendChild(div);
        rateImgs.push(base64);
    }
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