import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "./notification.js";
import { app, getData } from "./firebase.js";

const auth = getAuth(app);

const account = document.getElementById("account");
const loginBtn = document.getElementById("login-btn");
const manageBtn = document.getElementById("manage-btn");

auth.onAuthStateChanged(async (user) => {
    console.log(user);
    if (!user) {
        account.classList.add("hidden");
        loginBtn.classList.remove("hidden");
        return;
    }
    account.classList.remove("hidden");
    loginBtn.classList.add("hidden");

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

    if(data.role) manageBtn.parentNode.classList.remove("hidden");
    
    visibleNoti(`Welcome, ${data.name}`, 3000);
});

// TOPIC SELECT HANDLE
const cards = document.querySelectorAll(".card");
for(let card of cards) card.addEventListener("click", () => {
    window.location.href = `/topics?subject=${card.id}`;
});

account.addEventListener("click", () => window.location.href = "/profile");