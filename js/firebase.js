import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, child, remove, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCR1_KRvwc4CAX8_shJRfjEzqpjpbNadTE",
  authDomain: "exscimula.firebaseapp.com",
  databaseURL: "https://exscimula-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "exscimula",
  storageBucket: "exscimula.firebasestorage.app",
  messagingSenderId: "509213416938",
  appId: "1:509213416938:web:422dbbc09b962618562693",
  measurementId: "G-5KX0B7RE6K"
};

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