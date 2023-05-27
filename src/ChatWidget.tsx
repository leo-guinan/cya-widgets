import React, { useState, useEffect } from "react";
import "./ChatWidget.css";

interface Message {
    id: number;
    sender: string;
    message: string;
}
const ChatWidget = () => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [useId, setUseId] = useState(-1)



    const fetchMessages = async () => {
        // Retrieve messages from the backend
        // Replace the content with actual data from your server
        console.log(inputMessage)
        const response = await fetch("http://localhost:8000/api/chat/baee7ee0-31f0-4c68-88e2-3c999860bc80/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                use_id: useId,
            })
        })
        const data = await response.json();
        const newMessage = {
            id: data.message.id,
            sender: data.message.sender,
            message: data.message.message,

        }
        setUseId(data.use_id)

        setMessages([...messages, newMessage]);
    };

    useEffect(() => {
        // TODO: Implement backend fetch method to retrieve messages from the server
        fetchMessages();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessages([...messages, { id: 1, sender: "user", message: inputMessage }]);
        await sendMessage(inputMessage);

        setInputMessage("");
    };

    const sendMessage = async (messageContent: string) => {
        // Send the message to the backend
        // Implement the required logic to communicate with your server
        console.log("Sending message:", messageContent);
        const response = await fetch("http://localhost:8000/api/chat/baee7ee0-31f0-4c68-88e2-3c999860bc80/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                use_id: useId,
                message: messageContent
            })
        })
        const data = await response.json();
        console.log(data)
        const newMessage = {
            id: data.message.id,
            sender: "bot",
            message: data.message.message,

        }
        console.log(newMessage)
        setUseId(data.use_id)

        setMessages([...messages, { id: 1, sender: "user", message: inputMessage }, newMessage]);
    };

    return (
        <div className="chat-widget">
            {showChat ? (
                <div className="chat-container">
                    <div className="chat-header" onClick={() => setShowChat(!showChat)}>
                        Chat Widget
                    </div>
                    <div className="chat-body">
                        {messages.map(message => (
                            <div key={message.id} className={`message ${message.sender}`}>
                                {message.message}
                            </div>
                        ))}
                    </div>
                    <form className="chat-input" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            ) : (
                <div className="chat-minimized" onClick={() => setShowChat(!showChat)}>
                    Open Chat
                </div>
            )}
        </div>
    );
};

export default ChatWidget;