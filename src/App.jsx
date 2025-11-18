import { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import PhotoGrid from './components/PhotoGrid'
import DetailDrawer from './components/DetailDrawer'
import ImportPanel from './components/ImportPanel'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({ q: '' })
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [pageSize] = useState(48)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (query.q) p.set('q', query.q)
    Object.entries(filters).forEach(([k,v]) => {
      if (v !== undefined && v !== '' && v !== null) p.set(k, v)
    })
    p.set('page', String(page))
    p.set('page_size', String(pageSize))
    return p.toString()
  }, [query, filters, page, pageSize])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${baseUrl}/api/search?${params}`)
        const data = await res.json()
        setItems(data.items || [])
        setTotal(data.total || 0)
      } catch (e) {
        setItems([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params])

  useEffect(() => { setPage(1) }, [query, filters])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.10),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.08),transparent_25%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Photo Search</h1>
          <a href="/test" className="text-slate-300 hover:text-white text-sm">System check</a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <SearchBar onSearch={setQuery} />
            <Filters onChange={setFilters} />

            <div className="flex items-center justify-between pt-2">
              <div className="text-slate-300 text-sm">{total.toLocaleString()} results</div>
              <div className="flex items-center gap-2 text-sm">
                <button disabled={page<=1} onClick={() => setPage((p)=>p-1)} className="px-3 py-1.5 rounded bg-slate-800/70 border border-slate-700 disabled:opacity-40">Prev</button>
                <div className="text-slate-400">{page} / {totalPages}</div>
                <button disabled={page>=totalPages} onClick={() => setPage((p)=>p+1)} className="px-3 py-1.5 rounded bg-slate-800/70 border border-slate-700 disabled:opacity-40">Next</button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading…</div>
            ) : (
              <PhotoGrid items={items} onOpen={(item)=>setSelected(item)} />
            )}
          </div>

          <div className="lg:col-span-1">
            <ImportPanel />
          </div>
        </div>
      </div>

      <DetailDrawer open={!!selected} item={selected} onClose={()=>setSelected(null)} />
    </div>
  )
}

export default App
