const cookie = document.cookie;
const loginBtn = document.getElementById("login-btn");
const account = document.getElementById("account");

let token = (Math.random() * 2834 + 1).toString(36) + (Math.random() * 2834 + 1).toString(24) + '=' + (Math.random() * 2834 + 1).toString(24).toUpperCase();
console.log(token)

if(cookie == "") {
    loginBtn.classList.add("hidden");
    account.classList.remove("hidden");
}
else{
    loginBtn.classList.remove("hidden");
    account.classList.add("hidden");
}