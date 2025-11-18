import { useState } from 'react'

function PhotoCard({ item, onOpen }) {
  return (
    <button onClick={() => onOpen(item)} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-800 border border-slate-700">
      {item.thumbnail_url ? (
        <img src={item.thumbnail_url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No preview</div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-2 text-left bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-xs text-white/90 truncate">{item.filename}</div>
        <div className="text-[10px] text-white/70">
          {item.rating ? '★'.repeat(item.rating) : ''} {item.label ? `• ${item.label}` : ''}
        </div>
      </div>
    </button>
  )
}

export default function PhotoGrid({ items = [], onOpen }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {items.map((it) => (
        <PhotoCard key={it.id} item={it} onOpen={onOpen} />
      ))}
    </div>
  )
}
