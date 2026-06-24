const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/chat", async (req, res) => {
    try {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: `Je bent NovaPulse AI.
Antwoord altijd in het Nederlands.
Vraag van gebruiker: ${req.body.message}`,
                stream: false
            })
        });

        const data = await response.json();

        res.json({
            reply: data.response
        });

    } catch (error) {
        console.error(error);

        res.json({
            reply: "NovaPulse AI kon Ollama niet bereiken."
        });
    }
});

app.listen(PORT, () => {
    console.log(`NovaPulse AI draait op poort ${PORT}`);
});
