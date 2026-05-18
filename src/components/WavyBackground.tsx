export function WavyBackground() {
  // Each wave is a horizontal band positioned at a different vertical % of the page.
  const waves = [
    { top: "0%",   height: "26%", anim: "animate-wave-slow-reverse",   fill: "color-mix(in oklab, oklch(0.72 0.20 50) 14%, transparent)" },
    { top: "15%",  height: "22%", anim: "animate-wave-medium",          fill: "color-mix(in oklab, oklch(0.85 0.17 90) 16%, transparent)" },
    { top: "32%",  height: "24%", anim: "animate-wave-fast-reverse",    fill: "color-mix(in oklab, oklch(0.93 0.05 60) 22%, transparent)" },
    { top: "50%",  height: "22%", anim: "animate-wave-slow",            fill: "color-mix(in oklab, oklch(0.72 0.20 50) 12%, transparent)" },
    { top: "68%",  height: "22%", anim: "animate-wave-medium-reverse",  fill: "color-mix(in oklab, oklch(0.85 0.17 90) 18%, transparent)" },
    { top: "82%",  height: "22%", anim: "animate-wave-fast",            fill: "color-mix(in oklab, oklch(0.93 0.05 60) 26%, transparent)" },
  ];

  const wavePaths = [
    "M0,80 C160,30 320,130 480,80 C640,30 800,130 960,80 C1120,30 1280,130 1440,80 L1440,320 L0,320 Z",
    "M0,60 C200,120 400,10 600,70 C800,130 1000,20 1200,80 C1320,110 1400,60 1440,50 L1440,320 L0,320 Z",
    "M0,100 C180,40 360,140 540,90 C720,40 900,140 1080,90 C1260,40 1380,110 1440,80 L1440,320 L0,320 Z",
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {waves.map((w, i) => (
        <svg
          key={i}
          className={`absolute left-0 w-[200%] ${w.anim}`}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ top: w.top, height: w.height }}
        >
          <path fill={w.fill} d={wavePaths[i % wavePaths.length]} />
        </svg>
      ))}

      {/* Floating orbs for extra depth */}
      <div
        className="absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full animate-orb-float opacity-30"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[55%] right-[-15%] w-[45vw] h-[45vw] rounded-full animate-orb-float-reverse opacity-25"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent) 0%, transparent 70%)",
          animationDelay: "-4s",
        }}
      />
    </div>
  );
}
