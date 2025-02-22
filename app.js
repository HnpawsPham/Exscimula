const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();
const emailjs = require("emailjs-com");
const cors = require("cors");
const moment = require("moment");
const XMLHttpRequest = require("xhr2"); 
const firebase_admin = require("firebase-admin");
const firebase_service_account = require("./firebase_service_account.json");

// SETUP
const app = express();
global.XMLHttpRequest = XMLHttpRequest;

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

// Define some stuff
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.set('view engine', 'ejs');

// Create storage folder
const storage_dir = path.join(__dirname, "./uploads");
if(!fs.existsSync(storage_dir)) fs.mkdirSync(storage_dir);

// SET UPLOADING STRUCTURE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storage_dir);
    },
    filename: (req, file, cb) => {
        const name = parseInt(req.body.id);

        if(!name) return cb(new Error("ID not found."), null);
        cb(null, `${name}.zip`);
    },
})
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype === "application/zip" || file.mimetype === "application/x-zip-compressed") {
            cb(null, true); // accept
        }
        else cb(new Error("Accept .zip files only!"), false);
    },
    limits: {fileSize: 500 * 1024 * 1024} //500mb
});

// PREPARE PATHS
app.set('views', path.join(__dirname, './pages'));
app.use("/css", express.static(path.join(__dirname, "./css")));
app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("/fonts", express.static(path.join(__dirname, "./fonts")));
app.use("/js", express.static(path.join(__dirname, "./js")));
app.use("/public", express.static(path.join(__dirname, "topics")));
app.use("/fonts", express.static(path.join(__dirname, "./fonts")));


// FIREBASE CONFIG
app.get("/firebase-config", (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    });
});

// FIREBASE REALTIME DATABASE 
firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(firebase_service_account),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = firebase_admin.database();

async function setData(path, data){
    try{
        await db.ref(path).set(data);
    }
    catch(err) {
        console.log(err);
        throw new Error("set data failed");
    }
}

async function updateData_list(path, val){
    try{
        let snapshot = await db.ref(path).get();
        let data = snapshot.exists() ? snapshot.val() : [];
        
        data.push(val);
        let newData = [...new Set(data)];
        setData(path, newData);
    }
    catch(err) {
        console.log(err);
        throw new Error("set data failed");
    }
}

// NAVIGATOR
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages/admin.html"));
})

app.get("/offline-download", (req, res) => {
    res.render("download");
})

const base_dir = path.join(__dirname, "topics");

// UPDATE MY SIM WHENEVER I NEED (LOAD JSONS AND UPLOAD THEM ON FIREBASE DB)
function updateAuSim(subject){
    const fpath = path.join(__dirname, "topics", subject.toLowerCase());
    if(!fs.existsSync(fpath)) return res.status(404).send("subject not found");
 
    async function getSim(dir){
        const files = fs.readdirSync(dir);

        for(let file of files){
            const fpath = path.join(dir, file);
            const stat = fs.statSync(fpath);

            if(stat.isDirectory()) getSim(fpath); // if is sim folder, find its children (code files)
            else if(file == "main.html"){         // get main html file and sim info
                const info_path = path.join(dir, "info.json");
                let info = null;

                if(fs.existsSync(info_path)) info = fs.readFileSync(info_path, "utf-8");

                if(info){
                    info = JSON.parse(info);
                    info["folder_name"] = path.basename(dir);

                    for(let tag of info.tags){
                        updateData_list(`tags/${subject}/${tag[0].toUpperCase()}/`, tag);
                    }
                    setData(`works/${info.id}/`, info);
                }
            }
        }
    }
    getSim(fpath);
}

// LOAD ALL SIM IN TOPICS DIRECTORY 
app.get("/topics", (req, res) => {
    const subject = req.query.subject;
    // updateAuSim(subject);

    res.render("topics_menu");
})

app.get("/public/:subject/:name", (req, res) => {
    const full_path = path.join(__dirname, "topics", req.params.subject, req.params.name, "main.html");

    // Check if path exists
    if (!fs.existsSync(full_path)) {
        return res.status(404).send("Simulation not found");
    }

    res.redirect(`/public/${req.params.subject}/${req.params.name}/main.html`);
});


app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages/profile.html"));
})

app.get("/upload-works", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages/upload_sim.html"));
})

app.get("/tags", (req, res) => {
    res.render("search_by_tags");
})

app.get("/preview", (req, res) => {
    const {id, subject, name} = req.query;
    res.render("preview_sim", {id, subject, name});
})

app.get("/policy", (req, res) => {
    res.render("policy");
})

// POST ZIP FILES
app.post('/upload', upload.single("file"), (req, res) => {
    if(!req.file) return res.status(400).send("No file uploaded.");
    
    res.send("File uploaded successfully.");
})

// DELETE ZIP FILES
app.delete("/remove", (req, res) => {
    try{
        const name = req.query.name;
        if(!name) return res.status(400).send("Can't read file name");

        const fpath = path.join("uploads", name);
        if(!fs.existsSync(fpath)) return res.status(404).send("File not found.");
        
        fs.unlinkSync(fpath);
        res.send("File deleted successfully.");
    }
    catch (err){
        console.log(err);
        res.status(500).send("Couldn't remove file");
    }
})

// GET ZIP FILES
app.get("/get-zip", (req, res) => {
    const id = req.query.id;
    if(!id) return res.status(400).send("ID not found.");

    const zpath = `${storage_dir}/${id}.zip`;
    res.download(zpath, (err) => {
        if(err){
            console.log(err.message);
            res.status(400).send("Get file failed.");
        }
    })
});

// SEND EMAILS TO USERS
emailjs.init(process.env.EMAILJS_PUBLIC_KEY);
app.post("/send-block-email", (req, res) => {
    let params = {
        to_email: req.body.email,
        to_name: req.body.name,
        from_message: req.body.message,
        block_time: req.body.time,
    }

    emailjs.send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, params)
    .then((result) => {
        console.log("Email is sent successfully");
        res.send(result);
    })
    .catch ((err) => {
        console.log(err);
        res.status(500).send("Sent failed");
    });
})

// HOST ON LOCAL PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
})

