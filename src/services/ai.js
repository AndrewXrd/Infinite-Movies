// Frontend AI service — calls our own serverless API, NOT Hugging Face directly.
// The HF API key never reaches the browser.

export const getMovieRecommendations = async (userQuery) => {
    try {
        console.log("Sending request to serverless AI endpoint...");

        const response = await fetch("/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: userQuery }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("AI API Response:", response.status, errorBody);
            throw new Error(`AI API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.titles || [];

    } catch (error) {
        console.error("AI Service Error:", error);
        return [];
    }
};
