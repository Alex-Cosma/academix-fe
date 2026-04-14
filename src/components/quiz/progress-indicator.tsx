"use client"

import type { LevelProgress } from "@/types/paper"
import { Lock, CheckCircle2, Circle } from "lucide-react"

interface ProgressIndicatorProps {
  levels: LevelProgress[]
}

export function ProgressIndicator({ levels }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {levels.map((level, idx) => (
        <div key={level.level} className="flex items-center">
          <div
            className="flex items-center gap-1.5"
            title={`${level.levelName}: ${
              level.completed ? "Completed" : level.unlocked ? "Unlocked" : "Locked"
            }`}
          >
            {level.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : level.unlocked ? (
              <Circle className="h-5 w-5 text-primary" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            <span
              className={`text-xs ${
                level.completed
                  ? "font-medium text-green-600 dark:text-green-400"
                  : level.unlocked
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {level.levelName}
            </span>
          </div>
          {idx < levels.length - 1 && (
            <div
              className={`mx-2 h-px w-4 ${
                levels[idx + 1]?.unlocked
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
