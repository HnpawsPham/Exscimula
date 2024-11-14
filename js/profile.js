
import { findData, saveToStorage } from "./firebase.js";

let accountID = sessionStorage.getItem("accountID");

let accountList = await findData("accountList");
let currentAccount = accountList[accountID];
let userWorkListNewest = currentAccount["work"] || [];

//NEWEST SORT
userWorkListNewest = userWorkListNewest.reverse();

// TO TOPIC SORT
let bio = userWorkListNewest.filter(elm => elm.topic == "Biology");
let physics = userWorkListNewest.filter(elm => elm.topic == "Physics");
let chemis = userWorkListNewest.filter(elm => elm.topic == "Chemistry");

let userWorkListToTopic = bio.concat(physics, chemis);

// DEFAULT IS NEWEST
let userWorkList = userWorkListNewest;

const username = document.getElementById("username");
const editUsername = document.getElementById("edit-username");
const uploadExperiment = document.getElementById("upload-experiment");
const userWorkContainer = document.getElementById("user-work");
const home = document.getElementById("home");
const logout = document.getElementById("logout");
const sort = document.getElementById("sort");

loadData();

// VISIBLE USERNAME
if(currentAccount.name == undefined){
    username.innerHTML = (Math.random() + 1).toString(36).substring(2);
}
else{
    username.innerHTML = currentAccount.name;
}

// CHANGE USERNAME
editUsername.addEventListener("click", function () {
    username.innerHTML = prompt("Type new name here:");

    // CANNOT NAME THE SAME AS CREATOR
    while(username.innerHTML == "HnpawsPham"){
        alert("You can not name creator's name!");
        username.innerHTML = prompt("Type new name here:");
    }

    currentAccount["name"] = username.innerHTML;
    accountList[accountID] = currentAccount;

    saveToStorage("accountList", accountList);
});

// CHANGE SORT TYPE
sort.addEventListener("change", function () {
    
    userWorkContainer.replaceChildren();

    if (sort.value == "newest") {
        userWorkList = userWorkListNewest;
    }
    else {
        userWorkList = userWorkListToTopic;
    }

    loadData();
})

// HANDLE WHEN USER UPLOAD AN EXPERIMENT
uploadExperiment.addEventListener("click", function () {
    window.location.href = "./uploadExperiment.html";
})

// OPEN CHOSEN EXPERIMENT
function loadExperiment(div, work){
    div.onclick = function(){
        // OPEN NEW TAB
        const newTab = window.open('', '_blank');
    
        newTab.document.open();
        newTab.document.write(`${work.html}`);

        // LOAD IMAGES AND AUDIOS
        let images = newTab.document.querySelectorAll("img");
        let audios = newTab.document.querySelectorAll("audio");

        if (images.length > 0) {
            for (let image of images) {
                image.src = work.assets[`${image.src.split("/").pop()}`];
            }
        }

        if (audios.length > 0) {
            for (let audio of audios) {
                audio.src = work.audios[`${audio.src.split("/").pop()}`];
            }
        }

        newTab.document.close(); 
    }
}

// LOAD USER WORK NEWEST (DEFAULT)
function loadData() {
    if (userWorkList.length > 0) {
        for (let work of userWorkList) {
            let div = document.createElement("div");
            div.classList.add("user-work-container");

            if (work.isVerified) {
                let check = document.createElement("span");
                check.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>`;
                div.appendChild(check);
            }

            let img = document.createElement("img");

            if (work.cover_img != null) {
                img.src = work.cover_img;
            }
            else {
                img.src = "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";
                img.style.objectFit = "contain";
            }

            loadExperiment(div, work);

            div.appendChild(img);


            // ADD INFO
            let name = document.createElement("p");
            name.innerHTML = work.name.toUpperCase();
            div.appendChild(name);

            let topic = document.createElement("u");

            if (work.topic.length < 20) {
                topic.innerHTML = "Topic: " + work.topic;
            }
            else {
                topic.innerHTML = "Topic: " + work.topic.substring(0, 17) + "...";
            }

            div.appendChild(topic);

            userWorkContainer.appendChild(div);
        }
    }
    else {
        let p = document.createElement("p");
        p.classList.add("not-found-text");
        p.innerHTML = "There is no work.";

        userWorkContainer.appendChild(p);
    }
}


// RETURN HOME
home.addEventListener("click", function () {
    window.location.href = "../index.html";
})

// LOGOUT ACCOUNT
logout.addEventListener("click", function(){
    sessionStorage.setItem("isLoggedIn", false);
    sessionStorage.removeItem("accountID");

    window.location.href = "../index.html";
})