import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Filter, ZoomIn, ZoomOut,
  Lock, Unlock, Sparkles, ArrowRight, MoreHorizontal, Clock
} from 'lucide-react';
import { orders, resources, getStatusColor, getPriorityColor } from '../data/mockData';
import { format, addDays, differenceInHours, startOfDay, isToday } from 'date-fns';

const today = startOfDay(new Date());
const HOUR_WIDTH = 12;
const ROW_HEIGHT = 44;
const DAYS_VISIBLE = 7;
const HEADER_HEIGHT = 60;

export default function Schedule() {
  const [viewDays, setViewDays] = useState(DAYS_VISIBLE);
  const [frozenDays, setFrozenDays] = useState(1);
  const [showFlowIQHint, setShowFlowIQHint] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const days = useMemo(() =>
    Array.from({ length: viewDays }, (_, i) => addDays(today, i)),
    [viewDays]
  );

  const totalWidth = viewDays * 24 * HOUR_WIDTH;

  const filteredResources = resources;

  const getBarStyle = (op) => {
    const startOffset = differenceInHours(op.start, today);
    const width = op.duration * HOUR_WIDTH;
    const left = startOffset * HOUR_WIDTH;
    return { left: Math.max(0, left), width: Math.max(width, 20) };
  };

  const getBarColor = (order, op) => {
    if (op.status === 'complete') return 'bg-slate-300 border-slate-400';
    if (order.status === 'late') return 'bg-red-400 border-red-500';
    if (order.status === 'at-risk') return 'bg-amber-400 border-amber-500';
    if (op.status === 'in-progress') return 'bg-blue-400 border-blue-500';
    return 'bg-primary-400 border-primary-500';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Planning Board</h2>
        <div className="w-px h-5 bg-slate-200" />

        <div className="flex items-center gap-1 text-xs">
          <button className="px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium">
            Resource
          </button>
          <button className="px-2.5 py-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors">
            Order
          </button>
        </div>

        <div className="w-px h-5 bg-slate-200" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewDays(Math.max(3, viewDays - 2))}
            className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ZoomIn size={16} />
          </button>
          <span className="text-xs text-slate-500 min-w-[50px] text-center">{viewDays} days</span>
          <button
            onClick={() => setViewDays(Math.min(14, viewDays + 2))}
            className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ZoomOut size={16} />
          </button>
        </div>

        <div className="w-px h-5 bg-slate-200" />

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Lock size={12} className="text-amber-500" />
          <span>Frozen: {frozenDays}d</span>
        </div>

        <div className="flex-1" />

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
          <Filter size={12} />
          Filters
        </button>

        <button className="flowiq-card flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-medium hover:opacity-90">
          <Sparkles size={12} />
          Optimize
        </button>
      </div>

      {/* FlowIQ inline hint */}
      {showFlowIQHint && (
        <div className="mx-4 mt-3 flex items-center gap-3 px-4 py-2.5 flowiq-card rounded-lg animate-fade-in">
          <Sparkles size={14} className="text-white shrink-0 flowiq-icon" />
          <p className="text-xs text-white/90 flex-1">
            <strong className="text-white">FlowIQ:</strong> I detected a scheduling conflict on CNC Mill #1 tomorrow. WO-1003 and WO-1001 overlap by 2h.
            <button className="ml-1 text-white underline underline-offset-2 font-medium">View suggestion</button>
          </p>
          <button onClick={() => setShowFlowIQHint(false)} className="text-white/50 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Gantt area */}
      <div className="flex-1 flex overflow-hidden mx-4 mt-3 mb-4 bg-white rounded-xl border border-slate-200">
        {/* Resource sidebar */}
        <div className="w-48 shrink-0 border-r border-slate-200 bg-slate-50">
          <div className="h-[60px] border-b border-slate-200 flex items-end px-3 pb-2">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Resource</span>
          </div>
          {filteredResources.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 px-3 border-b border-slate-100 hover:bg-slate-100 transition-colors"
              style={{ height: ROW_HEIGHT }}
            >
              <div className={`w-2 h-2 rounded-full ${
                r.status === 'running' ? 'bg-emerald-500' :
                r.status === 'down' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">{r.name}</p>
                <p className="text-[10px] text-slate-400">{r.dept}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-auto">
          <div style={{ width: totalWidth, minWidth: '100%' }}>
            {/* Day headers */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 flex" style={{ height: HEADER_HEIGHT }}>
              {days.map((day, i) => {
                const isFrozen = i < frozenDays;
                return (
                  <div
                    key={i}
                    className={`border-r border-slate-100 flex flex-col justify-end pb-2 px-3 ${
                      isFrozen ? 'bg-amber-50/50' : isToday(day) ? 'bg-blue-50/30' : ''
                    }`}
                    style={{ width: 24 * HOUR_WIDTH }}
                  >
                    <div className="flex items-center gap-1.5">
                      {isFrozen && <Lock size={10} className="text-amber-500" />}
                      <span className={`text-xs font-semibold ${
                        isToday(day) ? 'text-primary-600' : 'text-slate-700'
                      }`}>
                        {format(day, 'EEE, MMM d')}
                      </span>
                      {isToday(day) && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 font-medium">
                          TODAY
                        </span>
                      )}
                    </div>
                    <div className="flex mt-1">
                      {[6, 12, 18].map(h => (
                        <span key={h} className="text-[9px] text-slate-400 flex-1">
                          {h}:00
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resource rows */}
            {filteredResources.map((resource) => {
              const resourceOps = orders.flatMap(order =>
                order.operations
                  .filter(op => op.resource === resource.id)
                  .map(op => ({ ...op, order }))
              );

              return (
                <div
                  key={resource.id}
                  className="relative border-b border-slate-50"
                  style={{ height: ROW_HEIGHT }}
                >
                  {/* Frozen zone overlay */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-amber-50/20 border-r border-amber-200/50 z-[1] pointer-events-none"
                    style={{ width: frozenDays * 24 * HOUR_WIDTH }}
                  />

                  {/* Now line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-400 z-[2]"
                    style={{ left: differenceInHours(new Date(), today) * HOUR_WIDTH }}
                  />

                  {/* Operation bars */}
                  {resourceOps.map((op) => {
                    const style = getBarStyle(op);
                    const color = getBarColor(op.order, op);
                    return (
                      <Link
                        to={`/orders/${op.order.id}`}
                        key={`${op.order.id}-${op.id}`}
                        className={`absolute top-1.5 h-[28px] rounded-md border cursor-pointer hover:brightness-95 transition-all flex items-center px-2 z-[3] ${color}`}
                        style={{
                          left: style.left,
                          width: style.width,
                        }}
                        onMouseEnter={() => setSelectedOrder(op.order.id)}
                        onMouseLeave={() => setSelectedOrder(null)}
                      >
                        <span className="text-[10px] font-medium text-white truncate drop-shadow-sm">
                          {op.order.id} — {op.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-4 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-primary-400" /> Scheduled</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-400" /> In Progress</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-amber-400" /> At Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-red-400" /> Late</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-slate-300" /> Complete</div>
        <div className="flex items-center gap-1.5"><div className="w-px h-3 bg-red-400" /> Now</div>
        <div className="flex items-center gap-1.5"><Lock size={10} className="text-amber-500" /> Frozen</div>
      </div>
    </div>
  );
}
