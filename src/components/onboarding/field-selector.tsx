"use client"

import { FieldChip } from "./field-chip"

interface Field {
  name: string
  slug: string
  iconName: string
}

interface FieldSelectorProps {
  fields: Field[]
}

export function FieldSelector({ fields }: FieldSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {fields.map((field) => (
        <FieldChip
          key={field.slug}
          slug={field.slug}
          name={field.name}
          iconName={field.iconName}
        />
      ))}
    </div>
  )
}
