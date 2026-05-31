/* ============================================================
   Drift Stars — gentle floating galaxy layer (2D canvas)
   ============================================================ */

(function initDriftStars() {
  const canvas = document.getElementById('drift-stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const SIZES = [1, 1.5, 2];
  const STAR_COUNT = 80 + Math.floor(Math.random() * 41);

  let width = 0;
  let height = 0;
  let stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStar() {
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    const depth = (size - 1) / 1;
    const speed = 0.06 + depth * 0.14;
    const angle = Math.random() * Math.PI * 2;
    const variance = 0.75 + Math.random() * 0.5;

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      vx: Math.cos(angle) * speed * variance,
      vy: Math.sin(angle) * speed * variance,
      twinkle: Math.random() < 0.3,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.006 + Math.random() * 0.012,
      baseOpacity: 0.35 + depth * 0.3 + Math.random() * 0.2,
    };
  }

  function wrapStar(star) {
    const pad = 10;
    if (star.x < -pad) star.x = width + pad;
    else if (star.x > width + pad) star.x = -pad;
    if (star.y < -pad) star.y = height + pad;
    else if (star.y > height + pad) star.y = -pad;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.x += star.vx;
      star.y += star.vy;
      wrapStar(star);

      let alpha = star.baseOpacity;
      if (star.twinkle) {
        star.twinklePhase += star.twinkleSpeed;
        alpha *= 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(star.twinklePhase));
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar());
    }
  }

  window.addEventListener('resize', () => {
    const prevW = width || 1;
    const prevH = height || 1;
    resize();
    for (let i = 0; i < stars.length; i++) {
      stars[i].x = (stars[i].x / prevW) * width;
      stars[i].y = (stars[i].y / prevH) * height;
    }
  });

  init();
  requestAnimationFrame(draw);
})();
