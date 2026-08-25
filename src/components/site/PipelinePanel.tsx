import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: "prompt", label: "Prompt", note: "user profile" },
  { id: "raw", label: "Raw Response", note: "text/plain" },
  { id: "extract", label: "JSON Extraction", note: "fenced block found" },
  { id: "parse", label: "JSON Parsing", note: "trailing comma" },
  { id: "validate", label: "Pydantic Validation", note: "User schema" },
  { id: "repair", label: "Deterministic Repair", note: "2 fixes" },
  { id: "llmrepair", label: "LLM Repair", note: "skipped" },
  { id: "result", label: "StructuredResult", note: "valid" },
] as const;

type Status = "idle" | "active" | "done";

export function PipelinePanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i >= steps.length + 2 ? 0 : i + 1));
    }, 750);
    return () => window.clearInterval(t);
  }, []);

  const statusOf = (i: number): Status =>
    i < index ? "done" : i === index ? "active" : "idle";

  const finished = index >= steps.length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-background/40 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-destructive/70" />
          <span className="size-3 rounded-full bg-chart-4/70" />
          <span className="size-3 rounded-full bg-success/70" />
        </div>
        <p className="flex-1 text-center font-mono text-xs text-muted-foreground">
          llm-reliability-engine
        </p>
        <span className="w-14" />
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        {/* pipeline */}
        <ol className="space-y-1.5 border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8 xl:p-10">
          {steps.map((s, i) => {
            const status = statusOf(i);
            return (
              <li key={s.id}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors duration-200",
                    status === "idle" && "border-transparent",
                    status === "active" && "border-primary/30 bg-primary/[0.07]",
                    status === "done" && "border-transparent bg-secondary/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      status === "done" &&
                        "border-success/40 bg-success/15 text-success",
                      status === "active" &&
                        "border-primary/50 bg-primary/20 text-primary-foreground",
                      status === "idle" && "border-border text-muted-foreground",
                    )}
                  >
                    {status === "done" ? (
                      <Check className="size-3" aria-hidden />
                    ) : status === "active" ? (
                      <Loader2 className="size-3 animate-spin" aria-hidden />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate font-mono text-[12.5px] transition-colors",
                        status === "idle"
                          ? "text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {s.label}
                    </p>
                  </div>
                  <span className="hidden shrink-0 whitespace-nowrap font-mono text-[11px] text-muted-foreground lg:block">
                    {status === "idle" ? "" : s.note}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="ml-[24px] h-2.5 w-px bg-border" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>

        {/* right column */}
        <div className="space-y-4 p-6 lg:p-8 xl:p-10">
          <div className="overflow-hidden rounded-lg border border-border bg-code">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Raw LLM Response
              </p>
              <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] text-destructive">
                malformed
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-7 text-muted-foreground">
              <code>{`Sure! Here is the user:
\`\`\`json
{
  "name": "Ada Lovelace",
  "email": "ada@analytical.dev",
  "age": "36",
  "roles": ["admin", "engineer",],
}
\`\`\``}</code>
            </pre>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: finished ? 1 : 0.35, y: finished ? 0 : 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-lg border border-success/25 bg-success/10 p-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-success/20 text-success">
                <Check className="size-3.5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-success">
                  Successfully validated after 2 attempts
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  StructuredResult&lt;User&gt; returned
                </p>
              </div>
            </div>
          </motion.div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {[
              ["Attempts", "2"],
              ["Parse Method", "deterministic"],
              ["Latency", "812 ms"],
              ["Provider", "openai:gpt-4o-mini"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card px-3 py-2.5">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-1 truncate font-mono text-[12px] text-foreground">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <Wrench className="size-3" aria-hidden />
            repaired: trailing comma removed · age coerced to int
          </p>
        </div>
      </div>
    </div>
  );
}