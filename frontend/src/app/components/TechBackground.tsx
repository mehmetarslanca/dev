import { useEffect } from "react";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export function TechBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-[#0a0a0a] overflow-hidden">
      {/* Base Grid Pattern (Dots) */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Moving Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useMotionTemplate`radial-gradient(
            600px circle at ${mouseX}px ${mouseY}px,
            rgba(255, 77, 77, 0.08),
            transparent 80%
          )`,
        }}
      />

       {/* Secondary Subtle Texture (Scanlines) */}
       <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
    </div>
  );
}
