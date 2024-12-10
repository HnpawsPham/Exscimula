import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { app, delData, getData, setData } from "./firebase.js";
import { forkOff, getBase64, ranksList, defaultAvt, getUserRank, setToLeaderBoard, defaultImg } from "./auth/storing.js";
import { visibleNoti } from "./notification.js";

const auth = getAuth(app);
let data;

// RANK HANDLE
function setInterface(data) {
    const avt = document.querySelector("#avt>img");
    const nickname = document.getElementById("nickname");
    const email = document.getElementById("email");
    const joinSince = document.getElementById("join-since");

    avt.src = data.avt || defaultAvt;
    nickname.innerHTML = data.name;
    email.innerHTML = data.email;
    joinSince.innerHTML = data.joined_since;
}

function setCurrentRank(data) {
    const userPoint = data.activities.point;
    const rankImgs = document.querySelectorAll(".rank");
    const progressBar = document.querySelector("#progress-bar>div");

    let userRank = getUserRank(userPoint);
    
    for (let img of rankImgs) img.src = userRank.img;
    progressBar.style.width = `${userPoint / userRank.max * 100}%`;
}

function loadSimCard(work){
    let div = document.createElement("div");
    div.classList.add("card");

    let img = document.createElement("img");
    img.src = work.preview?.[0] || defaultImg;
    div.appendChild(img)

    let info = document.createElement("div");

    let name = document.createElement("h3");
    name.style.fontWeight = "bold";
    name.innerHTML = work.name.toUpperCase();
    info.appendChild(name);

    let subject = document.createElement("p");
    subject.innerHTML = `Subject: ${work.subject}`;
    info.appendChild(subject);

    let date = document.createElement("i");
    date.innerHTML = `Release: ${moment(work.date, "MMDDYYYY").fromNow()}`;
    info.appendChild(date);
    div.appendChild(info);

    div.addEventListener("click", () => {
        window.location.href = `/preview?id=${work.id}&subject=${work.subject}`;
    })
    return div;
}

async function loadWorks(data) {
    const workIds = data.works || [];
    const container = document.querySelector("#user-works>.inside");

    if (workIds.length == 0) {
        let p = document.createElement("p");
        p.style.textAlign = "center";
        p.innerHTML = "You haven't contributed anything.";
        container.appendChild(p);
        return;
    }

    for(let id of workIds){
        const work = await getData(`works/${id}`);
        container.appendChild(loadSimCard(work));
    }
}

async function loadSaved(data) {
    const saveIds = data.activities?.saved || [];
    const container = document.querySelector("#saved>.inside");

    if (saveIds.length == 0) {
        let p = document.createElement("p");
        p.style.textAlign = "center";
        p.innerHTML = "You haven't saved anything.";
        container.appendChild(p);
        return;
    }

    for(let id of saveIds){
        const save = await getData(`works/${id}`);
        container.appendChild(loadSimCard(save));
    }
}

async function loadAchievement(data){
    const achievementIds = data.activities.achievement || [];
    const container = document.querySelector("#achievement>div");

    if(achievementIds.length == 0){
        let p = document.createElement("p");
        p.style.textAlign = "center";
        p.innerHTML = "You don't have any achievement.";
        container.appendChild(p);
        return;
    }

    for(let id of achievementIds){
        const achievement = await getData(`achievements/${id}`);
    }
}

function changeAvt(data, UID) {
    // VISIBLE CHANGE AVT OPTION WHEN HOVER ONTO AVT IMG
    const avt = document.querySelector("#avt");
    const avtImg = document.querySelector("#avt>img");
    const editAvtBtn = document.querySelector("#avt>div");

    avt.addEventListener("mouseover", function () {
        editAvtBtn.style.opacity = "1";
    })
    avt.addEventListener("mouseleave", function () {
        editAvtBtn.style.opacity = "0";
    })

    // INPUT AVT
    const input = document.querySelector("#avt>div>input");
    input.addEventListener("change", async function(){
        let base64 = await getBase64(input.files[0]);
        avtImg.src = base64;

        data["avt"] = base64;
        let err = await setData(`users/${UID}`, data);

        if(err) return visibleNoti("There was an error occur. Please try again", 3000);

        await visibleNoti("Avatar updated successfully!", 2000);
    });
}

// MAIN EVENT
let UID = null;
auth.onAuthStateChanged(async (user) => {
    if (!user) forkOff();

    UID = user.uid;
    data = await getData(`users/${UID}`);

    if (!data) forkOff();

    setInterface(data);
    setCurrentRank(data);
    loadWorks(data);
    loadSaved(data);
    loadAchievement(data);
    changeAvt(data, UID);
})

// LOG OUT HANDLE
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function () {
    signOut(auth).then(() => {
        window.location.href = "/index";
    }).catch((err) => {
        visibleNoti("There was an error occur. Please try again.", 5000);
    })
})


// DELETE ACCOUNT HANDLE
const deleteBtn = document.getElementById("delete-account");

deleteBtn.addEventListener("click", async function(){
    await delData(`users/${UID}`);

    const user = auth.currentUser;
    
    await user.delete().then(() => {
        visibleNoti("Deleted successfully.", 2000);
    })
    .catch(err => {
        visibleNoti(err.message, 5000);
    })

    window.location.href = "/index";
})