import { addDays, addHours, subDays, format, startOfDay } from 'date-fns';

const today = startOfDay(new Date());

// ─── Resources / Machines ────────────────────────────
export const resources = [
  { id: 'CNC-01', name: 'CNC Mill #1', type: 'Machine', dept: 'Machining', capacity: 16, status: 'running' },
  { id: 'CNC-02', name: 'CNC Mill #2', type: 'Machine', dept: 'Machining', capacity: 16, status: 'running' },
  { id: 'CNC-03', name: 'CNC Lathe #1', type: 'Machine', dept: 'Machining', capacity: 16, status: 'down' },
  { id: 'WELD-01', name: 'Welding Cell A', type: 'Cell', dept: 'Welding', capacity: 16, status: 'running' },
  { id: 'WELD-02', name: 'Welding Cell B', type: 'Cell', dept: 'Welding', capacity: 16, status: 'running' },
  { id: 'PAINT-01', name: 'Paint Line 1', type: 'Line', dept: 'Finishing', capacity: 8, status: 'running' },
  { id: 'ASSY-01', name: 'Assembly Line 1', type: 'Line', dept: 'Assembly', capacity: 16, status: 'running' },
  { id: 'ASSY-02', name: 'Assembly Line 2', type: 'Line', dept: 'Assembly', capacity: 16, status: 'changeover' },
  { id: 'INSP-01', name: 'Inspection Bay', type: 'Station', dept: 'Quality', capacity: 8, status: 'running' },
  { id: 'PKG-01', name: 'Packaging Line', type: 'Line', dept: 'Shipping', capacity: 8, status: 'running' },
];

