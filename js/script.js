document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const storySequence = document.querySelector(".story-sequence");
  const storyPanels = storySequence
    ? [...storySequence.querySelectorAll(".story-sequence__panel")]
    : [];
  const contactSection = document.querySelector(".contact");
  const consultationButtons = [
    ...document.querySelectorAll(
      ".site-header__consultation-button, .hero__consultation-button, .proposal__button, .consultation__button, .footer-cta__button, .site-footer__consultation-button"
    ),
  ];
  const desktopStory = window.matchMedia("(min-width: 769px)");
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

  if (hero) {
    window.requestAnimationFrame(() => {
      hero.classList.add("is-loaded");
    });
  }

  const scrollToContact = (event) => {
    if (!contactSection) {
      return;
    }

    event.preventDefault();

    const headerHeight = header?.offsetHeight || 0;
    const contactTop =
      contactSection.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: contactTop,
      behavior: "smooth",
    });
  };

  consultationButtons.forEach((button) => {
    button.addEventListener("click", scrollToContact);
  });

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

  const revealSelectors = [
    ".story-cover__heading",
    ".story-cover__lead",
    ".story-cover__bottom-image",
    ".supply-chain-risk__heading",
    ".supply-chain-risk__introduction",
    ".supply-chain-risk__diagram",
    ".supply-chain-risk__impact-box",
    ".supply-chain-risk__conclusion",
    ".scs-overview__heading",
    ".scs-overview__description",
    ".scs-overview__scope",
    ".scs-overview__note",
    ".security-action__heading",
    ".security-action__lead",
    ".security-action__diagram",
    ".preparation__heading",
    ".preparation__subheading",
    ".preparation__question-card--security-status",
    ".preparation__question-card--scs-status",
    ".preparation__down-arrow",
    ".preparation__issues-box",
    ".preparation__conclusion",
    ".concerns__heading",
    ".concerns__conclusion",
    ".support__heading",
    ".support__introduction",
    ".support__subheading",
    ".proposal__heading",
    ".proposal__description",
    ".proposal__conclusion",
    ".proposal__button",
    ".benefits__heading",
    ".recommended__heading",
    ".consultation__heading",
    ".consultation__button",
    ".contact__heading",
    ".contact__lead",
    ".contact__form--1",
    ".site-footer__company-name",
    ".site-footer__tagline",
    ".site-footer__consultation-button",
    ".site-footer__privacy-link",
  ];
  const fromRightGroups = [
    ".concerns__card-list > *",
    ".benefits__card-list > *",
    ".support-plans__card-list > *",
    ".recommended__item-list > *",
    ".consultation__benefit-list > *",
    ".support__flow--1 > article",
  ];
  const revealElements = new Set();

  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      revealElements.add(element);
    });
  });

  fromRightGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("js-scroll-reveal--from-right");
      element.style.transitionDelay = `${index * 0.12}s`;
      revealElements.add(element);
    });
  });

  revealElements.forEach((element) => {
    element.classList.add("js-scroll-reveal");
  });

  const showRevealElements = (elements) => {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    showRevealElements(revealElements);
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.18,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }
});
