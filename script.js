// =============================================
//  PARTICLE SYSTEM (replaces floating hearts)
// =============================================

const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

let W, H, particles = [];

function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

const SYMBOLS = ['❤', '✦', '·'];

class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
        this.x    = randomBetween(0, W);
        this.y    = initial ? randomBetween(0, H) : H + 20;
        this.vx   = randomBetween(-0.25, 0.25);
        this.vy   = randomBetween(-0.4, -0.9);
        this.alpha= 0;
        this.life = 0;
        this.maxLife = randomBetween(180, 360);
        this.size = randomBetween(8, 14);
        this.sym  = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        this.hue  = randomBetween(0, 20); // warm reds/golds
        this.sat  = randomBetween(50, 80);
        this.lit  = randomBetween(40, 65);
    }

    update() {
        this.life++;
        this.x += this.vx;
        this.y += this.vy;

        const progress = this.life / this.maxLife;
        if (progress < 0.2)      this.alpha = progress / 0.2;
        else if (progress > 0.7) this.alpha = 1 - (progress - 0.7) / 0.3;
        else                     this.alpha = 1;

        if (this.life >= this.maxLife) this.reset();
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha * 0.35;
        ctx.fillStyle   = `hsl(${this.hue}, ${this.sat}%, ${this.lit}%)`;
        ctx.font        = `${this.size}px serif`;
        ctx.textAlign   = 'center';
        ctx.fillText(this.sym, this.x, this.y);
        ctx.restore();
    }
}

for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();


// =============================================
//  SCROLL REVEAL
// =============================================

const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));


// =============================================
//  HERO PARALLAX (subtle)
// =============================================

const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroBg && scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
    }
});


// =============================================
//  COUNTDOWN  — change this date!
// =============================================

const birthdayDate = new Date(2027, 5, 8, 0, 0, 0).getTime();

const countdown = setInterval(function () {

    const now      = new Date().getTime();
    const distance = birthdayDate - now;

    if (distance < 0) {
        clearInterval(countdown);
        const el = document.getElementById('countdown');
        if (el) {
            el.innerHTML = `
                <div class="countdown-inner" style="text-align:center">
                    <p class="section-label centered">It's Here</p>
                    <h2 class="section-title centered">🎉 Happy Birthday! 🎉</h2>
                    <p style="color:var(--muted);font-size:0.9rem;letter-spacing:0.1em">Today is all about you ❤️</p>
                </div>`;
        }
        return;
    }

    const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const ids = ['days', 'hours', 'minutes', 'seconds'];
    const vals = [days, hours, minutes, seconds];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
            const newVal = String(vals[i]).padStart(2, '0');
            if (el.textContent !== newVal) {
                el.style.transform = 'translateY(-6px)';
                el.style.opacity   = '0';
                setTimeout(() => {
                    el.textContent     = newVal;
                    el.style.transform = 'translateY(0)';
                    el.style.opacity   = '1';
                }, 120);
            }
        }
    });

}, 1000);

// Add transition to countdown spans
document.querySelectorAll('.time-box span').forEach(el => {
    el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
});