// ─── Orders / Jobs ───────────────────────────────────
export const orders = [
  {
    id: 'WO-1001', customer: 'Apex Motors', product: 'Drive Shaft Assembly', qty: 120,
    priority: 'high', status: 'in-progress', dueDate: addDays(today, 2),
    startDate: subDays(today, 1), progress: 65, promised: addDays(today, 2),
    operations: [
      { id: 'OP10', name: 'CNC Turning', resource: 'CNC-03', duration: 6, status: 'complete', start: subDays(today, 1), end: today },
      { id: 'OP20', name: 'CNC Milling', resource: 'CNC-01', duration: 8, status: 'in-progress', start: today, end: addHours(today, 8) },
      { id: 'OP30', name: 'Welding', resource: 'WELD-01', duration: 4, status: 'pending', start: addDays(today, 1), end: addHours(addDays(today, 1), 4) },
      { id: 'OP40', name: 'Inspection', resource: 'INSP-01', duration: 2, status: 'pending', start: addHours(addDays(today, 1), 5), end: addHours(addDays(today, 1), 7) },
    ],
  },
  {
    id: 'WO-1002', customer: 'SteelWorks Inc', product: 'Hydraulic Cylinder', qty: 80,
    priority: 'critical', status: 'at-risk', dueDate: addDays(today, 1),
    startDate: subDays(today, 3), progress: 45, promised: addDays(today, 1),
    operations: [
      { id: 'OP10', name: 'CNC Turning', resource: 'CNC-02', duration: 8, status: 'complete', start: subDays(today, 3), end: subDays(today, 2) },
      { id: 'OP20', name: 'Welding', resource: 'WELD-02', duration: 6, status: 'in-progress', start: subDays(today, 1), end: addHours(today, 4) },
      { id: 'OP30', name: 'Paint', resource: 'PAINT-01', duration: 3, status: 'pending', start: addHours(today, 5), end: addHours(today, 8) },
      { id: 'OP40', name: 'Assembly', resource: 'ASSY-01', duration: 5, status: 'pending', start: addDays(today, 1), end: addHours(addDays(today, 1), 5) },
    ],
  },
  {
    id: 'WO-1003', customer: 'TechForm Ltd', product: 'Precision Gear Set', qty: 200,
    priority: 'medium', status: 'on-track', dueDate: addDays(today, 5),
    startDate: today, progress: 10, promised: addDays(today, 5),
    operations: [
      { id: 'OP10', name: 'CNC Milling', resource: 'CNC-01', duration: 12, status: 'in-progress', start: today, end: addHours(today, 12) },
      { id: 'OP20', name: 'Heat Treatment', resource: 'WELD-01', duration: 4, status: 'pending', start: addDays(today, 1), end: addHours(addDays(today, 1), 4) },
      { id: 'OP30', name: 'Grinding', resource: 'CNC-02', duration: 8, status: 'pending', start: addDays(today, 2), end: addHours(addDays(today, 2), 8) },
      { id: 'OP40', name: 'Inspection', resource: 'INSP-01', duration: 3, status: 'pending', start: addDays(today, 3), end: addHours(addDays(today, 3), 3) },
      { id: 'OP50', name: 'Packaging', resource: 'PKG-01', duration: 2, status: 'pending', start: addDays(today, 4), end: addHours(addDays(today, 4), 2) },
    ],
  },
  {
    id: 'WO-1004', customer: 'Apex Motors', product: 'Brake Caliper Housing', qty: 300,
    priority: 'medium', status: 'on-track', dueDate: addDays(today, 7),
    startDate: addDays(today, 1), progress: 0, promised: addDays(today, 7),
    operations: [
      { id: 'OP10', name: 'CNC Milling', resource: 'CNC-02', duration: 10, status: 'pending', start: addDays(today, 1), end: addHours(addDays(today, 1), 10) },
      { id: 'OP20', name: 'Welding', resource: 'WELD-02', duration: 6, status: 'pending', start: addDays(today, 2), end: addHours(addDays(today, 2), 6) },
      { id: 'OP30', name: 'Paint', resource: 'PAINT-01', duration: 4, status: 'pending', start: addDays(today, 3), end: addHours(addDays(today, 3), 4) },
      { id: 'OP40', name: 'Assembly', resource: 'ASSY-02', duration: 8, status: 'pending', start: addDays(today, 4), end: addHours(addDays(today, 4), 8) },
      { id: 'OP50', name: 'Inspection', resource: 'INSP-01', duration: 2, status: 'pending', start: addDays(today, 5), end: addHours(addDays(today, 5), 2) },
    ],
  },
  {
    id: 'WO-1005', customer: 'Delta Aero', product: 'Turbine Bracket', qty: 50,
    priority: 'high', status: 'in-progress', dueDate: addDays(today, 3),
    startDate: subDays(today, 2), progress: 55, promised: addDays(today, 3),
    operations: [
      { id: 'OP10', name: 'CNC Turning', resource: 'CNC-03', duration: 6, status: 'complete', start: subDays(today, 2), end: subDays(today, 1) },
      { id: 'OP20', name: 'CNC Milling', resource: 'CNC-01', duration: 8, status: 'in-progress', start: subDays(today, 1), end: addHours(today, 6) },
      { id: 'OP30', name: 'Welding', resource: 'WELD-01', duration: 4, status: 'pending', start: addDays(today, 1), end: addHours(addDays(today, 1), 4) },
      { id: 'OP40', name: 'Paint', resource: 'PAINT-01', duration: 2, status: 'pending', start: addDays(today, 2), end: addHours(addDays(today, 2), 2) },
      { id: 'OP50', name: 'Inspection', resource: 'INSP-01', duration: 2, status: 'pending', start: addDays(today, 2), end: addHours(addDays(today, 2), 4) },
    ],
  },
  {
    id: 'WO-1006', customer: 'Nova Engineering', product: 'Valve Body', qty: 150,
    priority: 'low', status: 'on-track', dueDate: addDays(today, 10),
    startDate: addDays(today, 3), progress: 0, promised: addDays(today, 10),
    operations: [
      { id: 'OP10', name: 'CNC Turning', resource: 'CNC-02', duration: 8, status: 'pending', start: addDays(today, 3), end: addHours(addDays(today, 3), 8) },
      { id: 'OP20', name: 'CNC Milling', resource: 'CNC-01', duration: 6, status: 'pending', start: addDays(today, 4), end: addHours(addDays(today, 4), 6) },
      { id: 'OP30', name: 'Assembly', resource: 'ASSY-01', duration: 4, status: 'pending', start: addDays(today, 5), end: addHours(addDays(today, 5), 4) },
    ],
  },
  {
    id: 'WO-1007', customer: 'Quantum Dynamics', product: 'Motor Housing', qty: 60,
    priority: 'medium', status: 'on-track', dueDate: addDays(today, 6),
    startDate: addDays(today, 1), progress: 0, promised: addDays(today, 6),
    operations: [
      { id: 'OP10', name: 'CNC Milling', resource: 'CNC-02', duration: 10, status: 'pending', start: addDays(today, 1), end: addHours(addDays(today, 1), 10) },
      { id: 'OP20', name: 'Welding', resource: 'WELD-01', duration: 5, status: 'pending', start: addDays(today, 2), end: addHours(addDays(today, 2), 5) },
      { id: 'OP30', name: 'Paint', resource: 'PAINT-01', duration: 3, status: 'pending', start: addDays(today, 3), end: addHours(addDays(today, 3), 3) },
      { id: 'OP40', name: 'Assembly', resource: 'ASSY-01', duration: 6, status: 'pending', start: addDays(today, 4), end: addHours(addDays(today, 4), 6) },
    ],
  },
  {
    id: 'WO-1008', customer: 'SteelWorks Inc', product: 'Pump Impeller', qty: 90,
    priority: 'high', status: 'late', dueDate: subDays(today, 1),
    startDate: subDays(today, 5), progress: 80, promised: subDays(today, 1),
    operations: [
      { id: 'OP10', name: 'CNC Turning', resource: 'CNC-01', duration: 8, status: 'complete', start: subDays(today, 5), end: subDays(today, 4) },
      { id: 'OP20', name: 'CNC Milling', resource: 'CNC-02', duration: 10, status: 'complete', start: subDays(today, 4), end: subDays(today, 3) },
      { id: 'OP30', name: 'Welding', resource: 'WELD-02', duration: 4, status: 'complete', start: subDays(today, 2), end: subDays(today, 1) },
      { id: 'OP40', name: 'Inspection', resource: 'INSP-01', duration: 3, status: 'in-progress', start: today, end: addHours(today, 3) },
      { id: 'OP50', name: 'Packaging', resource: 'PKG-01', duration: 2, status: 'pending', start: addHours(today, 4), end: addHours(today, 6) },
    ],
  },
];

