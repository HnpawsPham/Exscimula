import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "./notification.js";
import { app, getData } from "./firebase.js";

const auth = getAuth(app);

const account = document.getElementById("account");
const loginBtn = document.getElementById("login-btn");

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

    visibleNoti(`Welcome, ${data.name}`, 3000);
});
