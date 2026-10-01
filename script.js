(() => {
  'use strict';

  // Enables progressive-enhancement styles for the reveal animations.
  document.documentElement.classList.add('js');

  /* Mobile navigation */
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar) {
    const navLinks = navbar.querySelectorAll('a');

    function setMenu(isOpen, restoreFocus = false) {
      navbar.classList.toggle('active', isOpen);
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation' : 'Open navigation'
      );

      if (!isOpen && restoreFocus) {
        menuToggle.focus();
      }
    }

    function closeMenu(restoreFocus = false) {
      setMenu(false, restoreFocus);
    }

    setMenu(false);

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('click', (event) => {
      if (
        !navbar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        menuToggle.getAttribute('aria-expanded') === 'true'
      ) {
        closeMenu(true);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  /* FAQ accordion */
  const faqButtons = document.querySelectorAll('.faq-question');

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      if (!answer) return;

      // Keep one answer open at a time for a compact accordion.
      faqButtons.forEach((otherButton) => {
        const otherAnswer = document.getElementById(
          otherButton.getAttribute('aria-controls')
        );

        otherButton.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.hidden = true;
      });

      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* Contact form validation */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    const fields = {
      name: {
        element: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate(value) {
          return value.trim().length >= 2
            ? ''
            : 'Please enter your name.';
        }
      },
      email: {
        element: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate(value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailPattern.test(value.trim())
            ? ''
            : 'Please enter a valid email address.';
        }
      },
      message: {
        element: document.getElementById('message'),
        error: document.getElementById('message-error'),
        validate(value) {
          return value.trim().length >= 10
            ? ''
            : 'Please enter at least 10 characters.';
        }
      }
    };

    function showFieldError(field, message) {
      if (!field.element || !field.error) return;

      field.element.setAttribute('aria-invalid', String(Boolean(message)));
      field.error.textContent = message;

      if (message) {
        field.element.setAttribute('aria-describedby', field.error.id);
      } else {
        field.element.removeAttribute('aria-describedby');
      }
    }

    function validateField(field) {
      const message = field.validate(field.element.value);
      showFieldError(field, message);
      return !message;
    }

    Object.values(fields).forEach((field) => {
      field.element.addEventListener('blur', () => {
        validateField(field);
      });

      field.element.addEventListener('input', () => {
        if (field.element.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
        formStatus.textContent = '';
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isValid = Object.values(fields).every(validateField);
      formStatus.className = 'form-status';

      if (!isValid) {
        formStatus.textContent = 'Please correct the highlighted fields.';
        formStatus.classList.add('is-error');
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
        return;
      }

      // This demo validates locally. Connect the form to your email service
      // or backend before deploying if you need to receive submissions.
      formStatus.textContent =
        'Thanks — your message passed validation. We will be in touch soon.';
      formStatus.classList.add('is-success');
      contactForm.reset();

      Object.values(fields).forEach((field) => {
        showFieldError(field, '');
      });
    });
  }

  /* Scroll-triggered reveal animations using Intersection Observer */
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (
    prefersReducedMotion ||
    !('IntersectionObserver' in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add('is-visible');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
})();
