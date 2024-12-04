const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// SETUP
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

// Define some stuff
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.set('view engine', 'ejs');

// Create storage folder
const storage_dir = path.join(__dirname, "../uploads");
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
app.set('views', path.join(__dirname, '../pages'));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/fonts", express.static(path.join(__dirname, "../fonts")));
app.use("/js", express.static(path.join(__dirname, "../js")));

// NAVIGATOR
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/admin.html"));
})

app.get("/offline-download", (req, res) => {
    res.render("download");
})

app.get("/topics", (req, res) => {
    const subject = req.query.subject;
    const tag = req.query.tag || null;
    res.render("topic-menu", {subject, tag});
})

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/profile.html"));
})

app.get("/upload-works", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/upload-works.html"));
})

app.get("/tags", (req, res) => {
    res.render("search-by-tags");
})

app.get("/preview", (req, res) => {
    const id = req.query.id;
    const subject = req.query.subject;
    res.render("work-preview", {id, subject});
})

// POST ZIP FILES
app.post('/upload', upload.single("file"), (req, res) => {
    if(!req.file) return res.status(400).send("No file uploaded.");
    
    res.send("File uploaded successfully.");
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

// HOST ON LOCAL PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
})