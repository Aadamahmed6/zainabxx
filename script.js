
function nextQuestion(id) {
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function makeNoButtonDodge(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('mouseenter', () => {
    const offsetX = Math.random() * 300 - 150;
    const offsetY = Math.random() * 200 - 100;
    btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
}

makeNoButtonDodge('no1');
makeNoButtonDodge('no2');
makeNoButtonDodge('no-final');

let selectedLeft = null;
let matchedPairs = 0;
const totalPairs = 5;

const leftPics = document.querySelectorAll('#left-pics img');
const rightPics = document.querySelectorAll('#right-pics img');

leftPics.forEach(img => {
  img.addEventListener('click', () => {
    leftPics.forEach(i => i.classList.remove('selected'));
    img.classList.add('selected');
    selectedLeft = img;
  });
});

rightPics.forEach(img => {
  img.addEventListener('click', () => {
    if (!selectedLeft) return;
    if (selectedLeft.dataset.pair === img.dataset.pair) {
      selectedLeft.classList.add('matched');
      img.classList.add('matched');
      selectedLeft.style.opacity = 0.5;
      img.style.opacity = 0.5;
      matchedPairs++;
      selectedLeft = null;
      document.getElementById('match-status').innerText = `Matched ${matchedPairs} of ${totalPairs}`;
      if (matchedPairs === totalPairs) {
        setTimeout(() => nextQuestion('q7'), 1000);
      }
    } else {
      alert('Oops! Try again.');
    }
  });
});

function celebrate() {
  const msg = document.getElementById('final-message');
  msg.classList.remove('hidden');
}


function celebrate() {
  const msg = document.getElementById('final-message');
  msg.classList.remove('hidden');

  const canvas = document.createElement('canvas');
  canvas.id = 'fireworksCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = 9999;
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fireworks = [];

  function Firework() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height / 2;
    this.radius = 2;
    this.alpha = 1;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.exploded = false;
    this.particles = [];

    this.update = () => {
      if (!this.exploded) {
        this.y -= 10;
        if (this.y <= this.targetY) {
          this.exploded = true;
          for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
          }
        }
      } else {
        this.particles.forEach(p => p.update());
      }
    };

    this.draw = () => {
      if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      } else {
        this.particles.forEach(p => p.draw());
      }
    };
  }

  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 6 - 3;
    this.alpha = 1;
    this.color = color;

    this.update = () => {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.02;
    };

    this.draw = () => {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    };
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach(fw => {
      fw.update();
      fw.draw();
    });
    fireworks = fireworks.filter(fw => fw.exploded === false || fw.particles.some(p => p.alpha > 0));
    requestAnimationFrame(animate);
  }

  for (let i = 0; i < 5; i++) {
    fireworks.push(new Firework());
  }
  animate();
}
