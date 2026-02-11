import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Filter, ZoomIn, ZoomOut,
  Lock, Unlock, Sparkles, ArrowRight, MoreHorizontal, Clock,
  X, Brain, Eye, AlertTriangle, CheckCircle2, Info, GripVertical
} from 'lucide-react';
import { orders, resources, getStatusColor, getPriorityColor } from '../data/mockData';
import { format, addDays, differenceInHours, startOfDay, isToday } from 'date-fns';
import TypewriterText from '../components/TypewriterText';

const today = startOfDay(new Date());
const HOUR_WIDTH = 12;
const ROW_HEIGHT = 44;
const DAYS_VISIBLE = 7;
const HEADER_HEIGHT = 60;

// Mock algorithm reasoning for each operation
const algorithmReasons = {
  'WO-1001-OP20': {
    decision: 'Scheduled on CNC Mill #1, starting at 8:00 today',
    reasons: [
      { type: 'constraint', text: 'Predecessor OP10 (CNC Turning) completed — dependency satisfied' },
      { type: 'optimization', text: 'CNC-01 had earliest available slot, minimizing wait time by 3h vs CNC-02' },
      { type: 'learned', text: 'Previous planner corrections show preference for CNC-01 for Drive Shaft milling (89% confidence)' },
    ],
    alternatives: ['CNC-02 available at 11:00 (+3h delay)', 'CNC-03 unavailable (down)'],
  },
  'WO-1002-OP20': {
    decision: 'Scheduled on Welding Cell B, starting yesterday',
    reasons: [
      { type: 'constraint', text: 'Critical priority — scheduled ahead of medium-priority jobs' },
      { type: 'optimization', text: 'WELD-02 selected to balance load (WELD-01 at 92% utilization)' },
      { type: 'constraint', text: 'Due date is tomorrow — backward scheduling from due date' },
    ],
    alternatives: ['WELD-01 would delay by 4h due to WO-1005 conflict'],
  },
  'WO-1003-OP10': {
    decision: 'Scheduled on CNC Mill #1, starting today',
    reasons: [
      { type: 'optimization', text: 'Longest operation in routing (12h) — scheduled early to protect lead time' },
      { type: 'constraint', text: 'Due date Day+5 allows slack but early start reduces risk' },
      { type: 'learned', text: 'Pattern detected: planner consistently front-loads precision gear milling (94% confidence)' },
    ],
    alternatives: ['CNC-02 available but would split across 2 shifts'],
  },
};

// Structured feedback reasons for drag corrections
const feedbackReasons = [
  { id: 'setup-conflict', label: 'Setup conflict', icon: '⚙️' },
  { id: 'operator-unavailable', label: 'Operator not qualified', icon: '👤' },
  { id: 'sequence-suboptimal', label: 'Suboptimal sequence', icon: '🔄' },
  { id: 'material-dependency', label: 'Material not ready', icon: '📦' },
  { id: 'customer-priority', label: 'Customer priority change', icon: '⭐' },
  { id: 'maintenance-window', label: 'Maintenance window', icon: '🔧' },
  { id: 'quality-requirement', label: 'Quality requirement', icon: '✓' },
  { id: 'other', label: 'Other reason', icon: '💬' },
];

