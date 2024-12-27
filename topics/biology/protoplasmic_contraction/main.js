const help = document.getElementById("help");
const tb = document.getElementById("alert");

// CONTROLLER MENU
help.addEventListener("click", function () {
    alert(`
        `)
})

// ALERT
function notification(content, milisec) {
    tb.style.display = "flex"
    tb.innerHTML = content;
    setTimeout(function () {
        tb.style.display = "none";
    }, milisec)

}

// DELAY FUNCTION
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}