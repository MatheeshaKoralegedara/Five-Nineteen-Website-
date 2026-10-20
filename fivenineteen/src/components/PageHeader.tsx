export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-7xl px-5 pb-12 pt-36 sm:px-8 sm:pb-16 sm:pt-44">
      <p className="animate-fade-up text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
      <h1
        className="animate-fade-up mt-5 max-w-4xl font-display text-5xl font-light leading-[1.05] text-ink sm:text-7xl"
        style={{ animationDelay: "100ms" }}
      >
        {title}
      </h1>
      {children && (
        <div className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-stone" style={{ animationDelay: "200ms" }}>
          {children}
        </div>
      )}
    </header>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-xs uppercase tracking-[0.35em] ${light ? "text-gold-soft" : "text-gold"}`}>
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}
