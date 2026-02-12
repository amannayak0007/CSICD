
import React, { useState, useEffect } from 'react';
import { Plot } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateRegionInsight } from '../services/gemini';

interface DashboardProps {
  plots: Plot[];
}

const Dashboard: React.FC<DashboardProps> = ({ plots }) => {
  const [aiInsight, setAiInsight] = useState("Generating real-time regional summary...");

  useEffect(() => {
    async function fetchInsight() {
        const result = await generateRegionInsight(plots);
        setAiInsight(result);
    }
    fetchInsight();
  }, [plots]);

  const totalDues = plots.reduce((sum, p) => sum + p.dues, 0);
  const violationCount = plots.filter(p => p.violations.length > 0).length;
  const criticalCount = plots.filter(p => p.riskScore > 80).length;

  const chartData = [
    { name: 'Siltara', violations: 5, revenue: 120000 },
    { name: 'Urla', violations: 8, revenue: 450000 },
    { name: 'Sirgitti', violations: 3, revenue: 85000 },
    { name: 'Tifra', violations: 2, revenue: 15000 },
  ];

  const pieData = [
    { name: 'Encroachment', value: 35, color: '#f43f5e' },
    { name: 'Unused Land', value: 45, color: '#f59e0b' },
    { name: 'Payment Default', value: 20, color: '#6366f1' },
  ];

  const MetricCard = ({ title, value, sub, icon, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl text-2xl">{icon}</div>
        {trend && (
           <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
             {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
           </span>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
      <p className="text-[11px] text-slate-400 mt-2 font-medium uppercase tracking-wide">{sub}</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Regional Monitoring Portal</h1>
          <p className="text-slate-500 font-medium">Chhattisgarh State Industrial Development Corporation (CSIDC)</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-slate-200 px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">Download Audit</button>
          <button className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">New Inspection Task</button>
        </div>
      </header>

      <div className="bg-slate-900 p-6 rounded-2xl flex items-center space-x-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none transform rotate-12 transition-transform group-hover:scale-110">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0l-7.97-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9z"/></svg>
        </div>
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shrink-0">🤖</div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">AI Regional Insight</h4>
          <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
            "{aiInsight}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Plot Revenue" value={`₹${(totalDues/1000000).toFixed(2)}M`} sub="Pending in Current Qtr" icon="💰" trend={12} />
        <MetricCard title="Violations Flagged" value={violationCount} sub="Detected via Satellite" icon="🚨" trend={5} />
        <MetricCard title="Critical Risk Plots" value={criticalCount} sub="Immediate Action Required" icon="⚠️" />
        <MetricCard title="Inspections Completed" value="84%" sub="Monthly Target: 90%" icon="✅" trend={-2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Violations by Region</h3>
            <div className="flex space-x-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Filters: </span>
                <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">All Regions</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="violations" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Violation Mix</h3>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Critical Alerts</h3>
            <button className="text-indigo-600 font-bold text-xs hover:underline">View All Task Logs</button>
        </div>
        <div className="divide-y divide-slate-100">
            {plots.filter(p => p.violations.length > 0).map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${p.riskScore > 80 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                            {p.riskScore}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{p.companyName}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Plot {p.plotNumber} | {p.region}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-rose-600">{p.violations[0].replace('_', ' ')}</p>
                            <p className="text-[10px] text-slate-400">Detected 2 days ago</p>
                        </div>
                        <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
