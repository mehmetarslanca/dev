import { useEffect, useRef } from "react";

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Grid configuration
    const spacing = 40;
    const points: {
        x: number;
        y: number;
        originX: number;
        originY: number;
        vx: number;
        vy: number;
    }[] = [];

    // Mouse configuration
    const mouse = { x: -1000, y: -1000 };
    const radius = 120; // Reduced interaction radius (was 300)

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      points.length = 0;
      for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
          points.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    // Physics constants (Fine-tuned)
    const friction = 0.92; // Higher friction for fluid drift (was 0.9)
    const ease = 0.06;    // Lower ease for softer/organic snaps (was 0.1)
    const forceFactor = 2.5; // Reduced strength (was 8)

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Logic
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";

      points.forEach((point) => {
        // Calculate distance to mouse
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let tx = point.originX;
        let ty = point.originY;

        // Interaction: Repel from mouse
        if (distance < radius) {
          // Cubic falloff for "Balanced Displacement"
          // Center is strong, edges are very subtle
          const rawForce = (radius - distance) / radius;
          const force = rawForce * rawForce * rawForce;

          const angle = Math.atan2(dy, dx);

          // "Space-Time" Warp: Push away
          tx = point.originX - Math.cos(angle) * force * spacing * forceFactor;
          ty = point.originY - Math.sin(angle) * force * spacing * forceFactor;
        }

        // Spring physics to return to target (tx, ty)
        const ax = (tx - point.x) * ease;
        const ay = (ty - point.y) * ease;

        point.vx += ax;
        point.vy += ay;
        point.vx *= friction;
        point.vy *= friction;

        point.x += point.vx;
        point.y += point.vy;

        // Draw Point
        ctx.beginPath();
        // Dynamic size based on velocity (optional "energy" effect) or distance
        const size = distance < radius ? 2 : 1.5;

        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Optional: Draw connecting lines if very close (web effect)
        // But requested was "dot/grid pattern", simple distortion is cleaner.
      });

      animationId = requestAnimationFrame(animate);
    };

    init();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-[#0a0a0a]">
       <canvas ref={canvasRef} className="block w-full h-full" />
       {/* Removed the previous overlay divs to let canvas handle everything */}
    </div>
  );
}
