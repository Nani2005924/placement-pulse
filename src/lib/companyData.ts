import type { SeedSkillLevel } from "@/data/seedCompanies";

export interface CompanySummary {
  company_id: number;
  name: string;
  short_name: string;
  logo_url?: string;
  category?: string;
  company_type?: string;
  incorporation_year?: number | string;
  employee_size?: string;
  headquarters_address?: string;
  yoy_growth_rate?: string;
  website_url?: string;
}

export interface CompanyProfile extends CompanySummary {
  raw: Record<string, any>;
}

export interface DashboardSkill {
  skill_set_id: number;
  name: string;
  required_level: number;
  bloom: "CU" | "AP" | "AS" | "EV" | "CR";
  criticality: "Critical" | "Important" | "Baseline";
  difficulty: "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";
}

const NULLISH = new Set(["na", "n/a", "none", "-", "null", "undefined", ""]);

export const isNullish = (v: unknown): boolean => {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return NULLISH.has(v.trim().toLowerCase());
  return false;
};

export const asString = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  return typeof v === "string" ? v : String(v);
};

export const asRecord = (v: unknown): Record<string, any> =>
  v && typeof v === "object" ? (v as Record<string, any>) : {};

export const splitItems = (s: string): string[] =>
  s
    .split(/[\n;•]|(?:\.\s)/g)
    .map((x) => x.trim().replace(/^[-•·*]\s*/, ""))
    .filter(Boolean);

export const titleCaseFromCode = (s: string): string =>
  s
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const scoreToDifficulty = (n: number): DashboardSkill["difficulty"] => {
  if (n >= 8) return "EXPERT";
  if (n >= 6) return "ADVANCED";
  if (n >= 4) return "PRO";
  return "BEGINNER";
};

export const proficiencyToBloom = (level: number): DashboardSkill["bloom"] => {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
};

export const scoreToCriticality = (n: number): DashboardSkill["criticality"] => {
  if (n >= 7) return "Critical";
  if (n >= 5) return "Important";
  return "Baseline";
};

export function normalizeCompanySummary(short_json: Record<string, any>, company_id?: number): CompanySummary {
  return {
    company_id: company_id ?? Number(short_json.company_id ?? 0),
    name: asString(short_json.name),
    short_name: asString(short_json.short_name || short_json.name),
    logo_url: asString(short_json.logo_url) || undefined,
    category: asString(short_json.category) || undefined,
    company_type: asString(short_json.company_type) || undefined,
    incorporation_year: short_json.incorporation_year,
    employee_size: asString(short_json.employee_size) || undefined,
    headquarters_address: asString(short_json.headquarters_address) || undefined,
    yoy_growth_rate: asString(short_json.yoy_growth_rate) || undefined,
    website_url: asString(short_json.website_url) || undefined,
  };
}

export function normalizeCompanyProfile(
  full_json: Record<string, any>,
  short_json: Record<string, any>,
  company_id?: number,
): CompanyProfile {
  const merged = { ...short_json, ...full_json };
  const summary = normalizeCompanySummary(merged, company_id);
  return { ...summary, raw: merged };
}

export function normalizeDashboardSkills(skillLevels: SeedSkillLevel[]): DashboardSkill[] {
  return skillLevels.map((s) => ({
    skill_set_id: s.skill_set_id,
    name: s.skill_set_name,
    required_level: s.required_level,
    bloom: proficiencyToBloom(s.required_level),
    criticality: scoreToCriticality(s.required_level),
    difficulty: scoreToDifficulty(s.required_level),
  }));
}