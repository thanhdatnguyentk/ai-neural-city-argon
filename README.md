# AI Neural City — Inside the Neural City

An interactive isometric 3D city that visualizes how an artificial intelligence system works. Each district represents one part of an AI pipeline, and glowing data particles travel between districts to show how information moves through the system.

## Architecture & Districts

1. **Input Gateway** — Receives text, images, video, or other data and normalizes incoming payloads.
2. **Data Lake** — Stores, indexes, and organizes incoming data into structured reservoirs.
3. **Computer Vision District** — Analyzes visual information through layered convolutional filters.
4. **NLP District** — Processes language and text into numerical token embeddings.
5. **Training Cluster** — High-density GPU towers that train AI models via parallel matrix math.
6. **Model Core** — The central multi-head attention neural network that connects the system.
7. **Inference Center** — Runs a trained model at ultra-low latency to produce a prediction or response.
8. **Output Terminal** — Formats and displays the final result to the user.

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **3D Engine**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **UI & Transitions**: Tailwind CSS, Framer Motion, Lucide Icons
- **Fallback & Accessibility**: Automatic 2D Isometric SVG Schematic fallback when WebGL is unavailable or when 2D Lite mode is toggled; full keyboard navigation (`1–8`, `R`, `Esc`) and `prefers-reduced-motion` support.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```
