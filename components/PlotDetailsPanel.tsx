
import React, { useState, useEffect } from 'react';
import { Plot, ViolationType } from '../types';
import { analyzePlotCompliance } from '../services/gemini';

interface PlotDetailsPanelProps {
  plot: Plot;
  onClose: () => void;
}

const PlotDetailsPanel: React.FC<PlotDetailsPanelProps> = ({ plot, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true);
      const result = await analyzePlotCompliance(plot);
      setAiAnalysis(result || "No assessment available.");
      setLoading(false);
    }
    fetchAnalysis();
  }, [plot]);

  return (
    <div className="fixed top-0 right-0 w-[420px] h-full bg-white shadow-2xl z-[2000] flex flex-col border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right duration-300">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-bold">Plot Details: {plot.plotNumber}</h2>
          <p className="text-xs text-slate-400 font-medium">Allotted to: {plot.companyName}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${plot.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-sm font-semibold capitalize">{plot.status.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Risk Level</p>
            <p className={`text-sm font-bold ${plot.riskScore > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {plot.riskScore > 80 ? 'CRITICAL' : plot.riskScore > 50 ? 'HIGH' : 'STABLE'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
            <span className="mr-2">📏</span> Area Metrics
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span className="text-slate-500">Allocated Area</span>
              <span className="font-medium">{plot.areaAllocated.toLocaleString()} m²</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span className="text-slate-500">Current Footprint</span>
              <span className={`font-bold ${plot.areaCurrent > plot.areaAllocated ? 'text-rose-600' : 'text-slate-800'}`}>
                {plot.areaCurrent.toLocaleString()} m²
              </span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-slate-500">Deviation</span>
              <span className={`font-bold ${plot.areaCurrent > plot.areaAllocated ? 'text-rose-600' : 'text-emerald-600'}`}>
                {(((plot.areaCurrent - plot.areaAllocated) / plot.areaAllocated) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
            <span className="mr-2">🚨</span> Active Violations
          </h3>
          <div className="flex flex-wrap gap-2">
            {plot.violations.length === 0 ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium">None detected</span>
            ) : (
              plot.violations.map(v => (
                <span key={v} className="text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full font-medium border border-rose-200 uppercase tracking-tight">
                  {v.replace('_', ' ')}
                </span>
              ))
            )}
          </div>
        </div>

        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                <span className="mr-2">💳</span> Financial Status
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Outstanding Dues</p>
                    <p className="text-lg font-bold text-slate-900">₹{plot.dues.toLocaleString()}</p>
                </div>
                <button className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-indigo-700">Generate Notice</button>
            </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
            <span className="mr-2">🤖</span> AI-Powered Compliance Review
          </h3>
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 relative min-h-[100px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] text-indigo-600 font-medium uppercase tracking-widest">Analyzing Satellite Frames...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed italic">
                {aiAnalysis}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                View History
            </button>
            <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                Physical Inspection
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlotDetailsPanel;
