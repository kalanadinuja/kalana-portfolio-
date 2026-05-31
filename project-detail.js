/* ============================================================
   Project Detail Page – JavaScript
   Lightbox for screenshots + page-specific setup
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ──────────────────────────────────────────────────────────
  // 1. SCREENSHOT LIGHTBOX
  // ──────────────────────────────────────────────────────────
  const screenshotItems = document.querySelectorAll('.pd-screenshot-item');

  if (screenshotItems.length > 0) {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'pd-lightbox';
    lightbox.innerHTML = `
      <button class="pd-lightbox-close" aria-label="Close lightbox">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img src="" alt="Screenshot preview">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.pd-lightbox-close');

    // Open lightbox on screenshot click
    screenshotItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ──────────────────────────────────────────────────────────
  // 2. NAVBAR SCROLL BEHAVIOR (on detail page)
  // ──────────────────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    // Always show scrolled state on detail page
    navbar.classList.add('scrolled');
  }

  // ──────────────────────────────────────────────────────────
  // 3. CURRENT YEAR
  // ──────────────────────────────────────────────────────────
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
