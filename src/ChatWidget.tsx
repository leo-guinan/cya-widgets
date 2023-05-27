import React, {useEffect, useState} from "react";
import "./ChatWidget.css";

interface Message {
    id: number;
    sender: string;
    message: string;
}
// @ts-ignore - this is expected to be set in the usage script injected on the including page
const API_KEY = window.widgetApiKey
const API_URL = `https://api.chooseyouralgorithm.com/api/chat/${API_KEY}/`
const ChatWidget = () => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [useId, setUseId] = useState(-1)


    const fetchMessages = async () => {
        // Retrieve messages from the backend
        // Replace the content with actual data from your server
        console.log(inputMessage)

        const response = await fetch(API_URL, {
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
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessages([...messages, {id: 1, sender: "user", message: inputMessage}]);
        await sendMessage(inputMessage);

        setInputMessage("");
    };

    const sendMessage = async (messageContent: string) => {
        // Send the message to the backend
        // Implement the required logic to communicate with your server
        console.log("Sending message:", messageContent);
        const response = await fetch(API_URL, {
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

        setMessages([...messages, {id: 1, sender: "user", message: inputMessage}, newMessage]);
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