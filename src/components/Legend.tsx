import { CATEGORY_COLORS, CATEGORY_LABELS, Category } from '../types'

const categories = Object.keys(CATEGORY_COLORS) as Category[]

export default function Legend() {
  return (
    <div className="legend">
      {categories.map(cat => (
        <div key={cat} className="legend-item">
          <span
            className="legend-dot"
            style={{ backgroundColor: CATEGORY_COLORS[cat] }}
          />
          <span className="legend-label">{CATEGORY_LABELS[cat]}</span>
        </div>
      ))}
    </div>
  )
}
