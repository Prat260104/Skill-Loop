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
    const userId = user ? user.id : Math.floor(Math.random() * 10000).toString();
    const userName = user ? user.name : `Guest-${userId}`;

    useEffect(() => {
        if (!containerRef.current) return;

        const initMeeting = async () => {
            // These would normally come from your environment variables (.env)
            const appID = 144692827;
            const serverSecret = "46ab368a35b2b668da3162abea6954ce";

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
                onLeaveRoom: () => {
                    // When they click the red "End" button, go back to dashboard
                    navigate('/dashboard');
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
