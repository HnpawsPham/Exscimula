const is_mobile = navigator.userAgentDate.mobile;

function screenSizeAlert(){
    if(window.innerWidth < 800){
        if(is_mobile) alert("Please rotate your device!");
        else alert("Please expand the viewing tab!");
    }
}
screenSizeAlert();

window.addEventListener("resize", screenSizeAlert());