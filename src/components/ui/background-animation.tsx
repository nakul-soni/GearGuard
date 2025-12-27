"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      {/* 3D Perspective Grid */}
      <div 
        className="absolute inset-0" 
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d" 
        }}
      >
        <motion.div
          initial={{ rotateX: 60, y: "20%" }}
          animate={{ 
            y: ["18%", "22%", "18%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-x-[-50%] bottom-[-50%] h-[150%] opacity-[0.15] dark:opacity-[0.2]"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          }}
        />
      </div>

      {/* Depth Particles / Floating Lights */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, "-120%"],
              opacity: [0, 0.4, 0],
              x: (Math.random() - 0.5) * 20 + "%",
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-2 h-2 rounded-full bg-primary/40 blur-[2px]"
          />
        ))}
      </div>

      {/* Main Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px]"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="absolute inset-0 bg-background/20 backdrop-blur-[40px]" />
    </div>
  );
}
