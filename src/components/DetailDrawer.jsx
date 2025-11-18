import { useEffect } from 'react'

export default function DetailDrawer({ open, item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open || !item) return null

  const MetaRow = ({ label, value }) => (
    <div className="flex gap-3 py-1 text-sm">
      <div className="w-28 text-slate-400">{label}</div>
      <div className="text-slate-100 flex-1 break-all">{value ?? '—'}</div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100 truncate">{item.filename}</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        {item.thumbnail_url && (
          <img src={item.thumbnail_url} alt={item.filename} className="w-full rounded-lg mb-4" />
        )}
        <div className="space-y-2">
          <MetaRow label="Title" value={item.title} />
          <MetaRow label="Caption" value={item.caption} />
          <MetaRow label="Keywords" value={Array.isArray(item.keywords) ? item.keywords.join(', ') : ''} />
          <MetaRow label="Rating" value={item.rating} />
          <MetaRow label="Label" value={item.label} />
          <MetaRow label="Flagged" value={item.flagged ? 'Yes' : 'No'} />
          <MetaRow label="Camera" value={item?.exif?.camera} />
          <MetaRow label="Lens" value={item?.exif?.lens} />
          <MetaRow label="ISO" value={item?.exif?.iso} />
          <MetaRow label="Aperture" value={item?.exif?.aperture} />
          <MetaRow label="Shutter" value={item?.exif?.shutter} />
          <MetaRow label="Focal" value={item?.exif?.focal_length} />
          <MetaRow label="Size" value={item.width && item.height ? `${item.width} × ${item.height}` : ''} />
        </div>
      </div>
    </div>
  )
}
