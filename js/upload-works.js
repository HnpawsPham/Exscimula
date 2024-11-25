import { getData, setData } from "./firebase.js";
import { visibleNoti } from "./notification.js";
import { getImgBase64 } from "./auth/storing.js";

// CHOOSING OPTIONS HANDLE
const optionBtns = document.querySelectorAll("#top>button");

for(let i in optionBtns){
    try{
        i = parseInt(i);
        let btn = optionBtns[i];

        btn.addEventListener("click", function(){
            btn.classList.add("option-chosen");
            optionBtns[(i + 1) % optionBtns.length].classList.remove("option-chosen");
        });
    }
    catch{}
}
