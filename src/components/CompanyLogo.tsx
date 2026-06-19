import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  size?: number;
  className?: string;
}

function logoDevUrl(website?: string): string | null {
  const key = (import.meta as any).env?.VITE_LOGO_DEV_PUBLISHABLE_KEY as string | undefined;
  if (!key || !website) return null;
  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    return `https://img.logo.dev/${host}?token=${key}&size=200&format=png`;
  } catch {
    return null;
  }
}

export function CompanyLogo({ name, logoUrl, websiteUrl, size = 48, className }: Props) {
  const candidates = [logoDevUrl(websiteUrl), logoUrl].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);
  const src = candidates[idx];
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-navy text-white font-heading font-bold",
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      onError={() => setIdx((i) => i + 1)}
      className={cn("rounded-xl bg-white object-contain border border-border", className)}
      style={{ width: size, height: size }}
    />
  );
}