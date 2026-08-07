/* =========================================================================
   Ranky AI — landing page behaviour
   No dependencies. Everything here is progressive enhancement: with JS
   disabled the page is fully readable and fully visible.
   ========================================================================= */

(function () {
  "use strict";

  var root = document.documentElement;

  /* --- Motion gate ----------------------------------------------------
     Animations are opt-in: CSS only animates under [data-motion="on"], so
     visitors who asked for reduced motion (and anyone without JS) get the
     finished page immediately instead of empty, un-revealed sections.
     -------------------------------------------------------------------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var animate = !reduced.matches;

  if (animate) {
    root.setAttribute("data-motion", "on");
  }

  // Honour a mid-visit change to the OS setting.
  var onPrefChange = function () {
    if (reduced.matches) {
      root.removeAttribute("data-motion");
    } else {
      root.setAttribute("data-motion", "on");
    }
  };

  if (typeof reduced.addEventListener === "function") {
    reduced.addEventListener("change", onPrefChange);
  }

  /* --- Tools marquee --------------------------------------------------
     The CSS slides the track by exactly one group width, so the loop is
     only seamless with three identical groups. Clone them here rather
     than triplicating the markup — and keep the copies out of the
     accessibility tree and out of the tab order.
     -------------------------------------------------------------------- */

  var marqueeTrack = document.querySelector(".marquee__track");

  if (animate && marqueeTrack && marqueeTrack.children.length === 1) {
    var group = marqueeTrack.firstElementChild;

    for (var copy = 0; copy < 2; copy++) {
      var clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a").forEach(function (link) {
        link.tabIndex = -1;
      });
      marqueeTrack.appendChild(clone);
    }
  }

  /* =====================================================================
     Book-a-demo dialog
     ===================================================================== */

  var demo = document.getElementById("demo");
  var demoForm = document.getElementById("demo-form");
  var demoDone = demo.querySelector(".modal__done");
  var demoError = demo.querySelector(".modal__error");
  var demoSubmit = demo.querySelector(".modal__submit");
  var canDialog = typeof demo.showModal === "function";

  /* ---------------------------------------------------------------------
     TODO: point this at your real endpoint. Everything else in the flow
     (validation, pending state, success panel, error panel) already works
     against the promise this returns.

       return fetch("/api/demo-requests", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       }).then(function (res) {
         if (!res.ok) throw new Error("Request failed");
       });

     Until then it resolves after a short delay so the UI is complete.
     --------------------------------------------------------------------- */
  function submitDemoRequest(payload) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        // eslint-disable-next-line no-console
        console.info("[demo request]", payload);
        resolve();
      }, 700);
    });
  }

  function openDemo() {
    demo.showModal();
    document.body.classList.add("modal-open");

    var first = demoForm.hidden
      ? demoDone.querySelector(".modal__title")
      : demoForm.querySelector("input");

    if (first) first.focus();
  }

  function closeDemo() {
    demo.close();
  }

  demo.addEventListener("close", function () {
    document.body.classList.remove("modal-open");
  });

  document.querySelectorAll("[data-demo]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      // Without <dialog> support the href="#demo" fallback takes over.
      if (!canDialog) return;
      event.preventDefault();
      openDemo();
    });
  });

  demo.querySelectorAll("[data-demo-close]").forEach(function (button) {
    button.addEventListener("click", closeDemo);
  });

  // A click that lands on the dialog itself is a click on the backdrop.
  demo.addEventListener("click", function (event) {
    if (event.target === demo) closeDemo();
  });

  demoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // novalidate keeps the browser quiet until submit, then we ask for it.
    if (!demoForm.checkValidity()) {
      demoForm.reportValidity();
      return;
    }

    var data = new FormData(demoForm);
    var payload = {
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      website: data.get("website"),
      note: data.get("note"),
    };

    demoError.hidden = true;
    demoSubmit.disabled = true;
    demoSubmit.querySelector("span").textContent = "Sending…";

    submitDemoRequest(payload)
      .then(function () {
        demo.querySelector("[data-demo-email]").textContent = payload.email;
        demoForm.hidden = true;
        demoDone.hidden = false;
        demoDone.querySelector(".modal__title").focus();
      })
      .catch(function () {
        demoError.textContent =
          "Something went wrong sending that. Please try again, or email us directly.";
        demoError.hidden = false;
        demoSubmit.disabled = false;
        demoSubmit.querySelector("span").textContent = "Request demo";
      });
  });

  // Deep link: /landing/#demo opens the dialog rather than the inline fallback.
  if (canDialog && window.location.hash === "#demo") {
    openDemo();
    window.history.replaceState(null, "", window.location.pathname);
  }

  /* --- Nav: hairline + blur once scrolled off the hero ---------------- */

  var nav = document.getElementById("nav");
  var ticking = false;

  function syncNav() {
    nav.classList.toggle("is-stuck", window.scrollY > 24);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncNav);
      }
    },
    { passive: true }
  );

  syncNav();

  /* --- Scroll-spy: highlight the current section's nav link ----------- */

  var navLinks = document.querySelectorAll(".nav__link");
  var spySections = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) spySections.push(section);
  });

  if (spySections.length && "IntersectionObserver" in window) {
    var setActiveLink = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      // A thin band just above the viewport's middle — whichever section is
      // crossing it counts as "current", the usual scroll-spy trick.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    spySections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* --- Scroll reveals -------------------------------------------------
     One observer drives three things:
       .reveal  → fade-up (staggered by its own --i)
       .mock    → gauge ring + sparkline draw-on
       .pipe    → the eight pipeline nodes light up in sequence
     -------------------------------------------------------------------- */

  var targets = document.querySelectorAll(".reveal, .mock, .flow, .sprawl, .pipe");

  if (!animate || !("IntersectionObserver" in window)) {
    // Static fallback: mark everything visible so nothing is left hidden.
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll(".node").forEach(function (el) {
      el.classList.add("is-lit");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        el.classList.add("is-visible");

        if (el.classList.contains("pipe")) {
          el.querySelectorAll(".node").forEach(function (node) {
            node.classList.add("is-lit");
          });
        }

        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
