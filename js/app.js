const express = require("express");
const app = express();
const path = require("path");
const Joi = require("joi");

app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/fonts", express.static(path.join(__dirname, "../fonts")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on port ${port}`);
})