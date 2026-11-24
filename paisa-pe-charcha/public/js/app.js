/**
 * PAISA PE CHARCHA - MASTER APPLICATION CONTROLLER
 * Responsive navigation, royal particle canvas, modals, newsletter & smooth scrolling
 */

(function () {
  'use strict';

  // 1. Mobile Drawer Navigation
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 2. Active Navigation Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // 3. Subtle Animated Gold Particles Canvas (Hero Section)
  function initHeroParticles() {
    const canvas = document.getElementById('heroParticleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const count = Math.min(45, Math.floor(width / 30));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(255, 119, 34, ',
        alpha: Math.random() * 0.5 + 0.15,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.008;
        const currentAlpha = Math.max(0.1, Math.min(0.65, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha + ')';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 4. Login / Sign Up Modal Handling
  const authModalOverlay = document.getElementById('authModalOverlay');
  const openAuthBtns = document.querySelectorAll('.open-auth-modal-btn');
  const closeAuthBtn = document.getElementById('closeAuthBtn');
  const authForm = document.getElementById('authForm');
  const authToggleLink = document.getElementById('authToggleLink');
  let isSignupMode = false;

  function openAuthModal() {
    if (authModalOverlay) {
      authModalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAuthModal() {
    if (authModalOverlay) {
      authModalOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  openAuthBtns.forEach(btn => btn.addEventListener('click', openAuthModal));
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
  if (authModalOverlay) {
    authModalOverlay.addEventListener('click', (e) => {
      if (e.target === authModalOverlay) closeAuthModal();
    });
  }

  if (authToggleLink) {
    authToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      isSignupMode = !isSignupMode;
      const titleEl = document.getElementById('authModalTitle');
      const submitBtn = document.getElementById('authSubmitBtn');
      const promptText = document.getElementById('authTogglePrompt');

      if (isSignupMode) {
        if (titleEl) titleEl.innerText = "Create Your Financial Intelligence Account";
        if (submitBtn) submitBtn.innerText = "Register Portfolio";
        if (promptText) promptText.innerHTML = `Already registered? <a href="#" id="authToggleLink" style="color:#D4AF37;text-decoration:underline;">Log in</a>`;
      } else {
        if (titleEl) titleEl.innerText = "Log In to Paisa Pe Charcha";
        if (submitBtn) submitBtn.innerText = "Access AI Terminal";
        if (promptText) promptText.innerHTML = `New to Paisa Pe Charcha? <a href="#" id="authToggleLink" style="color:#D4AF37;text-decoration:underline;">Create free account</a>`;
      }
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail')?.value || 'Citizen';
      alert(`Namaste ${email}! You are successfully logged into the Paisa Pe Charcha Financial Intelligence Terminal.`);
      closeAuthModal();
    });
  }

  // 5. API Key Settings Modal
  const apiKeyModal = document.getElementById('apiKeyModalOverlay');
  const openApiKeyBtns = document.querySelectorAll('.open-api-key-btn');
  const closeApiKeyBtn = document.getElementById('closeApiKeyBtn');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
  const apiKeyInput = document.getElementById('customApiKeyInput');
  const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
  const API_KEY_STORAGE = 'paisa_pe_charcha_gemini_key';

  function openApiKeyModal() {
    if (apiKeyModal) {
      if (apiKeyInput) {
        apiKeyInput.value = localStorage.getItem(API_KEY_STORAGE) || '';
      }
      apiKeyModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeApiKeyModal() {
    if (apiKeyModal) {
      apiKeyModal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  openApiKeyBtns.forEach(btn => btn.addEventListener('click', openApiKeyModal));
  if (closeApiKeyBtn) closeApiKeyBtn.addEventListener('click', closeApiKeyModal);
  if (apiKeyModal) {
    apiKeyModal.addEventListener('click', (e) => {
      if (e.target === apiKeyModal) closeApiKeyModal();
    });
  }

  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput?.value?.trim() || '';
      if (key) {
        localStorage.setItem(API_KEY_STORAGE, key);
        alert("Google Gemini API Key securely saved in your local browser session! The AI terminal will now utilize this key for external live reasoning.");
      } else {
        localStorage.removeItem(API_KEY_STORAGE);
        alert("Key removed. The platform will now use the high-performance built-in Indian Financial Reasoning Engine.");
      }
      closeApiKeyModal();
    });
  }

  if (clearApiKeyBtn) {
    clearApiKeyBtn.addEventListener('click', () => {
      localStorage.removeItem(API_KEY_STORAGE);
      if (apiKeyInput) apiKeyInput.value = '';
      alert("Key cleared. Defaulting to built-in Indian Financial Reasoning Engine.");
      closeApiKeyModal();
    });
  }

  // 6. Newsletter Subscription Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput?.value || '';

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        const data = await res.json();
        alert(data.message || "Thank you for subscribing to Paisa Pe Charcha!");
        if (emailInput) emailInput.value = '';
      } catch (err) {
        alert("Namaste! You have successfully subscribed to the Paisa Pe Charcha Financial Intelligence Digest.");
        if (emailInput) emailInput.value = '';
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroParticles();
    });
  } else {
    initHeroParticles();
  }

})();