// ─── Alerts / Exceptions ─────────────────────────────
export const alerts = [
  {
    id: 'ALT-001', type: 'machine-down', severity: 'critical',
    title: 'CNC Lathe #1 unplanned downtime',
    description: 'Spindle failure detected. Maintenance dispatched. ETA repair: 4 hours.',
    impactedOrders: ['WO-1001', 'WO-1005'],
    impactSummary: '2 orders at risk of delay, potential OTIF drop of 8%',
    timestamp: addHours(today, -2),
    status: 'open',
    resource: 'CNC-03',
    flowiqSuggestion: 'Reschedule OP10 for WO-1001 to CNC-02 (available in 2h). This keeps delivery on track.',
  },
  {
    id: 'ALT-002', type: 'material-shortage', severity: 'critical',
    title: 'Steel alloy SS-316 stock below safety level',
    description: 'Current inventory: 45 kg. Required for next 48h: 120 kg. Supplier delivery expected in 3 days.',
    impactedOrders: ['WO-1002', 'WO-1004', 'WO-1007'],
    impactSummary: '3 orders impacted, $180K revenue at risk',
    timestamp: addHours(today, -1),
    status: 'open',
    resource: null,
    flowiqSuggestion: 'Prioritize WO-1002 (due tomorrow). Defer WO-1004 start by 2 days. Source expedited shipment from alt supplier.',
  },
  {
    id: 'ALT-003', type: 'capacity-overload', severity: 'warning',
    title: 'Paint Line 1 overloaded — Day +2 to +4',
    description: 'Paint Line 1 is scheduled at 135% capacity for the next 3 days.',
    impactedOrders: ['WO-1002', 'WO-1005', 'WO-1007'],
    impactSummary: 'Potential cascading delays on 3 orders',
    timestamp: addHours(today, -3),
    status: 'acknowledged',
    resource: 'PAINT-01',
    flowiqSuggestion: 'Shift WO-1007 paint operation to Day +5. This reduces load to 95% with no delivery impact.',
  },
  {
    id: 'ALT-004', type: 'late-order', severity: 'critical',
    title: 'WO-1008 — Past due by 1 day',
    description: 'Pump Impeller order for SteelWorks Inc missed delivery date. Inspection in progress.',
    impactedOrders: ['WO-1008'],
    impactSummary: 'Customer SLA breach, OTIF penalty risk',
    timestamp: addHours(today, -4),
    status: 'open',
    resource: null,
    flowiqSuggestion: 'Expedite remaining inspection + packaging. Use express shipping. Estimated new delivery: today +6h.',
  },
  {
    id: 'ALT-005', type: 'changeover', severity: 'info',
    title: 'Assembly Line 2 changeover in progress',
    description: 'Changeover from Product A to Product B configuration. Expected duration: 2 hours.',
    impactedOrders: ['WO-1004'],
    impactSummary: 'Minor — WO-1004 start delayed 2h, within buffer',
    timestamp: addHours(today, -0.5),
    status: 'acknowledged',
    resource: 'ASSY-02',
    flowiqSuggestion: 'No action needed. Buffer absorbs the delay. Will notify if changeover exceeds 3h.',
  },
  {
    id: 'ALT-006', type: 'schedule-conflict', severity: 'warning',
    title: 'Resource conflict on CNC Mill #1 — Tomorrow 8AM',
    description: 'WO-1003 OP10 and WO-1001 OP20 both scheduled on CNC-01 with 2h overlap.',
    impactedOrders: ['WO-1001', 'WO-1003'],
    impactSummary: 'One order will be delayed by 2h if not resolved',
    timestamp: addHours(today, -1.5),
    status: 'open',
    resource: 'CNC-01',
    flowiqSuggestion: 'Move WO-1003 OP10 to CNC-02 (idle slot available). Zero impact on both deliveries.',
  },
];

