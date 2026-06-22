async function sendMessage() {
    const input = document.getElementById("message");
    const chat = document.getElementById("chat");

    const text = input.value.trim();
    if (!text) return;

    chat.innerHTML += `
        <div style="background:#00e5ff;color:black;padding:10px;margin:10px;border-radius:10px;text-align:right;">
            ${text}
        </div>
    `;

    input.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        chat.innerHTML += `
            <div style="background:#222;color:white;padding:10px;margin:10px;border-radius:10px;">
                NovaPulse AI: ${data.reply}
            </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    } catch (error) {
        chat.innerHTML += `
            <div style="background:#550000;color:white;padding:10px;margin:10px;border-radius:10px;">
                Fout: kan geen verbinding maken met NovaPulse AI.
            </div>
        `;
    }
}