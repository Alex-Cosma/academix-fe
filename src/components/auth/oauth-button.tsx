"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OAuthButtonProps {
  provider: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function OAuthButton({
  provider,
  icon,
  label,
  onClick,
  disabled,
  className,
}: OAuthButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("w-full justify-start gap-3 h-12", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {label}
    </Button>
  )
}
