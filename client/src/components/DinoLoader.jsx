
import React, { useEffect, useRef, useState } from 'react';

const DinoLoader = () => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let frames = 0;
        let scoreCount = 0;

        // Game Constants
        const GRAVITY = 0.6;
        const JUMP_FORCE = -10;
        const SPEED = 5;
        const GROUND_HEIGHT = 20;

        // Dino Object
        const dino = {
            x: 50,
            y: canvas.height - GROUND_HEIGHT - 30,
            width: 30,
            height: 30,
            dy: 0,
            jumpTimer: 0,
            originalY: canvas.height - GROUND_HEIGHT - 30,
            grounded: true,
            draw() {
                ctx.fillStyle = '#fff';
                // Simple Dino Shape (Pixel Art style Rects)
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // Head
                ctx.fillRect(this.x + 15, this.y - 10, 20, 15);
                // Eye
                ctx.fillStyle = '#6366f1';
                ctx.fillRect(this.x + 25, this.y - 8, 4, 4);

                // Legs animation
                ctx.fillStyle = '#fff';
                if (Math.floor(frames / 10) % 2 === 0 || !this.grounded) {
                    ctx.fillRect(this.x + 5, this.y + this.height, 8, 10);
                } else {
                    ctx.fillRect(this.x + 18, this.y + this.height, 8, 10);
                }
            },
            jump() {
                if (this.grounded) {
                    this.dy = JUMP_FORCE;
                    this.grounded = false;
                }
            },
            update() {
                // Apply Gravity
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
                this.x = canvas.width;
                this.y = canvas.height - GROUND_HEIGHT - 30; // Cactus height
                this.width = 15;
                this.height = 30;
                this.markedForDeletion = false;
            }
            update() {
                this.x -= SPEED;
                if (this.x < -this.width) this.markedForDeletion = true;
                this.draw();
            }
            draw() {
                ctx.fillStyle = '#ff4757'; // Cactus Color (Reddish for visibility)
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // Cactus Arms styling
                ctx.fillRect(this.x - 5, this.y + 10, 5, 10);
                ctx.fillRect(this.x + 15, this.y + 5, 5, 10);
            }
        }

        const handleInput = (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp' || e.type === 'touchstart') && !gameOver) {
                dino.jump();
            }
        };

        // Auto-Play Logic (AI Mode)
        // Simple heuristic: If obstacle is close, jump!
        const autoPlay = () => {
            // Find closest obstacle
            const nextObstacle = obstacles.find(obs => obs.x > dino.x);
            if (nextObstacle) {
                const distance = nextObstacle.x - (dino.x + dino.width);
                if (distance < 100 && distance > 0 && dino.grounded) {
                    // Randomize jump slightly to make it look less robotic? No, perfect jumps for loading screen.
                    dino.jump();
                }
            }
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frames++;
            scoreCount++;
            setScore(Math.floor(scoreCount / 10));

            // Background / Ground
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - GROUND_HEIGHT + 10);
            ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT + 10);
            ctx.strokeStyle = '#ffffff50';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Spawn Obstacles
            if (frames % 120 === 0 || (frames % 80 === 0 && Math.random() > 0.7)) { // Random spawning
                obstacles.push(new Obstacle());
            }

            // Update/Draw Obstacles
            obstacles.forEach(obstacle => {
                obstacle.update();
                // Collision Detection (Circle/Rect approximation)
                if (
                    dino.x < obstacle.x + obstacle.width &&
                    dino.x + dino.width > obstacle.x &&
                    dino.y < obstacle.y + obstacle.height &&
                    dino.y + dino.height > obstacle.y
                ) {
                    // Game Over - Reset for Loop
                    // setGameOver(true);
                    // For loading animation, we don't want it to stop. Just reset score or invincible?
                    // Let's make it invincible or reset score visual.
                    // Or let's just make it auto-play perfectly.
                }
            });

            // Remove off-screen obstacles
            obstacles = obstacles.filter(obs => !obs.markedForDeletion);

            // Update Dino
            autoPlay(); // Enable Auto-Play for "Loading Animation" feel
            dino.update();

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        // Start
        gameLoop();

        // Listeners for manual play override?
        window.addEventListener('keydown', handleInput);
        window.addEventListener('touchstart', handleInput);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleInput);
            window.removeEventListener('touchstart', handleInput);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-2">
            <canvas
                ref={canvasRef}
                width={300}
                height={80}
                className="rounded-lg bg-black/20 backdrop-blur-sm"
            />
            <div className="absolute top-2 right-4 text-xs font-mono text-gray-400">
                Score: {score} | AI Running...
            </div>
        </div>
    );
};

export default DinoLoader;
