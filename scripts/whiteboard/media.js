// Product demo videos + placeholder fallback for landing page media.
export function initProductMedia() {
    document.querySelectorAll(".lp-media").forEach((wrap) => {
        const video = wrap.querySelector(".lp-demo-video");
        if (!video) return;

        const showPlaceholder = () => {
            wrap.classList.add("is-placeholder");
            video.remove();
        };

        video.addEventListener("error", showPlaceholder);

        video.addEventListener("loadeddata", () => {
            wrap.classList.remove("is-placeholder");
            video.play().catch(() => {});
        });

        if (video.error) {
            showPlaceholder();
        }
    });

    const mediaObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const video = entry.target.querySelector(".lp-demo-video");
                if (!video) return;
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        },
        { threshold: 0.25 }
    );
    document.querySelectorAll(".lp-media").forEach((el) => mediaObserver.observe(el));
}