export default function Schedule() {
  const [viewDays, setViewDays] = useState(DAYS_VISIBLE);
  const [frozenDays, setFrozenDays] = useState(1);
  const [showSyncIQHint, setShowSyncIQHint] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDecisionPanel, setShowDecisionPanel] = useState(null);
  const [dragFeedback, setDragFeedback] = useState(null);
  const [showImpactPreview, setShowImpactPreview] = useState(false);
  const [draggedOp, setDraggedOp] = useState(null);

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

  const handleDragStart = (e, op, order) => {
    if (op.status === 'complete') return;
    setDraggedOp({ ...op, order });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetResource) => {
    e.preventDefault();
    if (!draggedOp) return;
    // Show feedback modal
    setDragFeedback({
      operation: draggedOp,
      fromResource: draggedOp.resource,
      toResource: targetResource.id,
      toResourceName: targetResource.name,
    });
    setDraggedOp(null);
  };

  const handleFeedbackSubmit = (reason) => {
    setShowImpactPreview(true);
    // Store feedback reason (would persist in real app)
  };

  const handleConfirmChange = () => {
    setDragFeedback(null);
    setShowImpactPreview(false);
  };

  const handleCancelChange = () => {
    setDragFeedback(null);
    setShowImpactPreview(false);
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

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-xs text-teal-700 font-medium hover:bg-teal-100">
          <Eye size={12} />
          Show Decisions
        </button>

        <button className="flowiq-card flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white font-medium hover:opacity-90">
          <Sparkles size={12} />
          Optimize
        </button>
      </div>

      {/* SyncIQ inline hint */}
      {showSyncIQHint && (
        <div className="mx-4 mt-3 flex items-center gap-3 px-4 py-2.5 flowiq-card rounded-lg animate-fade-in">
          <Sparkles size={14} className="text-white shrink-0 flowiq-icon" />
          <p className="text-xs text-white/90 flex-1">
            <strong className="text-white">SyncIQ:</strong>{' '}
            <TypewriterText text="I detected a scheduling conflict on CNC Mill #1 tomorrow. WO-1003 and WO-1001 overlap by 2h. Based on your past corrections, I've pre-resolved 2 similar conflicts today." />
            <button className="ml-1 text-white underline underline-offset-2 font-medium flowiq-actions-reveal" style={{ display: 'inline' }}>View suggestion</button>
          </p>
          <button onClick={() => setShowSyncIQHint(false)} className="text-white/50 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Adaptive learning indicator bar */}
      <div className="mx-4 mt-2 flex items-center gap-3 px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg">
        <Brain size={14} className="text-teal-600 shrink-0" />
        <div className="flex-1 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-teal-700 font-medium">Adaptation Score</span>
            <div className="w-20 h-1.5 bg-teal-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-teal-500" style={{ width: '73%' }} />
            </div>
            <span className="text-[10px] font-semibold text-teal-700">73%</span>
          </div>
          <div className="w-px h-4 bg-teal-200" />
          <span className="text-[10px] text-teal-600">12 learned rules active</span>
          <div className="w-px h-4 bg-teal-200" />
          <span className="text-[10px] text-teal-600">Manual correction rate: 12% <span className="text-emerald-600">(↓ from 34%)</span></span>
        </div>
        <Link to="/adaptive" className="text-[10px] text-teal-700 font-medium underline underline-offset-2 hover:text-teal-900">
          View details
        </Link>
      </div>

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
              className={`flex items-center gap-2 px-3 border-b border-slate-100 hover:bg-slate-100 transition-colors ${
                draggedOp ? 'cursor-copy' : ''
              }`}
              style={{ height: ROW_HEIGHT }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, r)}
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
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(e, resource)}
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
                    const reasonKey = `${op.order.id}-${op.id}`;
                    const hasReasons = algorithmReasons[reasonKey];
                    const isDraggable = op.status !== 'complete';

                    return (
                      <div
                        key={`${op.order.id}-${op.id}`}
                        draggable={isDraggable}
                        onDragStart={e => handleDragStart(e, op, op.order)}
                        className={`absolute top-1.5 h-[28px] rounded-md border transition-all flex items-center px-2 z-[3] group ${color} ${
                          isDraggable ? 'cursor-grab active:cursor-grabbing hover:brightness-95' : 'cursor-default'
                        } ${hasReasons ? 'ring-1 ring-teal-400/40' : ''}`}
                        style={{
                          left: style.left,
                          width: style.width,
                        }}
                        onMouseEnter={() => setSelectedOrder(op.order.id)}
                        onMouseLeave={() => setSelectedOrder(null)}
                      >
                        <span className="text-[10px] font-medium text-white truncate drop-shadow-sm flex-1">
                          {op.order.id} — {op.name}
                        </span>

                        {/* Decision transparency icon */}
                        {hasReasons && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowDecisionPanel(showDecisionPanel === reasonKey ? null : reasonKey);
                            }}
                            className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded bg-white/20 hover:bg-white/40 transition-all"
                            title="View algorithm decision"
                          >
                            <Eye size={10} className="text-white" />
                          </button>
                        )}

                        {/* Drag handle */}
                        {isDraggable && (
                          <GripVertical size={10} className="text-white/40 opacity-0 group-hover:opacity-100 ml-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Algorithm Decision Panel - slides in from right when an operation is selected */}
      {showDecisionPanel && algorithmReasons[showDecisionPanel] && (
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-xl z-50 animate-slide-in-right overflow-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Eye size={14} className="text-teal-600" />
                Algorithm Decision
              </h3>
              <button
                onClick={() => setShowDecisionPanel(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Decision */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-1">Decision</p>
                <p className="text-xs text-slate-600">{algorithmReasons[showDecisionPanel].decision}</p>
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Reasoning</p>
                <div className="space-y-2">
                  {algorithmReasons[showDecisionPanel].reasons.map((r, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                      r.type === 'learned' ? 'bg-teal-50 border-teal-200' :
                      r.type === 'optimization' ? 'bg-blue-50 border-blue-200' :
                      'bg-slate-50 border-slate-200'
                    }`}>
                      {r.type === 'learned' ? (
                        <Brain size={12} className="text-teal-600 mt-0.5 shrink-0" />
                      ) : r.type === 'optimization' ? (
                        <Sparkles size={12} className="text-blue-600 mt-0.5 shrink-0" />
                      ) : (
                        <Lock size={12} className="text-slate-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{
                          color: r.type === 'learned' ? '#0d9488' : r.type === 'optimization' ? '#2563eb' : '#64748b'
                        }}>
                          {r.type === 'learned' ? 'Learned from you' : r.type === 'optimization' ? 'Optimization' : 'Hard constraint'}
                        </p>
                        <p className="text-xs text-slate-700">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives considered */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Alternatives Considered</p>
                <div className="space-y-1.5">
                  {algorithmReasons[showDecisionPanel].alternatives.map((alt, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                      <Info size={10} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-500">{alt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Override button */}
              <button className="w-full py-2 px-3 rounded-lg border border-teal-300 bg-teal-50 text-xs text-teal-700 font-medium hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5">
                <Brain size={12} />
                Teach SyncIQ a different approach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag Feedback Modal */}
      {dragFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleCancelChange}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Schedule Correction</h3>
              <p className="text-xs text-slate-500 mt-1">
                Moving <strong>{dragFeedback.operation.order.id} — {dragFeedback.operation.name}</strong> from{' '}
                <strong>{dragFeedback.fromResource}</strong> to <strong>{dragFeedback.toResourceName}</strong>
              </p>
            </div>

            {!showImpactPreview ? (
              <div className="p-5">
                <p className="text-xs font-semibold text-slate-700 mb-3">Why are you making this change?</p>
                <div className="grid grid-cols-2 gap-2">
                  {feedbackReasons.map(reason => (
                    <button
                      key={reason.id}
                      onClick={() => handleFeedbackSubmit(reason)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-left"
                    >
                      <span>{reason.icon}</span>
                      <span>{reason.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-teal-50 border border-teal-200 flex items-start gap-2">
                  <Brain size={12} className="text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-teal-700">
                    <strong>SyncIQ will learn from this correction</strong> and factor it into future scheduling decisions. If you make similar changes consistently, it will become an automatic constraint.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <p className="text-xs font-semibold text-slate-700 mb-3">Impact Preview</p>

                {/* KPI Impact */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400">OTIF</p>
                    <p className="text-lg font-bold text-slate-900">87%</p>
                    <p className="text-[10px] text-slate-400">No change</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-[10px] text-slate-400">Utilization</p>
                    <p className="text-lg font-bold text-emerald-600">80%</p>
                    <p className="text-[10px] text-emerald-600">+2%</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400">Late Orders</p>
                    <p className="text-lg font-bold text-slate-900">2</p>
                    <p className="text-[10px] text-slate-400">No change</p>
                  </div>
                </div>

                {/* Cascade effects */}
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Cascading Effects</p>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">WO-1004 OP10 will be delayed by 1h on {dragFeedback.toResourceName}</p>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-700">No impact on critical or high-priority orders</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmChange}
                    className="flex-1 py-2 px-3 rounded-lg bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={12} />
                    Apply Change
                  </button>
                  <button
                    onClick={handleCancelChange}
                    className="py-2 px-3 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center gap-4 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-primary-400" /> Scheduled</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-400" /> In Progress</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-amber-400" /> At Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-red-400" /> Late</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-slate-300" /> Complete</div>
        <div className="flex items-center gap-1.5"><div className="w-px h-3 bg-red-400" /> Now</div>
        <div className="flex items-center gap-1.5"><Lock size={10} className="text-amber-500" /> Frozen</div>
        <div className="flex items-center gap-1.5"><Brain size={10} className="text-teal-500" /> Learned placement</div>
        <div className="flex items-center gap-1.5"><GripVertical size={10} className="text-slate-400" /> Drag to correct</div>
      </div>
    </div>
  );
}
