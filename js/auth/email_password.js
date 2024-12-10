import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "../notification.js";
import { setData, getData } from "../firebase.js";
import {defaultAvt, getDate} from "./storing.js";
import Joi from 'https://cdn.jsdelivr.net/npm/joi@17.13.3/+esm'
const auth = getAuth();

const formSignUp = document.querySelector(".form#sign-up");
const formLogIn = document.querySelector(".form#log-in");
const emailInp = document.getElementById("email-input");
const passInp = document.getElementById("pass-input");
const nameInp = document.getElementById("name-input");
const rememberCheckBox = document.getElementById("remember-check");

function checkUser(info){
    const check = Joi.object().keys({
        name: Joi.string().min(1),
        email: Joi.string().email({tlds: {allow : false}}).required(),
        pass: Joi.string().min(6).alphanum().required(),
    });

    const {err} = check.validate(info);
    return err;
}

if(formSignUp)
formSignUp.addEventListener("submit", function(e) {
    e.preventDefault();

    let userInfo = {
        name: nameInp.value,
        email: emailInp.value,
        pass: passInp.value,
    }

    const err = checkUser(userInfo);
    if(err) {
        visibleNoti(err.details, 2000);
        return;
    }

    let name = userInfo.name;
    let email = userInfo.email;
    let pass = userInfo.pass;

    createUserWithEmailAndPassword(auth, email, pass).then(async (credential) => {
        const user = credential.user;
        const uid = user.uid;

        const info = {
            name: name,
            email: email,
            pass: pass,
            uid: uid,
            role: 0,
            provider: user.providerId,
            avt: defaultAvt,
            joined_since: getDate(),
            activities: {
                point: 0,
                comment: [],
                achievement: [],
                saved: [],
                works: [],
                rate: [],
                challenge_mode: 0,
            }
        }   
        setData(`users/${uid}`, info);

        await visibleNoti("Signed up successfully", 1500);
        window.location.href = "/login";
    })
    .catch((err) => {
        visibleNoti(err.message, 5000);
    })
})

if(formLogIn)
formLogIn.addEventListener("submit", async function(e){
    e.preventDefault();

    let userInfo = {
        email: emailInp.value,
        pass: passInp.value,
    }

    const err = checkUser(userInfo);
    if(err) {
        visibleNoti(err.details, 5000);
        return;
    }

    let remember = rememberCheckBox.checked;

    await signInWithEmailAndPassword(auth, userInfo.email, userInfo.pass).then(async (credential) => {
        const user = credential.user;
        (remember ? localStorage.setItem("uid", user.uid) : sessionStorage.setItem("uid", user.uid));

        await visibleNoti("Logged in successfully!", 2000);
        window.location.href = "/index";
    })
    .catch((err) => {
        visibleNoti(err.message, 5000);
    })
})