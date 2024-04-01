require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { getWeather } = require("./utils/weather");

const app = express();

const publicDir = path.join(__dirname, "../public");
const viewsDir = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const PORT = process.env.PORT || 8080;

app.set("view engine", "hbs");
app.set("views", viewsDir);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDir));

app.get("/", (req, res) => {
    res.render("index", {
        title: "Weather",
        name: "Gabriel",
    });
});

app.get("/weather", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            throw new Error("Latitude and longitude are required.");
        }

        const weatherData = await getWeather({ lat, lon });
        res.json(weatherData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/help", (req, res) => {
    res.render("help", {
        helpMessage: "Some generic help message",
        title: "Help",
        name: "Gabriel",
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "Not Found",
        message: "Help article not found.",
        name: "Gabriel",
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Gabriel",
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        message: "Page not found.",
        name: "Gabriel",
    });
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}.`);
});
