const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reveals = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const siteAudio = document.querySelector("[data-site-audio]");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  header.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    header.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.src;
    lightboxImage.alt = item.dataset.title;
    lightboxTitle.textContent = item.dataset.title;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

if (siteAudio) {
  siteAudio.volume = 0.6;
  let userAllowedAudio = false;

  const pageCanPlayAudio = () => !document.hidden;

  const pauseSiteAudio = () => {
    siteAudio.pause();
  };

  const playSiteAudio = () => {
    if (!pageCanPlayAudio()) {
      pauseSiteAudio();
      return Promise.resolve(false);
    }

    return siteAudio
      .play()
      .then(() => {
        userAllowedAudio = true;
        return true;
      })
      .catch(() => {
        document.addEventListener("pointerdown", unlockAndPlayAudio, { once: true });
        document.addEventListener("keydown", unlockAndPlayAudio, { once: true });
        return false;
      });
  };

  const unlockAndPlayAudio = () => {
    userAllowedAudio = true;
    playSiteAudio();
  };

  const syncSiteAudio = () => {
    if (pageCanPlayAudio() && userAllowedAudio) {
      playSiteAudio();
      return;
    }

    pauseSiteAudio();
  };

  document.addEventListener("DOMContentLoaded", playSiteAudio, { once: true });
  window.addEventListener("load", playSiteAudio, { once: true });
  document.addEventListener("pointerdown", unlockAndPlayAudio, { once: true });
  document.addEventListener("keydown", unlockAndPlayAudio, { once: true });
  document.addEventListener("visibilitychange", syncSiteAudio);
  window.addEventListener("focus", syncSiteAudio);
  window.addEventListener("blur", pauseSiteAudio);
  window.addEventListener("pagehide", pauseSiteAudio);
  window.addEventListener("pageshow", syncSiteAudio);
}
