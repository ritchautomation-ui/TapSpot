import Link from "next/link";

type Variant = "primary" | "dark" | "outline" | "ghost" | "onDark";
const styles: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  dark: "bg-ink text-white hover:bg-neutral-800",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-white",
  ghost: "text-ink hover:bg-black/5",
  onDark: "border border-white/25 text-white hover:bg-white/10",
};
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function ButtonLink({ href, variant = "primary", className = "", children, external }: {
  href: string; variant?: Variant; className?: string; children: React.ReactNode; external?: boolean;
}) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (external) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <Link href={href} className={cls}>{children}</Link>;
}

export function Button({ variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...props} className={`${base} ${styles[variant]} ${className}`} />;
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Field({ id, label, error, help, optional, children }: {
  id: string; label: string; error?: string; help?: string; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-mute">(optional)</span>}
      </label>
      {children}
      {help && !error && <p id={`${id}-help`} className="mt-1.5 text-sm text-mute">{help}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}

export const inputClass = (hasError?: boolean) =>
  `block min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
    hasError ? "border-red-600" : "border-neutral-300"
  }`;
