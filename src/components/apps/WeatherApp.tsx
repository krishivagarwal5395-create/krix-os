import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Sun, Compass, RefreshCw } from 'lucide-react';

export const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('ThinkPad Station');
  const [temp, setTemp] = useState('22°C');
  const [condition, setCondition] = useState('Partly Cloudy');
  const [humidity, setHumidity] = useState('48%');
  const [windSpeed, setWindSpeed] = useState('14 km/h');
  const [hourly, setHourly] = useState([
    { time: '10 AM', temp: '20°' },
    { time: '12 PM', temp: '23°' },
    { time: '02 PM', temp: '25°' },
    { time: '04 PM', temp: '24°' },
    { time: '06 PM', temp: '21°' },
    { time: '08 PM', temp: '18°' },
  ]);

  const [forecast, setForecast] = useState([
    { day: 'Today', high: '25°', low: '16°', cond: 'Partly Cloudy' },
    { day: 'Wed', high: '24°', low: '15°', cond: 'Sunny' },
    { day: 'Thu', high: '22°', low: '14°', cond: 'Breezy' },
    { day: 'Fri', high: '20°', low: '13°', cond: 'Light Rain' },
    { day: 'Sat', high: '23°', low: '15°', cond: 'Clear' },
  ]);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-6">
      {/* Current Weather Banner */}
      <div className="flex flex-col items-center text-center space-y-1">
        <h2 className="text-xl font-bold text-white">{city}</h2>
        <div className="text-5xl font-bold tracking-tight text-white font-mono mt-2">{temp}</div>
        <p className="text-sm text-sky-200">{condition}</p>
        <p className="text-xs text-slate-400">H: 25°  L: 16° · Lenovo Intelligent Climate Monitor</p>
      </div>

      {/* Hourly Forecast Curve */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
        <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Hourly Forecast</span>
        <div className="flex justify-between items-center text-xs text-center divide-x divide-white/5">
          {hourly.map((h, i) => (
            <div key={i} className="flex-1 px-2 space-y-1">
              <span className="text-[11px] text-slate-400">{h.time}</span>
              <CloudSun size={18} className="mx-auto text-amber-300" />
              <span className="font-mono text-white font-semibold">{h.temp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: 7-Day Forecast & Atmospheric Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 7-Day Forecast */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">5-Day Outlook</span>
          <div className="space-y-2 text-xs">
            {forecast.map((f) => (
              <div key={f.day} className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="font-semibold text-white w-14">{f.day}</span>
                <span className="text-slate-400 flex-1 px-2">{f.cond}</span>
                <div className="flex gap-2 font-mono">
                  <span className="text-white">{f.high}</span>
                  <span className="text-slate-500">{f.low}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atmospheric Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-sky-300">
              <Droplets size={15} />
              <span>Humidity</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{humidity}</div>
            <span className="text-[10px] text-slate-400">Dew point 11°C</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-sky-300">
              <Wind size={15} />
              <span>Wind Speed</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{windSpeed}</div>
            <span className="text-[10px] text-slate-400">NNW gentle breeze</span>
          </div>
        </div>
      </div>
    </div>
  );
};
