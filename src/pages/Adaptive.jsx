import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, TrendingDown, TrendingUp, Sparkles, ArrowRight,
  CheckCircle2, Clock, Target, Plus, Minus, Eye, Lock, AlertTriangle
} from 'lucide-react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, Area, AreaChart
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import TypewriterText from '../components/TypewriterText';

const today = startOfDay(new Date());

// Mock adaptation history data
const adaptationHistory = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(today, 13 - i), 'MMM dd'),
  correctionRate: Math.round(34 - (i * 1.5) + (Math.random() * 4 - 2)),
  learnedRules: Math.min(12, 3 + Math.floor(i * 0.7)),
  adaptationScore: Math.min(73, 35 + Math.floor(i * 2.8) + Math.round(Math.random() * 3)),
}));

// Mock learned rules
const learnedRules = [
  {
    id: 1,
    rule: 'Prioritize critical-priority orders on CNC Mill #1 during morning shift (6:00-12:00)',
    confidence: 89,
    source: '47 observed corrections',
    category: 'Resource preference',
    detectedDate: subDays(today, 45),
    impact: 'Reduced morning shift corrections by 78%',
    status: 'active',
  },
  {
    id: 2,
    rule: 'Minimum 2-hour changeover buffer between alloy types on Welding Cells A & B',
    confidence: 94,
    source: '62 observed corrections',
    category: 'Setup constraint',
    detectedDate: subDays(today, 60),
    impact: 'Eliminated 92% of setup-related reschedules',
    status: 'active',
  },
  {
    id: 3,
    rule: 'Front-load precision gear milling operations at the start of the week',
    confidence: 81,
    source: '23 observed corrections',
    category: 'Sequencing preference',
    detectedDate: subDays(today, 30),
    impact: 'Reduced weekly schedule adjustments by 45%',
    status: 'active',
  },
  {
    id: 4,
    rule: 'Avoid scheduling Paint Line 1 at >90% capacity on Fridays (quality sensitivity)',
    confidence: 76,
    source: '18 observed corrections',
    category: 'Capacity preference',
    detectedDate: subDays(today, 21),
    impact: 'Reduced Friday paint quality issues by 60%',
    status: 'active',
  },
  {
    id: 5,
    rule: 'Group customer Apex Motors orders for sequential processing on Assembly Line 1',
    confidence: 72,
    source: '15 observed corrections',
    category: 'Batching preference',
    detectedDate: subDays(today, 14),
    impact: 'Reduced Apex Motors order lead time by 12%',
    status: 'active',
  },
  {
    id: 6,
    rule: 'When CNC Lathe is down, prefer CNC Mill #2 over #1 for turning operations',
    confidence: 68,
    source: '8 observed corrections',
    category: 'Contingency routing',
    detectedDate: subDays(today, 7),
    impact: 'Pending — too few data points for impact measurement',
    status: 'learning',
  },
  {
    id: 7,
    rule: 'Schedule inspection bay operations before 14:00 for same-day shipping',
    confidence: 55,
    source: '6 observed corrections',
    category: 'Timing preference',
    detectedDate: subDays(today, 3),
    impact: 'Pending validation',
    status: 'learning',
  },
];

// Mock correction log
const recentCorrections = [
  { id: 1, action: 'Moved WO-1003 OP10 from CNC-02 to CNC-01', reason: 'Setup conflict', time: '2 hours ago', learnedFrom: true },
  { id: 2, action: 'Shifted WO-1005 paint operation to earlier slot', reason: 'Customer priority', time: '4 hours ago', learnedFrom: true },
  { id: 3, action: 'Swapped WO-1004 and WO-1007 on Assembly Line 1', reason: 'Suboptimal sequence', time: 'Yesterday', learnedFrom: false },
  { id: 4, action: 'Added 2h buffer after WO-1001 welding operation', reason: 'Quality requirement', time: 'Yesterday', learnedFrom: true },
  { id: 5, action: 'Rerouted WO-1008 inspection to earlier time slot', reason: 'Material not ready', time: '2 days ago', learnedFrom: false },
];

