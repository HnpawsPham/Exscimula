const express = require("express");
const app = express();
const path = require("path");

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../pages'));

app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/fonts", express.static(path.join(__dirname, "../fonts")));
app.use("/js", express.static(path.join(__dirname, "../js")));

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
})