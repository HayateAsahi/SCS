document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const storySequence = document.querySelector(".story-sequence");
  const storyPanels = storySequence
    ? [...storySequence.querySelectorAll(".story-sequence__panel")]
    : [];
  const desktopStory = window.matchMedia("(min-width: 1025px)");
  let storyFrame = 0;
  let activeStoryIndex = -1;

  const toggleHeader = () => {
    if (window.scrollY > 80) {
      header.classList.add("site-header--scrolled");
    } else {
      header.classList.remove("site-header--scrolled");
    }
  };

  toggleHeader();

  window.addEventListener("scroll", toggleHeader);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const clearStoryStyles = () => {
    storyPanels.forEach((panel) => {
      panel.classList.remove("is-active", "is-exit", "is-next");
      panel.style.removeProperty("opacity");
      panel.style.removeProperty("transform");
      panel.style.removeProperty("z-index");
    });
    activeStoryIndex = -1;
  };

  const setActiveStoryPanel = (nextIndex) => {
    const safeIndex = clamp(nextIndex, 0, storyPanels.length - 1);

    if (safeIndex === activeStoryIndex) {
      return;
    }

    storyPanels.forEach((panel, index) => {
      panel.classList.remove("is-active", "is-exit", "is-next");

      if (index === safeIndex) {
        panel.classList.add("is-active");
      } else if (index < safeIndex) {
        panel.classList.add("is-exit");
      } else {
        panel.classList.add("is-next");
      }
    });

    activeStoryIndex = safeIndex;
  };

  const updateStorySequence = () => {
    storyFrame = 0;

    if (!storySequence || !storyPanels.length || !desktopStory.matches) {
      clearStoryStyles();
      return;
    }

    const sequenceTop = storySequence.getBoundingClientRect().top + window.scrollY;
    const rawScroll = window.scrollY - sequenceTop;
    const scrollPerPanel = window.innerHeight;
    const nextIndex = clamp(
      Math.floor(rawScroll / scrollPerPanel),
      0,
      storyPanels.length - 1
    );

    setActiveStoryPanel(nextIndex);
  };

  const requestStoryUpdate = () => {
    if (!storyFrame) {
      storyFrame = window.requestAnimationFrame(updateStorySequence);
    }
  };

  updateStorySequence();
  window.addEventListener("scroll", requestStoryUpdate, { passive: true });
  window.addEventListener("resize", requestStoryUpdate);
  desktopStory.addEventListener("change", updateStorySequence);
});
