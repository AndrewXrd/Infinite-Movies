// Vercel Serverless Function — proxies AI requests to Hugging Face
// The HF_API_KEY is only accessible on the server, never sent to the browser.

const MODEL = "Qwen/Qwen2.5-7B-Instruct";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const HF_API_KEY = process.env.HF_API_KEY;

    if (!HF_API_KEY) {
        console.error("HF_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: "Server configuration error" });
    }

    const { query } = req.body;

    if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'query' field" });
    }

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful movie assistant. Your task is to recommend movies based on the user's request.
                            CRITICAL INSTRUCTION: You must return ONLY valid JSON array of strings containing 5 to 10 movie titles.
                            Do not include any explanation, intro, or outro. 
                            Example: ["The Matrix", "Inception", "Interstellar"]`
                        },
                        {
                            role: "user",
                            content: query,
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("HF API Error:", response.status, errorBody);
            return res.status(response.status).json({ error: "AI service error" });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Clean up potential markdown code blocks
        const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const movieTitles = JSON.parse(cleanedContent);
            if (Array.isArray(movieTitles)) {
                return res.status(200).json({ titles: movieTitles });
            } else {
                return res.status(200).json({ titles: [] });
            }
        } catch (e) {
            console.error("Failed to parse AI response:", content);
            return res.status(200).json({ titles: [] });
        }

    } catch (error) {
        console.error("Serverless function error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
