import { useEffect, useRef } from "react";

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  width: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: number; // 0=oval, 1=maple-ish, 2=long narrow, 3=round
}

const LEAF_COLORS = [
  "#2d6a4f",
  "#40916c",
  "#52b788",
  "#74c69d",
  "#1b4332",
  "#4a7c59",
  "#6dae81",
  "#3d8b57",
  "#27ae60",
  "#1e8449",
  "#145a32",
  "#a9dfbf",
];

const LEAF_VEIN_COLORS = [
  "rgba(10,60,30,0.35)",
  "rgba(10,60,30,0.3)",
  "rgba(20,80,40,0.25)",
  "rgba(0,40,20,0.3)",
];

function drawOvalLeaf(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  veinColor: string
) {
  // Main leaf shape
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(
    size * 0.55, -size * 0.7,
    size * 0.75, size * 0.1,
    0, size * 0.9
  );
  ctx.bezierCurveTo(
    -size * 0.75, size * 0.1,
    -size * 0.55, -size * 0.7,
    0, -size
  );
  ctx.fillStyle = color;
  ctx.fill();

  // Highlight sheen
  ctx.beginPath();
  ctx.moveTo(-size * 0.15, -size * 0.7);
  ctx.bezierCurveTo(-size * 0.05, -size * 0.4, -size * 0.1, size * 0.0, -size * 0.2, size * 0.2);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = size * 0.18;
  ctx.lineCap = "round";
  ctx.stroke();

  // Center vein
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.85);
  ctx.bezierCurveTo(size * 0.05, 0, -size * 0.05, size * 0.4, 0, size * 0.85);
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = size * 0.065;
  ctx.lineCap = "round";
  ctx.stroke();

  // Side veins
  for (let i = 1; i <= 4; i++) {
    const t = i / 5;
    const mx = 0;
    const my = -size + t * size * 1.7;
    const angle = 0.45;
    const len = size * (0.35 - t * 0.06);
    // right
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.quadraticCurveTo(
      mx + Math.cos(angle) * len * 0.6,
      my + Math.sin(angle) * len * 0.5,
      mx + Math.cos(angle) * len,
      my + Math.sin(angle) * len
    );
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = size * 0.028;
    ctx.stroke();
    // left
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.quadraticCurveTo(
      mx - Math.cos(angle) * len * 0.6,
      my + Math.sin(angle) * len * 0.5,
      mx - Math.cos(angle) * len,
      my + Math.sin(angle) * len
    );
    ctx.stroke();
  }
}

function drawNarrowLeaf(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  veinColor: string
) {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.28, -size * 0.4, size * 0.28, size * 0.4, 0, size);
  ctx.bezierCurveTo(-size * 0.28, size * 0.4, -size * 0.28, -size * 0.4, 0, -size);
  ctx.fillStyle = color;
  ctx.fill();

  // Sheen
  ctx.beginPath();
  ctx.moveTo(-size * 0.06, -size * 0.75);
  ctx.bezierCurveTo(-size * 0.02, -size * 0.2, -size * 0.04, size * 0.1, -size * 0.1, size * 0.3);
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = "round";
  ctx.stroke();

  // Center vein
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.9);
  ctx.lineTo(0, size * 0.9);
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = size * 0.055;
  ctx.lineCap = "round";
  ctx.stroke();

  // Side veins
  for (let i = 1; i <= 5; i++) {
    const t = i / 6;
    const my = -size + t * size * 1.8;
    const len = size * (0.18 - t * 0.02);
    ctx.beginPath();
    ctx.moveTo(0, my);
    ctx.lineTo(len, my + len * 0.4);
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = size * 0.022;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, my);
    ctx.lineTo(-len, my + len * 0.4);
    ctx.stroke();
  }
}

