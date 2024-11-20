import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "../notification.js";
import { setKeyLocal } from "./storing.js";
import { app, setData } from "../firebase.js";

const signInBtn = document.getElementById("google-sign-in-btn");

const auth = getAuth();
const provider = new GoogleAuthProvider();


signInBtn.addEventListener("click", async () => {
    const res = await signInWithPopup(auth, provider);

    try{
        const user = res.user.providerData[0];
        visibleNoti("Signed in successfully!", 1500);
        setKeyLocal("uid", user.uid);
    }
    catch(err){
        console.log(err);
        visibleNoti("There was an error occur. Please try again", 2000);
    }
})

