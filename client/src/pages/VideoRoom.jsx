import React, { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Get the current user from Local Storage
    const user = JSON.parse(localStorage.getItem('user'));

    // Fallback names/IDs just in case user is not logged in properly
    const userId = (user && user.id) ? String(user.id) : Math.floor(Math.random() * 10000).toString();
    const userName = (user && user.name) ? String(user.name) : `Guest-${userId}`;

    useEffect(() => {
        if (!containerRef.current) return;

        // Variables for Gamification Rules
        let sessionStartTime = null;
        let hasSecondPlayerJoined = false;

        // For testing, we keep the required time low (e.g., 10 seconds). 
        // In production, this should be 5 * 60 * 1000 (5 minutes).
        const MINIMUM_CLASS_TIME_MS = 10 * 1000;

        const initMeeting = async () => {
            // These would normally come from your environment variables (.env)
            const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
            const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

            // Generate Kit Token (This authenticates the user for this specific room)
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId, // Both mentor and student must use this exact same Room ID to meet
                userId,
                userName
            );

            // Create an instance of the UI Kit
            const zp = ZegoUIKitPrebuilt.create(kitToken);

            // Join the room and mount the video UI to the div
            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [
                    {
                        name: 'Copy Session Link',
                        url: window.location.origin + window.location.pathname,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // Perfect for 1-1 mentoring
                },
                showScreenSharingButton: true, // Crucial for coding classes

                // EVENT: User joined the room successfully
                onJoinRoom: () => {
                    sessionStartTime = Date.now();
                },

                // EVENT: Someone else joined the room (The 2-Player Rule Check)
                onUserJoin: (users) => {
                    if (users && users.length > 0) {
                        hasSecondPlayerJoined = true;
                        console.log("Another player joined. 2-Player rule satisfied.");
                    }
                },

                // EVENT: User clicks the Red End button
                onLeaveRoom: () => {
                    const sessionEndTime = Date.now();
                    const durationInMs = sessionStartTime ? (sessionEndTime - sessionStartTime) : 0;

                    // Rule Checks
                    const isTimeRuleMet = durationInMs >= MINIMUM_CLASS_TIME_MS;
                    const isTwoPlayerRuleMet = hasSecondPlayerJoined;

                    if (isTimeRuleMet && isTwoPlayerRuleMet) {
                        // All good! Give them the Review Option
                        console.log("Valid Class! Triggering Completion Flow.");
                        navigate(`/dashboard?reviewSession=${roomId}`);
                    } else {
                        // Gamification Abuse Detected
                        // Send them back to dashboard with a warning instead 
                        console.warn("Class invalid: Either too short or mentor was alone.");
                        alert("Session was too short or other user didn't join. Points will not be awarded.");
                        navigate('/dashboard');
                    }
                },
            });
        };

        // Delay slightly to ensure layout is ready
        setTimeout(initMeeting, 100);

    }, [roomId, navigate, userId, userName]);

    return (
        <div className="w-screen h-screen bg-slate-900 flex flex-col">
            <div
                ref={containerRef}
                className="w-full h-full"
            />
        </div>
    );
}
