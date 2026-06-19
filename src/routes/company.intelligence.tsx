import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Linkedin, Globe } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { buildIntelligenceSections, type FieldDef, type SectionDef } from "@/data/intelligenceData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { isNullish, splitItems, asString } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  component: CompanyIntelligence,
});

function CompanyIntelligence() {
  const { profile, selected } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile && !selected && typeof window !== "undefined") {
      const stored = window.localStorage.getItem("selected-company");
      if (!stored) navigate({ to: "/" });
    }
  }, [profile, selected, navigate]);

  const sections = useMemo(() => buildIntelligenceSections(profile?.raw), [profile]);
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const offset = 220;
      const idx = sectionRefs.current.findIndex((el, i) => {
        if (!el) return false;
        const next = sectionRefs.current[i + 1];
        const top = el.getBoundingClientRect().top;
        const nextTop = next ? next.getBoundingClientRect().top : Infinity;
        return top <= offset && nextTop > offset;
      });
      if (idx >= 0 && idx !== active) setActive(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  useEffect(() => {
    const btn = tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab-idx="${active}"]`);
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    const y = el.getBoundingClientRect().top + window.scrollY - 180;
    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => (isScrollingRef.current = false), 700);
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">No company selected.</p>
      </div>
    );
  }

  const raw = profile.raw;

  return (
    <div>
      {/* Sticky top info bar */}
      <div className="sticky top-14 z-20 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyLogo
              name={profile.name}
              logoUrl={profile.logo_url}
              websiteUrl={profile.website_url}
              size={40}
            />
            <div className="min-w-0">
              <h1 className="font-heading text-base font-semibold leading-tight text-foreground truncate sm:text-lg">
                {profile.name}
              </h1>
              {profile.category && (
                <span className="mt-0.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {profile.category}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                <Globe className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Website</span>
              </a>
            )}
            {raw.linkedin_url && (
              <a href={asString(raw.linkedin_url)} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                <Linkedin className="h-3.5 w-3.5" /> <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div ref={tabsRef} className="mx-auto max-w-7xl overflow-x-auto px-2 sm:px-4">
          <div className="flex gap-1 whitespace-nowrap py-2">
            {sections.map((s, i) => (
              <button
                key={s.id}
                data-tab-idx={i}
                onClick={() => scrollToSection(i)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition",
                  active === i
                    ? "bg-[color:var(--color-app-sidebar-active-bg)] text-[color:var(--color-app-sidebar-active-fg)]"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            raw={raw}
            innerRef={(el) => (sectionRefs.current[idx] = el)}
          />
        ))}
      </div>
    </div>
  );
}

const SectionCard = memo(function SectionCard({
  section,
  raw,
  innerRef,
}: {
  section: SectionDef;
  raw: Record<string, any>;
  innerRef: (el: HTMLElement | null) => void;
}) {
  const Icon = section.icon;
  const filledCount = section.fields.filter((f) => !isNullish(raw[f.key])).length;

  return (
    <section
      ref={innerRef}
      className="scroll-mt-48 rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <header className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dream/10 text-dream">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
            {section.title}
          </h2>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {filledCount}/{section.fields.length}
        </span>
      </header>

      <dl className="divide-y divide-border">
        {section.fields.map((f) => (
          <FieldRow key={f.key} field={f} value={raw[f.key]} />
        ))}
      </dl>
    </section>
  );
});

function FieldRow({ field, value }: { field: FieldDef; value: unknown }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-1/3">
        {field.label}
      </dt>
      <dd className="text-sm text-foreground sm:w-2/3">
        {renderValue(field, value)}
      </dd>
    </div>
  );
}

function NotAvailable() {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium italic text-muted-foreground">
      Not Available
    </span>
  );
}

function renderValue(field: FieldDef, value: unknown) {
  if (isNullish(value)) return <NotAvailable />;
  const s = asString(value);

  if (field.render === "url" || /^https?:\/\//i.test(s)) {
    return (
      <a href={s} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1 break-all text-dream hover:underline">
        {s} <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  if (field.render === "video") {
    return (
      <a href={s} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1 text-dream hover:underline">
        Watch video <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  if (field.render === "rating") {
    return <span className="font-semibold text-foreground">{s}</span>;
  }

  if (field.render === "paragraph") {
    return <p className="leading-relaxed text-foreground">{s}</p>;
  }

  if (field.render === "list" || /[;,•]/.test(s) || /\n/.test(s)) {
    const items = splitItems(s);
    if (items.length > 1) {
      return (
        <ul className="flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <li key={i} className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs">
              {it}
            </li>
          ))}
        </ul>
      );
    }
  }

  return <span>{s}</span>;
}