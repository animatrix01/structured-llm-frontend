import { useEffect, useState } from "react";

export const GITHUB_REPO = "1divyanshdev/llm-reliability-engine";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export type GithubStats = {
  stars: number;
  forks: number;
  release: string | null;
};

/**
 * Live repository metadata. Renders nothing unless GitHub actually answers —
 * we never ship placeholder counts.
 */
export function useGithubStats() {
  const [stats, setStats] = useState<GithubStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const repoRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}`,
          { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } },
        );
        if (!repoRes.ok) return;
        const repo = (await repoRes.json()) as {
          stargazers_count?: number;
          forks_count?: number;
        };
        if (typeof repo.stargazers_count !== "number") return;

        let release: string | null = null;
        try {
          const relRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
            { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } },
          );
          if (relRes.ok) {
            const rel = (await relRes.json()) as { tag_name?: string };
            release = rel.tag_name ?? null;
          }
        } catch {
          release = null;
        }

        setStats({
          stars: repo.stargazers_count,
          forks: repo.forks_count ?? 0,
          release,
        });
      } catch {
        /* offline, rate-limited or private: show no metrics at all */
      }
    })();

    return () => controller.abort();
  }, []);

  return stats;
}

export function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
