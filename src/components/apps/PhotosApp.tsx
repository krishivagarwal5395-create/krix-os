import React, { useState } from 'react';
import { Image as ImageIcon, Heart, Info, Plus, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface PhotoItem {
  id: string;
  title: string;
  url: string;
  album: string;
  date: string;
  dimensions: string;
  size: string;
  isFavorite: boolean;
}

const SAMPLE_PHOTOS: PhotoItem[] = [
  {
    id: 'p1',
    title: 'ThinkPad Carbon Aesthetic',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    album: 'Wallpapers',
    date: 'Oct 24, 2026',
    dimensions: '2880 x 1800',
    size: '3.4 MB',
    isFavorite: true,
  },
  {
    id: 'p2',
    title: 'Nordic Horizon Minimalist',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    album: 'Nature',
    date: 'Oct 22, 2026',
    dimensions: '3840 x 2160',
    size: '4.8 MB',
    isFavorite: false,
  },
  {
    id: 'p3',
    title: 'Industrial Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    album: 'ThinkPad Design',
    date: 'Oct 18, 2026',
    dimensions: '2560 x 1600',
    size: '2.9 MB',
    isFavorite: true,
  },
];

export const PhotosApp: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>(SAMPLE_PHOTOS);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(photos[0]);
  const [showInspector, setShowInspector] = useState(false);

  const filtered = photos.filter((p) => {
    if (selectedAlbum === 'favorites') return p.isFavorite;
    if (selectedAlbum === 'all') return true;
    return p.album === selectedAlbum;
  });

  const toggleFavorite = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    if (activePhoto?.id === id) {
      setActivePhoto((p) => (p ? { ...p, isFavorite: !p.isFavorite } : null));
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar Albums */}
      <div className="w-56 bg-slate-950/80 border-r border-white/10 p-3 space-y-4 shrink-0">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          KRIX Photos
        </div>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Photos', count: photos.length },
            { id: 'favorites', label: 'Favorites', count: photos.filter((p) => p.isFavorite).length },
            { id: 'Wallpapers', label: 'Wallpapers', count: photos.filter((p) => p.album === 'Wallpapers').length },
            { id: 'ThinkPad Design', label: 'ThinkPad Design', count: photos.filter((p) => p.album === 'ThinkPad Design').length },
          ].map((alb) => (
            <button
              key={alb.id}
              onClick={() => setSelectedAlbum(alb.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-colors ${
                selectedAlbum === alb.id ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>{alb.label}</span>
              <span className="font-mono text-[11px] opacity-75">{alb.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid & Viewer */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        {/* Top bar */}
        <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/50">
          <span className="text-xs font-semibold capitalize text-white">{selectedAlbum} Photos</span>
          <div className="flex items-center gap-2">
            {activePhoto && (
              <>
                <button
                  onClick={() => toggleFavorite(activePhoto.id)}
                  className={`p-1.5 rounded-lg hover:bg-white/10 ${activePhoto.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300'}`}
                  title="Favorite"
                >
                  <Heart size={15} className={activePhoto.isFavorite ? 'fill-red-500' : ''} />
                </button>
                <button
                  onClick={() => setShowInspector(!showInspector)}
                  className={`p-1.5 rounded-lg hover:bg-white/10 ${showInspector ? 'bg-white/20 text-white' : 'text-slate-300'}`}
                  title="Inspector Info"
                >
                  <Info size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 flex overflow-hidden">
          {/* Thumbnails grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className={`group relative rounded-xl overflow-hidden aspect-video cursor-pointer border transition-all ${
                  activePhoto?.id === photo.id ? 'ring-2 ring-sky-500 border-sky-400' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                {photo.isFavorite && (
                  <div className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-red-500">
                    <Heart size={10} className="fill-red-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Optional EXIF Inspector Panel */}
          {showInspector && activePhoto && (
            <div className="w-64 bg-slate-950/90 border-l border-white/10 p-4 space-y-3 text-xs overflow-y-auto shrink-0">
              <h4 className="font-bold text-white text-sm">Metadata Inspector</h4>
              <div className="space-y-2 text-slate-300 divide-y divide-white/5 pt-1">
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Title:</span>
                  <span className="font-medium text-white truncate max-w-[120px]">{activePhoto.title}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span>{activePhoto.date}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Dimensions:</span>
                  <span className="font-mono text-sky-400">{activePhoto.dimensions}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-mono">{activePhoto.size}</span>
                </div>
                <div className="py-1 flex justify-between">
                  <span className="text-slate-500">Color Profile:</span>
                  <span>Display P3</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
