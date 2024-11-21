import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getData, setData } from "./firebase.js";
import { forkOff } from "./auth/storing.js"

const admin = require("firebase/admin");

const auth = getAuth();

auth.onAuthStateChanged(async (res) => {
    if(!res) forkOff();

    const UID = res.uid;
    const data = await getData(`users/`);
    
    console.log(data);
    // const user = data[UID];

    // if(!user || !user.role) forkOff();
    // console.log(data)
})
