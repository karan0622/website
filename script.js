const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
const particleCount = 140;
const connectionDistance = 150;
const mouse = { x: null, y: null, radius: 200 };
const phrases = [
  'Decoding reality, one signal at a time.',
  'Turning noise into trust.',
  'Fact, not fiction.',
  'A new look for media verification.'
];
let phraseIndex = 0;
let charIndex = 0;
const typeElement = document.getElementById('type-text');

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 1.8 + 0.8;
    this.color = Math.random() > 0.35 ? '#ffd76f' : '#8fe3ff';
    this.opacity = Math.random() * 0.45 + 0.15;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x += (dx / distance) * force * 1.5;
        this.y += (dy / distance) * force * 1.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const particles = [];

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles.length = 0;

  for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle());
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i += 1) {
    const p1 = particles[i];
    p1.update();
    p1.draw();

    for (let j = i + 1; j < particles.length; j += 1) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 215, 111, ${1 - distance / connectionDistance})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawBackground);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 2200);
  setTimeout(() => toast.remove(), 2500);
}

function cycleText() {
  const currentPhrase = phrases[phraseIndex];

  if (charIndex <= currentPhrase.length) {
    typeElement.textContent = currentPhrase.slice(0, charIndex);
    charIndex += 1;
    setTimeout(cycleText, 75);
  } else {
    setTimeout(() => {
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      cycleText();
    }, 1800);
  }
}

const cards = document.querySelectorAll('.action-card');

const actionLinks = {
  Text: 'https://misleadcheck.onrender.com/',
  Image: 'https://deepfake-image-1.onrender.com',
};

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;
    const url = actionLinks[type];

    showToast(`${type} analysis coming online... 🚀`);
    card.animate(
      [
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-8px) scale(1.01)' },
        { transform: 'translateY(0) scale(1)' }
      ],
      {
        duration: 250,
        easing: 'ease-out'
      }
    );

    if (url) {
      window.open(url, '_blank');
    }
  });
});

window.addEventListener('resize', initCanvas);

initCanvas();
drawBackground();
cycleText();
