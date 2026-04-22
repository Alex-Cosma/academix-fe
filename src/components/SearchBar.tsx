interface Props {
  query: string
  onChange: (value: string) => void
}

export default function SearchBar({ query, onChange }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search nodes..."
        value={query}
        onChange={e => onChange(e.target.value)}
        className="search-input"
      />
      {query && (
        <button className="search-clear" onClick={() => onChange('')}>
          &times;
        </button>
      )}
    </div>
  )
}
