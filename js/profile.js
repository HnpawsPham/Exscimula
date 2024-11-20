import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { app, getData } from "./firebase.js";

const auth = getAuth(app);

function forkOff(){
    window.location.href = "/index";
}

const defaultAvt = "/assets/default.jpg";

auth.onAuthStateChanged(async (user) => {
    if (!user) forkOff();

    const UID = user.uid; 
    const data = await getData(`users/${UID}`);

    if(!data) forkOff();
    console.log(data)

    const avt = document.getElementById("avt");
    const nickname = document.getElementById("nickname");
    const email = document.getElementById("email");
    const joinSince = document.getElementById("join-since");

    avt.src = data.avt || defaultAvt;
    nickname.innerHTML = data.name;
    email.innerHTML = data.email;
    joinSince.innerHTML = data.joined_since;
})


