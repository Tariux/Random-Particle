class CarGame {
    constructor() {
        this.container = this.createContainer();
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');

        this.car = new Car(this.canvas);
        this.cubes = [];
        this.particles = [];

        this.updateSettings();
        this.addEventListeners();
        this.gameLoop();
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        document.body.appendChild(container);
        return container;
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.container.appendChild(canvas);
        return canvas;
    }

    updateSettings() {
        this.car.updateSettings();
        this.generateCubes();
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.car.keys[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.car.keys[event.key] = false;
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
                        this.car.carImage = new Image();
                        this.car.carImage.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    generateCubes() {
        this.cubes.length = 0; // Clear existing cubes
        for (let i = 0; i < 20; i++) {
            let cube;
            let overlapping;
            do {
                overlapping = false;
                cube = new Cube(this.canvas, this.car.cubeScale);
                for (let j = 0; j < this.cubes.length; j++) {
                    const other = this.cubes[j];
                    if (cube.isOverlapping(other)) {
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
            cube.updatePosition(this.canvas);
            cube.draw(this.ctx);
        });
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(this.ctx);
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    createParticles(cube) {
        for (let i = 0; i < 10; i++) {
            const particle = new Particle(cube);
            this.particles.push(particle);
        }
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

    gameLoop() {
        this.car.move();
        this.car.updatePosition(this.cubes, this.createParticles.bind(this), this.applyCollisionEffect.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCubes();
        this.car.draw(this.ctx);
        this.drawParticles();

        requestAnimationFrame(() => this.gameLoop());
    }
}

class Car {
    constructor(canvas) {
        this.canvas = canvas;
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

        this.carShape = this.generateRandomShape();
        this.bounceScale = 1;
        this.bounceDirection = 1;
    }

    generateRandomShape() {
        const shapes = ['circle', 'square', 'triangle'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    updateSettings() {
        this.acceleration = parseFloat(document.getElementById('speed') ? document.getElementById('speed').value : '0.5');
        this.carColor = document.getElementById('carColor') ? document.getElementById('carColor').value : '#000000';
        this.carName = document.getElementById('carName') ? document.getElementById('carName').value : 'Car';
        this.cubeScale = parseInt(document.getElementById('cubeScale') ? document.getElementById('cubeScale').value : '50');
        this.carShape = this.generateRandomShape(); // Generate a new random shape
    }

    move() {
        if (this.keys['w']) this.speedY = Math.max(this.speedY - this.acceleration, -this.maxSpeed);
        if (this.keys['s']) this.speedY = Math.min(this.speedY + this.acceleration, this.maxSpeed);
        if (this.keys['a']) this.speedX = Math.max(this.speedX - this.acceleration, -this.maxSpeed);
        if (this.keys['d']) this.speedX = Math.min(this.speedX + this.acceleration, this.maxSpeed);
    }

    updatePosition(cubes, createParticles, applyCollisionEffect) {
        this.speedX *= (1 - this.friction);
        this.speedY *= (1 - this.friction);

        let nextX = this.carX + this.speedX;
        let nextY = this.carY + this.speedY;

        // Check for collisions with cubes
        for (let i = 0; i < cubes.length; i++) {
            const cube = cubes[i];
            if (nextX + this.carRadius > cube.x && nextX - this.carRadius < cube.x + cube.size &&
                nextY + this.carRadius > cube.y && nextY - this.carRadius < cube.y + cube.size) {
                if (this.carRadius > cube.size) {
                    // Eat the cube and get bigger
                    this.carRadius += cube.size * 0.1;
                    cubes.splice(i, 1);
                    createParticles(cube);
                } else {
                    if (nextX + this.carRadius > cube.x && nextX - this.carRadius < cube.x + cube.size) {
                        this.speedX = -this.speedX * 0.5; // Bounce back with reduced speed
                    }
                    if (nextY + this.carRadius > cube.y && nextY - this.carRadius < cube.y + cube.size) {
                        this.speedY = -this.speedY * 0.5; // Bounce back with reduced speed
                    }
                    applyCollisionEffect();
                }
            }
        }

        this.carX += this.speedX;
        this.carY += this.speedY;

        if (this.carX - this.carRadius < 0) this.carX = this.carRadius;
        if (this.carX + this.carRadius > this.canvas.width) this.carX = this.canvas.width - this.carRadius;
        if (this.carY - this.carRadius < 0) this.carY = this.carRadius;
        if (this.carY + this.carRadius > this.canvas.height) this.carY = this.canvas.height - this.carRadius;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.carX, this.carY);
        ctx.scale(this.bounceScale, this.bounceScale);
        ctx.fillStyle = this.carColor;

        switch (this.carShape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.carRadius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(-this.carRadius, -this.carRadius, this.carRadius * 2, this.carRadius * 2);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.carRadius);
                ctx.lineTo(this.carRadius, this.carRadius);
                ctx.lineTo(-this.carRadius, this.carRadius);
                ctx.closePath();
                ctx.fill();
                break;
        }

        ctx.restore();
    }
}

class Cube {
    constructor(canvas, cubeScale) {
        this.x = Math.random() * (canvas.width - cubeScale);
        this.y = Math.random() * (canvas.height - cubeScale);
        this.size = Math.random() * (cubeScale - 10) + 10;
        this.color = this.getRandomColor();
        this.dx = (Math.random() - 0.5) * 4; // Random movement in x direction
        this.dy = (Math.random() - 0.5) * 4;  // Random movement in y direction
        this.angle = Math.random() * Math.PI * 2; // Random initial angle
        this.rotationSpeed = (Math.random() - 0.5) * 0.05; // Random rotation speed
        this.shape = this.generateRandomShape(); // Random shape for cubes
        this.special = Math.random() < 0.2; // 20% chance to be special
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
        const shapes = ['circle', 'square', 'triangle', 'hexagon', 'star'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    isOverlapping(other) {
        return this.x < other.x + other.size &&
            this.x + this.size > other.x &&
            this.y < other.y + other.size &&
            this.y + this.size > other.y;
    }

    updatePosition(canvas) {
        this.x += this.dx;
        this.y += this.dy;
        this.angle += this.rotationSpeed;

        // Bounce off the walls
        if (this.x < 0 || this.x + this.size > canvas.width) {
            this.dx *= -1;
            this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
        }
        if (this.y < 0 || this.y + this.size > canvas.height) {
            this.dy *= -1;
            this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
        }

        // Randomly change direction less frequently
        if (Math.random() < 0.001) {
            this.dx *= -1;
            this.dy *= -1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let j = 0; j < 6; j++) {
                    ctx.lineTo(this.size / 2 * Math.cos(Math.PI / 3 * j), this.size / 2 * Math.sin(Math.PI / 3 * j));
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                ctx.beginPath();
                for (let j = 0; j < 5; j++) {
                    ctx.lineTo(this.size / 2 * Math.cos((Math.PI * 2 / 5) * j), this.size / 2 * Math.sin((Math.PI * 2 / 5) * j));
                    ctx.lineTo(this.size / 4 * Math.cos((Math.PI * 2 / 5) * j + Math.PI / 5), this.size / 4 * Math.sin((Math.PI * 2 / 5) * j + Math.PI / 5));
                }
                ctx.closePath();
                ctx.fill();
                break;
        }

        if (this.special) {
            ctx.strokeStyle = '#FFD700'; // Gold color for special cubes
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.restore();
    }
}

class Particle {
    constructor(cube) {
        this.x = cube.x + cube.size / 2;
        this.y = cube.y + cube.size / 2;
        this.size = Math.random() * 5 + 2;
        this.color = cube.color;
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        this.life = 100;
        this.shape = this.generateRandomShape();
    }

    generateRandomShape() {
        const shapes = ['circle', 'square', 'triangle'];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.life -= 1;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);

        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }

        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    new CarGame();
});

// live free or die.
