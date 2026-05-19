export function WavyBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-slow"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "55vh" }}
      >
        <path
          fill="color-mix(in oklab, oklch(0.72 0.20 50) 18%, transparent)"
          d="M0,160 C240,80 480,240 720,160 C960,80 1200,240 1440,160 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  );
}
