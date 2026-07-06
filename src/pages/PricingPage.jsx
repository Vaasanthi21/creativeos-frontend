"\"use client\";
import { useState } from \"react\";
import { Link } from \"react-router-dom\";
import { Check, Sparkles, DollarSign, Zap, Save, TrendingUp, ArrowRight, X, Info } from \"lucide-react\";
import PageShell from \"@/components/PageShell\";
import SEO from \"@/components/SEO\";

const PACKS = [
  {
    name: \"Starter Save\",
    testid: \"pack-starter\",
    credits: 500,
    price: 9,
    per: \"$0.018 / credit\",
    tagline: \"Try before you commit.\",
    highlights: [
      \"500 credits — never expire\",
      \"Access to all 6 studios\",
      \"Standard rendering queue\",
      \"Email support\",
    ],
  },
  {
    name: \"Grow Pack\",
    testid: \"pack-grow\",
    credits: 3000,
    price: 45,
    per: \"$0.015 / credit\",
    tagline: \"For creators shipping weekly.\",
    popular: true,
    highlights: [
      \"3,000 credits — never expire\",
      \"Priority rendering queue\",
      \"HD image + video exports\",
      \"Save 💾 unused credits forever\",
      \"Slack + email support\",
    ],
  },
  {
    name: \"Scale Bundle\",
    testid: \"pack-scale\",
    credits: 10000,
    price: 129,
    per: \"$0.013 / credit\",
    tagline: \"Best value for teams & agencies.\",
    highlights: [
      \"10,000 credits — never expire\",
      \"Fastest rendering priority\",
      \"4K exports + brand kit\",
      \"Team seats (up to 5)\",
      \"Dedicated success manager\",
    ],
  },
  {
    name: \"Enterprise\",
    testid: \"pack-enterprise\",
    credits: null,
    price: null,
    per: \"Custom\",
    tagline: \"For large studios & organisations.\",
    highlights: [
      \"Custom volume pricing\",
      \"SSO + audit logs\",
      \"SLA-backed uptime\",
      \"White-label options\",
      \"24/7 priority support\",
    ],
  },
];

