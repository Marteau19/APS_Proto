import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Sparkles, AlertTriangle, ChevronDown, ChevronRight, Filter
} from 'lucide-react';
import { capacityData, getStatusColor } from '../data/mockData';

export default function Capacity() {
  const [expandedResource, setExpandedResource] = useState(null);
  const [deptFilter, setDeptFilter] = useState('all');

  const departments = ['all', ...new Set(capacityData.map(r => r.dept))];

  const filtered = capacityData.filter(r =>
    deptFilter === 'all' || r.dept === deptFilter
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Capacity & Load</h2>
          <p className="text-sm text-slate-500 mt-0.5">Load vs. capacity by resource — 7-day view</p>
        </div>
        <button className="flowiq-card flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-medium hover:opacity-90">
          <Sparkles size={12} /> Find bottlenecks
        </button>
      </div>

      {/* FlowIQ Insight */}
      <div className="flowiq-card rounded-xl px-5 py-4 flex items-start gap-3">
        <Sparkles size={16} className="text-white mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-white/90">
            <strong className="text-white">Bottleneck detected:</strong> Paint Line 1 is at 135% capacity for days +2 to +4.
            CNC Lathe #1 is down. Recommended: reroute CNC jobs to Mill #2 and defer low-priority paint jobs.
          </p>
        </div>
      </div>

      {/* Department filter */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 w-fit">
        {departments.map(d => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              deptFilter === d
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {d === 'all' ? 'All Departments' : d}
          </button>
        ))}
      </div>

      {/* Resource capacity rows */}
      <div className="space-y-3">
        {filtered.map(resource => {
          const isExpanded = expandedResource === resource.id;
          const maxUtil = Math.max(...resource.days.map(d => d.utilization));
          const avgUtil = Math.round(resource.days.reduce((s, d) => s + d.utilization, 0) / resource.days.length);
          const isOverloaded = maxUtil > 100;
          const isDown = resource.status === 'down';

          return (
            <div key={resource.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedResource(isExpanded ? null : resource.id)}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${
                  isDown ? 'bg-red-500' :
                  resource.status === 'changeover' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                <div className="w-40 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{resource.name}</p>
                  <p className="text-[10px] text-slate-400">{resource.dept} &middot; {resource.type}</p>
                </div>

                {/* Inline sparkline bars */}
                <div className="flex-1 flex items-end gap-1 h-8">
                  {resource.days.map((day, i) => {
                    const pct = Math.min(day.utilization, 140);
                    const barHeight = (pct / 140) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full max-w-[32px] bg-slate-100 rounded-sm h-8 relative overflow-hidden">
                          <div
                            className={`absolute bottom-0 w-full rounded-sm transition-all ${
                              day.utilization > 100 ? 'bg-red-400' :
                              day.utilization > 85 ? 'bg-amber-400' :
                              day.utilization === 0 ? 'bg-slate-300' : 'bg-emerald-400'
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                          {/* 100% line */}
                          <div className="absolute w-full border-t border-dashed border-slate-300" style={{ bottom: `${(100/140)*100}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-400">{day.day.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-right w-20 shrink-0">
                  <p className={`text-sm font-semibold ${
                    isDown ? 'text-red-500' :
                    avgUtil > 100 ? 'text-red-600' :
                    avgUtil > 85 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {isDown ? 'DOWN' : `${avgUtil}%`}
                  </p>
                  <p className="text-[10px] text-slate-400">avg util.</p>
                </div>

                {isOverloaded && !isDown && (
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                )}

                {isExpanded ? (
                  <ChevronDown size={16} className="text-slate-400" />
                ) : (
                  <ChevronRight size={16} className="text-slate-400" />
                )}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 animate-fade-in">
                  <div className="border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-7 gap-3">
                      {resource.days.map((day, i) => (
                        <div key={i} className="text-center">
                          <p className="text-xs font-medium text-slate-700 mb-2">{day.day}</p>
                          <div className="w-full bg-slate-100 rounded-lg h-24 relative overflow-hidden">
                            <div
                              className={`absolute bottom-0 w-full rounded-lg transition-all ${
                                day.utilization > 100 ? 'bg-red-200' :
                                day.utilization > 85 ? 'bg-amber-200' :
                                day.utilization === 0 ? 'bg-slate-200' : 'bg-emerald-200'
                              }`}
                              style={{ height: `${Math.min(day.utilization, 100)}%` }}
                            />
                            {day.utilization > 100 && (
                              <div
                                className="absolute bottom-0 w-full bg-red-400/30"
                                style={{ height: `100%` }}
                              />
                            )}
                          </div>
                          <p className={`text-xs font-semibold mt-1.5 ${
                            day.utilization > 100 ? 'text-red-600' :
                            day.utilization > 85 ? 'text-amber-600' :
                            day.utilization === 0 ? 'text-slate-400' : 'text-emerald-600'
                          }`}>
                            {day.utilization}%
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {day.load}h / {day.capacity}h
                          </p>
                        </div>
                      ))}
                    </div>

                    {isOverloaded && (
                      <div className="mt-4 flowiq-card rounded-lg p-3 flex items-start gap-2">
                        <Sparkles size={14} className="text-white mt-0.5 shrink-0" />
                        <p className="text-xs text-white/90">
                          <strong className="text-white">FlowIQ:</strong> This resource is overloaded. I can suggest load leveling
                          by shifting {isDown ? 'jobs to alternate resources' : 'lower-priority jobs to lighter days'}.
                          <button className="ml-1 text-[#43C4EF] underline underline-offset-2 font-medium">
                            Show options
                          </button>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-2">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-400" /> &lt;85%</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-400" /> 85-100%</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-400" /> &gt;100%</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-300" /> Down/Idle</div>
        <div className="flex items-center gap-1.5"><div className="border-t border-dashed border-slate-400 w-4" /> 100% capacity line</div>
      </div>
    </div>
  );
}
