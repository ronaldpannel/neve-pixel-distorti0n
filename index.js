/**@type{HTMLCanvasElement} */

class Particle {
  constructor(effect, x, y, color) {
    this.effect = effect;
    this.x = Math.random() * this.effect.width;
    this.y = Math.random() * this.effect.height;
    this.originX = Math.floor(x);
    this.originY = Math.floor(y);
    this.color = color;
    this.size = this.effect.gap;
    this.vx = 0;
    this.vy = 0;
    this.ease = 0.1;
    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
    this.force = 0;
    this.angle = 0;
    this.friction = 0.95;
  }
  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }
  update() {
    this.dx = this.effect.pointer.x - this.x;
    this.dy = this.effect.pointer.y - this.y;
    // this.distance = Math.hypot(this.dx, this.dy)
    this.distance = this.dx * this.dx + this.dy * this.dy;
    this.force = -this.effect.pointer.radius / this.distance;

    if (this.distance < this.effect.pointer.radius) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }

    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y +=
      ((this.vy *= this), this.friction) + (this.originY - this.y) * this.ease;
  }
  warp() {
    this.x = Math.random() * this.effect.width;
    this.y = Math.random() * this.effect.height;
    this.ease = 0.05;
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particlesArray = [];
    this.numParticles = 100;
    this.image = document.getElementById("neveImg");
    this.centerX = this.width * 0.5 - this.image.width * 0.5;
    this.centerY = this.height * 0.5 - this.image.height * 0.5;
    this.gap = 2;

    this.pointer = {
      x: undefined,
      y: undefined,
      radius: 750,
      pressed: false,
    };
    const warpBtn = document.getElementById("warpBtn");
    warpBtn.addEventListener("click", () => {
      this.warp();
    });
    window.addEventListener("pointerdown", () => {
      this.pointer.pressed = true;
    });

    window.addEventListener("pointermove", (e) => {
      if (this.pointer.pressed) {
        this.pointer.x = e.offsetX;
        this.pointer.y = e.offsetY;
      }
    });
    window.addEventListener("pointerup", () => {
      this.pointer.pressed = false;
    });
  }

  init(context) {
    context.drawImage(this.image, this.centerX, this.centerY);
    const pixels = context.getImageData(0, 0, this.width, this.height).data;
    for (let y = 0; y < this.height; y += this.gap) {
      for (let x = 0; x < this.width; x += this.gap) {
        const index = (y * this.width + x) * 4;
        let red = pixels[index];
        let green = pixels[index + 1];
        let blue = pixels[index + 2];
        let alpha = pixels[index + 3];
        let color = `rgb(${red}, ${green}, ${blue})`;

        if (alpha > 0) {
          this.particlesArray.push(new Particle(this, x, y, color));
        }
      }
    }
  }
  draw(context) {
    this.particlesArray.forEach((particle) => {
      particle.draw(context);
    });
  }
  update() {
    this.particlesArray.forEach((particle) => {
      particle.update();
    });
  }
  warp() {
    this.particlesArray.forEach((particle) => {
      particle.warp();
    });
  }
}

window.addEventListener("load", function () {
  const canvas1 = document.getElementById("canvas1");
  const ctx = canvas1.getContext("2d", { willReadFrequently: true });
  canvas1.width = 320;
  canvas1.height = 400;
  ctx.fillStyle = "red";

  const effect = new Effect(canvas1.width, canvas1.height);
  effect.init(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    effect.draw(ctx);
    effect.update();

    requestAnimationFrame(animate);
  }
  animate();
});
