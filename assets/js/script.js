document.addEventListener("DOMContentLoaded", () => {
  const setDynamicHeaderHeight = () => {
    const header = document.getElementById("header-nav");
    if (!header) return;
    document.documentElement.style.setProperty(
      "--header-height",
      `${header.offsetHeight}px`
    );
  };

  setDynamicHeaderHeight();
  window.addEventListener("load", setDynamicHeaderHeight);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setDynamicHeaderHeight, 120);
  });

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });

  // Mobile navigation
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileMenu = document.getElementById("mobileMenu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("nav-active");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("nav-active");
      });
    });
  }

  // Carousel controls
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");

    if (!track) return;
    const scrollValue = () => track.clientWidth * 0.8;

    const scrollTrack = (direction) => {
      track.scrollBy({
        left: direction * scrollValue(),
        behavior: "smooth",
      });
    };

    prev?.addEventListener("click", () => scrollTrack(-1));
    next?.addEventListener("click", () => scrollTrack(1));

    track.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        track.scrollBy({
          left: event.deltaY,
          behavior: "smooth",
        });
      },
      { passive: false }
    );

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDrag = (event) => {
      isDown = true;
      track.classList.add("dragging");
      startX = event.pageX || event.touches?.[0].pageX;
      scrollLeft = track.scrollLeft;
    };

    const endDrag = () => {
      isDown = false;
      track.classList.remove("dragging");
    };

    const moveDrag = (event) => {
      if (!isDown) return;
      const x = event.pageX || event.touches?.[0].pageX;
      const walk = (x - startX) * 1.2;
      track.scrollLeft = scrollLeft - walk;
    };

    track.addEventListener("mousedown", startDrag);
    track.addEventListener("mouseleave", endDrag);
    track.addEventListener("mouseup", endDrag);
    track.addEventListener("mousemove", moveDrag);

    track.addEventListener("touchstart", startDrag, { passive: true });
    track.addEventListener("touchend", endDrag);
    track.addEventListener("touchmove", moveDrag, { passive: true });
  });

  // Horizontal scroll for testimonials
  document.querySelectorAll(".testimonial-track").forEach((track) => {
    track.addEventListener(
      "wheel",
      (event) => {
        if (!event.deltaY) return;
        event.preventDefault();
        track.scrollBy({
          left: event.deltaY,
          behavior: "smooth",
        });
      },
      { passive: false }
    );
  });

  document.querySelectorAll("[data-testimonial-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".testimonial-track");
    const prev = carousel.querySelector("[data-testimonial-prev]");
    const next = carousel.querySelector("[data-testimonial-next]");
    if (!track) return;

    const card = track.querySelector(".testimonial-card");
    const scrollValue = () =>
      (card ? card.getBoundingClientRect().width : track.clientWidth * 0.6) + 24;

    const handleScroll = (direction) => {
      track.scrollBy({
        left: direction * scrollValue(),
        behavior: "smooth",
      });
    };

    prev?.addEventListener("click", () => handleScroll(-1));
    next?.addEventListener("click", () => handleScroll(1));
  });

  // Dynamic year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