function drawRoundLeaf(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  veinColor: string
) {
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.1);
  // Three-lobed simple leaf
  ctx.bezierCurveTo(size * 0.1, -size, size * 0.8, -size * 0.9, size * 0.7, -size * 0.2);
  ctx.bezierCurveTo(size * 1.0, -size * 0.3, size * 0.9, size * 0.4, size * 0.3, size * 0.5);
  ctx.bezierCurveTo(size * 0.15, size * 0.9, -size * 0.15, size * 0.9, -size * 0.3, size * 0.5);
  ctx.bezierCurveTo(-size * 0.9, size * 0.4, -size * 1.0, -size * 0.3, -size * 0.7, -size * 0.2);
  ctx.bezierCurveTo(-size * 0.8, -size * 0.9, -size * 0.1, -size, 0, -size * 0.1);
  ctx.fillStyle = color;
  ctx.fill();

  // Sheen
  ctx.beginPath();
  ctx.moveTo(size * 0.05, -size * 0.55);
  ctx.bezierCurveTo(size * 0.2, -size * 0.2, size * 0.25, size * 0.1, size * 0.1, size * 0.3);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = size * 0.2;
  ctx.lineCap = "round";
  ctx.stroke();

  // Center + side veins
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.05);
  ctx.bezierCurveTo(size * 0.05, size * 0.2, size * 0.02, size * 0.4, 0, size * 0.6);
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = size * 0.07;
  ctx.lineCap = "round";
  ctx.stroke();

  // right vein
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.05);
  ctx.bezierCurveTo(size * 0.3, -size * 0.5, size * 0.55, -size * 0.4, size * 0.6, -size * 0.15);
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = size * 0.05;
  ctx.stroke();

  // left vein
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.05);
  ctx.bezierCurveTo(-size * 0.3, -size * 0.5, -size * 0.55, -size * 0.4, -size * 0.6, -size * 0.15);
  ctx.stroke();
}

function drawMapleLeaf(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  veinColor: string
) {
  // Simplified 5-point maple-ish shape
  const points = 5;
  ctx.beginPath();
  for (let p = 0; p < points; p++) {
    const outerAngle = (p / points) * Math.PI * 2 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / points;
    const ox = Math.cos(outerAngle) * size;
    const oy = Math.sin(outerAngle) * size;
    const ix = Math.cos(innerAngle) * size * 0.4;
    const iy = Math.sin(innerAngle) * size * 0.4;
    if (p === 0) ctx.moveTo(ox, oy);
    else ctx.lineTo(ox, oy);
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Sheen
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, -size * 0.5);
  ctx.bezierCurveTo(-size * 0.02, -size * 0.15, size * 0.02, size * 0.1, -size * 0.05, size * 0.25);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = size * 0.16;
  ctx.lineCap = "round";
  ctx.stroke();

  // Veins radiating from center
  for (let p = 0; p < points; p++) {
    const angle = (p / points) * Math.PI * 2 - Math.PI / 2;
    const ox = Math.cos(angle) * size * 0.75;
    const oy = Math.sin(angle) * size * 0.75;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ox, oy);
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = size * 0.045;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

export default function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const rainDrops: RainDrop[] = [];
    const leaves: Leaf[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const initRain = () => {
      rainDrops.length = 0;
      for (let i = 0; i < 180; i++) {
        rainDrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 6 + Math.random() * 8,
          length: 15 + Math.random() * 25,
          opacity: 0.08 + Math.random() * 0.22,
          width: 0.5 + Math.random() * 1,
        });
      }
    };

    const initLeaves = () => {
      leaves.length = 0;
      for (let i = 0; i < 22; i++) {
        leaves.push(createLeaf(canvas.width, canvas.height, true));
      }
    };

    const createLeaf = (
      width: number,
      height: number,
      randomY = false
    ): Leaf => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -80,
      size: 10 + Math.random() * 22,
      speed: 0.5 + Math.random() * 1.0,
      sway: 35 + Math.random() * 55,
      swaySpeed: 0.25 + Math.random() * 0.55,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.6 + Math.random() * 0.35,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      type: Math.floor(Math.random() * 4),
    });

    let time = 0;

    const drawLeaf = (leaf: Leaf) => {
      const veinColor = LEAF_VEIN_COLORS[leaf.type % LEAF_VEIN_COLORS.length];

      ctx.save();
      ctx.translate(
        leaf.x + Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.sway,
        leaf.y
      );
      ctx.rotate(leaf.rotation);
      ctx.globalAlpha = leaf.opacity;

      // Drop shadow for depth
      ctx.shadowColor = "rgba(0,30,10,0.35)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      switch (leaf.type) {
        case 0: drawOvalLeaf(ctx, leaf.size, leaf.color, veinColor); break;
        case 1: drawMapleLeaf(ctx, leaf.size, leaf.color, veinColor); break;
        case 2: drawNarrowLeaf(ctx, leaf.size, leaf.color, veinColor); break;
        case 3: drawRoundLeaf(ctx, leaf.size, leaf.color, veinColor); break;
        default: drawOvalLeaf(ctx, leaf.size, leaf.color, veinColor);
      }

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw rain
      ctx.lineCap = "round";
      rainDrops.forEach((drop) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(147, 210, 230, ${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 2, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      // Draw leaves
      leaves.forEach((leaf, i) => {
        drawLeaf(leaf);
        leaf.y += leaf.speed;
        leaf.rotation += leaf.rotationSpeed;

        if (leaf.y > canvas.height + 100) {
          leaves[i] = createLeaf(canvas.width, canvas.height, false);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    initRain();
    initLeaves();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
