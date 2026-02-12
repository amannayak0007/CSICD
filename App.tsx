
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapContainer';
import Dashboard from './components/Dashboard';
import PlotDetailsPanel from './components/PlotDetailsPanel';
import { MOCK_PLOTS } from './constants';
import { Plot } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard plots={MOCK_PLOTS} />}
        {activeTab === 'map' && (
          <div className="h-full w-full">
            <MapView 
              plots={MOCK_PLOTS} 
              onPlotSelect={(plot) => setSelectedPlot(plot)} 
            />
          </div>
        )}
        {(activeTab === 'analytics' || activeTab === 'reports' || activeTab === 'settings') && (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">
                🚧
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Feature Under Maintenance</h2>
             <p className="text-slate-500 max-w-sm">We are currently integrating deeper GeoServer and PostGIS data layers for {activeTab}. Check back in the next version.</p>
             <button onClick={() => setActiveTab('dashboard')} className="mt-8 bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold">Back to Dashboard</button>
          </div>
        )}
      </main>

      {selectedPlot && (
        <PlotDetailsPanel 
          plot={selectedPlot} 
          onClose={() => setSelectedPlot(null)} 
        />
      )}
    </div>
  );
};

export default App;
