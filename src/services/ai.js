const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const MODEL = "Qwen/Qwen2.5-7B-Instruct";

export const getMovieRecommendations = async (userQuery) => {
    try {
        if (!HF_API_KEY) {
            console.error("HF_API_KEY is missing. Make sure VITE_HF_API_KEY is set in .env and server is restarted.");
            return [];
        }

        console.log("Sending request to HF API (via Proxy)...");
        // Using local proxy /api/hf to bypass CORS
        const response = await fetch(
            `/api/hf/v1/chat/completions`,
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
                            content: userQuery,
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("HF API Response:", response.status, errorBody);
            throw new Error(`HF API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Attempt to parse JSON from the response
        // Sometimes LLMs might add markdown code blocks, so we strip them
        const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const movieTitles = JSON.parse(cleanedContent);
            if (Array.isArray(movieTitles)) {
                return movieTitles;
            } else {
                console.error("AI did not return an array:", movieTitles);
                return [];
            }
        } catch (e) {
            console.error("Failed to parse AI response:", content);
            return [];
        }

    } catch (error) {
        console.error("AI Service Error:", error);
        return [];
    }
};
