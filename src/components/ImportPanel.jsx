import { useRef, useState } from 'react'

export default function ImportPanel() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [mode, setMode] = useState('json')
  const [catalog, setCatalog] = useState('Demo Catalog')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  const example = {
    catalog: 'Demo Catalog',
    items: [
      {
        filename: 'IMG_001.jpg',
        path: '/photos/IMG_001.jpg',
        title: 'Sunset over bay',
        caption: 'Golden hour',
        keywords: ['sunset','bay','vacation'],
        rating: 5,
        label: 'red',
        flagged: true,
        exif: { camera: 'Canon EOS R5', lens: 'RF 24-70mm', iso: 200, aperture: 4.0, shutter: '1/250', focal_length: 50 },
        width: 4000,
        height: 3000,
        thumbnail_url: 'https://picsum.photos/seed/1/400/400'
      }
    ]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg('')

    try {
      if (mode === 'json') {
        const res = await fetch(`${backend}/api/ingest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(example)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Ingest failed')
        setMsg(`Imported ${data.inserted} items`)
      } else if (mode === 'csv' || mode === 'upload') {
        const f = fileRef.current?.files?.[0]
        if (!f) throw new Error('Please choose a file')
        const form = new FormData()
        form.append('file', f)
        form.append('catalog', catalog)
        form.append('source', 'upload')
        const res = await fetch(`${backend}/api/ingest/upload`, { method: 'POST', body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Upload failed')
        setMsg(`Imported ${data.inserted} items`)
      }
    } catch (err) {
      setMsg(`Error: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold">Quick Import</h3>
        <select value={mode} onChange={(e)=>setMode(e.target.value)} className="bg-slate-800/70 border border-slate-700 rounded px-2 py-1 text-sm">
          <option value="json">Sample JSON</option>
          <option value="upload">Upload JSON/CSV</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {mode === 'upload' && (
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Catalog name</label>
            <input value={catalog} onChange={(e)=>setCatalog(e.target.value)} className="w-full bg-slate-800/70 border border-slate-700 rounded px-3 py-2" />
            <input ref={fileRef} type="file" accept=".json,.csv,application/json,text/csv" className="w-full text-sm text-slate-300" />
          </div>
        )}
        {mode === 'json' && (
          <div className="text-xs text-slate-300/90 bg-slate-800/60 p-3 rounded">
            This will ingest a small sample payload to get you started. You can switch to Upload to send your own JSON/CSV.
          </div>
        )}
        <button disabled={busy} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">{busy ? 'Working…' : 'Import'}</button>
        {msg && <div className="text-sm text-slate-300">{msg}</div>}
      </form>
    </div>
  )
}
