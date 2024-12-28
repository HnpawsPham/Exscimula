import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "./notification.js";
import { app, getData } from "./firebase.js";
import { getUserRank} from "./auth/storing.js";

const auth = getAuth(app);

const account = document.getElementById("account");
const login_btn = document.getElementById("login-btn");
const manage_btn = document.getElementById("manage-btn");
const setting = document.getElementById("setting");
const font_change_btn = document.querySelector("#setting>ul>li");
const font_selector = document.getElementById("font-selector");

const settingBarWidth = {
    start: "50px",
    expanded: "170px"
}

auth.onAuthStateChanged(async (user) => {
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

// SETTING OPTIONS HANDLE
setting.addEventListener("mouseleave", function(){
    if(!font_selector.classList.contains("hidden")) return;

    setting.querySelector("ul").style.width = settingBarWidth.start;
    setting.querySelector("ul").style.opacity = "0";
    setting.querySelector("svg").style.filter = "invert(0)";
});

[setting, font_selector].forEach(elm => elm.addEventListener("mouseover", function(){
    setting.querySelector("ul").style.width = settingBarWidth.expanded;
    setting.querySelector("ul").style.opacity = "1";
    setting.querySelector("svg").style.filter = "invert(1)";
}));

// Set selected font
document.querySelector(`li[name=${localStorage.getItem("font") || "nimbus"}]`).classList.add("selected");

font_change_btn.addEventListener("click", function(){
    font_selector.classList.remove("hidden");

    const rect = font_change_btn.getBoundingClientRect();

    font_selector.style.margin = `${rect.top - 190}px 0 0 ${rect.left}px`;
    font_selector.style.display = "block";
})

const font_selector_li = font_selector.querySelectorAll("li");
for(let font of font_selector_li){
    font.addEventListener("click", function(){
        font_selector.querySelector(".selected").classList.remove("selected");
        font.classList.add("selected");
        
        let font_name = font.getAttribute("name");
        localStorage.setItem("font", font_name);
        document.documentElement.style.fontFamily = font_name;

        font_selector.classList.add("hidden");
    })
}

document.addEventListener('click', function (e) {
    if (!font_selector.contains(e.target) && !font_change_btn.contains(e.target)) 
        font_selector.classList.add("hidden");
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
    top.innerHTML = `Top ${parseInt(index) + 1}`;
    top.classList.add("notranslate");
    div.appendChild(top);
    
    let avt = document.createElement("img");
    avt.classList.add("avt");
    avt.src = user.avt;
    div.appendChild(avt);

    let name = document.createElement("h3");
    name.innerHTML = user.name;
    name.classList.add("notranslate");
    div.appendChild(name);

    let point = document.createElement("p");
    point.innerHTML = `${user.point} point`;
    if(user.point > 1) point.innerHTML += 's';
    div.appendChild(point);

    let person_rank = getUserRank(user.point);

    let rank_img = document.createElement("img");
    rank_img.src = person_rank.img;
    div.appendChild(rank_img)

    leaderboard.appendChild(div);
}
