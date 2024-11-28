import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { app, delData, getData, setData } from "./firebase.js";
import { forkOff, getImgBase64 } from "./auth/storing.js";
import { visibleNoti } from "./notification.js";

const auth = getAuth(app);
let data;

const defaultAvt = "/assets/default.jpg";

// RANK HANDLE
const ranksList = {
    bronze: {
        min: 0,
        src: "/assets/ranks/bronze.png"
    },
    silver: {
        min: 10,
        src: "/assets/ranks/silver.png"
    },
    gold: {
        min: 20,
        src: "/assets/ranks/gold.png"
    },
    diamond: {
        min: 30,
        src: "/assets/ranks/diamond.png"
    },
    emerald: {
        min: 40,
        src: "/assets/ranks/emerald.png"
    },
    vip1: {
        min: 1000,
        src: "/assets/ranks/vip1.png"
    },
    vip2: {
        min: 10000,
        src: "/assets/ranks/vip2.png"
    },
    vip3: {
        min: 100000,
        src: "/assets/ranks/vip3.png"
    },
}

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
    let userRankImg = "/assets/ranks/bronze.png";
    let max;

    for (let rank in ranksList) {
        let min = ranksList[rank].min;
        if (userPoint >= min) userRankImg = ranksList[rank].src;
        else {
            max = ranksList[rank].min - 1;
            break;
        }
    }

    for (let img of rankImgs) img.src = userRankImg;
    progressBar.style.width = `${userPoint / max * 100}%`;
}

function loadWorks(data) {
    const userWork = data.activities.works || [];
    const container = document.getElementById("user-works");

    if (userWork.length == 0) {
        let p = document.createElement("p");
        p.style.textAlign = "center";
        p.innerHTML = "You haven't contributed anything.";
        container.appendChild(p);
        return;
    }

}

function loadSaved(data) {
    const userSave = data.activities.saved || [];
    const container = document.getElementById("saved");

    if (userSave.length == 0) {
        let p = document.createElement("p");
        p.style.textAlign = "center";
        p.innerHTML = "You haven't saved anything.";
        container.appendChild(p);
        return;
    }
}

function loadAchievement(data){
    const userAchievement = data.activities.achievement || [];
    const container = document.querySelector("#achievement>div");

    if(userAchievement.length == 0){
        let p = document.createElement("p");
        p.style.textAlign = "center";
        p.innerHTML = "You don't have any achievement.";
        container.appendChild(p);
        return;
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
        let base64 = await getImgBase64(input.files[0]);
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
    console.log(user);
    
    await user.delete().then(() => {
        visibleNoti("Deleted successfully.", 2000);
    })
    .catch(err => {
        visibleNoti(err.message, 5000);
    })

    window.location.href = "/index";
})