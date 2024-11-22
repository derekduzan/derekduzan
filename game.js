class EndlessRunner {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = {
            x: canvas.width / 3,
            y: canvas.height - 100,
            width: 40,
            height: 40,
            velocity: 0,
            jumping: false,
            isInvincible: false,
            invincibilityTimer: 0
        };
        this.ground = canvas.height - 60;
        this.obstacles = [];
        this.powerups = [];
        this.score = 0;
        this.gameSpeed = 5;
        this.active = true;
        this.lastObstacleTime = 0;
        this.minObstacleInterval = 120; // Minimum frames between obstacles
        this.canRestart = true;
        this.restartCooldown = 2000; // 2 seconds in milliseconds
        this.particles = []; // Add this for explosion effects
        this.speedLines = []; // Add array for speed lines

        // Controls
        this.spacePressed = false;
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.active) {
                    this.jump();
                } else if (this.canRestart) {
                    this.startRestartCooldown();
                    this.reset();
                    this.active = true;
                }
            }
        });

        // Mouse controls
        this.canvas.addEventListener('click', () => {
            if (this.active) {
                this.jump();
            } else if (this.canRestart) {
                this.startRestartCooldown();
                this.reset();
                this.active = true;
            }
        });

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        this.createSpeedLines(); // Initialize speed lines
    }

    jump() {
        if (!this.player.jumping) {
            this.player.velocity = -15;
            this.player.jumping = true;
        }
    }

    spawnObstacle() {
        if (this.lastObstacleTime > this.minObstacleInterval) {
            if (Math.random() < 0.02) {
                this.obstacles.push({
                    x: this.canvas.width,
                    y: this.ground,
                    width: 20,
                    height: 40
                });
                this.lastObstacleTime = 0;

                // Only spawn powerup if player is not invincible
                if (!this.player.isInvincible && Math.random() < 0.3) {
                    this.powerups.push({
                        x: this.canvas.width + Math.random() * 200,
                        y: this.ground - 100 - Math.random() * 50,
                        width: 20,
                        height: 20
                    });
                }
            }
        }
        this.lastObstacleTime++;
    }

    movePlayer() {
        // Apply gravity
        this.player.velocity += 0.8;
        this.player.y += this.player.velocity;

        // Ground collision
        if (this.player.y > this.ground - this.player.height) {
            this.player.y = this.ground - this.player.height;
            this.player.velocity = 0;
            this.player.jumping = false;
        }

        // Update invincibility
        if (this.player.isInvincible) {
            this.player.invincibilityTimer--;
            if (this.player.invincibilityTimer <= 0) {
                this.player.isInvincible = false;
            }
        }
    }

    checkCollisions() {
        // Check obstacle collisions
        this.obstacles = this.obstacles.filter(obstacle => {
            if (this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.width > obstacle.x &&
                this.player.y < obstacle.y &&
                this.player.y + this.player.height > obstacle.y - obstacle.height) {
                
                if (this.player.isInvincible) {
                    this.createExplosion(
                        obstacle.x + obstacle.width / 2,
                        obstacle.y - obstacle.height / 2
                    );
                    return false;
                } else {
                    this.active = false;
                }
            }
            return true;
        });

        // Check powerup collisions
        this.powerups = this.powerups.filter(powerup => {
            if (this.player.x < powerup.x + powerup.width &&
                this.player.x + this.player.width > powerup.x &&
                this.player.y < powerup.y + powerup.height &&
                this.player.y + this.player.height > powerup.y) {
                this.player.isInvincible = true;
                this.player.invincibilityTimer = 600;
                return false;
            }
            return true;
        });
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#111827';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw speed lines first (behind everything else)
        this.ctx.save();
        this.speedLines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(0, 255, 255, ${line.alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(line.x, line.y);
            this.ctx.lineTo(line.x + line.width, line.y);
            this.ctx.stroke();
        });
        this.ctx.restore();

        // Draw ground
        this.ctx.fillStyle = '#0ff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#0ff';
        this.ctx.fillRect(0, this.ground, this.canvas.width, 2);
        this.ctx.shadowBlur = 0;

        // Draw player
        this.ctx.fillStyle = this.player.isInvincible ? '#0f0' : '#0ff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.player.isInvincible ? '#0f0' : '#0ff';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.shadowBlur = 0;

        // Draw obstacles
        this.ctx.fillStyle = '#f0f';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#f0f';
        for (let obstacle of this.obstacles) {
            this.ctx.fillRect(obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
        }

        // Draw powerups
        this.ctx.fillStyle = '#0f0';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#0f0';
        for (let powerup of this.powerups) {
            this.ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
        }
        this.ctx.shadowBlur = 0;

        // Draw score and invincibility timer
        this.ctx.fillStyle = '#0ff';
        this.ctx.font = '20px "Orbitron"';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        if (this.player.isInvincible) {
            this.ctx.fillStyle = '#0f0';
            this.ctx.fillText(`Invincible: ${Math.ceil(this.player.invincibilityTimer / 60)}s`, 20, 70);
        }

        // Draw particles
        for (const particle of this.particles) {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            this.ctx.fillStyle = `rgba(255, 0, 255, ${particle.alpha})`;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = '#f0f';
            
            if (particle.shape === 'triangle') {
                this.ctx.beginPath();
                this.ctx.moveTo(-particle.size, particle.size);
                this.ctx.lineTo(particle.size, particle.size);
                this.ctx.lineTo(0, -particle.size);
                this.ctx.closePath();
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            }
            
            this.ctx.restore();
        }

        if (!this.active) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#0ff';
            this.ctx.font = '40px "Orbitron"';
            this.ctx.fillText('Game Over', this.canvas.width/2 - 100, this.canvas.height/2);
            this.ctx.font = '20px "Orbitron"';
            if (!this.canRestart) {
                this.ctx.fillText('Wait...', this.canvas.width/2 - 30, this.canvas.height/2 + 40);
            } else {
                this.ctx.fillText('Space or Click to Restart', this.canvas.width/2 - 120, this.canvas.height/2 + 40);
            }
        }
    }

    animate() {
        if (this.active) {
            this.movePlayer();
            this.spawnObstacle();
            this.checkCollisions();
            this.updateParticles();
            this.updateSpeedLines();

            // Move and filter obstacles
            this.obstacles = this.obstacles.filter(obstacle => {
                obstacle.x -= this.gameSpeed;
                return obstacle.x + obstacle.width > 0;
            });

            // Move and filter powerups
            this.powerups = this.powerups.filter(powerup => {
                powerup.x -= this.gameSpeed;
                return powerup.x + powerup.width > 0;
            });

            this.score++;
        }

        this.draw();
        requestAnimationFrame(this.animate);
    }

    reset() {
        this.player.x = this.canvas.width / 3;
        this.player.y = this.ground - this.player.height;
        this.player.velocity = 0;
        this.player.jumping = false;
        this.player.isInvincible = false;
        this.player.invincibilityTimer = 0;
        this.obstacles = [];
        this.powerups = [];
        this.score = 0;
        this.active = true;
        this.lastObstacleTime = 0;
    }

    startRestartCooldown() {
        this.canRestart = false;
        setTimeout(() => {
            this.canRestart = true;
        }, this.restartCooldown);
    }

    createExplosion(x, y) {
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 12 + 6;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed * (Math.random() + 0.5),
                vy: Math.sin(angle) * speed * (Math.random() + 0.5) - 2,
                size: Math.random() * 6 + 2,
                alpha: 1,
                gravity: 1.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.4,
                shape: Math.random() > 0.5 ? 'triangle' : 'rectangle'
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.vy += particle.gravity;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.vx *= 0.98;
            particle.alpha -= 0.02;
            
            return particle.alpha > 0 && particle.y < this.canvas.height + 100;
        });
    }

    createSpeedLines() {
        for (let i = 0; i < 20; i++) {
            this.speedLines.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: Math.random() * 50 + 20,
                speed: Math.random() * 15 + 10,
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    updateSpeedLines() {
        this.speedLines.forEach(line => {
            line.x -= line.speed;
            if (line.x + line.width < 0) {
                line.x = this.canvas.width;
                line.y = Math.random() * this.canvas.height;
                line.alpha = Math.random() * 0.5 + 0.1;
            }
        });
    }
} 