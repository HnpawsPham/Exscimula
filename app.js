const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();
const emailjs = require("emailjs-com");
const cors = require("cors");
const moment = require("moment");
const XMLHttpRequest = require("xhr2"); 

// SETUP
const app = express();
global.XMLHttpRequest = XMLHttpRequest;

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

// Define some stuff
app.use(cors());
app.use(express.static('public'));
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
        const name = req.body.id;
        console.log(req.body.id);

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

app.get("/topics", (req, res) => {
    const subject = req.query.subject;
    const tag = req.query.tag || null;

    const fpath = path.join(__dirname, "topics", subject.toLowerCase());
    if(!fs.existsSync(fpath)) return res.status(404).send("subject not found");

    const admin_sims = [];
    function getSim(dir){
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
                    admin_sims.push({
                        path: fpath,
                        info: JSON.parse(info)
                    });

                    console.log(JSON.parse(info))
                }
            }
        }
    }
    getSim(fpath);

    res.render("topics_menu", {subject, tag, moment, admin_sims});
})

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
    const id = req.query.id;
    const subject = req.query.subject;
    res.render("preview_sim", {id, subject});
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