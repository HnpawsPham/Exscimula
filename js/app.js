const express = require("express");
const app = express();
const path = require("path");
const Joi = require("joi");

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/fonts", express.static(path.join(__dirname, "../fonts")));
app.use("/js", express.static(path.join(__dirname, "../js")));
// app.use("/pages", express.static(path.join(__dirname, "../pages")));

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/login.html"));
})

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/signup.html"));
})

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/admin.html"));
})

app.get("/offline-download", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/download.html"));
})

app.get("/topic-menu", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/topic-menu.html"));
})

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/profile.html"));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
})