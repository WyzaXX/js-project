class MatrixRain {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setupCanvas();
    this.characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    this.fontSize = 16;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    this.rainbowColors = [
      "#ff0000",
      "#ff4000",
      "#ff8000",
      "#ffbf00",
      "#ffff00",
      "#80ff00",
      "#00ff00",
      "#00ff80",
      "#00ffff",
      "#0080ff",
      "#0000ff",
      "#8000ff",
      "#ff00ff",
      "#ff0080",
    ];
    this.init();
  }

  setupCanvas() {
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "-1";
    this.canvas.style.opacity = "0.4";
    document.body.appendChild(this.canvas);
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.init();
  }

  init() {
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -100);
    }
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `bold ${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const text =
        this.characters[Math.floor(Math.random() * this.characters.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      const colorIndex = Math.floor(
        (y / this.canvas.height) * this.rainbowColors.length
      );
      const color = this.rainbowColors[colorIndex % this.rainbowColors.length];

      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 5;
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, x, y);
      this.ctx.shadowBlur = 0;

      if (y * this.fontSize > this.canvas.height && Math.random() > 0.99) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const matrixRain = new MatrixRain();
  matrixRain.animate();
});
