const express = require("express");

const app = express();

const API_KEY = "np_d6d3f902045b4d7b932473907b541746";
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

// API-key controle
function checkApiKey(req, res, next) {
    const key = req.headers["x-api-key"];

    if (key !== API_KEY) {
        return res.status(401).json({
            error: "Ongeldige API key"
        });
    }

    next();
}

// Test route zonder key
app.get("/", (req, res) => {
    res.send("NovaPulse API draait!");
});

// Status route met API key
app.get("/api/status", checkApiKey, (req, res) => {
    res.json({
        status: "online",
        name: "NovaPulse API",
        version: "1.0.0"
    });
});

// Eigen chat endpoint
app.post("/chat", checkApiKey, (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.status(400).json({
            error: "Geen bericht ontvangen"
        });
    }

    res.json({
        reply: "NovaPulse API heeft je bericht ontvangen: " + message
    });
});

app.listen(PORT, () => {
    console.log(`NovaPulse API draait op poort ${PORT}`);
});