// ─── KPI Data ────────────────────────────────────────
export const kpis = {
  otif: { value: 87, target: 95, trend: 'down', unit: '%', label: 'OTIF' },
  adherence: { value: 91, target: 95, trend: 'stable', unit: '%', label: 'Schedule Adherence' },
  throughput: { value: 42, target: 50, unit: 'jobs/week', label: 'Throughput', trend: 'up' },
  wip: { value: 18, target: 15, unit: 'jobs', label: 'WIP', trend: 'up' },
  avgLeadTime: { value: 4.2, target: 3.5, unit: 'days', label: 'Avg Lead Time', trend: 'stable' },
  utilizationAvg: { value: 78, target: 85, unit: '%', label: 'Utilization', trend: 'down' },
  tardiness: { value: 2, target: 0, unit: 'orders', label: 'Late Orders', trend: 'up' },
  changeovers: { value: 6, target: 4, unit: '/week', label: 'Changeovers', trend: 'stable' },
};

export const kpiHistory = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(today, 13 - i), 'MMM dd'),
  otif: Math.round(85 + Math.random() * 12),
  adherence: Math.round(88 + Math.random() * 10),
  throughput: Math.round(38 + Math.random() * 14),
  utilization: Math.round(72 + Math.random() * 16),
}));

// ─── Capacity / Load Data ────────────────────────────
export const capacityData = resources.map(r => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const base = r.status === 'down' ? 0 : r.capacity;
    const load = r.status === 'down' && i < 1
      ? 0
      : Math.round(r.capacity * (0.5 + Math.random() * 0.7));
    return {
      day: format(addDays(today, i), 'EEE dd'),
      date: addDays(today, i),
      capacity: base,
      load: Math.min(load, r.capacity * 1.4),
      utilization: base > 0 ? Math.round((Math.min(load, r.capacity * 1.4) / base) * 100) : 0,
    };
  });
  return { ...r, days };
});

