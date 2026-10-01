# Car Scroll Animation Project

This project demonstrates a scroll-driven animation featuring a car moving across the screen while revealing a headline.

## 🏗️ Workspaces Architecture

This project is built using an **npm workspaces** setup. It contains two separate implementations that produce the **exact same visual output and animation**, allowing you to see how the logic translates between different tech stacks:

1. **`scroll-r` (React)**: Built with React, TypeScript, and Vite.
2. **`scroll-n` (Native)**: Built with pure HTML, CSS, and Vanilla JavaScript (No build tools or frameworks).

---

## 🚀 How to Run

Because this is a monorepo using workspaces, you can run either project directly from this root directory, or by navigating into their respective folders.

### Running the React Version (`scroll-r`)

From the root directory:

```bash
npm run dev --workspace=scroll-r
```

Or, by navigating into the folder:

```bash
cd scroll-r
npm run dev
```

### Running the Native Version (`scroll-n`)

From the root directory:

```bash
npm run dev --workspace=scroll-n
```

Or, by navigating into the folder:

```bash
cd scroll-n
npm run dev
# (You can also just double-click index.html to view it in your browser!)
```

---

## 🧠 How It Works (The Magic Behind the Animation)

The animation is powered by **GSAP (GreenSock) & ScrollTrigger**, but the real trick is in the CSS layout. Instead of relying on complex `clip-path` calculations or masks, the layout uses a very simple and robust **Z-Index Layering System**.

### The 5 Layers (From Back to Front):

1. **`z-index: 1` (Background)**: The dark grey base background of the page.
2. **`z-index: 2` (Black Road)**: A full-width horizontal black ribbon representing the asphalt road.
3. **`z-index: 3` (Base Text)**: The "WELCOME ITZFIZZ" text sitting directly on the road. This text is styled with `color: transparent`, meaning it acts as a structural placeholder but is invisible on the black road.
4. **`z-index: 4` (Green Ribbon)**: A green `div` that starts on the left side.
   - **The Trick**: This green ribbon has `overflow: hidden`. Inside it is an exact duplicate of the "WELCOME ITZFIZZ" text, but coloured white. Because of the hidden overflow, the white text is *only* visible exactly where the green ribbon covers it!
5. **`z-index: 5` (The Car)**: The top-down car image sits on top of everything.

### The GSAP Animation:

When you scroll down the page, GSAP's `ScrollTrigger` scrubs a timeline from `0` to `1` (linked to your scroll progress). In this timeline, two things happen in **perfect lockstep**:

1. The **Car's X position** moves from the left edge of the screen to the right edge.
2. The **Green Ribbon's width** grows from `0` to the full width of the screen (`window.innerWidth`).

Because the car's center point is mathematically glued to the green ribbon's right edge, the car appears to be "painting" the green ribbon (and revealing the white text inside it) as it drives across the screen!
