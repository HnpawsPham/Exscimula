
import { findData } from "../../js/firebase.js"

// COMBINE DEFAULT EXPERIMENTS AND USER UPLOADED EXPERIMENTS TOGETHER
let defaultListLength = list.length;
let allUserWork = await findData("allUserWork");
list.push(...allUserWork);

let accountList = await findData("accountList");

const search = document.getElementById("search")
const body = document.querySelector(".container")
const notFoundText = document.querySelector(".notfound")
const suggest = document.getElementById("suggest");
const topic = document.getElementsByTagName("b")[0].id;
const sort = document.getElementById("sort");


let grade6 = suggest.querySelectorAll("li")[0]
let grade7 = suggest.querySelectorAll("li")[1]
let grade8 = suggest.querySelectorAll("li")[2]
let allGrade = suggest.querySelectorAll("li")[3]


grade6.addEventListener("click", function () {
    visibleToList(6)
})

grade7.addEventListener("click", function () {
    visibleToList(7)
})

grade8.addEventListener("click", function () {
    visibleToList(8)
})

allGrade.addEventListener("click", function () {
    for (let i in list) {
        card[i].classList.remove("hide")
        notFoundText.classList.add("hide")
    }
    if (body.querySelectorAll(".hide").length == body.querySelectorAll(".col").length) {
        notFoundText.classList.remove("hide")
    }
})

// LOAD IMAGES AND AUDIOS
function loadAssetsAudios(newTab, info){
    let images = newTab.document.querySelectorAll("img");
    let audios = newTab.document.querySelectorAll("audio");

    if (images.length > 0) {
        for (let image of images) {
            image.src = accountList[info.author.id].work[info.work_index_in_userList].assets[`${image.src.split("/").pop()}`];
        }
    }

    if (audios.length > 0) {
        for (let audio of audios) {
            audio.src = accountList[info.author.id].work[info.work_index_in_userList].audios[`${audio.src.split("/").pop()}`];
        }
    }
}

// LOAD EXPERIMENT ON NEW TAB
function loadExperiment(button, info, i){
    button.addEventListener("click", function () {
        if(info.author.id != -1){
            sessionStorage.setItem("viewingWorkID", (i - defaultListLength));

            // OPEN NEW TAB
            const newTab = window.open('', '_blank');

            newTab.document.open();
            newTab.document.write(`${info.html}`);

            loadAssetsAudios(newTab, info);

            newTab.document.close(); 
        }
        else{
            window.open(info.html);
        }
    })
}

let sortType = () => {return true};

// DISPLAY EXPERIMENTS 
function loadItems(){
    body.replaceChildren();

    for (let [i, info] of list.entries()) {

        if (info.author.id != -1 && info.topic != topic) {
            continue;
        }
        else {
            if(sortType(info)){
                let card = document.createElement("div")
                card.classList.add("col")
        
                let title = document.createElement("h2")
                title.innerHTML = info.title
                card.appendChild(title)
        
                let desc = document.createElement("p")

                if(info.desb.trim().length > 0){
                    desc.innerHTML = info.desb;
                }
                else{
                    desc.innerHTML = `<i style="opacity: 0.4;">No description.</i>`;   
                }
                card.appendChild(desc)
        
                if (info.isVerified) {
                    let check = document.createElement("span");
                    check.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#255290"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>`;
                    card.appendChild(check);
                }
        
                let author = document.createElement("u");
                
                try{
                    author.innerHTML = "By " + accountList[info.author.id].name;
                }
                catch{
                    if(info.author.id == -1){
                        author.innerHTML = "By HnpawsPham";
                    }
                    else{
                        author.innerHTML = "By Anonymous";
                    }
                }
                
                card.appendChild(author);
        
                let button = document.createElement("a")
                button.innerHTML = "Try now"
        
                loadExperiment(button, info, i);
        
                card.appendChild(button)
                body.appendChild(card)
            }
        }
    }
    // CANT FIND 
    if(body.querySelectorAll(".col").length == 0){
        let p = document.createElement("p");
        p.id = "no-result";
        p.innerHTML = "No result.";
        body.appendChild(p);
    }
}
loadItems(sortType);

// ENHANCE SEARCHING
function normalizeStr(str) {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase()
}

// SEARCHING FEATURES
search.addEventListener("keypress", function () {
    searchItem()
    document.querySelector("ul").style.opacity = "1"
})

search.addEventListener("submit", function () {
    searchItem()
})

let titles = document.querySelectorAll("h2")
let card = document.querySelectorAll(".col")

function searchItem() {
    notFoundText.classList.add("hide")

    if (search.value != "") {
        for (let i in titles) {
            notFoundText.classList.add("hide")
            try {
                card[i].classList.add("hide")
            }
            catch { }

            // FOR BETTER SEARCHING EXPERIENCE
            try{
                if (normalizeStr(titles[i].innerHTML).includes(normalizeStr(search.value))) {
                    card[i].classList.remove("hide")
                    notFoundText.classList.add("hide")
                }
            }
            catch{}
        }
    }
    else{
        for (let i in titles) {
            notFoundText.classList.add("hide");
            try {
                card[i].classList.remove("hide");
            }
            catch { }
        }
    }

    if (body.querySelectorAll(".hide").length == body.querySelectorAll(".col").length) {
        notFoundText.classList.remove("hide");
    }
}
    

// DISPLAY EXPERIMENTS ACCORDING TO CHOSEN GRADE
function visibleToList(grade) {
    for (let i in list) {
        try {
            card[i].classList.add("hide")
        }
        catch { }

        if (list[i].grade == grade || list[i].grade == 0) {
            card[i].classList.remove("hide")
            notFoundText.classList.add("hide")
        }
        console.log(body.querySelectorAll(".hide").length + " " + body.querySelectorAll(".col").length)
        if (body.querySelectorAll(".hide").length  == body.querySelectorAll(".col").length) {
            notFoundText.classList.remove("hide");
        }
    }
}

// SORT
sort.addEventListener("change", function(){
    switch (sort.value) {
        case "all":
            sortType = () => {return true;};
            loadItems();
            break;

        case "verified-only":
            sortType = (info) => {
                if(info.isVerified){
                    return true;
                }
                return false;
            };

            loadItems();
            break;

        case "original-only":
            sortType = (info) => {
                if(info.author.id == -1){
                    return true;
                }
                return false;
            };

            loadItems();
            break;

        case "added-only":
            sortType = (info) => {
                if(info.author.id != -1){
                    return true;
                }
                return false;
            };
            loadItems();
            break;

        default:
            break;
    }
})