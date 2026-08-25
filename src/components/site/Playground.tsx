import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";

const PROMPT = `Extract the user profile.
Return JSON matching the User schema.`;

const RAW = `\`\`\`json
{
  "name": "Ada Lovelace",
  "email": "ada@analytical.dev",
  "age": "36",
  "roles": ["admin", "engineer",],
}
\`\`\``;

const OUTPUT = `User(
  name="Ada Lovelace",
  email="ada@analytical.dev",
  age=36,
  roles=["admin", "engineer"],
)`;

function useTyped(text: string, active: boolean, speed = 12) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed]);
  return out;
}

function Panel({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: "danger" | "success";
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {tone && (
          <span
            className={
              tone === "danger"
                ? "rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] text-destructive"
                : "rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success"
            }
          >
            {tone === "danger" ? "unparseable" : "validated"}
          </span>
        )}
      </div>
      <pre className="flex-1 overflow-x-auto bg-code px-5 py-5 font-mono text-[12.5px] leading-[1.7] text-foreground/85">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function Playground() {
  const [run, setRun] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    const a = window.setTimeout(() => setStage(1), 500);
    const b = window.setTimeout(() => setStage(2), 1800);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [run]);

  const prompt = useTyped(PROMPT, true, 18);
  const raw = useTyped(RAW, stage >= 1);
  const out = useTyped(OUTPUT, stage >= 2);

  return (
    <section id="playground" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-28 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Playground
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
              Watch a broken response become a typed object.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium outline-none transition-colors duration-200 hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Play className="size-3.5" aria-hidden />
            Run again
          </button>
        </div>

        <div className="mt-16 grid items-stretch gap-5 lg:mt-20 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Panel label="Prompt">{prompt}</Panel>
          </motion.div>

          <div className="flex items-center justify-center text-muted-foreground">
            <ArrowRight className="size-4 rotate-90 lg:rotate-0" aria-hidden />
          </div>

          <motion.div
            animate={{ opacity: stage >= 1 ? 1 : 0.4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Panel label="Raw Response" tone="danger">
              {raw}
            </Panel>
          </motion.div>

          <div className="flex items-center justify-center text-muted-foreground">
            <ArrowRight className="size-4 rotate-90 lg:rotate-0" aria-hidden />
          </div>

          <motion.div
            animate={{ opacity: stage >= 2 ? 1 : 0.4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Panel label="Structured Output" tone="success">
              {out}
            </Panel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}