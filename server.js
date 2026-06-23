const express = require("express");
const OpenAI = require("openai");

const app = express();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("."));

app.post("/chat", async (req, res) => {
    try {
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            instructions: "Je bent NovaPulse AI. Antwoord altijd in het Nederlands. Wees vriendelijk, slim en behulpzaam.",
            input: req.body.message
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.json({
            reply: "NovaPulse AI kon geen antwoord ophalen."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`NovaPulse AI draait op poort ${PORT}`);
});
