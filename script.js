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
const scrollStory = document.querySelector(".scroll-story");
const storyWords = document.querySelectorAll("[data-story-word]");
const storyNotes = document.querySelectorAll("[data-story-note]");
const storyProgress = document.querySelectorAll("[data-story-progress]");
const storyPortrait = document.querySelector(".story-portrait");
const storyCurrent = document.querySelector("[data-story-current]");
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

  if (scrollStory && enabled) {
    const storyBounds = scrollStory.getBoundingClientRect();
    const scrollableDistance = storyBounds.height - window.innerHeight;
    const progress = Math.max(0, Math.min(1, -storyBounds.top / scrollableDistance));
    const activeStory = Math.min(storyWords.length - 1, Math.floor(progress * storyWords.length));

    storyWords.forEach((word, index) => word.classList.toggle("is-active", index === activeStory));
    storyNotes.forEach((note, index) => note.classList.toggle("is-active", index === activeStory));
    storyProgress.forEach((item, index) => item.classList.toggle("is-active", index <= activeStory));
    storyCurrent.textContent = String(activeStory + 1).padStart(2, "0");
    storyPortrait.style.setProperty("--story-scale", (.78 + progress * .18).toFixed(3));
    storyPortrait.style.setProperty("--story-rotate", `${(-4 + progress * 8).toFixed(2)}deg`);
  }

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
