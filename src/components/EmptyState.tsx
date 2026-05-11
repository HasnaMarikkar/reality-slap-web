export function EmptyState() {
  return (
    <div className="rounded-3xl bg-card/60 p-10 text-center space-y-3 shadow-clay-inset">
      <div className="text-5xl">🤡</div>
      <h3 className="font-display text-xl text-foreground">No roasts yet</h3>
      <p className="text-sm text-muted-foreground">
        Type a habit or excuse above and hit <span className="font-semibold text-accent">Slap Me With Reality</span>.
      </p>
    </div>
  );
}
