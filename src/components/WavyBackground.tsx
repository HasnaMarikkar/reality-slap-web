export function WavyBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* ====== TOP WAVES (move right, crests point down) ====== */}
      {/* Top wave layer 1 — slowest, back */}
      <svg
        className="absolute top-0 left-0 w-[200%] animate-wave-slow-reverse"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "35%", transform: "scaleY(-1)" }}
      >
        <path
          fill={"color-mix(in oklab, oklch(0.72 0.20 50) 12%, transparent)"}
          d="M0,192L48,197C96,203,192,213,288,229C384,245,480,267,576,250C672,233,768,179,864,181C960,183,1056,245,1152,261C1248,277,1344,245,1392,229L1440,213L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Top wave layer 2 — medium */}
      <svg
        className="absolute top-0 left-0 w-[200%] animate-wave-medium-reverse"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "28%", transform: "scaleY(-1)" }}
      >
        <path
          fill={"color-mix(in oklab, oklch(0.85 0.17 90) 18%, transparent)"}
          d="M0,96L48,112C96,128,192,160,288,186C384,213,480,235,576,224C672,213,768,171,864,165C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Top wave layer 3 — fastest, front */}
      <svg
        className="absolute top-0 left-0 w-[200%] animate-wave-fast-reverse"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "22%", transform: "scaleY(-1)" }}
      >
        <path
          fill={"color-mix(in oklab, oklch(0.93 0.05 60) 28%, transparent)"}
          d="M0,64L48,80C96,96,192,128,288,133C384,139,480,117,576,128C672,139,768,181,864,192C960,203,1056,181,1152,165C1248,149,1344,139,1392,133L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* ====== BOTTOM WAVES (move left) ====== */}
      {/* Wave layer 1 — slowest, back */}
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-slow"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "35%" }}
      >
        <path
          fill={"color-mix(in oklab, oklch(0.72 0.20 50) 12%, transparent)"}
          d="M0,192L48,197C96,203,192,213,288,229C384,245,480,267,576,250C672,233,768,179,864,181C960,183,1056,245,1152,261C1248,277,1344,245,1392,229L1440,213L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Wave layer 2 — medium */}
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-medium"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "28%" }}
      >
        <path
          fill={"color-mix(in oklab, oklch(0.85 0.17 90) 18%, transparent)"}
          d="M0,96L48,112C96,128,192,160,288,186C384,213,480,235,576,224C672,213,768,171,864,165C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Wave layer 3 — fastest, front */}
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-fast"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "22%" }}
      >
        <path
          fill={"color-mix(in oklab, oklch(0.93 0.05 60) 28%, transparent)"}
          d="M0,64L48,80C96,96,192,128,288,133C384,139,480,117,576,128C672,139,768,181,864,192C960,203,1056,181,1152,165C1248,149,1344,139,1392,133L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Floating orbs for extra depth */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full animate-orb-float opacity-30"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[20%] right-[-15%] w-[45vw] h-[45vw] rounded-full animate-orb-float-reverse opacity-25"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent) 0%, transparent 70%)",
          animationDelay: "-4s",
        }}
      />
    </div>
  );
}
