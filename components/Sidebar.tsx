
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'map', label: 'GIS Map View', icon: '🗺️' },
    { id: 'analytics', label: 'Violation Analytics', icon: '🚨' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            C
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CSIDC GIS</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'analytics' && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  12
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/40/40" alt="Avatar" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">Administrator</span>
            <span className="text-xs text-slate-500 truncate">Regional Head - Raipur</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
