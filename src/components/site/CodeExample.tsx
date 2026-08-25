import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const snippets = {
  Install: `pip install llm-reliability-engine

# optional provider extras
pip install "llm-reliability-engine[anthropic,ollama]"`,
  Python: `from pydantic import BaseModel
from llm_reliability_engine import ReliableClient

class User(BaseModel):
    name: str
    email: str
    age: int
    roles: list[str]

client = ReliableClient(provider="openai:gpt-4o-mini", max_attempts=3)

result = client.structured(
    prompt="Extract the user profile from this email thread.",
    schema=User,
)

print(result.value.name)
print(result.attempts)
print(result.parse_method)`,
  Async: `import asyncio
from llm_reliability_engine import AsyncReliableClient

client = AsyncReliableClient(provider="anthropic:claude-3-5-sonnet")

async def main():
    results = await asyncio.gather(*[
        client.structured(prompt=thread, schema=User)
        for thread in threads
    ])
    for result in results:
        if result.ok:
            store(result.value)
        else:
            log.warning("unrecoverable", extra=result.metadata)

asyncio.run(main())`,
} as const;

type Tab = keyof typeof snippets;
const tabs = Object.keys(snippets) as Tab[];

const KEYWORDS =
  /\b(from|import|class|def|async|await|return|for|in|if|else|with|as|pass|print|lambda|not|and|or|None|True|False)\b/;

/** Small, dependency-free tokenizer — enough for Python and shell samples. */
function highlight(source: string): ReactNode[] {
  const pattern =
    /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*)/g;

  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source))) {
    if (match.index > last) nodes.push(source.slice(last, match.index));
    const [text, comment, str, num, word] = match;

    if (comment) {
      nodes.push(
        <span key={key++} className="text-muted-foreground/70">
          {text}
        </span>,
      );
    } else if (str) {
      nodes.push(
        <span key={key++} className="text-success/90">
          {text}
        </span>,
      );
    } else if (num) {
      nodes.push(
        <span key={key++} className="text-accent">
          {text}
        </span>,
      );
    } else if (word && KEYWORDS.test(word)) {
      nodes.push(
        <span key={key++} className="text-primary">
          {text}
        </span>,
      );
    } else {
      nodes.push(text);
    }
    last = match.index + text.length;
  }
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

export function CodeExample() {
  const [tab, setTab] = useState<Tab>("Python");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[tab]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="code" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-28 lg:py-32">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Quick start
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
            Four lines from prompt to typed object.
          </h2>
        </div>

        <div className="mt-14 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-3 py-2">
            <div role="tablist" aria-label="Example" className="flex gap-0.5">
              {tabs.map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-md px-3 py-1.5 font-mono text-xs outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                    tab === t
                      ? "bg-secondary/70 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Code copied" : "Copy code to clipboard"}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground outline-none transition-colors duration-200 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check className="size-3.5 text-success" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <pre className="overflow-x-auto bg-code px-6 py-7 font-mono text-[13px] leading-[1.75] text-foreground/90">
            <code>{highlight(snippets[tab])}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
