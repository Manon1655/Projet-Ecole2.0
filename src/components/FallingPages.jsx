import { useEffect } from "react";

export default function FallingPages() {
  useEffect(() => {
    const canvas = document.getElementById("pagesCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pages = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 2,
      size: 20 + Math.random() * 20,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pages.forEach(p => {
        ctx.fillStyle = "rgba(255,255,240,0.6)";
        ctx.fillRect(p.x, p.y, p.size, p.size * 1.2);
        p.y += p.speed;
        if (p.y > canvas.height) p.y = -50;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas id="pagesCanvas" className="background-canvas"></canvas>;
}
