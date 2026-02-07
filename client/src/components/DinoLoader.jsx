
import React, { useEffect, useRef, useState } from 'react';

const DinoLoader = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [score, setScore] = useState(0);

    // Responsive Canvas Resizing Hook
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                canvasRef.current.width = clientWidth;
                canvasRef.current.height = clientHeight;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial resize

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Game Logic Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const container = containerRef.current;

        let animationFrameId;
        let frames = 0;
        let scoreCount = 0;

        // Constants adjusted for responsiveness
        const GRAVITY = 0.6;
        const JUMP_FORCE = -12;
        const SPEED = 7;
        const GROUND_PAD = 10;

        // Initial Dimensions
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        const GROUND_Y = canvas.height - GROUND_PAD;

        // Dino
        const dino = {
            x: 50,
            y: GROUND_Y - 40,
            width: 40,
            height: 40,
            dy: 0,
            originalY: GROUND_Y - 40,
            grounded: true,

            draw() {
                // Recalculate ground Y in case of resize
                const currentGroundY = canvas.height - GROUND_PAD;
                this.originalY = currentGroundY - this.height;

                ctx.fillStyle = '#fff';
                // Body
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // Head
                ctx.fillRect(this.x + 20, this.y - 15, 25, 20);
                // Eye
                ctx.fillStyle = '#6366f1';
                ctx.fillRect(this.x + 35, this.y - 10, 5, 5);

                // Legs
                ctx.fillStyle = '#fff';
                if (Math.floor(frames / 8) % 2 === 0 || !this.grounded) {
                    ctx.fillRect(this.x + 5, this.y + this.height, 10, 10);
                } else {
                    ctx.fillRect(this.x + 25, this.y + this.height, 10, 10);
                }
            },

            jump() {
                if (this.grounded) {
                    this.dy = JUMP_FORCE;
                    this.grounded = false;
                }
            },

            update() {
                // Gravity
                if (!this.grounded) {
                    this.dy += GRAVITY;
                    this.y += this.dy;
                }

                // Ground Collision
                if (this.y > this.originalY) {
                    this.y = this.originalY;
                    this.dy = 0;
                    this.grounded = true;
                }
                this.draw();
            }
        };

        // Obstacles
        let obstacles = [];

        class Obstacle {
            constructor() {
                this.width = 20;
                this.height = 40;
                this.x = canvas.width + 50;
                this.y = canvas.height - GROUND_PAD - this.height;
                this.markedForDeletion = false;
            }

            update() {
                this.x -= SPEED;
                // Stick to ground
                this.y = canvas.height - GROUND_PAD - this.height;

                if (this.x < -this.width) this.markedForDeletion = true;
                this.draw();
            }

            draw() {
                ctx.fillStyle = '#ef4444'; // Red
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // Details
                ctx.fillRect(this.x - 5, this.y + 10, 5, 10);
                ctx.fillRect(this.x + 15, this.y + 5, 5, 10);
            }
        }

        // Auto Play AI
        const autoPlay = () => {
            const nextObstacle = obstacles.find(obs => obs.x > dino.x);
            if (nextObstacle) {
                const distance = nextObstacle.x - (dino.x + dino.width);
                // Jump trigger
                if (distance < 140 && distance > 0 && dino.grounded) {
                    dino.jump();
                }
            }
        };

        // Game Loop
        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frames++;
            scoreCount++;
            setScore(Math.floor(scoreCount / 10));

            // Draw Ground Line
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - GROUND_PAD);
            ctx.lineTo(canvas.width, canvas.height - GROUND_PAD);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Spawn Obstacles
            if (frames % 90 === 0 || (frames % 60 === 0 && Math.random() > 0.8)) {
                obstacles.push(new Obstacle());
            }

            // Update Obstacles
            obstacles.forEach(obs => obs.update());
            obstacles = obstacles.filter(obs => !obs.markedForDeletion);

            // Update Dino
            autoPlay(); // Always play automatically
            dino.update();

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        // Manual controls if user wants to play along
        const handleInput = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.type === 'touchstart') {
                dino.jump();
            }
        };
        window.addEventListener('keydown', handleInput);
        window.addEventListener('touchstart', handleInput);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleInput);
            window.removeEventListener('touchstart', handleInput);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ minWidth: '100%' }}>
            <canvas
                ref={canvasRef}
                className="block w-full h-full rounded-2xl"
            />

            {/* Overlay UI */}
            <div className="absolute top-4 right-6 text-sm font-mono text-cyan-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                Score: {score} | AI Active 🤖
            </div>
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-300 font-bold tracking-widest uppercase shadow-black drop-shadow-md">
                    Target Acquired: Analyzing...
                </span>
            </div>
        </div>
    );
};

export default DinoLoader;
