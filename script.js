const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const yearEl = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const introPopup = document.getElementById("introPopup");
const popupOpenBtn = document.querySelector(".popup-open-btn");
const popupCloseBtn = document.querySelector(".popup-close-btn");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (revealItems.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (sections.length > 0 && navAnchors.length > 0 && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute("id");
        navAnchors.forEach((anchor) => {
          const isActive = anchor.getAttribute("href") === `#${id}`;
          anchor.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0.01,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsHover = window.matchMedia("(hover: hover)").matches;
const tiltItems = document.querySelectorAll(".about-image-wrap, .timeline-card, .project-card");

if (!prefersReducedMotion && supportsHover && tiltItems.length > 0) {
  tiltItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 4;
      const rotateX = ((centerY - y) / centerY) * 4;

      item.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}

if (introPopup) {
  const closePopup = () => {
    introPopup.classList.remove("open");
    introPopup.setAttribute("aria-hidden", "true");
  };

  const openPopup = () => {
    introPopup.classList.add("open");
    introPopup.setAttribute("aria-hidden", "false");
  };

  // Show welcome popup once per tab session.
  if (!sessionStorage.getItem("portfolio-popup-shown")) {
    window.setTimeout(() => {
      openPopup();
      sessionStorage.setItem("portfolio-popup-shown", "true");
    }, 700);
  }

  if (popupOpenBtn) {
    popupOpenBtn.addEventListener("click", openPopup);
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener("click", closePopup);
  }

  introPopup.addEventListener("click", (event) => {
    if (event.target === introPopup) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && introPopup.classList.contains("open")) {
      closePopup();
    }
  });
}

// ===== LIGHTBOX =====
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.innerHTML = `
    <button id="lb-close" aria-label="Close">&times;</button>
    <img id="lb-img" src="" alt="">
  `;
  document.body.appendChild(overlay);

  function initLightbox() {
    document.querySelectorAll('.media-block img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        document.getElementById('lb-img').src = img.src;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.id === 'lb-close') {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
