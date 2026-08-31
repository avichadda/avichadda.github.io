document.getElementById("year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const parallaxItems = [
  { element: document.querySelector(".portrait-wrap"), strength: 18 },
  ...Array.from(document.querySelectorAll(".project-visual"), (element) => ({
    element,
    strength: 10,
  })),
].filter(({ element }) => element);

let parallaxFrame;

function updateParallax() {
  parallaxFrame = undefined;
  const enabled = !reducedMotion.matches && window.innerWidth > 640;
  const viewportCenter = window.innerHeight / 2;

  parallaxItems.forEach(({ element, strength }) => {
    const bounds = element.getBoundingClientRect();
    const distance = (bounds.top + bounds.height / 2 - viewportCenter) / viewportCenter;
    const offset = enabled ? Math.max(-1, Math.min(1, distance)) * -strength : 0;
    element.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
  });
}

function requestParallaxUpdate() {
  if (parallaxFrame === undefined) {
    parallaxFrame = window.requestAnimationFrame(updateParallax);
  }
}

window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
reducedMotion.addEventListener("change", requestParallaxUpdate);
requestParallaxUpdate();
