import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Wrench, Package, Layers, Clock,
  Check, ChevronRight, Sparkles, Filter, ArrowRight, Settings
} from 'lucide-react';
import { alerts, getSeverityColor, getSeverityBadge } from '../data/mockData';
import { format, formatDistanceToNow } from 'date-fns';

const typeIcons = {
  'machine-down': Wrench,
  'material-shortage': Package,
  'capacity-overload': Layers,
  'late-order': Clock,
  'changeover': Settings,
  'schedule-conflict': AlertTriangle,
};

const filterOptions = ['all', 'critical', 'warning', 'info'];
const statusOptions = ['all', 'open', 'acknowledged'];

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedAlert, setExpandedAlert] = useState(null);

  const filtered = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Exceptions & Alerts</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {alerts.filter(a => a.status === 'open').length} open &middot;
            Prioritized by business impact
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
          {filterOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSeverityFilter(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                severityFilter === opt
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
          {statusOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === opt
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt === 'all' ? 'All Status' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const Icon = typeIcons[alert.type] || AlertTriangle;
          const isExpanded = expandedAlert === alert.id;

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border border-slate-200 overflow-hidden transition-all ${
                isExpanded ? 'shadow-md' : 'hover:shadow-sm'
              }`}
            >
              {/* Alert header */}
              <button
                className="w-full text-left px-5 py-4 flex items-start gap-4"
                onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-100' :
                  alert.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  <Icon size={18} className={
                    alert.severity === 'critical' ? 'text-red-600' :
                    alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 capitalize">
                      {alert.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{alert.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{alert.impactSummary}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400">{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</p>
                  <ChevronRight size={16} className={`text-slate-300 mt-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 animate-fade-in">
                  <div className="border-t border-slate-100 pt-4 space-y-4">
                    <p className="text-sm text-slate-600">{alert.description}</p>

                    {/* Impacted orders */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Impacted Orders</h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.impactedOrders.map(oid => (
                          <Link
                            key={oid}
                            to={`/orders/${oid}`}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-primary-600 font-medium hover:bg-primary-50 transition-colors"
                          >
                            {oid}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* FlowIQ suggestion */}
                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles size={16} className="text-violet-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="text-xs font-semibold text-violet-800 mb-1">FlowIQ Recommendation</h4>
                          <p className="text-sm text-violet-700">{alert.flowiqSuggestion}</p>
                          <div className="flex gap-2 mt-3">
                            <button className="text-xs px-3 py-1.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors">
                              Apply suggestion
                            </button>
                            <button className="text-xs px-3 py-1.5 rounded-lg border border-violet-300 text-violet-700 font-medium hover:bg-violet-100 transition-colors">
                              Simulate first
                            </button>
                            <button className="text-xs px-3 py-1.5 rounded-lg text-violet-600 font-medium hover:bg-violet-100 transition-colors">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {alert.status === 'open' && (
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                          <Check size={12} /> Acknowledge
                        </button>
                      )}
                      {alert.resource && (
                        <Link
                          to="/capacity"
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                        >
                          View resource <ArrowRight size={12} />
                        </Link>
                      )}
                      <Link
                        to="/schedule"
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                      >
                        Open in schedule <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
