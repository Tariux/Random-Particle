class CarGame {
    constructor() {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        document.body.appendChild(this.container);

        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.carRadius = 50; // Make the car bigger
        this.carX = this.canvas.width / 2;
        this.carY = this.canvas.height / 2;
        this.speedX = 0;
        this.speedY = 0;
        this.acceleration = 0.5;
        this.friction = 0.05;
        this.maxSpeed = 10;
        this.keys = {};

        this.carColor = document.getElementById('carColor') ? document.getElementById('carColor').value : '#000000';
        this.carName = document.getElementById('carName') ? document.getElementById('carName').value : 'Car';
        this.cubeScale = document.getElementById('cubeScale') ? parseInt(document.getElementById('cubeScale').value) : 50;

        this.cubes = [];
        this.particles = [];

        this.carShape = this.generateRandomShape();

        this.bounceScale = 1;
        this.bounceDirection = 1;

        this.updateSettings();
        this.addEventListeners();
        this.gameLoop();
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateRandomShape() {
        const shapes = ['circle', 'square', 'triangle'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    generateCubes() {
        this.cubes.length = 0; // Clear existing cubes
        for (let i = 0; i < 20; i++) {
            let cube;
            let overlapping;
            do {
                overlapping = false;
                cube = {
                    x: Math.random() * (this.canvas.width - this.cubeScale),
                    y: Math.random() * (this.canvas.height - this.cubeScale),
                    size: Math.random() * (this.cubeScale - 10) + 10,
                    color: this.getRandomColor(),
                    dx: (Math.random() - 0.5) * 2, // Random movement in x direction
                    dy: (Math.random() - 0.5) * 2,  // Random movement in y direction
                    angle: Math.random() * Math.PI * 2, // Random initial angle
                    rotationSpeed: (Math.random() - 0.5) * 0.02 // Slower random rotation speed
                };
                for (let j = 0; j < this.cubes.length; j++) {
                    const other = this.cubes[j];
                    if (cube.x < other.x + other.size &&
                        cube.x + cube.size > other.x &&
                        cube.y < other.y + other.size &&
                        cube.y + cube.size > other.y) {
                        overlapping = true;
                        break;
                    }
                }
            } while (overlapping);
            this.cubes.push(cube);
        }
    }

    drawCubes() {
        this.cubes.forEach(cube => {
            // Update cube position
            cube.x += cube.dx;
            cube.y += cube.dy;
            cube.angle += cube.rotationSpeed;

            // Bounce off the walls
            if (cube.x < 0 || cube.x + cube.size > this.canvas.width) {
                cube.dx *= -1;
                cube.x = Math.max(0, Math.min(cube.x, this.canvas.width - cube.size));
            }
            if (cube.y < 0 || cube.y + cube.size > this.canvas.height) {
                cube.dy *= -1;
                cube.y = Math.max(0, Math.min(cube.y, this.canvas.height - cube.size));
            }

            // Randomly change direction less frequently
            if (Math.random() < 0.001) {
                cube.dx *= -1;
                cube.dy *= -1;
            }

            // Check for collisions with other cubes
            for (let i = 0; i < this.cubes.length; i++) {
                const other = this.cubes[i];
                if (cube !== other && cube.x < other.x + other.size &&
                    cube.x + cube.size > other.x &&
                    cube.y < other.y + other.size &&
                    cube.y + cube.size > other.y) {
                    // Change direction
                    cube.dx *= -1;
                    cube.dy *= -1;

                    // Make a little bit bigger
                    cube.size *= 1.1; // Make bigger
                    if (cube.size > this.cubeScale * 2) {
                        this.cubes.splice(i, 1); // Remove cube if it gets too big
                    }
                }
            }

            // Draw cube with border-radius and fancy shape
            this.ctx.save();
            this.ctx.translate(cube.x + cube.size / 2, cube.y + cube.size / 2);
            this.ctx.rotate(cube.angle);
            this.ctx.fillStyle = cube.color;
            this.ctx.beginPath();
            this.ctx.moveTo(-cube.size / 2, -cube.size / 2);
            this.ctx.lineTo(cube.size / 2, -cube.size / 2);
            this.ctx.lineTo(cube.size / 2, cube.size / 2);
            this.ctx.lineTo(-cube.size / 2, cube.size / 2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        });
    }

    drawCar() {
        this.ctx.save();
        this.ctx.translate(this.carX, this.carY);
        this.ctx.scale(this.bounceScale, this.bounceScale);
        this.ctx.fillStyle = this.carColor;

        switch (this.carShape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.carRadius, 0, Math.PI * 2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case 'square':
                this.ctx.fillRect(-this.carRadius, -this.carRadius, this.carRadius * 2, this.carRadius * 2);
                break;
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -this.carRadius);
                this.ctx.lineTo(this.carRadius, this.carRadius);
                this.ctx.lineTo(-this.carRadius, this.carRadius);
                this.ctx.closePath();
                this.ctx.fill();
                break;
        }

        this.ctx.restore();
    }

    moveCar() {
        if (this.keys['w']) this.speedY = Math.max(this.speedY - this.acceleration, -this.maxSpeed);
        if (this.keys['s']) this.speedY = Math.min(this.speedY + this.acceleration, this.maxSpeed);
        if (this.keys['a']) this.speedX = Math.max(this.speedX - this.acceleration, -this.maxSpeed);
        if (this.keys['d']) this.speedX = Math.min(this.speedX + this.acceleration, this.maxSpeed);
    }

    updateCarPosition() {
        this.speedX *= (1 - this.friction);
        this.speedY *= (1 - this.friction);

        let nextX = this.carX + this.speedX;
        let nextY = this.carY + this.speedY;

        // Check for collisions with cubes
        for (let i = 0; i < this.cubes.length; i++) {
            const cube = this.cubes[i];
            if (nextX + this.carRadius > cube.x && nextX - this.carRadius < cube.x + cube.size &&
                nextY + this.carRadius > cube.y && nextY - this.carRadius < cube.y + cube.size) {
                if (this.carRadius > cube.size) {
                    // Eat the cube and get bigger
                    this.carRadius += cube.size * 0.1;
                    this.cubes.splice(i, 1);
                    this.createParticles(cube);
                } else {
                    if (nextX + this.carRadius > cube.x && nextX - this.carRadius < cube.x + cube.size) {
                        this.speedX = -this.speedX * 0.5; // Bounce back with reduced speed
                    }
                    if (nextY + this.carRadius > cube.y && nextY - this.carRadius < cube.y + cube.size) {
                        this.speedY = -this.speedY * 0.5; // Bounce back with reduced speed
                    }
                    this.applyCollisionEffect();
                }
            }
        }

        this.carX += this.speedX;
        this.carY += this.speedY;

        if (this.carX - this.carRadius < 0) this.carX = this.carRadius;
        if (this.carX + this.carRadius > this.canvas.width) this.carX = this.canvas.width - this.carRadius;
        if (this.carY - this.carRadius < 0) this.carY = this.carRadius;
        if (this.carY + this.carRadius > this.canvas.height) this.carY = this.canvas.height - this.carRadius;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCubes();
        this.drawCar();
    }

    createParticles(cube) {
        for (let i = 0; i < 10; i++) {
            const particle = {
                x: cube.x + cube.size / 2,
                y: cube.y + cube.size / 2,
                size: Math.random() * 5 + 2,
                color: cube.color,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                life: 100
            };
            this.particles.push(particle);
        }
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.life -= 1;

            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();

            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    applyCollisionEffect() {
        // Shake effect
        this.container.style.transition = 'transform 0.1s';
        this.container.style.transform = 'translateX(10px)';
        setTimeout(() => {
            this.container.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                this.container.style.transform = 'translateX(0)';
            }, 100);
        }, 100);

        // Pulse effect
        this.canvas.style.transition = 'filter 0.1s';
        this.canvas.style.filter = 'contrast(200%)';
        setTimeout(() => {
            this.canvas.style.filter = 'contrast(100%)';
        }, 100);
    }

    updateSettings() {
        this.acceleration = parseFloat(document.getElementById('speed') ? document.getElementById('speed').value : '0.5');
        this.carColor = document.getElementById('carColor') ? document.getElementById('carColor').value : '#000000';
        this.carName = document.getElementById('carName') ? document.getElementById('carName').value : 'Car';
        this.cubeScale = parseInt(document.getElementById('cubeScale') ? document.getElementById('cubeScale').value : '50');
        this.carShape = this.generateRandomShape(); // Generate a new random shape
        this.generateCubes(); // Regenerate cubes when settings change
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });

        const speedElement = document.getElementById('speed');
        if (speedElement) {
            speedElement.addEventListener('input', () => this.updateSettings());
        }

        const carColorElement = document.getElementById('carColor');
        if (carColorElement) {
            carColorElement.addEventListener('input', () => this.updateSettings());
        }

        const carNameElement = document.getElementById('carName');
        if (carNameElement) {
            carNameElement.addEventListener('input', () => this.updateSettings());
        }

        const cubeScaleElement = document.getElementById('cubeScale');
        if (cubeScaleElement) {
            cubeScaleElement.addEventListener('input', () => this.updateSettings());
        }

        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            imageInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.carImage = new Image();
                        this.carImage.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    gameLoop() {
        this.moveCar();
        this.updateCarPosition();
        this.drawParticles();

        // Update bounce effect
        this.bounceScale += this.bounceDirection * 0.01;
        if (this.bounceScale > 1.1 || this.bounceScale < 0.9) {
            this.bounceDirection *= -1;
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    new CarGame().gameLoop();
})


// live free or die.