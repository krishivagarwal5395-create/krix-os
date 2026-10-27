import React, { useState } from 'react';
import { MapPin, Search, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react';

interface CityLoc {
  name: string;
  lat: number;
  lon: number;
  zoom: number;
  desc: string;
}

const CITIES: CityLoc[] = [
  { name: 'Morrisville (Lenovo HQ)', lat: 35.8324, lon: -78.8256, zoom: 14, desc: 'Lenovo Global Technology Center' },
  { name: 'New York City', lat: 40.7128, lon: -74.006, zoom: 12, desc: 'Metropolis & Commercial Core' },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, zoom: 12, desc: 'Silicon Valley Innovations' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, zoom: 12, desc: 'Shinjuku & Akihabara Engineering' },
  { name: 'London', lat: 51.5074, lon: -0.1278, zoom: 12, desc: 'Historic Thames Innovation District' },
];

export const MapsApp: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityLoc>(CITIES[0]);
  const [search, setSearch] = useState('');

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Generate OpenStreetMap embed tile URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${selectedCity.lon - 0.04}%2C${selectedCity.lat - 0.03}%2C${selectedCity.lon + 0.04}%2C${selectedCity.lat + 0.03}&layer=mapnik&marker=${selectedCity.lat}%2C${selectedCity.lon}`;

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar Search and Places */}
      <div className="w-64 bg-slate-950/80 border-r border-white/10 p-3 flex flex-col shrink-0">
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
          Featured Hubs
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 text-xs">
          {filteredCities.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCity(c)}
              className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                selectedCity.name === c.name
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <MapPin size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              <div>
                <div>{c.name}</div>
                <div className="text-[10px] text-slate-400 font-normal">{c.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Frame */}
      <div className="flex-1 relative bg-slate-950">
        <iframe
          src={mapUrl}
          className="w-full h-full border-none filter invert contrast-125 opacity-90"
          title="KRIX OpenStreetMap"
        />
        {/* Floating Location Overlay */}
        <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <Navigation size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{selectedCity.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              {selectedCity.lat.toFixed(4)}° N, {selectedCity.lon.toFixed(4)}° W
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
