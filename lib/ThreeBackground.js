import { useEffect, useRef } from 'react';

// Premium canvas background: diagonal light beam + particles + grain
export default function ThreeBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.35 + 0.1,
    }));

    const noise = () => {
      const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const p = id.data;
      for (let i = 0; i < p.length; i += 4) {
        const n = (Math.random() - 0.5) * 12;
        p[i] += n; p[i + 1] += n; p[i + 2] += n;
      }
      ctx.putImageData(id, 0, 0);
    };

    const render = () => {
      // background gradient
      const g = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.25,
        0,
        canvas.width * 0.5,
        canvas.height * 0.25,
        canvas.width * 0.9
      );
      g.addColorStop(0, '#0a0e1a');
      g.addColorStop(0.6, '#050810');
      g.addColorStop(1, '#000');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // diagonal beam
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const lg = ctx.createLinearGradient(canvas.width * 0.1, 0, canvas.width * 0.9, canvas.height);
      lg.addColorStop(0, 'rgba(30,80,180,0.25)');
      lg.addColorStop(0.5, 'rgba(60,120,220,0.1)');
      lg.addColorStop(1, 'rgba(20,60,150,0.06)');
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        glow.addColorStop(0, `rgba(160,200,255,${p.o * 0.4})`);
        glow.addColorStop(1, 'rgba(60,100,180,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - p.r * 8, p.y - p.r * 8, p.r * 16, p.r * 16);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${p.o})`;
        ctx.fill();
      });

      ctx.save();
      ctx.globalAlpha = 0.025; noise(); ctx.restore();
      requestAnimationFrame(render);
    };
    render();

    return () => window.removeEventListener('resize', setSize);
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-10 w-full h-full" />;
}

