import { useState } from 'react';
import {
  GitBranch, Plus, Sparkles, Check, ArrowRight,
  Copy, Trash2, ChevronRight, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import { scenarios } from '../data/mockData';

const kpiLabels = {
  otif: { label: 'OTIF', unit: '%', target: 95, better: 'higher' },
  utilization: { label: 'Utilization', unit: '%', target: 85, better: 'higher' },
  lateness: { label: 'Late Orders', unit: '', target: 0, better: 'lower' },
  makespan: { label: 'Makespan', unit: 'days', target: 8, better: 'lower' },
};

export default function Scenarios() {
  const [selected, setSelected] = useState(['SCN-BASE', 'SCN-001']);
  const [showCreate, setShowCreate] = useState(false);

  const baseline = scenarios.find(s => s.type === 'baseline');
  const selectedScenarios = scenarios.filter(s => selected.includes(s.id));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">What-If Scenarios</h2>
          <p className="text-sm text-slate-500 mt-0.5">Compare plan alternatives side by side</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
          >
            <Plus size={14} /> New scenario
          </button>
          <button className="flowiq-card flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#051E40] font-medium hover:opacity-90">
            <Sparkles size={12} /> Generate with FlowIQ
          </button>
        </div>
      </div>

      {/* FlowIQ suggestion */}
      <div className="flowiq-card rounded-xl px-5 py-4 flex items-start gap-3">
        <Sparkles size={16} className="text-[#051E40] mt-0.5 shrink-0 flowiq-icon" />
        <div>
          <p className="text-sm text-[#051E40]/90">
            <strong className="text-[#051E40]">FlowIQ:</strong> I've generated 2 what-if scenarios based on your current exceptions.
            "Rush WO-1002 + Overtime" shows the best OTIF improvement (+5 points) with moderate cost impact.
          </p>
          <button className="text-xs text-[#051E40] font-medium mt-1 underline underline-offset-2">
            Compare both scenarios below
          </button>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map(scenario => {
          const isSelected = selected.includes(scenario.id);
          const isBaseline = scenario.type === 'baseline';

          return (
            <div
              key={scenario.id}
              className={`bg-white rounded-xl border-2 transition-all cursor-pointer ${
                isSelected ? 'border-primary-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                if (isBaseline) return;
                setSelected(prev =>
                  prev.includes(scenario.id)
                    ? prev.filter(s => s !== scenario.id)
                    : [...prev, scenario.id]
                );
              }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {isBaseline ? (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <GitBranch size={16} className="text-slate-500" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                      <GitBranch size={16} className="text-violet-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{scenario.name}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      isBaseline ? 'bg-slate-100 text-slate-600' : 'bg-violet-100 text-violet-700'
                    }`}>
                      {isBaseline ? 'BASELINE' : 'WHAT-IF'}
                    </span>
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-primary-500 ml-auto" />
                  )}
                </div>

                {scenario.description && (
                  <p className="text-xs text-slate-500 mb-3">{scenario.description}</p>
                )}

                {scenario.changes && (
                  <div className="space-y-1 mb-3">
                    {scenario.changes.map((c, i) => (
                      <p key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-violet-500 mt-0.5">+</span> {c}
                      </p>
                    ))}
                  </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  {Object.entries(scenario.kpis).map(([key, value]) => {
                    const meta = kpiLabels[key];
                    const baseVal = baseline.kpis[key];
                    const diff = value - baseVal;
                    const isImprovement = meta.better === 'higher' ? diff > 0 : diff < 0;

                    return (
                      <div key={key} className="text-center p-2 rounded-lg bg-slate-50">
                        <p className="text-[10px] text-slate-400 mb-0.5">{meta.label}</p>
                        <p className="text-lg font-bold text-slate-900">{value}{meta.unit}</p>
                        {!isBaseline && diff !== 0 && (
                          <p className={`text-[10px] font-medium ${isImprovement ? 'text-emerald-600' : 'text-red-500'}`}>
                            {diff > 0 ? '+' : ''}{diff}{meta.unit}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {!isBaseline && (
                <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
                    Promote to plan
                  </button>
                  <button className="text-xs px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                    <Copy size={12} />
                  </button>
                  <button className="text-xs px-2 py-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Side-by-side comparison */}
      {selectedScenarios.length >= 2 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Side-by-Side Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 w-40">Metric</th>
                  {selectedScenarios.map(s => (
                    <th key={s.id} className="text-center text-xs font-medium text-slate-700 px-5 py-3">
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(kpiLabels).map(([key, meta]) => (
                  <tr key={key} className="border-b border-slate-50">
                    <td className="px-5 py-3 text-xs text-slate-600">{meta.label}</td>
                    {selectedScenarios.map(s => {
                      const val = s.kpis[key];
                      const baseVal = baseline.kpis[key];
                      const diff = val - baseVal;
                      const isImprovement = meta.better === 'higher' ? diff > 0 : diff < 0;
                      const isBaseline = s.type === 'baseline';

                      return (
                        <td key={s.id} className="text-center px-5 py-3">
                          <span className="text-sm font-semibold text-slate-900">
                            {val}{meta.unit}
                          </span>
                          {!isBaseline && diff !== 0 && (
                            <span className={`ml-1.5 text-xs font-medium ${isImprovement ? 'text-emerald-600' : 'text-red-500'}`}>
                              ({diff > 0 ? '+' : ''}{diff})
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
