const noti = document.getElementById("noti");

export const visibleNoti = (text, ms) => new Promise((r) => {
    noti.classList.remove("hidden");
    noti.innerHTML = text;

    setTimeout(() => {
        noti.classList.add("hidden");
        r();
    }, ms)
})