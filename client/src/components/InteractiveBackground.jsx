import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();

                // Dynamic styling based on mouse proximity
                let isNearMouse = false;
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        isNearMouse = true;
                    }
                }

                if (isNearMouse) {
                    // GLOW EFFECT: Warm Light (Gold/Amber)
                    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2, false);
                    ctx.fillStyle = '#FEF3C7'; // Pale Amber Core
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = 'rgba(245, 158, 11, 0.9)'; // Warm Amber Glow
                } else {
                    // Normal State
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                    ctx.fillStyle = this.color;
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                // Reset shadow to avoid affecting other elements
                ctx.shadowBlur = 0;
            }

            update() {
                // Boundary check
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                // Move
                this.x += this.directionX;
                this.y += this.directionY;

                // Mouse Interaction (Repulsion)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        // Move particles away from mouse (Antigravity feel)
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const directionX = forceDirectionX * force * 3; // Push strength
                        const directionY = forceDirectionY * force * 3;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                this.draw();
            }
        }

        const initParticles = () => {
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
            // Fewer particles on mobile
            if (window.innerWidth < 768) numberOfParticles = numberOfParticles / 2;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = 'rgba(99, 102, 241, 0.4)'; // Primary color with opacity

                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);

                        // Check if this connection is near the mouse
                        let islineNearMouse = false;
                        if (mouse.x != null) {
                            let dx = mouse.x - particles[a].x;
                            let dy = mouse.y - particles[a].y;
                            if (Math.sqrt(dx * dx + dy * dy) < mouse.radius + 50) {
                                islineNearMouse = true;
                            }
                        }

                        if (islineNearMouse) {
                            ctx.strokeStyle = `rgba(245, 158, 11, ${opacityValue})`; // Warm Amber Lines
                            ctx.lineWidth = 1.5; // Slightly thicker
                        } else {
                            ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.2})`; // Faint Blue Lines
                            ctx.lineWidth = 1;
                        }

                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        handleResize(); // Init
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-60"
        />
    );
}
