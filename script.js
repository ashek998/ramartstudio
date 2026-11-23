const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menu = document.querySelector("[data-menu]");
const menuOpen = document.querySelector("[data-menu-open]");
const menuClose = document.querySelector("[data-menu-close]");
let menuReturnFocus = null;

const setMenu = (open) => {
  if (!menu || !menuOpen) return;
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  menuOpen.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
  if (open) {
    menuReturnFocus = document.activeElement;
    window.setTimeout(() => menuClose?.focus(), reducedMotion ? 0 : 350);
  } else if (menuReturnFocus instanceof HTMLElement) {
    menuReturnFocus.focus();
  }
};

menuOpen?.addEventListener("click", () => setMenu(true));
menuClose?.addEventListener("click", () => setMenu(false));
menu?.querySelectorAll("[data-menu-link]").forEach((link) => link.addEventListener("click", () => setMenu(false)));

const hero = document.querySelector("[data-hero]");
const heroImage = document.querySelector("[data-hero-image]");
const heroLogo = document.querySelector("[data-hero-logo]");
const heroCaption = document.querySelector("[data-hero-caption]");

const renderHero = () => {
  if (!hero || !heroImage || !heroLogo || !heroCaption) return;
  const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
  const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / travel));
  heroImage.style.transform = `scale(${1 + progress * 0.16})`;
  heroLogo.style.transform = `translateX(-50%) translateY(${-progress * 90}px) scale(${1 + progress * 0.08})`;
  heroLogo.style.opacity = String(1 - progress * 1.18);
  heroCaption.style.transform = `translateY(${-progress * 70}px)`;
  heroCaption.style.opacity = String(1 - progress * 0.86);
};

if (hero && !reducedMotion) {
  let heroFrame = 0;
  const requestHeroRender = () => {
    if (heroFrame) return;
    heroFrame = window.requestAnimationFrame(() => {
      renderHero();
      heroFrame = 0;
    });
  };
  renderHero();
  window.addEventListener("scroll", requestHeroRender, { passive: true });
  window.addEventListener("resize", requestHeroRender);
}

const reveals = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((element) => revealObserver.observe(element));
}

const viewCursor = document.querySelector("[data-view-cursor]");
if (viewCursor && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  let pointerX = -100;
  let pointerY = -100;
  let cursorX = -100;
  let cursorY = -100;
  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  });
  document.querySelectorAll(".work-card, .gallery-button").forEach((element) => {
    element.addEventListener("pointerenter", () => viewCursor.classList.add("visible"));
    element.addEventListener("pointerleave", () => viewCursor.classList.remove("visible"));
  });
  const moveCursor = () => {
    cursorX += (pointerX - cursorX) * 0.16;
    cursorY += (pointerY - cursorY) * 0.16;
    viewCursor.style.left = `${cursorX}px`;
    viewCursor.style.top = `${cursorY}px`;
    window.requestAnimationFrame(moveCursor);
  };
  moveCursor();
}

const enquiryForm = document.querySelector("[data-enquiry-form]");
enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = enquiryForm.querySelector(".form-status");
  if (!enquiryForm.reportValidity()) {
    if (status) status.textContent = "Please complete the required fields.";
    return;
  }
  const formData = new FormData(enquiryForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const text = `Hello RAM Art Studio,\n\nName: ${name}\nPhone: ${phone}\nProject type: ${projectType}\n\n${message}`;
  window.open(`https://wa.me/918123330767?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  if (status) status.textContent = "WhatsApp should open with your enquiry ready to send.";
});

const lightbox = document.querySelector("[data-lightbox]");
const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxCount = document.querySelector("[data-lightbox-count]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
let activeImage = 0;
let lightboxReturnFocus = null;

const renderLightbox = () => {
  const item = galleryItems[activeImage];
  if (!item || !lightboxImage || !lightboxTitle || !lightboxCaption || !lightboxCount) return;
  const title = item.dataset.title || "RAM Art Studio artwork";
  lightboxImage.src = item.dataset.src || "";
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxCaption.textContent = title;
  lightboxCount.textContent = `${activeImage + 1} / ${galleryItems.length}`;
};

const openLightbox = (index) => {
  if (!lightbox) return;
  activeImage = index;
  lightboxReturnFocus = document.activeElement;
  renderLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  if (galleryItems.length < 2) {
    if (lightboxPrev) lightboxPrev.hidden = true;
    if (lightboxNext) lightboxNext.hidden = true;
  }
  window.setTimeout(() => lightboxClose?.focus(), reducedMotion ? 0 : 250);
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) lightboxImage.src = "";
  if (lightboxReturnFocus instanceof HTMLElement) lightboxReturnFocus.focus();
};

const changeImage = (direction) => {
  if (galleryItems.length < 2) return;
  activeImage = (activeImage + direction + galleryItems.length) % galleryItems.length;
  renderLightbox();
};

galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => changeImage(-1));
lightboxNext?.addEventListener("click", () => changeImage(1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox?.classList.contains("open")) closeLightbox();
    else if (menu?.classList.contains("open")) setMenu(false);
  }
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "ArrowLeft") changeImage(-1);
  if (event.key === "ArrowRight") changeImage(1);
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
