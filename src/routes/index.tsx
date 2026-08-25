import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { CodeExample } from "@/components/site/CodeExample";
import { Playground } from "@/components/site/Playground";
import { Footer } from "@/components/site/Footer";

const title = "LLM Reliability Engine — Structured, validated LLM outputs";
const description =
  "Open-source Python middleware that extracts JSON, repairs malformed LLM responses, validates with Pydantic and returns typed Python objects.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CodeExample />
        <Playground />
      </main>
      <Footer />
    </div>
  );
}
