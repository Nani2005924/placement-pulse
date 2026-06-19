import type { ComponentType } from "react";
import {
  Building2, Eye, Users, DollarSign, Globe, Package, Cpu, Handshake, Swords,
  Target, Leaf, Heart, Newspaper, BarChart3, ShieldCheck, MapPin, Siren,
  GraduationCap, Star, Wallet, Globe2, Phone,
} from "lucide-react";

export type FieldRender = "auto" | "url" | "video" | "rating" | "list" | "paragraph";

export interface FieldDef {
  key: string;
  label: string;
  render?: FieldRender;
}

export interface SectionDef {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  fields: FieldDef[];
}

export function buildIntelligenceSections(profile?: Record<string, any>): SectionDef[] {
  void profile;
  return [
    { id: "identity", title: "Company Identity", icon: Building2, fields: [
      { key: "name", label: "Legal Name" },
      { key: "short_name", label: "Common Name" },
      { key: "category", label: "Category" },
      { key: "nature_of_company", label: "Nature" },
      { key: "incorporation_year", label: "Founded" },
      { key: "headquarters_address", label: "Headquarters" },
      { key: "employee_size", label: "Employees" },
    ]},
    { id: "overview", title: "Overview & Vision", icon: Eye, fields: [
      { key: "overview_text", label: "Overview", render: "paragraph" },
      { key: "vision_statement", label: "Vision", render: "paragraph" },
      { key: "mission_statement", label: "Mission", render: "paragraph" },
      { key: "core_values", label: "Core Values", render: "list" },
    ]},
    { id: "leadership", title: "Leadership", icon: Users, fields: [
      { key: "ceo_name", label: "CEO" },
      { key: "ceo_linkedin_url", label: "CEO LinkedIn", render: "url" },
      { key: "key_leaders", label: "Key Leaders", render: "list" },
      { key: "board_members", label: "Board", render: "list" },
      { key: "warm_intro_pathways", label: "Warm Intros", render: "list" },
      { key: "decision_maker_access", label: "Decision Maker Access" },
    ]},
    { id: "funding", title: "Funding & Financials", icon: DollarSign, fields: [
      { key: "annual_revenue", label: "Annual Revenue" },
      { key: "annual_profit", label: "Profit" },
      { key: "revenue_mix", label: "Revenue Mix" },
      { key: "valuation", label: "Valuation" },
      { key: "yoy_growth_rate", label: "YoY Growth" },
      { key: "profitability_status", label: "Profitability" },
      { key: "key_investors", label: "Key Investors", render: "list" },
      { key: "recent_funding_rounds", label: "Recent Funding" },
      { key: "total_capital_raised", label: "Capital Raised" },
      { key: "burn_rate", label: "Burn Rate" },
      { key: "runway_months", label: "Runway" },
      { key: "burn_multiplier", label: "Burn Multiplier" },
    ]},
    { id: "global", title: "Global Presence", icon: Globe, fields: [
      { key: "operating_countries", label: "Countries", render: "list" },
      { key: "office_count", label: "Office Count" },
      { key: "office_locations", label: "Office Locations", render: "list" },
    ]},
    { id: "products", title: "Products & Services", icon: Package, fields: [
      { key: "offerings_description", label: "Offerings", render: "list" },
      { key: "focus_sectors", label: "Focus Sectors", render: "list" },
      { key: "pain_points_addressed", label: "Pain Points Solved", render: "list" },
      { key: "product_pipeline", label: "Pipeline", render: "list" },
      { key: "innovation_roadmap", label: "Innovation Roadmap", render: "list" },
    ]},
    { id: "tech", title: "Technology Stack", icon: Cpu, fields: [
      { key: "tech_stack", label: "Stack", render: "list" },
      { key: "ai_ml_adoption_level", label: "AI / ML Adoption" },
      { key: "tech_adoption_rating", label: "Tech Adoption" },
      { key: "intellectual_property", label: "IP", render: "list" },
      { key: "r_and_d_investment", label: "R&D Spend" },
      { key: "cybersecurity_posture", label: "Security", render: "list" },
    ]},
    { id: "partnerships", title: "Partnerships & Ecosystem", icon: Handshake, fields: [
      { key: "technology_partners", label: "Tech Partners", render: "list" },
      { key: "partnership_ecosystem", label: "Ecosystem", render: "list" },
      { key: "industry_associations", label: "Industry Bodies", render: "list" },
    ]},
    { id: "competition", title: "Competitive Landscape", icon: Swords, fields: [
      { key: "key_competitors", label: "Competitors", render: "list" },
      { key: "market_share_percentage", label: "Market Share" },
      { key: "benchmark_vs_peers", label: "Vs Peers", render: "paragraph" },
      { key: "competitive_advantages", label: "Advantages", render: "list" },
      { key: "weaknesses_gaps", label: "Weaknesses", render: "list" },
    ]},
    { id: "market", title: "Market Opportunity", icon: Target, fields: [
      { key: "tam", label: "TAM" }, { key: "sam", label: "SAM" }, { key: "som", label: "SOM" },
      { key: "future_projections", label: "Future Projections" },
      { key: "strategic_priorities", label: "Strategic Priorities", render: "list" },
      { key: "go_to_market_strategy", label: "GTM", render: "list" },
    ]},
    { id: "value-esg", title: "Core Value Proposition & ESG", icon: Leaf, fields: [
      { key: "core_value_proposition", label: "Value Proposition", render: "list" },
      { key: "unique_differentiators", label: "Differentiators", render: "list" },
      { key: "esg_ratings", label: "ESG", render: "list" },
      { key: "carbon_footprint", label: "Carbon" },
      { key: "ethical_sourcing", label: "Ethical Sourcing", render: "list" },
      { key: "sustainability_csr", label: "CSR", render: "list" },
    ]},
    { id: "culture", title: "Culture & Work Life", icon: Heart, fields: [
      { key: "work_culture_summary", label: "Culture", render: "list" },
      { key: "manager_quality", label: "Manager Quality" },
      { key: "psychological_safety", label: "Psychological Safety" },
      { key: "feedback_culture", label: "Feedback Culture", render: "list" },
      { key: "diversity_inclusion_score", label: "D&I", render: "list" },
      { key: "ethical_standards", label: "Ethical Standards" },
      { key: "burnout_risk", label: "Burnout Risk" },
      { key: "mission_clarity", label: "Mission Clarity" },
      { key: "crisis_behavior", label: "Crisis Behavior" },
    ]},
    { id: "news", title: "Recent News & Milestones", icon: Newspaper, fields: [
      { key: "recent_news", label: "Recent News", render: "list" },
      { key: "history_timeline", label: "Timeline", render: "list" },
      { key: "case_studies", label: "Case Studies", render: "list" },
      { key: "event_participation", label: "Events", render: "list" },
    ]},
    { id: "sales", title: "Sales & Customer Metrics", icon: BarChart3, fields: [
      { key: "sales_motion", label: "Sales Motion" },
      { key: "top_customers", label: "Top Customers", render: "list" },
      { key: "customer_concentration_risk", label: "Concentration Risk" },
      { key: "customer_acquisition_cost", label: "CAC" },
      { key: "customer_lifetime_value", label: "LTV" },
      { key: "cac_ltv_ratio", label: "CAC/LTV" },
      { key: "churn_rate", label: "Churn" },
      { key: "net_promoter_score", label: "NPS" },
      { key: "customer_testimonials", label: "Testimonials", render: "list" },
    ]},
    { id: "risk", title: "Risk & Compliance", icon: ShieldCheck, fields: [
      { key: "regulatory_status", label: "Regulatory", render: "list" },
      { key: "legal_issues", label: "Legal Issues" },
      { key: "supply_chain_dependencies", label: "Supply Chain", render: "list" },
      { key: "geopolitical_risks", label: "Geopolitical Risk", render: "list" },
      { key: "macro_risks", label: "Macro Risk", render: "list" },
      { key: "layoff_history", label: "Layoff History" },
      { key: "exit_strategy_history", label: "Exit Strategy" },
    ]},
    { id: "location", title: "Work Location & Commute", icon: MapPin, fields: [
      { key: "remote_policy_details", label: "Remote Policy" },
      { key: "typical_hours", label: "Hours" },
      { key: "overtime_expectations", label: "Overtime" },
      { key: "weekend_work", label: "Weekend Work" },
      { key: "flexibility_level", label: "Flexibility" },
      { key: "location_centrality", label: "Centrality" },
      { key: "public_transport_access", label: "Transit", render: "list" },
      { key: "cab_policy", label: "Cab" },
      { key: "airport_commute_time", label: "Airport Commute" },
      { key: "office_zone_type", label: "Zone" },
    ]},
    { id: "safety", title: "Safety & Wellbeing", icon: Siren, fields: [
      { key: "area_safety", label: "Area Safety" },
      { key: "safety_policies", label: "Safety Policies", render: "list" },
      { key: "infrastructure_safety", label: "Infrastructure" },
      { key: "emergency_preparedness", label: "Emergency" },
      { key: "health_support", label: "Health Support", render: "list" },
    ]},
    { id: "career", title: "Career Growth & Learning", icon: GraduationCap, fields: [
      { key: "training_spend", label: "Training Spend" },
      { key: "onboarding_quality", label: "Onboarding" },
      { key: "learning_culture", label: "Learning Culture", render: "list" },
      { key: "mentorship_availability", label: "Mentorship" },
      { key: "internal_mobility", label: "Internal Mobility" },
      { key: "promotion_clarity", label: "Promotion Clarity" },
      { key: "tools_access", label: "Tools Access" },
      { key: "role_clarity", label: "Role Clarity" },
      { key: "early_ownership", label: "Early Ownership" },
      { key: "work_impact", label: "Work Impact" },
      { key: "execution_thinking_balance", label: "Exec/Thinking Balance" },
      { key: "automation_level", label: "Automation" },
      { key: "cross_functional_exposure", label: "Cross-functional" },
      { key: "skill_relevance", label: "Skill Relevance" },
      { key: "exit_opportunities", label: "Exit Opportunities" },
    ]},
    { id: "brand", title: "Brand & Reputation", icon: Star, fields: [
      { key: "brand_value", label: "Brand Value" },
      { key: "client_quality", label: "Client Quality" },
      { key: "external_recognition", label: "Recognition" },
      { key: "network_strength", label: "Network" },
      { key: "global_exposure", label: "Global Exposure" },
      { key: "awards_recognitions", label: "Awards", render: "list" },
      { key: "brand_sentiment_score", label: "Sentiment" },
    ]},
    { id: "comp", title: "Compensation & Benefits", icon: Wallet, fields: [
      { key: "fixed_vs_variable_pay", label: "Pay Structure" },
      { key: "bonus_predictability", label: "Bonus Predictability" },
      { key: "esops_incentives", label: "ESOPs / Incentives", render: "list" },
      { key: "family_health_insurance", label: "Family Insurance" },
      { key: "relocation_support", label: "Relocation" },
      { key: "lifestyle_benefits", label: "Lifestyle", render: "list" },
      { key: "leave_policy", label: "Leave Policy", render: "list" },
    ]},
    { id: "digital", title: "Digital Presence & Ratings", icon: Globe2, fields: [
      { key: "website_url", label: "Website", render: "url" },
      { key: "linkedin_url", label: "LinkedIn", render: "url" },
      { key: "twitter_handle", label: "Twitter" },
      { key: "facebook_url", label: "Facebook", render: "url" },
      { key: "instagram_url", label: "Instagram", render: "url" },
      { key: "marketing_video_url", label: "Video", render: "video" },
      { key: "website_quality", label: "Website Quality" },
      { key: "website_traffic_rank", label: "Traffic Rank" },
      { key: "social_media_followers", label: "Followers" },
      { key: "glassdoor_rating", label: "Glassdoor", render: "rating" },
      { key: "indeed_rating", label: "Indeed", render: "rating" },
      { key: "google_rating", label: "Google", render: "rating" },
    ]},
    { id: "contact", title: "Contact Information", icon: Phone, fields: [
      { key: "primary_contact_email", label: "Email" },
      { key: "primary_phone_number", label: "Phone" },
      { key: "contact_person_name", label: "Contact Person" },
      { key: "contact_person_title", label: "Title" },
      { key: "contact_person_email", label: "Contact Email" },
      { key: "contact_person_phone", label: "Contact Phone" },
    ]},
  ];
}