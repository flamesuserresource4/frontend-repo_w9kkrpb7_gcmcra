import { useEffect, useState } from 'react'

export default function Filters({ onChange }) {
  const [facets, setFacets] = useState({ ratings: [], labels: [], cameras: [], lenses: [] })
  const [filters, setFilters] = useState({ rating: '', label: '', camera: '', lens: '', flagged: '' })

  useEffect(() => {
    const load = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      try {
        const res = await fetch(`${baseUrl}/api/facets`)
        const data = await res.json()
        setFacets({
          ratings: (data.ratings || []).filter((v) => v !== null).sort(),
          labels: (data.labels || []).filter((v) => v).sort(),
          cameras: (data.cameras || []).filter((v) => v).sort(),
          lenses: (data.lenses || []).filter((v) => v).sort(),
        })
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [])

  useEffect(() => {
    const active = {}
    if (filters.rating !== '') active.rating = Number(filters.rating)
    if (filters.label) active.label = filters.label
    if (filters.camera) active.camera = filters.camera
    if (filters.lens) active.lens = filters.lens
    if (filters.flagged !== '') active.flagged = filters.flagged === 'true'
    onChange(active)
  }, [filters])

  const shared = 'bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2 text-slate-100'

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <select className={shared} value={filters.rating} onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))}>
        <option value="">Rating</option>
        {[0,1,2,3,4,5].map(r => <option key={r} value={r}>{r}★</option>)}
      </select>
      <select className={shared} value={filters.label} onChange={(e) => setFilters((f) => ({ ...f, label: e.target.value }))}>
        <option value="">Label</option>
        {facets.labels.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select className={shared} value={filters.camera} onChange={(e) => setFilters((f) => ({ ...f, camera: e.target.value }))}>
        <option value="">Camera</option>
        {facets.cameras.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={shared} value={filters.lens} onChange={(e) => setFilters((f) => ({ ...f, lens: e.target.value }))}>
        <option value="">Lens</option>
        {facets.lenses.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <select className={shared} value={filters.flagged} onChange={(e) => setFilters((f) => ({ ...f, flagged: e.target.value }))}>
        <option value="">Flagged</option>
        <option value="true">Picked</option>
        <option value="false">Unpicked</option>
      </select>
      <button onClick={() => setFilters({ rating: '', label: '', camera: '', lens: '', flagged: '' })} className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-3 py-2 text-slate-100">Reset</button>
    </div>
  )
}