const USAGE_TABLE = [
  { action: \"Text post (Content Studio)\", credits: \"1\" },
  { action: \"AI image, HD (Image Studio)\", credits: \"3\" },
  { action: \"Video clip, up to 10s (Video Studio)\", credits: \"69\" },
  { action: \"Text + Image bundle\", credits: \"4\" },
  { action: \"Long-form blog article, SEO-tuned\", credits: \"10\" },
  { action: \"LinkedIn Tracker refresh\", credits: \"0 (free)\" },
];

const COMPARE = [
  { label: \"Never expires\", included: true },
  { label: \"No recurring subscription\", included: true },
  { label: \"Auto-renew charges\", included: false },
  { label: \"Unused credits roll over forever\", included: true },
  { label: \"All studios unlocked\", included: true },
  { label: \"Hidden fees\", included: false },
];

export default function PricingPage() {
  const [billing, setBilling] = useState(\"packs\");

  const jsonLd = {
    \"@context\": \"https://schema.org\",
    \"@type\": \"PriceSpecification\",
    name: \"CreativeOS Usage-Based Pricing\",
    description:
      \"Buy credits once, use them forever. No subscription, no auto-renewal. Credits work across all six CreativeOS studios.\",
    priceCurrency: \"USD\",
    offers: PACKS.filter((p) => p.price).map((p) => ({
      \"@type\": \"Offer\",
      name: p.name,
      price: p.price,
      priceCurrency: \"USD\",
      description: `${p.credits} credits — ${p.tagline}`,
    })),
  };

  return (
    <PageShell testid=\"pricing-page\">
      <SEO
        title=\"Pricing — Usage-based, no subscriptions\"
        description=\"CreativeOS pricing: buy credits once, use them forever. No subscription. No auto-renewal. Save 💾 and Grow — pay only for what you generate across all studios.\"
        path=\"/pricing\"
        jsonLd={jsonLd}
      />

      <section className=\"mx-auto max-w-6xl px-5 pt-32 pb-12\">
        <div className=\"text-center\">
          <span className=\"inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 font-mono text-xs text-orange-300\">
            <Save className=\"h-3.5 w-3.5\" /> Save 💾 and Grow
          </span>
          <h1 className=\"mx-auto mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl\">
            Pay only for what you <span className=\"text-orange-500\">create</span>.
          </h1>
          <p className=\"mx-auto mt-5 max-w-xl text-pretty text-base text-neutral-400 md:text-lg\">
            Usage-based pricing. No monthly subscriptions. No auto-renewals. Credits never expire — bank them today, spend them next quarter.
          </p>

          <div className=\"mx-auto mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1\" role=\"tablist\">
            <button
              data-testid=\"billing-packs\"
              onClick={() => setBilling(\"packs\")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billing === \"packs\" ? \"bg-orange-500 text-black\" : \"text-neutral-400 hover:text-white\"
              }`}
            >
              Credit packs
            </button>
            <button
              data-testid=\"billing-usage\"
              onClick={() => setBilling(\"usage\")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billing === \"usage\" ? \"bg-orange-500 text-black\" : \"text-neutral-400 hover:text-white\"
              }`}
            >
              Usage table
            </button>
          </div>
        </div>
      </section>

      {billing === \"packs\" ? (
        <section className=\"mx-auto max-w-6xl px-5 pb-16\">
          <div className=\"grid gap-5 md:grid-cols-2 lg:grid-cols-4\">
            {PACKS.map((p) => (
              <div
                key={p.name}
                data-testid={p.testid}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                  p.popular
                    ? \"border-orange-500/60 bg-gradient-to-b from-orange-500/[0.08] to-white/[0.02] shadow-[0_0_60px_-20px_rgba(249,115,22,0.4)]\"
                    : \"border-white/10 bg-white/[0.03] hover:border-orange-500/30\"
                }`}
              >
                {p.popular && (
                  <span className=\"absolute -top-3 left-6 rounded-full bg-orange-500 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black\">
                    Most popular
                  </span>
                )}
                <div className=\"text-sm font-semibold uppercase tracking-widest text-orange-400\">
                  {p.name}
                </div>
                <div className=\"mt-4 flex items-baseline gap-1.5\">
                  {p.price ? (
                    <>
                      <span className=\"text-4xl font-extrabold text-white\">${p.price}</span>
                      <span className=\"text-sm text-neutral-500\">one-time</span>
                    </>
                  ) : (
                    <span className=\"text-3xl font-extrabold text-white\">Let&apos;s talk</span>
                  )}
                </div>
                <div className=\"mt-1 text-xs font-mono text-neutral-500\">{p.per}</div>
                <p className=\"mt-4 text-sm text-neutral-400\">{p.tagline}</p>

                <ul className=\"mt-6 space-y-2.5\">
                  {p.highlights.map((h) => (
                    <li key={h} className=\"flex items-start gap-2 text-sm text-neutral-200\">
                      <Check className=\"mt-0.5 h-4 w-4 shrink-0 text-orange-500\" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className=\"mt-8\">
                  {p.name === \"Enterprise\" ? (
                    <Link
                      to=\"/contact\"
                      data-testid={`${p.testid}-cta`}
                      className=\"inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10\"
                    >
                      Contact sales <ArrowRight className=\"h-4 w-4\" />
                    </Link>
                  ) : (
                    <Link
                      to=\"/signup\"
                      data-testid={`${p.testid}-cta`}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                        p.popular
                          ? \"bg-orange-500 text-black hover:bg-orange-400\"
                          : \"border border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20\"
                      }`}
                    >
                      Get {p.credits.toLocaleString()} credits <ArrowRight className=\"h-4 w-4\" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className=\"mt-10 flex items-center justify-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] px-5 py-4 text-sm text-orange-100\">
            <Info className=\"h-4 w-4 shrink-0 text-orange-400\" />
            <span>
              <strong className=\"text-white\">No recurring payments.</strong> You&apos;re never
              charged again unless you top up. Credits roll over indefinitely.
            </span>
          </div>
        </section>
      ) : (
        <section className=\"mx-auto max-w-4xl px-5 pb-16\">
          <div className=\"overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]\">
            <table className=\"w-full text-sm\">
              <thead className=\"bg-white/[0.04]\">
                <tr>
                  <th className=\"p-4 text-left font-mono text-[11px] uppercase tracking-widest text-neutral-400\">
                    Action
                  </th>
                  <th className=\"p-4 text-right font-mono text-[11px] uppercase tracking-widest text-neutral-400\">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody>
                {USAGE_TABLE.map((row, i) => (
                  <tr key={row.action} className={i % 2 ? \"bg-white/[0.02]\" : \"\"}>
                    <td className=\"p-4 text-neutral-200\">{row.action}</td>
                    <td className=\"p-4 text-right font-mono text-orange-400\">{row.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className=\"mt-4 text-center text-xs text-neutral-500\">
            Only charged when a render completes successfully. Retries are free.
          </p>
        </section>
      )}

      {/* Why usage-based */}
      <section className=\"mx-auto max-w-6xl px-5 py-12\">
        <div className=\"grid gap-5 md:grid-cols-3\">
          {[
            { icon: DollarSign, title: \"No subscriptions\", desc: \"You pay once for credits. There's no auto-renewal, no surprise invoice.\" },
            { icon: Save, title: \"Save 💾 and Grow\", desc: \"Credits never expire. Buy the pack that fits — use them today or next year.\" },
            { icon: Zap, title: \"One balance, six studios\", desc: \"The same credits work across Content, Image, Video, Blog, Tracker & Platform.\" },
          ].map((c) => (
            <div key={c.title} className=\"rounded-2xl border border-white/10 bg-white/[0.03] p-6\">
              <span className=\"grid h-10 w-10 place-items-center rounded-lg bg-orange-500/10 text-orange-500\">
                <c.icon className=\"h-5 w-5\" />
              </span>
              <h3 className=\"mt-4 text-base font-semibold text-white\">{c.title}</h3>
              <p className=\"mt-2 text-sm leading-relaxed text-neutral-400\">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compare */}
      <section className=\"mx-auto max-w-3xl px-5 pb-16\">
        <h2 className=\"text-center text-2xl font-bold text-white md:text-3xl\">
          Usage-based vs subscription
        </h2>
        <div className=\"mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]\">
          {COMPARE.map((c, i) => (
            <div
              key={c.label}
              className={`flex items-center justify-between px-5 py-4 text-sm ${
                i !== COMPARE.length - 1 ? \"border-b border-white/5\" : \"\"
              }`}
            >
              <span className=\"text-neutral-200\">{c.label}</span>
              {c.included ? (
                <span className=\"inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-400\">
                  <Check className=\"h-4 w-4\" /> CreativeOS
                </span>
              ) : (
                <span className=\"inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-400\">
                  <X className=\"h-4 w-4\" /> Never
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className=\"mx-auto max-w-5xl px-5 pb-24\">
        <div className=\"relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/[0.15] to-transparent px-8 py-14 text-center\">
          <TrendingUp className=\"mx-auto h-10 w-10 text-orange-500\" />
          <h3 className=\"mt-4 text-3xl font-bold text-white md:text-4xl\">
            Ready to Save 💾 and Grow?
          </h3>
          <p className=\"mx-auto mt-3 max-w-lg text-neutral-300\">
            Start with 100 free credits. Explore every studio. Only top up if you love it.
          </p>
          <div className=\"mt-8 flex flex-wrap items-center justify-center gap-3\">
            <Link
              to=\"/signup\"
              data-testid=\"pricing-cta-start\"
              className=\"inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-orange-400\"
            >
              <Sparkles className=\"h-4 w-4\" />
              Claim free credits
            </Link>
            <Link
              to=\"/faq\"
              data-testid=\"pricing-cta-faq\"
              className=\"inline-flex items-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10\"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
"
