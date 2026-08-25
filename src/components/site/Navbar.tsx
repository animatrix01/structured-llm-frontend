import { useEffect, useState } from "react";
import { Github, Star, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { GITHUB_URL, formatCount, useGithubStats } from "@/hooks/useGithubStats";

const links = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#code" },
  { label: "Examples", href: "#playground" },
];

const sectionIds = ["features", "code", "playground"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const stats = useGithubStats();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6"
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Logo className="size-[22px]" title="LLM Reliability Engine" />
          <span className="text-[13px] font-medium tracking-tight">
            LLM Reliability Engine
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                  active === l.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-[13px] text-muted-foreground outline-none transition-colors duration-200 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <Github className="size-4" aria-hidden />
            GitHub
            {stats && (
              <span className="flex items-center gap-1 border-l border-border pl-2 font-mono text-[12px]">
                <Star className="size-3" aria-hidden />
                {formatCount(stats.stars)}
              </span>
            )}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-2 md:hidden">
          <ul className="flex flex-col">
            {[...links, { label: "GitHub", href: GITHUB_URL }].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
