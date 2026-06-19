import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanySummary } from "@/lib/companyData";
import { CompanyCard, type CompanyCardData } from "@/components/CompanyCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SVCE Companies Research & Placement Analytics Portal" },
      { name: "description", content: "Sri Venkateswara College of Engineering — strategic edge for campus placements." },
      { property: "og:title", content: "SVCE Placement Intelligence Hub" },
      { property: "og:description", content: "Research every recruiting company and build the skills they expect." },
    ],
  }),
  component: HomePage,
});

const FILTERS = ["All", "Super Dream", "Dream", "Standard", "Regular"] as const;
type Filter = (typeof FILTERS)[number];

const PILL_STYLES: Record<Filter, string> = {
  All: "border-foreground/20 text-foreground hover:bg-foreground/5 data-[active=true]:bg-navy data-[active=true]:text-white data-[active=true]:border-navy",
  "Super Dream": "border-super-dream/30 text-super-dream hover:bg-super-dream/5 data-[active=true]:bg-super-dream data-[active=true]:text-white",
  Dream: "border-dream/30 text-dream hover:bg-dream/5 data-[active=true]:bg-dream data-[active=true]:text-white",
  Standard: "border-standard/30 text-standard hover:bg-standard/5 data-[active=true]:bg-standard data-[active=true]:text-white",
  Regular: "border-regular/30 text-regular hover:bg-regular/5 data-[active=true]:bg-regular data-[active=true]:text-white",
};

function HomePage() {
  const allCompanies = useMemo<CompanyCardData[]>(
    () =>
      SEED_COMPANIES.map((c) => {
        const s = normalizeCompanySummary(c.short_json, c.company_id);
        return {
          company_id: s.company_id,
          name: s.name,
          short_name: s.short_name,
          logo_url: s.logo_url,
          company_type: s.company_type,
          headquarters_address: s.headquarters_address,
          employee_size: s.employee_size,
          yoy_growth_rate: s.yoy_growth_rate,
          website_url: s.website_url,
        };
      }),
    [],
  );

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { All: allCompanies.length, "Super Dream": 0, Dream: 0, Standard: 0, Regular: 0 };
    for (const co of allCompanies) {
      const t = co.company_type as Filter | undefined;
      if (t && t in c) c[t] += 1;
    }
    return c;
  }, [allCompanies]);

  const visible = useMemo(() => {
    return allCompanies.filter((c) => {
      if (filter !== "All" && c.company_type !== filter) return false;
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.short_name.toLowerCase().includes(query) ||
        (c.headquarters_address ?? "").toLowerCase().includes(query)
      );
    });
  }, [allCompanies, filter, query]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Sri Venkateswara College of Engineering Companies Research &amp; Placement Analytics Portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your strategic edge for campus placements.
          </p>

          <div className="mt-6 relative max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              placeholder="Search companies, locations…"
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-9 text-sm shadow-sm outline-none transition focus:border-dream focus:ring-2 focus:ring-dream/20"
            />
            {rawQuery && (
              <button
                aria-label="Clear search"
                onClick={() => setRawQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              data-active={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition",
                PILL_STYLES[f],
              )}
            >
              {f}
              <span className="ml-1.5 opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((c) => (
            <CompanyCard key={c.company_id} company={c} />
          ))}
        </section>

        {visible.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center">
            <p className="text-sm text-muted-foreground">No companies match your filters.</p>
            <button
              onClick={() => { setRawQuery(""); setFilter("All"); }}
              className="mt-3 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Reset
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
