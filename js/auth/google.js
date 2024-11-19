import {getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { visibleNoti } from "../notification.js";

const signInBtn = document.getElementById("google-sign-in-btn");
const auth = getAuth();
const provider = new GoogleAuthProvider();

signInBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider).then((res) => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        const token = credential.accessToken;
        const user = res.user.providerData[0];
        
        alert(`
            Display name: ${user.displayName}
            Email ${user.email}
            Phonenum: ${user.phoneNumber}
            UID: ${user.uid}
            `); 
    }).catch(err => {
        visibleNoti("There was an error occur. Please try again", 2000);
    })
})

