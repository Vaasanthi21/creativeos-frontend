"\"use client\";
import { Link } from \"react-router-dom\";
import { FileText, ArrowRight, Sparkles, Search } from \"lucide-react\";
import PageShell from \"@/components/PageShell\";
import SEO from \"@/components/SEO\";

const POSTS = [
  { slug: \"usage-based-vs-subscription-ai\", title: \"Usage-based vs subscription AI tools: why creators are switching\", excerpt: \"Subscription fatigue is real. Here's why usage-based pricing is winning with creators, agencies and lean marketing teams.\", tag: \"Pricing\", date: \"Jan 12, 2026\", read: \"6 min\" },
  { slug: \"modern-seo-strategies\", title: \"Modern SEO strategies for sustainable business growth\", excerpt: \"A practical guide for long-term ranking in the age of AI-generated content and answer engines.\", tag: \"SEO\", date: \"Jan 6, 2026\", read: \"9 min\" },
  { slug: \"aeo-answer-engine-optimization\", title: \"AEO: how to rank inside AI answer engines\", excerpt: \"Structured data, LLM.txt, semantic clarity — everything Answer Engine Optimization actually needs in 2026.\", tag: \"AEO\", date: \"Dec 22, 2025\", read: \"7 min\" },
  { slug: \"linkedin-content-that-works\", title: \"The LinkedIn content formula that consistently gets 100K impressions\", excerpt: \"What we learned tracking 1,200 posts through CreativeOS LinkedIn Tracker.\", tag: \"Growth\", date: \"Dec 10, 2025\", read: \"5 min\" },
  { slug: \"ai-prompts-brand-voice\", title: \"Teaching AI your brand voice in 15 minutes\", excerpt: \"A minimal, repeatable process to get consistent on-brand output every single time.\", tag: \"How-to\", date: \"Nov 28, 2025\", read: \"8 min\" },
  { slug: \"save-and-grow-credits\", title: \"Save 💾 and Grow: how our credits system actually works\", excerpt: \"No auto-renewals. No expiring credits. Here's the philosophy behind CreativeOS pricing.\", tag: \"Pricing\", date: \"Nov 14, 2025\", read: \"4 min\" },
];

export default function BlogPage() {
  const jsonLd = {
    \"@context\": \"https://schema.org\",
    \"@type\": \"Blog\",
    name: \"CreativeOS Blog\",
    url: typeof window !== \"undefined\" ? `${window.location.origin}/blog` : undefined,
    blogPost: POSTS.map((p) => ({
      \"@type\": \"BlogPosting\",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
    })),
  };

  return (
    <PageShell testid=\"blog-page\">
      <SEO
        title=\"Blog — Marketing, SEO & AI content strategy\"
        description=\"Ideas, playbooks and case studies from the CreativeOS team on AI content, SEO, AEO and LinkedIn growth.\"
        path=\"/blog\"
        jsonLd={jsonLd}
      />

      <section className=\"mx-auto max-w-5xl px-5 pt-32 pb-8 text-center\">
        <span className=\"inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-neutral-300\">
          <FileText className=\"h-3.5 w-3.5 text-orange-500\" /> The CreativeOS Blog
        </span>
        <h1 className=\"mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl\">
          Ideas that <span className=\"text-orange-500\">rank</span>.
        </h1>
        <p className=\"mx-auto mt-4 max-w-xl text-neutral-400\">
          Playbooks on AI content, SEO, AEO and how to Save 💾 and Grow — from the team building CreativeOS.
        </p>
      </section>

      <section className=\"mx-auto max-w-6xl px-5 pb-16\">
        <div className=\"mx-auto mb-8 flex max-w-lg items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5\">
          <Search className=\"h-4 w-4 text-orange-500\" />
          <input
            data-testid=\"blog-search-input\"
            placeholder=\"Search articles...\"
            className=\"flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-600\"
          />
        </div>

        <div className=\"grid gap-5 sm:grid-cols-2 lg:grid-cols-3\">
          {POSTS.map((p, i) => (
            <article
              key={p.slug}
              data-testid={`blog-card-${i}`}
              className=\"group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-orange-500/30\"
            >
              <div className=\"flex items-center justify-between\">
                <span className=\"rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-orange-300\">
                  {p.tag}
                </span>
                <span className=\"font-mono text-[11px] text-neutral-500\">{p.date}</span>
              </div>
              <h3 className=\"mt-4 text-[17px] font-semibold leading-snug text-white transition-colors group-hover:text-orange-100\">
                {p.title}
              </h3>
              <p className=\"mt-3 flex-1 text-sm leading-relaxed text-neutral-400\">{p.excerpt}</p>
              <div className=\"mt-5 flex items-center justify-between border-t border-white/5 pt-4\">
                <span className=\"font-mono text-[11px] text-neutral-500\">{p.read} read</span>
                <span className=\"inline-flex items-center gap-1 text-xs font-semibold text-orange-400\">
                  Read <ArrowRight className=\"h-3 w-3\" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className=\"mt-12 flex justify-center\">
          <Link
            to=\"/signup\"
            data-testid=\"blog-cta-signup\"
            className=\"inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400\"
          >
            <Sparkles className=\"h-4 w-4\" /> Try CreativeOS free
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
"
