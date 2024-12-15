import { searchQuery } from "../js/auth/storing.js";
import { getData } from "../js/firebase.js";

const id = searchQuery("id");
const curSim = await getData(`works${id}`);