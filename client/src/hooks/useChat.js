import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getChatHistory } from '../api/chatApi';

/**
 * Custom hook to manage WebSocket chat connection and history.
 * 
 * @param {number} currentUserId - The ID of the logged in user
 * @param {number} peerId - The ID of the user they are chatting with
 * @param {number} sessionId - The ID of the active session
 * @returns {Object} { messages, sendMessage, isConnected }
 */
const useChat = (currentUserId, peerId, sessionId) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // useRef allows us to keep the stompClient alive across component re-renders
    // without triggering a re-render itself.
    const stompClientRef = useRef(null);

    // Function to load the history when the chat is opened
    const loadHistory = useCallback(async () => {
        if (!currentUserId || !peerId || !sessionId) return;
        try {
            const history = await getChatHistory(sessionId);
            setMessages(history);
        } catch (error) {
            console.error("Failed to load chat history", error);
        }
    }, [currentUserId, peerId, sessionId]);

    useEffect(() => {
        if (!currentUserId || !peerId) return;

        // 1. Load History first!
        loadHistory();

        // 2. Setup WebSocket Connection
        // We use SockJS as a fallback wrapped by STOMP
        const client = new Client({
            // Note: In production, URL should come from env variables
            webSocketFactory: () => new SockJS('http://localhost:9090/ws'),
            debug: (str) => console.log(str), // Helps with debugging socket issues
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // 3. What happens when we successfully connect?
        client.onConnect = () => {
            setIsConnected(true);

            // Subscribe to our personal mailbox!
            // This matches the `config.setUserDestinationPrefix("/user");` we set in Spring Boot
            const myPrivateQueue = `/user/${currentUserId}/queue/messages`;

            client.subscribe(myPrivateQueue, (messageFrame) => {
                if (messageFrame.body) {
                    const newMsg = JSON.parse(messageFrame.body);

                    // Only add the message to the screen if it's from the person we are currently talking to.
                    // This prevents messages from User C showing up while we are chatting with User B.
                    if (newMsg.senderId === peerId || newMsg.senderId === currentUserId) {
                        setMessages((prevMessages) => [...prevMessages, newMsg]);
                    }
                }
            });
        };

        // 4. What happens if connection fails?
        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.onWebSocketClose = () => {
            setIsConnected(false);
        };

        // Start the connection
        client.activate();
        stompClientRef.current = client;

        // 5. Cleanup function when component unmounts (closes chat)
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                setIsConnected(false);
            }
        };
    }, [currentUserId, peerId, loadHistory]);

    // Function exposed to the React UI to send a new message
    const sendMessage = useCallback((content) => {
        if (stompClientRef.current && isConnected && content.trim() !== "") {

            const chatMessageRequest = {
                senderId: currentUserId,
                receiverId: peerId,
                sessionId: sessionId,
                content: content,
                // The backend actually sets timestamp automatically, but we can pass it if we want
                timestamp: new Date().toISOString()
            };

            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage', // Matches our Spring Boot @MessageMapping
                body: JSON.stringify(chatMessageRequest)
            });

            // Note: We DO NOT immediately add the message to the `messages` array here.
            // Why? Because we wait for the Server to process it and send it back to us via the STOMP subscriber above.
            // This guarantees the message was actually saved in the Database!
        }
    }, [currentUserId, peerId, sessionId, isConnected]);

    return { messages, sendMessage, isConnected };
};

export default useChat;
