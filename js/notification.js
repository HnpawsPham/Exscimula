const noti = document.getElementById("noti");

export const visibleNoti = (text, ms) => {
    noti.classList.remove("hidden");
    noti.innerHTML = text;

    setTimeout(() => {
        noti.classList.add("hidden");
    }, ms)
}