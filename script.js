(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.querySelector(".loader");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const progressBar = document.querySelector(".scroll-progress span");
  const cursor = document.querySelector(".cursor");
  const projectDialog = document.querySelector(".project-dialog");
  const dialogTitle = document.querySelector("#dialog-title");
  const dialogDescription = document.querySelector(".dialog-description");
  const dialogTags = document.querySelector(".dialog-tags");

  const projects = {
    healthcare: {
      title: "Healthcare Analytics Dashboard",
      description: "A dashboard project theme focused on exploring healthcare data and presenting observations through a clear visual overview.",
      tags: ["Power BI", "Dashboard", "Healthcare"]
    },
    excel: {
      title: "Excel Interactive Dashboard",
      description: "An interactive reporting project theme using spreadsheet tools to organize data and make information easier to explore.",
      tags: ["Microsoft Excel", "Dashboard", "Reporting"]
    },
    python: {
      title: "Python Data Analysis",
      description: "A data exploration project theme using Python to inspect a dataset, work through questions and communicate observations.",
      tags: ["Python", "Pandas", "Exploration"]
    },
    sql: {
      title: "SQL Data Exploration",
      description: "A project theme centered on querying structured data and exploring the patterns and relationships it may contain.",
      tags: ["SQL", "Data", "Exploration"]
    }
  };

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    mobileMenu.classList.toggle("is-open", !isOpen);
    mobileMenu.setAttribute("aria-hidden", String(isOpen));
    body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  if (window.lucide) window.lucide.createIcons();

  document.querySelectorAll(".project-card").forEach((card) => {
    const openProject = () => {
      const project = projects[card.dataset.project];
      if (!project) return;
      dialogTitle.textContent = project.title;
      dialogDescription.textContent = project.description;
      dialogTags.replaceChildren(...project.tags.map((tag) => {
        const element = document.createElement("span");
        element.textContent = tag;
        return element;
      }));
      projectDialog.showModal();
      body.classList.add("dialog-open");
    };
    card.querySelector(".project-image").addEventListener("click", openProject);
    card.querySelector(".project-view").addEventListener("click", openProject);
  });

  function closeDialog() {
    projectDialog.close();
    body.classList.remove("dialog-open");
  }

  projectDialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) closeDialog();
  });
  projectDialog.addEventListener("close", () => body.classList.remove("dialog-open"));

  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (supportsHover && cursor && !reducedMotion) {
    window.addEventListener("mousemove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add("is-visible");
    }, { passive: true });
    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
    document.addEventListener("mouseenter", () => cursor.classList.add("is-visible"));
  }

  function startMotion() {
    if (startMotion.hasStarted) return;
    startMotion.hasStarted = true;

    const revealIntro = () => {
      document.querySelectorAll(".hero-label, .hero-title, .hero-intro, .circle-link").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
    };

    if (reducedMotion) {
      revealIntro();
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      loader.classList.add("is-done");
      body.classList.remove("is-loading");
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      const gsap = window.gsap;
      let lenis;

      if (window.Lenis) {
        lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
        lenis.on("scroll", window.ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      const entrance = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          loader.classList.add("is-done");
          body.classList.remove("is-loading");
        }
      });
      entrance.to(".hero-image", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
        .to(".hero-label", { y: 0, opacity: 1, duration: 0.7 }, 0.28)
        .to(".hero-title", { y: 0, opacity: 1, duration: 1.05 }, 0.4)
        .to(".hero-intro", { y: 0, opacity: 1, duration: 0.7 }, 0.86)
        .to(".circle-link", { y: 0, opacity: 1, duration: 0.7 }, 1);

      gsap.utils.toArray(".display-title, .large-copy, .body-copy, .text-link, .tool-card, .project-card, .timeline-item, .gallery-heading > p, .contact-title, .contact-link").forEach((element) => {
        gsap.from(element, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true }
        });
      });

      gsap.utils.toArray(".tool-card").forEach((card, index) => {
        gsap.from(card, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          delay: (index % 3) * 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 92%", once: true }
        });
      });

      gsap.utils.toArray(".explore-row").forEach((row) => {
        window.ScrollTrigger.create({
          trigger: row,
          start: "top 78%",
          once: true,
          onEnter: () => row.classList.add("is-visible")
        });
        gsap.from(row.querySelector(".explore-detail"), {
          y: 35,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 78%", once: true }
        });
      });

      gsap.utils.toArray(".reveal-image").forEach((figure) => {
        window.ScrollTrigger.create({
          trigger: figure,
          start: "top 82%",
          once: true,
          onEnter: () => figure.classList.add("is-visible")
        });
      });

      gsap.utils.toArray(".project-image img, .gallery-item img").forEach((image) => {
        gsap.fromTo(image, { yPercent: -4, scale: 1.08 }, {
          yPercent: 4,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.5 }
        });
      });

      const heroImage = document.querySelector(".hero-image");
      gsap.to(heroImage, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 }
      });

      window.addEventListener("beforeunload", () => {
        if (lenis) lenis.destroy();
      }, { once: true });
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealIntro();
    document.querySelectorAll(".explore-row, .reveal-image, .display-title, .large-copy, .body-copy, .text-link, .tool-card, .project-card, .timeline-item").forEach((element) => revealObserver.observe(element));
    loader.classList.add("is-done");
    body.classList.remove("is-loading");
  }

  body.classList.add("is-loading");
  body.classList.add("js-ready");
  if (document.readyState === "complete") {
    startMotion();
  } else {
    window.addEventListener("load", startMotion, { once: true });
    window.setTimeout(startMotion, 2500);
  }
})();
