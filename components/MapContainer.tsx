
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Plot, ViolationType } from '../types';

interface MapViewProps {
  plots: Plot[];
  onPlotSelect: (plot: Plot) => void;
}

// Utility to center map on load
const MapCenterer = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ plots, onPlotSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState('Siltara');

  const getPlotColor = (plot: Plot) => {
    if (plot.violations.includes(ViolationType.ENCROACHMENT)) return '#f43f5e'; // rose-500
    if (plot.violations.includes(ViolationType.UNUSED_LAND)) return '#f59e0b'; // amber-500
    if (plot.status === 'under_construction') return '#3b82f6'; // blue-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-xl border border-slate-200 flex flex-col space-y-2">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Region Control</h4>
         <select 
           value={selectedRegion}
           onChange={(e) => setSelectedRegion(e.target.value)}
           className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none"
         >
           <option value="Siltara">Siltara Industrial Area</option>
           <option value="Urla">Urla Industrial Cluster</option>
           <option value="Sirgitti">Sirgitti Bilaspur</option>
         </select>
      </div>

      <div className="absolute bottom-10 right-10 z-[1000] bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-2xl border border-slate-200/50">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Map Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-rose-500"></div>
            <span className="text-[11px] font-semibold text-slate-600">Encroachment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-[11px] font-semibold text-slate-600">Unused Plot</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-[11px] font-semibold text-slate-600">Under Construction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-[11px] font-semibold text-slate-600">Compliant / Active</span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={[21.365, 81.655]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapCenterer center={[21.365, 81.655]} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite Imagery">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/intl/en-GB_ALL/help/terms_maps/">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {plots.map((plot) => (
          <Polygon
            key={plot.id}
            positions={plot.coordinates}
            pathOptions={{ 
              color: getPlotColor(plot),
              fillColor: getPlotColor(plot),
              fillOpacity: 0.35,
              weight: 2
            }}
            eventHandlers={{
              click: () => onPlotSelect(plot),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-sm text-slate-900">{plot.companyName}</h3>
                <p className="text-xs text-slate-500 font-medium">{plot.plotNumber} | {plot.areaAllocated} m²</p>
                <div className="mt-2 flex items-center space-x-2">
                   <button 
                     onClick={() => onPlotSelect(plot)}
                     className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-indigo-700 transition-colors"
                   >
                     Inspect Details
                   </button>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
