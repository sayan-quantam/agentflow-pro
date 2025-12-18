import { useEffect, useRef } from "react";

interface BackgroundAnimationProps {
  variant?: "mesh" | "grid" | "particles" | "gradient";
  className?: string;
}

export function BackgroundAnimation({ 
  variant = "mesh", 
  className = "" 
}: BackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant !== "particles") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(217, 91%, 60%, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(217, 91%, 60%, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [variant]);

  if (variant === "particles") {
    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-0 ${className}`}
        style={{ opacity: 0.6 }}
      />
    );
  }

  if (variant === "gradient") {
    return (
      <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
        {/* Animated gradient orbs */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.4) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div 
          className="absolute top-1/3 -left-20 w-72 h-72 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(190 95% 45% / 0.4) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div 
          className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, hsl(280 85% 60% / 0.3) 0%, transparent 70%)",
            animation: "float 12s ease-in-out infinite",
          }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, hsl(160 84% 45% / 0.3) 0%, transparent 70%)",
            animation: "float 9s ease-in-out infinite reverse",
          }}
        />
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>
    );
  }

  // Default: mesh
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <div className="absolute inset-0 bg-mesh" />
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{
          background: "hsl(217 91% 60% / 0.15)",
          animation: "float 15s ease-in-out infinite",
        }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "hsl(190 95% 45% / 0.12)",
          animation: "float 18s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}
