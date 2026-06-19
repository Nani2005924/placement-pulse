import { memo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Users, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { isNullish } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export interface CompanyCardData {
  company_id: number;
  name: string;
  short_name: string;
  logo_url?: string;
  company_type?: string;
  headquarters_address?: string;
  employee_size?: string;
  yoy_growth_rate?: string;
  website_url?: string;
}

const TYPE_STYLES: Record<string, string> = {
  "Super Dream": "bg-super-dream/10 text-super-dream border-super-dream/30",
  Dream: "bg-dream/10 text-dream border-dream/30",
  Standard: "bg-standard/10 text-standard border-standard/30",
  Regular: "bg-regular/10 text-regular border-regular/30",
};

function NA() {
  return <span className="italic text-muted-foreground">not publicly available</span>;
}

function val(v?: string) {
  return !v || isNullish(v) ? <NA /> : <>{v}</>;
}

export const CompanyCard = memo(function CompanyCard({ company }: { company: CompanyCardData }) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();

  const type = company.company_type || "Standard";
  const growthNeg = (company.yoy_growth_rate || "").trim().startsWith("-");

  const onClick = () => {
    selectCompany({
      companyId: company.company_id,
      companyName: company.name,
      logoUrl: company.logo_url,
    });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <button
      onClick={onClick}
      className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-dream hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <CompanyLogo
          name={company.name}
          logoUrl={company.logo_url}
          websiteUrl={company.website_url}
          size={48}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                TYPE_STYLES[type] ?? TYPE_STYLES.Standard,
              )}
            >
              {type}
            </span>
          </div>
          <h3 className="mt-1 font-heading text-base font-semibold leading-tight text-foreground">
            {company.short_name || company.name}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{company.name}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{val(company.headquarters_address)}</span>
        </div>
        <div className="flex items-start gap-2">
          <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{val(company.employee_size)}</span>
        </div>
        <div className="flex items-start gap-2">
          {growthNeg ? (
            <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          ) : (
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-standard" />
          )}
          <span className={cn("line-clamp-1", growthNeg && "text-destructive")}>
            {val(company.yoy_growth_rate)}
          </span>
        </div>
      </dl>

      <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-dream" />
    </button>
  );
});