import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "./notification.js";
import { app, getData } from "./firebase.js";
import { getUserRank } from "./auth/storing.js";

const auth = getAuth(app);

const account = document.getElementById("account");
const login_btn = document.getElementById("login-btn");
const manage_btn = document.getElementById("manage-btn");

auth.onAuthStateChanged(async (user) => {
    console.log(user);
    if (!user) {
        account.classList.add("hidden");
        login_btn.classList.remove("hidden");
        return;
    }
    account.classList.remove("hidden");
    login_btn.classList.add("hidden");

    const data = await getData(`users/${user.uid}`);

    if(!data){
        visibleNoti("There was an error occur. Please try again.", 2000);
        return;
    }

    const username = document.querySelector(".user-info>.username");
    const userPoint = document.querySelector(".user-info>.user-point");
    const avt = document.querySelector("#avt");

    username.innerHTML = data.name;
    userPoint.innerHTML = data.activities.point;
    avt.src = data.avt || "/assets/default.jpg";

    if(data.role) manage_btn.parentNode.classList.remove("hidden");
    
    visibleNoti(`Welcome, ${data.name}`, 3000);
});

// TOPIC SELECT HANDLE
const cards = document.querySelectorAll(".card");
for(let card of cards) card.addEventListener("click", () => {
    window.location.href = `/topics?subject=${card.id}`;
});

account.addEventListener("click", () => window.location.href = "/profile");

// LOAD LEADERBOARD
const leaderboard = document.querySelector("#leader-board>div");
const leaderboard_data = await getData(`leaderboard`) || [];

if(leaderboard_data.length == 0){
    let p = document.createElement("p");
    p.innerHTML = "Leaderboard empty.";
    p.style.textAlign = "center";
    p.style.color = "var(--red-brown)";
    leaderboard.appendChild(p);
}
else{
    for(let i in leaderboard_data){
        loadLeaderCard(leaderboard_data[i], i);
    }
}

function loadLeaderCard(user, index){
    let div = document.createElement("div");
    div.classList.add("card");

    let top = document.createElement("h2");
    top.innerHTML = "Top " + index;
    div.appendChild(top);
    
    let avt = document.createElement("img");
    avt.classList.add("avt");
    avt.src = user.avt;
    div.appendChild(avt);

    let name = document.createElement("h3");
    name.innerHTML = user.name;
    div.appendChild(name);

    let point = document.createElement("p");
    point.innerHTML = `${user.point} point`;
    if(user.point > 1) point.innerHTML += 's';
    div.appendChild(point);

    let person_rank = getUserRank(user.point);

    let rank_img = document.createElement("img");
    rank_img.src = person_rank.img;

    leaderboard.appendChild(div);
}
