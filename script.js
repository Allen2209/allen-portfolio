// ============ SCROLL REVEALS & PARALLAX ============
(function () {
  // Parallax background on scroll
  function updateScrollParallax() {
    const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    // Move background from 0% to 100% as user scrolls
    document.body.style.setProperty('--scroll-y', scrollPct * 100);
  }
  window.addEventListener('scroll', updateScrollParallax, { passive: true });
  updateScrollParallax();

  // Scroll-based reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('exit-down');
      } else {
        // Determine if it's exiting through the top or bottom
        const rect = entry.boundingClientRect;
        if (rect.top > 0) {
          // It exited through the bottom (pop down)
          entry.target.classList.remove('visible');
          entry.target.classList.add('exit-down');
        } else {
          // It exited through the top (reset to pop from up)
          entry.target.classList.remove('visible');
          entry.target.classList.remove('exit-down');
        }
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: "-50px 0px"
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Navbar scroll behavior
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Skill bar animations
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });
  });

  // Stat counter animation
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        if (target && !el.dataset.animated) {
          el.dataset.animated = 'true';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = current;
          }, 30);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));
})();

// ============ FORM HANDLER (Hidden iFrame Submit) ============
function handleFormSubmit(btn, event) {
  event.preventDefault();

  const form = document.getElementById("contact-form");
  const name = form.querySelector('input[name="name"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const message = form.querySelector('textarea[name="message"]').value;

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  // Submit the form silently via the hidden iframe
  form.submit();

  // Show UI feedback
  const original = btn.innerText;
  btn.innerText = "SENT! ✓";
  btn.disabled = true;

  const notif = document.getElementById("notification");
  notif.classList.add("show");
  form.reset();

  setTimeout(() => {
    notif.classList.remove("show");
    btn.innerText = original;
    btn.disabled = false;
  }, 3000);
}