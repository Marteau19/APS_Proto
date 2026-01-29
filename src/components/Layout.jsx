import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarRange, AlertTriangle, ClipboardList,
  BarChart3, GitBranch, Gauge, Handshake, Sparkles, X, Send,
  ChevronRight, Search, Bell, User
} from 'lucide-react';
import FlowIQPanel from './FlowIQPanel';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/schedule', icon: CalendarRange, label: 'Schedule' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts', badge: 4 },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/capacity', icon: BarChart3, label: 'Capacity' },
  { to: '/scenarios', icon: GitBranch, label: 'Scenarios' },
  { to: '/kpis', icon: Gauge, label: 'KPIs' },
  { to: '/promise', icon: Handshake, label: 'Promise' },
];

export default function Layout() {
  const [flowiqOpen, setFlowiqOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find(n => n.to === location.pathname)?.label || 'FlowAPS';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-20 bg-slate-900 flex flex-col items-center py-5 gap-1.5 shrink-0">
        <div className="w-11 h-11 rounded-lg bg-primary-500 flex items-center justify-center mb-5">
          <span className="text-white font-bold text-base">F</span>
        </div>

        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative w-12 h-12 rounded-lg flex items-center justify-center transition-colors group
              ${isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`
            }
          >
            <Icon size={22} />
            {badge && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                {badge}
              </span>
            )}
            <span className="absolute left-16 bg-slate-800 text-white text-sm px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {label}
            </span>
          </NavLink>
        ))}

        <div className="mt-auto flex flex-col gap-1 items-center">
          <button
            onClick={() => setFlowiqOpen(!flowiqOpen)}
            className="w-12 h-12 rounded-lg flex items-center justify-center bg-violet-600 text-white hover:bg-violet-500 transition-colors flowiq-pulse"
            title="FlowIQ Assistant"
          >
            <Sparkles size={22} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0">
          <h1 className="text-base font-semibold text-slate-900">{currentPage}</h1>

          <div className="flex-1" />

          {/* Command bar trigger */}
          <button
            onClick={() => setCommandOpen(!commandOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-400 text-sm hover:border-slate-300 hover:text-slate-500 transition-colors"
          >
            <Search size={16} />
            <span>Search or ask FlowIQ...</span>
            <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
              Ctrl+K
            </kbd>
          </button>

          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500" />
          </button>

          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <User size={18} className="text-slate-500" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* FlowIQ Side Panel */}
      {flowiqOpen && (
        <FlowIQPanel onClose={() => setFlowiqOpen(false)} />
      )}

      {/* Command Palette */}
      {commandOpen && (
        <CommandPalette onClose={() => setCommandOpen(false)} />
      )}
    </div>
  );
}

function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('');

  const suggestions = [
    { label: 'Show late orders', type: 'query' },
    { label: 'What should I fix first?', type: 'flowiq' },
    { label: 'Open WO-1002', type: 'navigate' },
    { label: 'Show CNC capacity this week', type: 'query' },
    { label: 'Simulate rushing WO-1008', type: 'flowiq' },
    { label: 'Compare scenarios', type: 'navigate' },
  ].filter(s => !query || s.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search size={20} className="text-slate-400" />
          <input
            autoFocus
            className="flex-1 text-base outline-none bg-transparent placeholder-slate-400"
            placeholder="Search orders, resources, or ask FlowIQ..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 font-mono">ESC</kbd>
        </div>
        <div className="py-2 max-h-80 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-5 py-3 text-base text-left hover:bg-slate-50 transition-colors"
              onClick={onClose}
            >
              {s.type === 'flowiq' ? (
                <Sparkles size={16} className="text-indigo-500" />
              ) : s.type === 'navigate' ? (
                <ChevronRight size={16} className="text-slate-400" />
              ) : (
                <Search size={16} className="text-slate-400" />
              )}
              <span className="text-slate-700">{s.label}</span>
              <span className="ml-auto text-xs text-slate-400 capitalize">{s.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
