gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const car = document.getElementById("car");
    const ribbon = document.getElementById("ribbon");
    
    // Select all the stat cards
    const stats = [
        document.getElementById("stat-1"),
        document.getElementById("stat-2"),
        document.getElementById("stat-3"),
        document.getElementById("stat-4")
    ];

    const W = window.innerWidth;
    const carW = 302; // px at height 144px

    // Car CENTER = green ribbon RIGHT EDGE at all times.
    // Car center starts at x=0 (left screen edge) → ends at x=W (right edge).
    const carStart = -carW / 2;
    const carEnd = W - carW / 2;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.0,
        },
    });

    // Car and ribbon move in exact lockstep
    tl.fromTo(car, { x: carStart }, { x: carEnd, ease: "none" }, 0);
    tl.fromTo(ribbon, { width: 0 }, { width: W, ease: "none" }, 0);

    // Stats appear when car is at screen centre (50% progress)
    gsap.set(stats, { opacity: 0, y: 24, scale: 0.9 });
    
    gsap.to(stats, {
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, 
        stagger: 0.13, 
        ease: "power2.out",
        scrollTrigger: {
            trigger: container,
            start: "62.5% top", // 50% car progress ≈ 62.5% of 400vh container
            toggleActions: "play none none reverse",
        },
    });
});
