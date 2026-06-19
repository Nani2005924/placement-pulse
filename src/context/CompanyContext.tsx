import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanyProfile, type CompanyProfile } from "@/lib/companyData";

const STORAGE_KEY = "selected-company";

export interface SelectedCompanyMeta {
  companyId: number;
  companyName: string;
  logoUrl?: string;
}

interface CompanyContextValue {
  selected: SelectedCompanyMeta | null;
  profile: CompanyProfile | null;
  selectCompany: (meta: SelectedCompanyMeta) => void;
  clear: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function readStored(): SelectedCompanyMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SelectedCompanyMeta;
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompanyMeta | null>(null);

  useEffect(() => {
    const stored = readStored();
    if (stored) setSelected(stored);
  }, []);

  const profile = useMemo<CompanyProfile | null>(() => {
    if (!selected) return null;
    const seed = SEED_COMPANIES.find((c) => c.company_id === selected.companyId);
    if (!seed) return null;
    return normalizeCompanyProfile(seed.full_json, seed.short_json, seed.company_id);
  }, [selected]);

  const selectCompany = useCallback((meta: SelectedCompanyMeta) => {
    setSelected(meta);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
    }
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ selected, profile, selectCompany, clear }),
    [selected, profile, selectCompany, clear],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}