import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

async function getFirebaseConfig(){
  try{
    const res = await fetch("/firebase-config");
    const config = await res.json();
    return config;
  }
  catch(err){
    console.log(err);
  }
}

const firebaseConfig = await getFirebaseConfig();
export const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function setData(name, data) {
  set(ref(db, name), data)
    .catch(err => { return err });
}

export async function getData(name) {
  try {
    const snapshot = await get(child(ref(db), name));
    if (snapshot.exists()) return snapshot.val();
    else {
      console.log(`Path '${name}' does not exist.`);
      return null;
    }
  }
  catch (err) {
    console.log(err.message);
    return null
  }
}

export async function delData(name) {
  remove(ref(db, name))
    .catch(err => {
      console.log(err.message);
    })
}

export async function updateData_list(name, value) {
  try {
    let data = await getData(name);
    if (!data) data = [];

    data.push(value);
    await setData(name, data);

    console.log("updated successfuly");
  }
  catch (err) {
    console.log(err.message);
    return null
  }
}