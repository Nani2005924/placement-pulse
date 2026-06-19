import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Lock, CheckCircle2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { SKILL_TOPICS } from "@/data/skillTopics";
import { normalizeDashboardSkills, type DashboardSkill } from "@/lib/companyData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  component: SkillIntelligence,
});

const BLOOM_META: Record<DashboardSkill["bloom"], { label: string; cls: string; bar: string }> = {
  CU: { label: "Understand", cls: "bg-bloom-cu/10 text-bloom-cu border-bloom-cu/30", bar: "bg-bloom-cu" },
  AP: { label: "Apply",      cls: "bg-bloom-ap/10 text-bloom-ap border-bloom-ap/30", bar: "bg-bloom-ap" },
  AS: { label: "Analyze",    cls: "bg-bloom-as/10 text-bloom-as border-bloom-as/30", bar: "bg-bloom-as" },
  EV: { label: "Evaluate",   cls: "bg-bloom-ev/10 text-bloom-ev border-bloom-ev/30", bar: "bg-bloom-ev" },
  CR: { label: "Create",     cls: "bg-bloom-cr/10 text-bloom-cr border-bloom-cr/30", bar: "bg-bloom-cr" },
};

const CRIT_META: Record<DashboardSkill["criticality"], { cls: string; desc: string }> = {
  Critical:  { cls: "border-crit-critical/30 text-crit-critical bg-crit-critical/5",  desc: "Must-have to clear most interviews." },
  Important: { cls: "border-crit-important/30 text-crit-important bg-crit-important/5", desc: "Strongly improves your odds." },
  Baseline:  { cls: "border-crit-baseline/30 text-crit-baseline bg-crit-baseline/5",   desc: "Foundational; expected by default." },
};

function SkillIntelligence() {
  const { profile, selected } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile && !selected && typeof window !== "undefined") {
      const stored = window.localStorage.getItem("selected-company");
      if (!stored) navigate({ to: "/" });
    }
  }, [profile, selected, navigate]);

  const skills = useMemo(() => {
    if (!selected) return [];
    const seed = SEED_COMPANIES.find((c) => c.company_id === selected.companyId);
    if (!seed) return [];
    return normalizeDashboardSkills(seed.skill_levels).sort((a, b) => b.required_level - a.required_level);
  }, [selected]);

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">No company selected.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex items-center gap-3">
        <CompanyLogo name={profile.name} logoUrl={profile.logo_url} websiteUrl={profile.website_url} size={44} />
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
            {profile.short_name} Skill Intelligence
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Skills, depth, and roadmap to crack {profile.short_name}.
          </p>
        </div>
      </header>

      {/* Bloom legend */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 font-heading text-sm font-semibold">Bloom's Taxonomy Depth</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(BLOOM_META) as DashboardSkill["bloom"][]).map((k) => (
            <div key={k} className={cn("rounded-lg border px-3 py-2 text-xs", BLOOM_META[k].cls)}>
              <p className="font-semibold">{k}</p>
              <p className="opacity-80">{BLOOM_META[k].label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Criticality legend */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(CRIT_META) as DashboardSkill["criticality"][]).map((k) => (
          <div key={k} className={cn("rounded-xl border p-3", CRIT_META[k].cls)}>
            <p className="font-heading text-sm font-semibold">{k}</p>
            <p className="mt-1 text-xs opacity-90">{CRIT_META[k].desc}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skills.map((s) => (
          <SkillCard key={s.skill_set_id} skill={s} />
        ))}
      </section>
    </div>
  );
}

function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM_META[skill.bloom];
  const crit = CRIT_META[skill.criticality];
  const pct = Math.min(100, (skill.required_level / 10) * 100);
  const topics = SKILL_TOPICS[skill.skill_set_id] ?? [];

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">
            {skill.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", bloom.cls)}>
              {skill.bloom} · {bloom.label}
            </span>
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", crit.cls)}>
              {skill.criticality}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-heading text-lg font-bold text-foreground leading-none">{skill.required_level}<span className="text-sm text-muted-foreground">/10</span></p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase text-muted-foreground">{skill.difficulty}</p>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full transition-all", bloom.bar)} style={{ width: `${pct}%` }} />
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-dream hover:underline"
      >
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {open ? "Hide roadmap" : "View 10-level roadmap"}
      </button>

      {open && (
        <ol className="mt-3 space-y-1.5 border-t border-border pt-3">
          {topics.map((topic, i) => {
            const level = i + 1;
            const locked = level > skill.required_level;
            return (
              <li
                key={level}
                className={cn(
                  "flex items-start gap-2 rounded-md px-2 py-1.5 text-xs",
                  locked ? "text-muted-foreground" : "text-foreground",
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  locked ? "bg-muted text-muted-foreground" : "bg-dream/10 text-dream",
                )}>
                  {level}
                </span>
                <span className="flex-1">{topic}</span>
                {locked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] italic">
                    <Lock className="h-3 w-3" /> Beyond scope
                  </span>
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-standard" />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}