export default function Adaptive() {
  const [selectedRule, setSelectedRule] = useState(null);
  const [ruleFilter, setRuleFilter] = useState('all');

  const filteredRules = learnedRules.filter(r =>
    ruleFilter === 'all' || r.status === ruleFilter
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Brain size={20} className="text-teal-600" />
            Adaptive Learning
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            How SyncRun is learning from your scheduling decisions
          </p>
        </div>
      </div>

      {/* SyncIQ Insight */}
      <div className="adaptive-card rounded-xl px-5 py-4 flex items-start gap-3">
        <Brain size={16} className="text-white mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-white/90">
            <strong className="text-white">Adaptive Status:</strong>{' '}
            <TypewriterText text="Your scheduling system has learned 12 rules from your corrections over the past 3 months. Manual correction rate has dropped from 34% to 12%. SyncIQ is now pre-resolving 73% of scheduling decisions that previously required your intervention." />
          </p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Adaptation Score</span>
            <Brain size={14} className="text-teal-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-teal-600">73%</span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-teal-500" style={{ width: '73%' }} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">+8% this month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Learned Rules</span>
            <CheckCircle2 size={14} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">12</span>
            <span className="text-xs text-slate-400">active</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-2">+3 new this week</p>
          <p className="text-[10px] text-slate-400">2 more being validated</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Correction Rate</span>
            <TrendingDown size={14} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-600">12%</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-2">Down from 34%</p>
          <p className="text-[10px] text-slate-400">3 months ago</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Corrections Analyzed</span>
            <Eye size={14} className="text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">247</span>
            <span className="text-xs text-slate-400">total</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Since system deployment</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correction Rate Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Manual Correction Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={adaptationHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis domain={[0, 40]} tick={{ fontSize: 10, fill: '#94a3b8' }} unit="%" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <ReferenceLine y={15} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'Target', fontSize: 10, fill: '#10b981' }} />
              <Area type="monotone" dataKey="correctionRate" stroke="#14b8a6" fill="#ccfbf1" strokeWidth={2} name="Correction Rate %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Adaptation Score Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Adaptation Score & Learned Rules</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={adaptationHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 15]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar yAxisId="right" dataKey="learnedRules" fill="#99f6e4" radius={[4, 4, 0, 0]} name="Learned Rules" />
              <Line yAxisId="left" type="monotone" dataKey="adaptationScore" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} name="Adaptation Score %" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learned Rules */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Brain size={16} className="text-teal-600" />
            Learned Rules & Constraints
          </h3>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            {['all', 'active', 'learning'].map(f => (
              <button
                key={f}
                onClick={() => setRuleFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  ruleFilter === f ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRules.map(rule => (
            <div
              key={rule.id}
              className={`px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                selectedRule === rule.id ? 'bg-teal-50/50' : ''
              }`}
              onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  rule.status === 'active' ? 'bg-teal-100' : 'bg-amber-100'
                }`}>
                  {rule.status === 'active' ? (
                    <CheckCircle2 size={16} className="text-teal-600" />
                  ) : (
                    <Clock size={16} className="text-amber-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{rule.rule}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      rule.status === 'active' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rule.status === 'active' ? 'Active' : 'Learning'}
                    </span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">
                      {rule.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {rule.source}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {selectedRule === rule.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-fade-in">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded bg-slate-50">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  rule.confidence >= 80 ? 'bg-teal-500' :
                                  rule.confidence >= 60 ? 'bg-amber-500' : 'bg-red-400'
                                }`}
                                style={{ width: `${rule.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">{rule.confidence}%</span>
                          </div>
                        </div>
                        <div className="p-2 rounded bg-slate-50">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Detected</p>
                          <p className="text-xs font-medium text-slate-700 mt-1">{format(rule.detectedDate, 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                        <p className="text-[10px] text-emerald-700 font-medium">Impact: {rule.impact}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
                          Promote to hard constraint
                        </button>
                        <button className="text-[10px] px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                          Deactivate
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confidence badge */}
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${
                    rule.confidence >= 80 ? 'text-teal-600' :
                    rule.confidence >= 60 ? 'text-amber-600' : 'text-red-500'
                  }`}>
                    {rule.confidence}%
                  </p>
                  <p className="text-[10px] text-slate-400">confidence</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Corrections Log */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Recent Planner Corrections</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your corrections help SyncIQ learn. Each one makes the system smarter.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentCorrections.map(c => (
            <div key={c.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                c.learnedFrom ? 'bg-teal-100' : 'bg-slate-100'
              }`}>
                {c.learnedFrom ? (
                  <Brain size={12} className="text-teal-600" />
                ) : (
                  <Clock size={12} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700">{c.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">{c.reason}</span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
              </div>
              {c.learnedFrom && (
                <span className="text-[10px] text-teal-600 font-medium px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 shrink-0">
                  Pattern learned
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
