import { useState, useRef, useEffect } from "react";
import "../css/ChatBot.css";
import { getMovieRecommendations } from "../services/ai";
import { getMoviesByTitles } from "../services/api";

function ChatBot({ onMoviesRecommended }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "incoming", text: "Hi there! I'm your movie assistant. Ask me for recommendations like 'Best action movies' or 'Tom Cruise movies'." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { role: "outgoing", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // 1. Get titles from AI
            const titles = await getMovieRecommendations(userMessage.text);

            if (titles.length === 0) {
                setMessages(prev => [...prev, { role: "incoming", text: "Sorry, I couldn't find any recommendations for that. Try simpler keywords." }]);
                return;
            }

            // 2. Fetch full movie details
            const movies = await getMoviesByTitles(titles);

            if (movies.length > 0) {
                // 3. Update Home Screen via Text
                onMoviesRecommended(movies);
                setMessages(prev => [...prev, { role: "incoming", text: `I found ${movies.length} movies for you! Check the home screen.` }]);
            } else {
                setMessages(prev => [...prev, { role: "incoming", text: "I found some titles, but couldn't retrieve their details from the database." }]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "incoming", text: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            {!isOpen && <div className="chatbot-tooltip">Chat with AI</div>}
            <button className="chatbot-toggler" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: isOpen ? 'block' : 'none' }}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: !isOpen ? 'block' : 'none' }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            <div className={`chatbot-window ${isOpen ? "show" : ""}`}>
                <div className="chat-header">
                    <h2>Movie AI</h2>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="chat-box" ref={chatBoxRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <p className="message-text">{msg.text}</p>
                        </div>
                    ))}
                    {isLoading && <div className="chat-loading">Thinking...</div>}
                </div>

                <div className="chat-input">
                    <textarea
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="send-btn" onClick={handleSend}>➤</button>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
