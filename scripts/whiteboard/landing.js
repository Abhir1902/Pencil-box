// dotconnect-inspired scroll reveals, stats counters, smooth anchor nav.
import { saveSession } from "./session.js";

let revealObserver;
let statObserver;
let scrollSaveTimer;

export function initLanding() {
    document.body.classList.add("landing-view");
    setupRevealObserver();
    setupStatObserver();
    setupParallax();
    setupAnchorNav();
    setupScrollPersistence();

    const themeBtn = document.getElementById("Z-landing");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.getElementById("Z")?.click();
        });
    }
}

export function onLandingShown() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => replayLandingMotions());
}

export function goHome() {
    if (document.body.classList.contains("landing-view")) {
        onLandingShown();
    }
}

function setupRevealObserver() {
    const reveals = document.querySelectorAll("[data-reveal]");
    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("is-visible", entry.isIntersecting);
            });
        },
        { threshold: [0, 0.1, 0.25], rootMargin: "0px 0px -4% 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
}

function setupStatObserver() {
    const statNums = document.querySelectorAll("[data-count]");
    statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = el.dataset.count;
                if (target === "inf") {
                    el.textContent = "∞";
                } else {
                    animateCount(el, Number(target));
                }
                statObserver.unobserve(el);
            });
        },
        { threshold: 0.45 }
    );
    statNums.forEach((el) => statObserver.observe(el));
}

function replayLandingMotions() {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.remove("is-visible");
        revealObserver?.unobserve(el);
        revealObserver?.observe(el);
    });

    const hero = document.querySelector(".lp-hero");
    hero?.classList.remove("is-visible");
    requestAnimationFrame(() => hero?.classList.add("is-visible"));

    document.querySelectorAll("[data-count]").forEach((el) => {
        el.textContent = "0";
        statObserver?.unobserve(el);
        statObserver?.observe(el);
    });
}

function setupParallax() {
    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!document.body.classList.contains("landing-view")) return;
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                document
                    .querySelector(".lp-hero-grid")
                    ?.style.setProperty("--scroll-y", `${y * 0.22}px`);
                ticking = false;
            });
        },
        { passive: true }
    );
}

function setupScrollPersistence() {
    window.addEventListener(
        "scroll",
        () => {
            if (!document.body.classList.contains("landing-view")) return;
            if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
            scrollSaveTimer = setTimeout(() => {
                scrollSaveTimer = null;
                saveSession({ landingScrollY: window.scrollY });
            }, 150);
        },
        { passive: true }
    );

    window.addEventListener("beforeunload", () => {
        if (document.body.classList.contains("landing-view")) {
            saveSession({ landingScrollY: window.scrollY });
        }
    });
}

function setupAnchorNav() {
    document.querySelectorAll('.landing-nav-links a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href").slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function animateCount(el, target) {
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}
