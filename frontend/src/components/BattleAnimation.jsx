import React, { useEffect, useRef, useState } from "react";

export default function BattleAnimation({
  from,
  to,
  count = 3,
  interval = 2000,
  color = "#c69d4a",
  onDone = () => {}
}) {
  const mounted = useRef(true);
  const timers = useRef([]);
  const [burst, setBurst] = useState({ id: 0, particles: [], started: false });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(t => clearTimeout(t));
      timers.current = [];
      onDone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!from || !to || typeof from.x !== "number" || typeof to.x !== "number") return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const perpX = -dy / dist;
  const perpY = dx / dist;

  const makeParticles = () =>
    new Array(count).fill(0).map((_, i) => {
      const delay = Math.floor(Math.random() * 40);
      const dur = 110 + Math.floor(Math.random() * 100);
      const width = 2;
      const height = 1;
      const lateral = (Math.random() - 0.5) * 3;
      const fade = 0.85 + Math.random() * 0.15;
      return { id: i, delay, dur, width, height, lateral, fade };
    });

  useEffect(() => {
    function doBurst() {
      if (!mounted.current) return;
      const id = Date.now();
      const ps = makeParticles();
      setBurst({ id, particles: ps, started: false });

      const r1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!mounted.current) return;
          setBurst(b => ({ ...b, started: true }));
        });
      });
      timers.current.push(r1);
    }

    doBurst();
    const iv = setInterval(doBurst, Math.max(2000, interval));
    timers.current.push(iv);

    return () => {
      timers.current.forEach(t => clearTimeout(t));
      clearInterval(iv);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, count, interval, color]);

  return (
    <>
      {burst.particles.map(p => {
        const tx = dx + perpX * p.lateral;
        const ty = dy + perpY * p.lateral;

        const startTransform = `translate(0px, 0px)`;
        const endTransform = `translate(${tx}px, ${ty}px)`;

        const opacityDelay = p.delay + Math.floor(p.dur * 0.75);

        const baseStyle = {
          position: "absolute",
          left: from.x,
          top: from.y,
          width: p.width,
          height: p.height,
          borderRadius: 1,
          background: color,
          boxShadow: `0 0 ${Math.max(0.5, p.width)}px rgba(255,220,120,0.18)`,
          transform: startTransform,
          pointerEvents: "none",
          zIndex: 140000,
          opacity: p.fade,
          transition: `transform ${p.dur}ms linear ${p.delay}ms, opacity 120ms linear ${opacityDelay}ms`
        };

        const applied = {
          ...baseStyle,
          transform: burst.started ? endTransform : baseStyle.transform,
          opacity: burst.started ? 0 : baseStyle.opacity
        };

        const key = `${burst.id}-${p.id}`;
        return <div key={key} style={applied} />;
      })}
    </>
  );
}