/* ============================================================
   Portfolio Website – Main JavaScript
   Vanilla JS · No external dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ──────────────────────────────────────────────────────────
  // 1. CACHE COMMON DOM REFERENCES
  // ──────────────────────────────────────────────────────────
  const navbar        = document.querySelector('.navbar');
  const hamburger     = document.getElementById('hamburger');
  const mobileNav     = document.querySelector('.mobile-nav');
  const navLinks      = document.querySelectorAll('a[href^="#"]');
  const sections      = document.querySelectorAll('section[id]');
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card');
  const statNumbers   = document.querySelectorAll('.stat-number');
  const yearSpan      = document.getElementById('current-year');

  // Navbar height used as scroll offset
  const NAV_OFFSET = 80;

  // ──────────────────────────────────────────────────────────
  // 2. SMOOTH SCROLL NAVIGATION
  // ──────────────────────────────────────────────────────────
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      // Guard: skip if the href is just '#'
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      // Calculate position with navbar offset
      const targetPosition = targetSection.offsetTop - NAV_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Close mobile nav if it's currently open
      closeMobileNav();
    });
  });

  // ──────────────────────────────────────────────────────────
  // 3. ACTIVE NAV LINK ON SCROLL
  // ──────────────────────────────────────────────────────────
  function highlightActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop    = section.offsetTop - NAV_OFFSET - 50;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      // Select matching links in both desktop and mobile nav
      const correspondingLinks = document.querySelectorAll(
        `a[href="#${sectionId}"]`
      );

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        correspondingLinks.forEach((l) => l.classList.add('active'));
      } else {
        correspondingLinks.forEach((l) => l.classList.remove('active'));
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav);

  // ──────────────────────────────────────────────────────────
  // 4. MOBILE NAVIGATION TOGGLE
  // ──────────────────────────────────────────────────────────

  /** Close the mobile nav and reset the hamburger icon. */
  function closeMobileNav() {
    if (mobileNav)  mobileNav.classList.remove('active');
    if (hamburger)  hamburger.classList.remove('active');
  }

  if (hamburger && mobileNav) {
    // Toggle on hamburger click
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      hamburger.classList.toggle('active'); // Animates lines → X
    });

    // Close when any mobile‑nav link is clicked
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // ──────────────────────────────────────────────────────────
  // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ──────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right'
  );

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after reveal so animation fires only once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ──────────────────────────────────────────────────────────
  // 6. NAVBAR BACKGROUND ON SCROLL
  // ──────────────────────────────────────────────────────────
  function handleNavbarScroll() {
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);

  // Run once on load in case the page is already scrolled
  handleNavbarScroll();

  // ──────────────────────────────────────────────────────────
  // 7. PROJECT FILTER
  // ──────────────────────────────────────────────────────────
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state on buttons
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        // Start hide animation
        card.style.opacity   = '0';
        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
          if (shouldShow) {
            card.style.display   = '';
            // Trigger reflow so the transition is visible
            void card.offsetHeight;
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        }, 100);
      });
    });
  });

  // ──────────────────────────────────────────────────────────
  // 8. TYPING CURSOR BLINK (CSS‑driven, injected once)
  //    Adds a blinking cursor after the hero‑title text.
  // ──────────────────────────────────────────────────────────
  (function injectCursorStyle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Only inject the keyframes once
    const style = document.createElement('style');
    style.textContent = `
      .hero-title::after {
        content: '|';
        display: inline-block;
        margin-left: 2px;
        animation: cursorBlink 1s step-end infinite;
        color: inherit;
      }
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  })();

  // ──────────────────────────────────────────────────────────
  // 9. PARALLAX FOR GEOMETRIC DECORATIONS
  // ──────────────────────────────────────────────────────────
  const geoCircles = document.querySelectorAll('.geo-circle');
  const geoDots    = document.querySelectorAll('.geo-dots');

  if (geoCircles.length > 0 || geoDots.length > 0) {
    document.addEventListener('mousemove', (e) => {
      // Normalize mouse position to –1 … 1
      const xRatio = (e.clientX / window.innerWidth  - 0.5) * 2;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;

      const maxShift = 12; // max px movement

      geoCircles.forEach((el) => {
        const tx = xRatio * maxShift;
        const ty = yRatio * maxShift;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      geoDots.forEach((el) => {
        // Move dots in the opposite direction for depth effect
        const tx = -xRatio * maxShift * 0.6;
        const ty = -yRatio * maxShift * 0.6;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
  }

  // ──────────────────────────────────────────────────────────
  // 10. SMOOTH COUNTER ANIMATION (About Stats)
  // ──────────────────────────────────────────────────────────
  let statsAnimated = false; // ensure counters fire only once

  /**
   * Animates a number from 0 to `target` inside `element`
   * using requestAnimationFrame over the given `duration` (ms).
   */
  function animateCounter(element, target, duration = 2000) {
    const start     = performance.now();
    const initial   = 0;

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease‑out quad for a decelerating feel
      const eased    = 1 - (1 - progress) * (1 - progress);
      const current  = Math.floor(eased * (target - initial) + initial);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Ensure final value is exact
        element.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  if (statNumbers.length > 0) {
    const aboutSection = document.getElementById('about');

    if (aboutSection) {
      const statsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !statsAnimated) {
              statsAnimated = true;

              statNumbers.forEach((numEl) => {
                const target = parseInt(numEl.getAttribute('data-target'), 10);
                if (!isNaN(target)) {
                  animateCounter(numEl, target, 2000);
                }
              });

              // No need to keep observing
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      statsObserver.observe(aboutSection);
    }
  }

  // ──────────────────────────────────────────────────────────
  // 11. CURRENT YEAR IN FOOTER
  // ──────────────────────────────────────────────────────────
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  // ──────────────────────────────────────────────────────────
  // 12. THREE.JS HYPERSPACE TUNNEL & GSAP INTRO
  // ──────────────────────────────────────────────────────────
  const threeCanvas = document.getElementById('three-canvas');
  if (threeCanvas && window.THREE && window.gsap) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create warp stars using InstancedMesh for performance and stretching
    const starCount = 3000;
    const starGeo = new THREE.BoxGeometry(2, 2, 2);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const starsMesh = new THREE.InstancedMesh(starGeo, starMat, starCount);

    const galaxyCenters = [
      { x: -500, y: 300, z: -800 },
      { x: 700, y: -250, z: -1000 },
      { x: -200, y: -400, z: -600 },
      { x: 400, y: 150, z: -1400 },
      { x: -900, y: 100, z: -1100 },
    ];

    const dummy = new THREE.Object3D();
    const starData = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 3000;
      const y = (Math.random() - 0.5) * 3000;
      const z = (Math.random() - 0.5) * 6000;
      const isGalaxy = Math.random() < 0.32;
      const star = { x, y, z, baseX: x, baseY: y, baseZ: z, isGalaxy };

      if (isGalaxy) {
        const center = galaxyCenters[Math.floor(Math.random() * galaxyCenters.length)];
        star.orbitCenterX = center.x;
        star.orbitCenterY = center.y;
        star.orbitCenterZ = center.z;
        star.orbitRadius = 60 + Math.random() * 250;
        star.orbitSpeed = 0.25 + Math.random() * 0.75;
        star.orbitAngle = Math.random() * Math.PI * 2;
        star.orbitFlatten = 0.35 + Math.random() * 0.65;
        star.zWobble = 15 + Math.random() * 35;
      }

      starData.push(star);
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      starsMesh.setMatrixAt(i, dummy.matrix);
    }
    scene.add(starsMesh);

    // Initial states for homepage elements
    gsap.set('.navbar', { opacity: 0, y: -20 });
    gsap.set('.hero-name', { opacity: 0, y: 30 });
    gsap.set('.hero-label, .hero-title, .hero-description, .hero-buttons, .available-badge', { opacity: 0, y: 20 });
    gsap.set('#hero-social-mobile a', { opacity: 0, y: 20 });
    gsap.set('.profile-img', { opacity: 0, scale: 0.8 });
    gsap.set('.sidebar-social a', { opacity: 0, x: -20 });
    gsap.set('.hero-left, .hero-right', { opacity: 1, x: 0, y: 0 });

    const warpParams = { speed: 0.5, introActive: true };
    const tl = gsap.timeline();

    // 1. Logo display (1.5s total: appear + hold)
    tl.to('.intro-logo', { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to('.intro-name', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25')
      .to({}, { duration: 0.75 }) // Hold until 1.5s
      .addLabel('warp')

      // 2. Logo fade-out & warp speed simultaneously (1.5s – 2.3s)
      .to('.intro-name', { opacity: 0, duration: 0.8 }, 'warp')
      .to('.intro-logo', { opacity: 0, duration: 0.8, ease: 'power2.in' }, 'warp')
      .to('.portal-ring', {
         scale: 50,
         borderColor: 'rgba(168, 85, 247, 0.8)',
         boxShadow: '0 0 100px #a855f7, inset 0 0 100px #a855f7',
         duration: 0.8,
         ease: 'power2.in'
      }, 'warp')
      .to(warpParams, { speed: 150, duration: 0.8, ease: 'power2.in' }, 'warp')
      .to('#intro-overlay', { backgroundColor: 'rgba(0,0,0,0)', duration: 0.8, ease: 'power2.inOut' }, 'warp')

      // 3. Decelerate warp & reveal homepage (2.3s – 3.0s)
      .to(warpParams, { speed: 0, duration: 0.7, ease: 'power3.out' })
      .to('.portal-ring', { opacity: 0, duration: 0.5 }, '-=0.7')

      // 4. Reveal Homepage
      .to('.navbar', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.7')
      .to('.profile-img', { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, '-=0.65')
      .to('.hero-name', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.55')
      .to('.hero-label, .hero-title, .hero-description, .hero-buttons, .available-badge', { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, '-=0.45')
      .to('#hero-social-mobile a', { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.35')
      .to('.sidebar-social a', { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, '-=0.35')
      .add(() => {
        document.getElementById('intro-overlay').style.display = 'none';
        warpParams.introActive = false; // Enable parallax
      });

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      if (!warpParams.introActive) {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
      }
    });

    const clock = new THREE.Clock();

    function animateThree() {
      requestAnimationFrame(animateThree);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      const currentSpeed = warpParams.speed;
      const isWarping = currentSpeed > 1.5;
      const isGalaxyIdle = !warpParams.introActive && currentSpeed <= 1.5;
      let stretch = 1;

      for (let i = 0; i < starCount; i++) {
        const sd = starData[i];

        if (isWarping) {
          sd.z += currentSpeed;
          stretch = Math.max(1, currentSpeed * 1.5);

          if (sd.z > camera.position.z) {
            sd.z -= 6000;
          }
        } else if (isGalaxyIdle) {
          if (sd.isGalaxy) {
            sd.orbitAngle += sd.orbitSpeed * delta;
            sd.x = sd.orbitCenterX + Math.cos(sd.orbitAngle) * sd.orbitRadius;
            sd.y = sd.orbitCenterY + Math.sin(sd.orbitAngle) * sd.orbitRadius * sd.orbitFlatten;
            sd.z = sd.orbitCenterZ + Math.sin(sd.orbitAngle * 2) * sd.zWobble;
          } else {
            sd.x = sd.baseX;
            sd.y = sd.baseY;
            sd.z = sd.baseZ;
          }
        } else {
          sd.z += currentSpeed;

          if (sd.z > camera.position.z) {
            sd.z -= 6000;
          }
        }

        dummy.position.set(sd.x, sd.y, sd.z);
        dummy.scale.set(1, 1, isWarping ? stretch : 1);
        dummy.updateMatrix();
        starsMesh.setMatrixAt(i, dummy.matrix);
      }
      starsMesh.instanceMatrix.needsUpdate = true;

      if (isWarping) {
        starsMesh.rotation.y = elapsedTime * 0.05;
        starsMesh.rotation.z = elapsedTime * 0.02;
      } else {
        starsMesh.rotation.set(0, 0, 0);
      }

      // Mouse parallax (only active after intro)
      targetX = mouseX * 0.05;
      targetY = mouseY * 0.05;
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animateThree();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  // ──────────────────────────────────────────────────────────
  // 13. ORION CONSTELLATION CURSOR
  // ──────────────────────────────────────────────────────────
  const orionCanvas = document.getElementById('orion-canvas');
  if (orionCanvas) {
    const octx = orionCanvas.getContext('2d');
    let oWidth, oHeight;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;
    let fadeAlpha = 0;
    let moveTimeout;

    function resizeOrion() {
      oWidth = orionCanvas.width = window.innerWidth;
      oHeight = orionCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeOrion);
    resizeOrion();

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 200);
    });

    const orionStars = [
      { id: 1, x: -15, y: -30 }, 
      { id: 2, x: 0, y: -40 },  
      { id: 3, x: 15, y: -25 }, 
      { id: 4, x: -8, y: 0 },   
      { id: 5, x: 0, y: 3 },    
      { id: 6, x: 8, y: 5 },    
      { id: 7, x: -12, y: 30 }, 
      { id: 8, x: 18, y: 35 }   
    ];

    const orionLines = [
      [1, 2], [2, 3], [1, 3], [1, 4], [3, 6], [4, 5], [5, 6], [4, 7], [6, 8], [7, 8]
    ];

    function animateOrion() {
      octx.clearRect(0, 0, oWidth, oHeight);

      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (isMoving) {
        fadeAlpha = Math.min(fadeAlpha + 0.05, 1);
      } else {
        fadeAlpha = Math.max(fadeAlpha - 0.02, 0);
      }

      if (fadeAlpha > 0) {
        octx.lineWidth = 0.5;
        octx.strokeStyle = `rgba(255, 255, 255, ${fadeAlpha * 0.2})`;
        octx.beginPath();
        orionLines.forEach(pair => {
          const s1 = orionStars.find(s => s.id === pair[0]);
          const s2 = orionStars.find(s => s.id === pair[1]);
          if (s1 && s2) {
            octx.moveTo(currentX + s1.x + 15, currentY + s1.y + 15);
            octx.lineTo(currentX + s2.x + 15, currentY + s2.y + 15);
          }
        });
        octx.stroke();

        orionStars.forEach(star => {
          octx.beginPath();
          octx.arc(currentX + star.x + 15, currentY + star.y + 15, 1.5, 0, Math.PI * 2);
          octx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha})`;
          octx.fill();
          
          octx.beginPath();
          octx.arc(currentX + star.x + 15, currentY + star.y + 15, 4, 0, Math.PI * 2);
          octx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha * 0.2})`;
          octx.fill();
        });
      }

      requestAnimationFrame(animateOrion);
    }
    animateOrion();
  }
});
