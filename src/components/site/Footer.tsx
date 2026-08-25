import { Logo } from "./Logo";
import { GITHUB_URL } from "@/hooks/useGithubStats";

const links = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "Documentation", href: "#code" },
  { label: "Examples", href: "#playground" },
  { label: "License", href: "https://opensource.org/licenses/MIT" },
];

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        <Logo className="size-[22px]" title="LLM Reliability Engine" />
        <span className="text-[13px] font-medium tracking-tight">
          LLM Reliability Engine
        </span>
      </div>

      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="rounded-sm text-[13px] text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="font-mono text-xs text-muted-foreground">MIT Licensed</p>
    </footer>
  );
}
