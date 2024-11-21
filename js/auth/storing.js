export function setKeyLocal(name, val){
    localStorage.setItem(name, val);
}

export function getKeyLocal(name){
    return JSON.parse(localStorage.getItem(name));
}

export function setKeySession(name, val){
    sessionStorage.setItem(name, val);
}

export function getKeySession(name){
    return JSON.parse(sessionStorage.getItem(name));
}

export function forkOff(){
    window.location.href = "/index";
}
