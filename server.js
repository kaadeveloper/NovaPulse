const express = require("express");

const app = express();

const API_KEY = "np_d6d3f902045b4d7b932473907b541746";
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

function checkApiKey(req, res, next) {
    const key = req.headers["x-api-key"];

    if (key !== API_KEY) {
        return res.status(401).json({
            error: "Ongeldige API key"
        });
    }

    next();
}

app.get("/", (req, res) => {
    res.send("NovaPulse API draait!");
});

app.get("/api/status", checkApiKey, (req, res) => {
    res.json({
        status: "online",
        name: "NovaPulse API",
        version: "1.1.0",
        internet: true
    });
});

async function zoekInternet(vraag) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(vraag)}&format=json&no_html=1&skip_disambig=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.AbstractText) {
        return data.AbstractText;
    }

    if (data.Answer) {
        return data.Answer;
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        const eerste = data.RelatedTopics[0];

        if (eerste.Text) {
            return eerste.Text;
        }
    }

    return "Ik heb gezocht op internet, maar ik vond geen duidelijk antwoord.";
}

app.post("/chat", checkApiKey, async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Geen bericht ontvangen"
            });
        }

        const tekst = message.toLowerCase();

        if (
            tekst.includes("zoek") ||
            tekst.includes("internet") ||
            tekst.includes("google") ||
            tekst.includes("wat is") ||
            tekst.includes("wie is") ||
            tekst.includes("waar is")
        ) {
            const antwoord = await zoekInternet(message);

            return res.json({
                reply: antwoord
            });
        }

        if (tekst.includes("hallo") || tekst.includes("hoi") || tekst.includes("hey")) {
            return res.json({
                reply: "Hallo! Ik ben NovaPulse AI. Waarmee kan ik je helpen?"
            });
        }

        if (tekst.includes("hoe gaat het")) {
            return res.json({
                reply: "Met mij gaat het goed! Ik ben klaar om je te helpen."
            });
        }

        if (tekst.includes("wie ben je")) {
            return res.json({
                reply: "Ik ben NovaPulse AI, jouw eigen API-chatbot."
            });
        }

        res.json({
            reply: "Ik begrijp je vraag. Zet er bijvoorbeeld 'zoek' voor, dan zoek ik op internet."
        });

    } catch (error) {
        console.error(error);

        res.json({
            reply: "Er ging iets fout bij het ophalen van informatie."
        });
    }
});

app.listen(PORT, () => {
    console.log(`NovaPulse API draait op poort ${PORT}`);
});
