(function () {
  "use strict";

  // Mobile nav
  const burger = document.querySelector("[data-burger]");
  const navlinks = document.querySelector("[data-navlinks]");
  if (burger && navlinks) {
    burger.addEventListener("click", () => {
      const open = navlinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // close menu on click
    navlinks.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.tagName === "A") {
        navlinks.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Active nav highlighting (simple by path)
  const path = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll("[data-nav] a").forEach(a => {
    const href = (a.getAttribute("href") || "").replace(/\/+$/, "") || "/";
    if (href !== "/" && path.startsWith(href)) a.classList.add("active");
    if (href === "/" && path === "/") a.classList.add("active");
  });

  // Carousel (only on pages that include it)
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const slidesEl = carousel.querySelector("[data-slides]");
  const dotWrap = carousel.querySelector("[data-dots]");
  const prevBtn = carousel.querySelector("[data-prev]");
  const nextBtn = carousel.querySelector("[data-next]");
  const autoplay = carousel.getAttribute("data-autoplay") === "true";
  const intervalMs = parseInt(carousel.getAttribute("data-interval") || "5000", 10);

  if (!slidesEl) return;

  const slides = Array.from(slidesEl.querySelectorAll(".slide"));
  if (slides.length === 0) return;

  let index = 0;
  let timer = null;

  function renderDots() {
    if (!dotWrap) return;
    dotWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "dotBtn" + (i === index ? " active" : "");
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i, true));
      dotWrap.appendChild(b);
    });
  }

  function update() {
    slidesEl.style.transform = `translateX(${-index * 100}%)`;
    if (dotWrap) {
      dotWrap.querySelectorAll(".dotBtn").forEach((b, i) => {
        b.classList.toggle("active", i === index);
      });
    }
  }

  function goTo(i, userAction) {
    index = (i + slides.length) % slides.length;
    update();
    if (userAction) restartAutoplay();
  }

  function next(userAction) { goTo(index + 1, userAction); }
  function prev(userAction) { goTo(index - 1, userAction); }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function startAutoplay() {
    if (!autoplay || slides.length < 2) return;
    stopAutoplay();
    timer = setInterval(() => next(false), Math.max(2000, intervalMs));
  }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  if (prevBtn) prevBtn.addEventListener("click", () => prev(true));
  if (nextBtn) nextBtn.addEventListener("click", () => next(true));

  // pause on hover/focus
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  // init
  renderDots();
  update();
  startAutoplay();
})();
