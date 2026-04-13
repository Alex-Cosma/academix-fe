"use client"

import { cn } from "@/lib/utils"
import { useOnboardingStore } from "@/stores/onboarding-store"
import {
  Atom,
  Brain,
  Briefcase,
  Calculator,
  Cpu,
  FlaskConical,
  GraduationCap,
  Gem,
  Globe,
  HeartPulse,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  Mountain,
  Palette,
  Scale,
  Scroll,
  TrendingUp,
  Trees,
  Users,
  Wheat,
  Wrench,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  cpu: Cpu,
  "heart-pulse": HeartPulse,
  "flask-conical": FlaskConical,
  leaf: Leaf,
  gem: Gem,
  atom: Atom,
  mountain: Mountain,
  brain: Brain,
  palette: Palette,
  scroll: Scroll,
  globe: Globe,
  users: Users,
  briefcase: Briefcase,
  landmark: Landmark,
  "trending-up": TrendingUp,
  lightbulb: Lightbulb,
  calculator: Calculator,
  wrench: Wrench,
  trees: Trees,
  wheat: Wheat,
  "graduation-cap": GraduationCap,
  scale: Scale,
  languages: Languages,
}

interface FieldChipProps {
  slug: string
  name: string
  iconName: string
}

export function FieldChip({ slug, name, iconName }: FieldChipProps) {
  const { selectedFields, toggleField } = useOnboardingStore()
  const isSelected = selectedFields.includes(slug)
  const Icon = iconMap[iconName]

  return (
    <button
      type="button"
      onClick={() => toggleField(slug)}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md",
        isSelected
          ? "border-primary bg-primary text-primary-foreground shadow-md"
          : "border-border bg-card text-card-foreground hover:border-primary/50"
      )}
    >
      {Icon && <Icon className="h-7 w-7" />}
      <span className="text-sm font-medium text-center leading-tight">
        {name}
      </span>
    </button>
  )
}
