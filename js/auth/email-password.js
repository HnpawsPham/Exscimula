import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "../notification.js";

const auth = getAuth();

const signUpBtn = document.getElementById("submit-btn");
const emailInp = document.getElementById("email-input");
const passInp = document.getElementById("pass-input");
const nameInp = document.getElementById("name-input");

function checkUser(info){
    const check = Joi.object().keys({
        name: Joi.string().min(1).required(),
        email: Joi.string().email({tlds: {allow : false}}).required(),
        pass: Joi.string().min(6).alphanum().required(),
    });

    const {err} = check.validate(info);
    return err;
}

signUpBtn.addEventListener(async () => {
    let userInfo = {
        name : nameInp.value,
        email: emailInp.value,
        pass: passInp.value,
    }

    const {err} = checkUser(userInfo);
    if(err) return visibleNoti(err.details, 2000);

    try{
        const credential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.pass);
        const user = credential.user;
        console.log(user);
        visibleNoti("Signed up successfully!", 1500);
    }
    catch(err){
        visibleNoti(err.message, 2000);
    }
})