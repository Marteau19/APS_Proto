import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Sparkles, ArrowRight,
  Target, AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { kpis, kpiHistory } from '../data/mockData';

const trendIcons = {
  up: <TrendingUp size={14} />,
  down: <TrendingDown size={14} />,
  stable: <Minus size={14} />,
};

export default function KPIs() {
  const [selectedKpi, setSelectedKpi] = useState('otif');

  const kpiList = Object.entries(kpis);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">KPIs & Performance</h2>
          <p className="text-sm text-slate-500 mt-0.5">14-day rolling performance view</p>
        </div>
      </div>

      {/* FlowIQ Insight */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <Sparkles size={16} className="text-violet-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-violet-700">
            <strong>FlowIQ:</strong> OTIF has dropped 6 points over the past week. Root causes: 2 material delays (SS-316 shortage)
            and 1 unplanned downtime (CNC Lathe #1). Resolving the material issue would recover ~4 points.
          </p>
          <div className="flex gap-2 mt-2">
            <button className="text-xs text-violet-600 font-medium underline underline-offset-2">
              View root cause analysis
            </button>
            <button className="text-xs text-violet-600 font-medium underline underline-offset-2">
              Suggest improvements
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiList.map(([key, kpi]) => {
          const isGood = key === 'wip' || key === 'tardiness' || key === 'avgLeadTime' || key === 'changeovers'
            ? kpi.value <= kpi.target
            : kpi.value >= kpi.target;

          return (
            <button
              key={key}
              onClick={() => setSelectedKpi(key)}
              className={`text-left bg-white rounded-xl border-2 p-4 transition-all ${
                selectedKpi === key ? 'border-primary-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">{kpi.label}</span>
                <span className={`flex items-center gap-0.5 text-xs ${isGood ? 'text-emerald-600' : 'text-red-500'}`}>
                  {trendIcons[kpi.trend]}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold ${isGood ? 'text-slate-900' : 'text-red-600'}`}>
                  {kpi.value}
                </span>
                <span className="text-sm text-slate-400">{kpi.unit}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isGood ? 'bg-emerald-500' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  <Target size={8} className="inline mr-0.5" />
                  {kpi.target}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OTIF / Adherence Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">OTIF & Adherence Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={kpiHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <ReferenceLine y={95} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} />
              <Line type="monotone" dataKey="otif" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="OTIF %" />
              <Line type="monotone" dataKey="adherence" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Adherence %" />
              <Legend iconType="line" wrapperStyle={{ fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Throughput / Utilization */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Throughput & Utilization</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={kpiHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="throughput" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Throughput" />
              <Bar dataKey="utilization" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Utilization %" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Performance Alerts</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { metric: 'OTIF', issue: 'Below target (87% vs 95%)', action: 'Focus on material availability and machine uptime', severity: 'critical' },
            { metric: 'WIP', issue: 'Above target (18 vs 15)', action: 'Review release policies — consider gating new releases', severity: 'warning' },
            { metric: 'Late Orders', issue: '2 orders past due', action: 'Expedite WO-1008, negotiate WO-1002 delivery', severity: 'critical' },
            { metric: 'Utilization', issue: 'Below target (78% vs 85%)', action: 'CNC Lathe #1 downtime is primary driver', severity: 'warning' },
          ].map((alert, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <AlertTriangle size={14} className={
                alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
              } />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{alert.metric}: {alert.issue}</p>
                <p className="text-xs text-slate-500 mt-0.5">{alert.action}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                alert.severity === 'critical' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'
              }`}>
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
