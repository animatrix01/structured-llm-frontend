import { motion } from "motion/react";
import { Boxes, Wrench, ShieldCheck, Activity } from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "Provider agnostic",
    description:
      "One interface across OpenAI, Anthropic, Mistral, Ollama and any HTTP endpoint. Swap providers without touching parsing logic.",
  },
  {
    icon: Wrench,
    title: "Automatic JSON repair",
    description:
      "Deterministic fixes for fenced blocks, trailing commas, single quotes and truncated objects before a retry is ever spent.",
  },
  {
    icon: ShieldCheck,
    title: "Pydantic validation",
    description:
      "Responses are coerced into your Pydantic models, so downstream code receives typed Python objects instead of dictionaries.",
  },
  {
    icon: Activity,
    title: "Production ready",
    description:
      "Attempt-level metadata, latency tracking, structured logging and bounded retries with exponential backoff built in.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-28 lg:py-32">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Features
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-4xl">
            Everything between the model and your types.
          </h2>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.22, ease: "easeOut", delay: i * 0.04 }}
              className="group rounded-xl border border-border bg-card/60 p-6 transition-colors duration-200 hover:border-input hover:bg-card"
            >
              <span className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                <f.icon className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-6 text-[15px] font-medium tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.65] text-muted-foreground">
                {f.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
