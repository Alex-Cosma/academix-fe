"use client"

import { cn } from "@/lib/utils"
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

interface Field {
  name: string
  slug: string
  iconName: string
}

interface SettingsFieldSelectorProps {
  fields: Field[]
  selectedFields: string[]
  onToggleField: (slug: string) => void
}

export function SettingsFieldSelector({
  fields,
  selectedFields,
  onToggleField,
}: SettingsFieldSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {fields.map((field) => {
        const isSelected = selectedFields.includes(field.slug)
        const Icon = iconMap[field.iconName]

        return (
          <button
            key={field.slug}
            type="button"
            onClick={() => onToggleField(field.slug)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-card text-card-foreground hover:border-primary/50"
            )}
          >
            {Icon && <Icon className="h-7 w-7" />}
            <span className="text-sm font-medium text-center leading-tight">
              {field.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
