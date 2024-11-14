import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase,ref,set,push,onValue,get,child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAhnigJ5APSGtw1teUXP9_8LG9n_mOzr3Y",
    authDomain: "camissimes.firebaseapp.com",
    databaseURL: "https://camissimes-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "camissimes",
    storageBucket: "camissimes.appspot.com",
    messagingSenderId: "903456104695",
    appId: "1:903456104695:web:ceb272fca5d3ba00c5f3f2"
  };

  // Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);

export async function findData(name){
    let dbref = ref(database,"/" + name);

    return get(dbref).then(function(snapshot){
        if(snapshot.exists()){
            return snapshot.val();
        }
        else{
            return [];
        }
    })
}

export async function saveToStorage(name,list){
    set(ref(database, `${name}/`), list);
}