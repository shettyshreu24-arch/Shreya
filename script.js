/**
 * ==========================================================================
 * SHREYA SHETTY - DEVELOPER PORTFOLIO JAVASCRIPT
 * Features:
 * - Theme Switcher (Light / Dark mode with localStorage persistence)
 * - Scroll Progress Bar & Scrollspy Active Navigation Link
 * - Responsive Mobile Drawer Navigation
 * - Project Category Filtering
 * - Accessible Modal System (Curriculum Vitae & Project Breakdown)
 * - Clipboard Copy with Animated Toast Notifications
 * - Validated Contact Form with direct mailto composition
 * - Subtle Scroll Reveal with IntersectionObserver
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to light theme per student preference
  const savedTheme = localStorage.getItem('shreya_portfolio_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(newTheme === 'light' ? 'Switched to Royal Blue & Rose Pink' : 'Switched to Cosmic Space Blue & Neon Pink');
    });
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('shreya_portfolio_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. SCROLL PROGRESS BAR & ACTIVE NAV HIGHLIGHTING
  // --------------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress-bar');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', handleScroll, { passive: true });

  function handleScroll() {
    // Scroll progress bar
    if (progressBar) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    // Scrollspy active nav
    const scrollY = window.pageYOffset + 150;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        highlightNavLink(sectionId);
      }
    });
  }

  function highlightNavLink(id) {
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Initial trigger
  handleScroll();

  // --------------------------------------------------------------------------
  // 3. RESPONSIVE MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  function openMobileNav() {
    if (mobileNavDrawer && mobileNavOverlay) {
      mobileNavDrawer.classList.add('open');
      mobileNavOverlay.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileNavDrawer && mobileNavOverlay) {
      mobileNavDrawer.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileNav);
  }

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // --------------------------------------------------------------------------
  // 4. PROJECT CATEGORY FILTERING TABS
  // --------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab UI
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. ACCESSIBLE MODALS (RESUME & PROJECT BREAKDOWN)
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroResumeTrigger = document.getElementById('hero-resume-trigger');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const closeResumeModalBtn = document.getElementById('close-resume-modal-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  // Trigger Resume Modal
  [openResumeBtn, heroResumeTrigger, mobileResumeBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        closeMobileNav();
        openModal(resumeModal);
      });
    }
  });

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', () => closeModal(resumeModal));
  }

  // Print / Save as PDF Button
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Project Detail Breakdown Modal
  const projectDetailButtons = document.querySelectorAll('.view-project-details-btn');
  projectDetailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  const projectModalCloseBtns = document.querySelectorAll('[data-close-modal]');
  projectModalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        closeModal(targetModal);
      }
    });
  });

  // Close modals when clicking overlay
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Keyboard accessibility: ESC key closes modals & drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
      closeMobileNav();
    }
  });

  function openModal(modal) {
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus first actionable item inside modal
      const focusable = modal.querySelector('button, [href], input, textarea');
      if (focusable) {
        setTimeout(() => focusable.focus(), 100);
      }
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Modal contact trigger
  const modalContactTriggers = document.querySelectorAll('.modal-contact-trigger');
  modalContactTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      modals.forEach(m => closeModal(m));
    });
  });

  // --------------------------------------------------------------------------
  // 6. CLIPBOARD COPY WITH TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older environments
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        const copyTextSpan = btn.querySelector('.copy-text');
        if (copyTextSpan) {
          const original = copyTextSpan.textContent;
          copyTextSpan.textContent = 'Copied!';
          setTimeout(() => {
            copyTextSpan.textContent = original;
          }, 2000);
        }

        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        showToast('Unable to copy to clipboard.');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => {
        if (toast.parentNode === toastContainer) {
          toastContainer.removeChild(toast);
        }
      }, 400);
    }, duration);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM CLIENT-SIDE VALIDATION & MAILTO HANDLER
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError('name-error', 'Please enter your name.');
        isValid = false;
      } else {
        clearError('name-error');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        showError('email-error', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('email-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        showError('subject-error', 'Please provide a subject line.');
        isValid = false;
      } else {
        clearError('subject-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError('message-error', 'Please write your message.');
        isValid = false;
      } else {
        clearError('message-error');
      }

      if (!isValid) return;

      // Construct mailto link
      const recipient = 'shettyshreu24@gmail.com';
      const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
      const mailBody = encodeURIComponent(
        `Hello Shreya,\n\n${messageInput.value.trim()}\n\n---\nFrom: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

      showToast('Opening default email application...');

      // Trigger mail client
      window.location.href = mailtoUrl;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
      }, 1000);
    });
  }

  function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  // --------------------------------------------------------------------------
  // 9. SUBTLE SCROLL REVEAL (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.card, .timeline-item, .skills-group, .hero-content'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 10. DYNAMIC YEAR
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
