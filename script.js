// Register ScrollTrigger (needed for Point 3, but good practice to register early)
gsap.registerPlugin(ScrollTrigger);

// Point 2: Initial Load Animation
document.addEventListener("DOMContentLoaded", () => {
    // Set initial states to prevent Flash of Unstyled Content (FOUC)
    gsap.set(".headline", { y: 30, opacity: 0 });
    gsap.set(".metric", { y: 20, opacity: 0 });
    gsap.set(".main-visual", { y: 150, opacity: 0, scale: 0.95 });

    // Create a timeline for the initial load
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Headline appears smoothly (fade + slight upward movement)
    tl.to(".headline", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.2
    })
    // 2. Statistics animate in one by one with a subtle delay (staggered reveal)
    .to(".metric", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2
    }, "-=0.6") // Start slightly before headline finishes
    
    // 3. The main visual element fades in gracefully
    .to(".main-visual", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out"
    }, "-=0.8");
    // --- Point 3: Scroll-Based Animation (Core Feature) ---
    // This connects the animation to the page scroll progress (scrub)
    // We will pin the hero section while the user scrolls, making the car scale up and come closer,
    // while the headline and metrics fade out smoothly.
    const scrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero",
            start: "top top", // When top of hero hits top of viewport
            end: "+=150%",    // Animation duration relative to scroll distance (1.5x screen height)
            scrub: 1,         // Smooth scrubbing with 1 second catch-up
            pin: true         // Pin the section so it stays on screen during the animation
        }
    });

    scrollTl
        // Fade out and move up the text content
        .to("#hero-content", {
            y: -150,
            opacity: 0,
            duration: 1,
            ease: "power1.inOut"
        }, 0)
        // Simultaneously scale up and move the car so it feels like it's driving towards the user
        .to(".main-visual", {
            scale: 2.2,
            y: 100,
            transformOrigin: "center bottom",
            duration: 2,
            ease: "power1.inOut"
        }, 0);
});
