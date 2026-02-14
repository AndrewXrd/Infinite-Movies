import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev middleware that mimics the Vercel serverless function
function aiDevProxy() {
  let hfApiKey;
  return {
    name: 'ai-dev-proxy',
    config(_, { mode }) {
      // Load ALL env vars (including non-VITE_ ones) from .env
      const env = loadEnv(mode, process.cwd(), '');
      hfApiKey = env.HF_API_KEY;
    },
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Parse request body
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', async () => {
          try {
            const { query } = JSON.parse(body);

            const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hfApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'Qwen/Qwen2.5-7B-Instruct',
                messages: [
                  {
                    role: 'system',
                    content: `You are a helpful movie assistant. Your task is to recommend movies based on the user's request.
                    CRITICAL INSTRUCTION: You must return ONLY valid JSON array of strings containing 5 to 10 movie titles.
                    Do not include any explanation, intro, or outro.
                    Example: ["The Matrix", "Inception", "Interstellar"]`,
                  },
                  { role: 'user', content: query },
                ],
                max_tokens: 500,
                temperature: 0.7,
              }),
            });

            if (!response.ok) {
              const errorBody = await response.text();
              console.error('HF API Error:', response.status, errorBody);
              res.statusCode = response.status;
              res.end(JSON.stringify({ error: 'AI service error' }));
              return;
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
              const movieTitles = JSON.parse(cleanedContent);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ titles: Array.isArray(movieTitles) ? movieTitles : [] }));
            } catch (e) {
              console.error('Failed to parse AI response:', content);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ titles: [] }));
            }
          } catch (err) {
            console.error('Dev proxy error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), aiDevProxy()],
})