// ─── Scenarios ───────────────────────────────────────
export const scenarios = [
  {
    id: 'SCN-BASE', name: 'Current Plan (Baseline)', type: 'baseline',
    created: subDays(today, 0), status: 'active',
    kpis: { otif: 87, utilization: 78, lateness: 2, makespan: 10 },
  },
  {
    id: 'SCN-001', name: 'Rush WO-1002 + Overtime', type: 'what-if',
    created: subDays(today, 0), status: 'draft',
    description: 'Add 4h overtime on WELD-02 and PAINT-01 to expedite WO-1002',
    kpis: { otif: 92, utilization: 86, lateness: 1, makespan: 9 },
    changes: ['Add overtime: WELD-02 (+4h)', 'Add overtime: PAINT-01 (+4h)', 'Reprioritize WO-1002 to slot 1'],
  },
  {
    id: 'SCN-002', name: 'Defer WO-1006 + Rebalance', type: 'what-if',
    created: subDays(today, 0), status: 'draft',
    description: 'Defer low-priority WO-1006 by 3 days to free CNC capacity for urgent jobs',
    kpis: { otif: 90, utilization: 82, lateness: 1, makespan: 12 },
    changes: ['Defer WO-1006 start by 3 days', 'Reallocate CNC-02 to WO-1002 OP10'],
  },
];

// ─── Promise / ATP ───────────────────────────────────
export const promiseRequests = [
  {
    id: 'PR-001', customer: 'Apex Motors', product: 'Drive Shaft Assembly', qty: 60,
    requestedDate: addDays(today, 5), status: 'pending',
    atpResult: { available: true, date: addDays(today, 6), confidence: 92 },
    ctpResult: { feasible: true, date: addDays(today, 5), requiresOvertime: true, affectedOrders: ['WO-1006'] },
  },
  {
    id: 'PR-002', customer: 'Delta Aero', product: 'Turbine Bracket', qty: 100,
    requestedDate: addDays(today, 4), status: 'pending',
    atpResult: { available: false, date: addDays(today, 8), confidence: 78 },
    ctpResult: { feasible: true, date: addDays(today, 5), requiresOvertime: true, affectedOrders: ['WO-1003', 'WO-1007'] },
  },
  {
    id: 'PR-003', customer: 'Nova Engineering', product: 'Valve Body', qty: 50,
    requestedDate: addDays(today, 12), status: 'committed',
    atpResult: { available: true, date: addDays(today, 11), confidence: 97 },
    ctpResult: { feasible: true, date: addDays(today, 10), requiresOvertime: false, affectedOrders: [] },
  },
];

// ─── Helper functions ────────────────────────────────
export const getStatusColor = (status) => {
  const map = {
    'on-track': 'text-emerald-600 bg-emerald-50',
    'in-progress': 'text-blue-600 bg-blue-50',
    'at-risk': 'text-amber-600 bg-amber-50',
    'late': 'text-red-600 bg-red-50',
    'complete': 'text-slate-500 bg-slate-100',
    'pending': 'text-slate-500 bg-slate-100',
    'running': 'text-emerald-600 bg-emerald-50',
    'down': 'text-red-600 bg-red-50',
    'changeover': 'text-amber-600 bg-amber-50',
  };
  return map[status] || 'text-slate-500 bg-slate-100';
};

export const getPriorityColor = (priority) => {
  const map = {
    critical: 'text-red-700 bg-red-50 border-red-200',
    high: 'text-orange-700 bg-orange-50 border-orange-200',
    medium: 'text-blue-700 bg-blue-50 border-blue-200',
    low: 'text-slate-600 bg-slate-50 border-slate-200',
  };
  return map[priority] || 'text-slate-600 bg-slate-50 border-slate-200';
};

export const getSeverityColor = (severity) => {
  const map = {
    critical: 'border-l-red-500 bg-red-50/50',
    warning: 'border-l-amber-500 bg-amber-50/50',
    info: 'border-l-blue-500 bg-blue-50/50',
  };
  return map[severity] || 'border-l-slate-300 bg-slate-50';
};

export const getSeverityBadge = (severity) => {
  const map = {
    critical: 'text-red-700 bg-red-100',
    warning: 'text-amber-700 bg-amber-100',
    info: 'text-blue-700 bg-blue-100',
  };
  return map[severity] || 'text-slate-600 bg-slate-100';
};
