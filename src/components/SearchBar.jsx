import { useState, useEffect } from 'react'

export default function SearchBar({ onSearch, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery)

  useEffect(() => {
    const handler = setTimeout(() => onSearch({ q }), 400)
    return () => clearTimeout(handler)
  }, [q])

  return (
    <div className="w-full flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" /></svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search filename, keywords, title, caption..."
        className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-400"
      />
    </div>
  )
}
