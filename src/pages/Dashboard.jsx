import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight, Minus,
  Clock, CheckCircle2, XCircle, Package, Sparkles, TrendingUp
} from 'lucide-react';
import { orders, alerts, kpis, getStatusColor, getSeverityBadge } from '../data/mockData';
import { format } from 'date-fns';

const trendIcon = {
  up: <ArrowUpRight size={14} />,
  down: <ArrowDownRight size={14} />,
  stable: <Minus size={14} />,
};

export default function Dashboard() {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const atRiskOrders = orders.filter(o => ['at-risk', 'late'].includes(o.status));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* FlowIQ Morning Brief */}
      <div className="flowiq-card rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#051E40]/10 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-[#051E40] flowiq-icon" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#051E40] mb-1">FlowIQ Daily Brief</h2>
            <p className="text-sm text-[#051E40]/90 leading-relaxed">
              You have <strong className="text-[#051E40]">{criticalAlerts.length} critical alerts</strong> and <strong className="text-[#051E40]">{atRiskOrders.length} orders at risk</strong>.
              Top priority: <strong className="text-[#051E40]">WO-1008</strong> is past due — expediting could recover it today.
              CNC Lathe #1 is down, affecting 2 orders. I have rerouting options ready.
            </p>
            <div className="flex gap-2 mt-3">
              <Link to="/alerts" className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#051E40] px-3 py-1.5 rounded-lg hover:bg-[#051E40]/90 transition-colors">
                View alerts <ArrowRight size={12} />
              </Link>
              <Link to="/schedule" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#051E40]/70 hover:text-[#051E40]">
                Open schedule <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(kpis).slice(0, 4).map(([key, kpi]) => {
          const isGood = key === 'wip' || key === 'tardiness'
            ? kpi.value <= kpi.target
            : kpi.value >= kpi.target;

          return (
            <Link
              to="/kpis"
              key={key}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">{kpi.label}</span>
                <span className={`flex items-center gap-0.5 text-xs ${isGood ? 'text-emerald-600' : 'text-red-500'}`}>
                  {trendIcon[kpi.trend]}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                <span className="text-sm text-slate-400">{kpi.unit}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400">target {kpi.target}{kpi.unit}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Critical Alerts
            </h3>
            <Link to="/alerts" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {criticalAlerts.map(alert => (
              <div key={alert.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.impactSummary}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {format(alert.timestamp, 'HH:mm')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Orders */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Package size={16} className="text-amber-500" />
              Orders Requiring Attention
            </h3>
            <Link to="/orders" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {orders.filter(o => ['at-risk', 'late', 'in-progress'].includes(o.status)).slice(0, 5).map(order => (
              <Link
                to={`/orders/${order.id}`}
                key={order.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{order.id}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.product} — {order.customer}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-slate-700">
                    Due {format(order.dueDate, 'MMM dd')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${order.status === 'late' ? 'bg-red-500' : order.status === 'at-risk' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{order.progress}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Resource Status */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Resource Status</h3>
          <Link to="/capacity" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View capacity
          </Link>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Running', count: 7, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'Down', count: 1, color: 'bg-red-500', textColor: 'text-red-700' },
              { label: 'Changeover', count: 1, color: 'bg-amber-500', textColor: 'text-amber-700' },
              { label: 'Idle', count: 1, color: 'bg-slate-300', textColor: 'text-slate-600' },
              { label: 'Overloaded', count: 1, color: 'bg-orange-500', textColor: 'text-orange-700' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <div>
                  <span className="text-lg font-bold text-slate-900">{s.count}</span>
                  <p className="text-[11px] text-slate-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
