import { motion } from "motion/react";
import { ArrowRight, GitFork, Github, Star, Tag } from "lucide-react";
import { PipelinePanel } from "./PipelinePanel";
import { GITHUB_URL, formatCount, useGithubStats } from "@/hooks/useGithubStats";

export function Hero() {
  const stats = useGithubStats();

  return (
    <section id="top" className="relative">
      <div className="mx-auto grid w-full max-w-[100rem] items-center gap-12 px-6 py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-20 lg:py-32 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent" />
            Open source · MIT
          </span>

          <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1.06] tracking-[-0.035em] sm:text-6xl">
            Make every
            <br />
            LLM response
            <br />
            reliable.
          </h1>

          <p className="mt-7 max-w-[38ch] text-[17px] leading-[1.7] text-muted-foreground">
            Production-grade reliability middleware for structured LLM outputs.
            Extract JSON, validate with Pydantic, repair malformed responses and
            return typed Python objects.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#code"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Get started
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground outline-none transition-colors duration-200 hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Github className="size-4" aria-hidden />
              View source
            </a>
          </div>

          {stats && (
            <motion.dl
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-border pt-7"
            >
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="size-3.5" aria-hidden />
                  Stars
                </dt>
                <dd className="mt-1.5 font-mono text-lg tracking-tight">
                  {formatCount(stats.stars)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GitFork className="size-3.5" aria-hidden />
                  Forks
                </dt>
                <dd className="mt-1.5 font-mono text-lg tracking-tight">
                  {formatCount(stats.forks)}
                </dd>
              </div>
              {stats.release && (
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Tag className="size-3.5" aria-hidden />
                    Latest release
                  </dt>
                  <dd className="mt-1.5 font-mono text-lg tracking-tight">
                    {stats.release}
                  </dd>
                </div>
              )}
            </motion.dl>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.99, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
        >
          <PipelinePanel />
        </motion.div>
      </div>
    </section>
  );
}
