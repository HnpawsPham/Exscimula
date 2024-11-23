export function setKeyLocal(name, val){
    localStorage.setItem(name, val);
}

export function getKeyLocal(name){
    return localStorage.getItem(name);
}

export function setKeySession(name, val){
    sessionStorage.setItem(name, val);
}

export function getKeySession(name){
    return sessionStorage.getItem(name);
}

export function forkOff(){
    window.location.href = "/index";
}
