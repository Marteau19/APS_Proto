import { useState } from 'react';
import { X, Send, Sparkles, ArrowRight, Zap, TrendingUp, AlertCircle, Brain, Plus, MessageSquare } from 'lucide-react';
import TypewriterText from './TypewriterText';

const preloadedMessages = [
  {
    role: 'assistant',
    content: "Good morning! Here's your daily briefing:",
    insights: [
      { icon: 'alert', text: 'CNC Lathe #1 is down — 2 orders affected. I have a rerouting suggestion ready.' },
      { icon: 'trend', text: 'OTIF dropped to 87%. Main cause: material delays on SS-316 steel.' },
      { icon: 'action', text: 'WO-1008 is past due. Expediting inspection + packaging could close it today.' },
    ],
  },
];

const quickActions = [
  'What should I fix first?',
  'Show me at-risk orders',
  'Simulate rushing WO-1002',
  'Why is OTIF dropping?',
];

export default function FlowIQPanel({ onClose }) {
  const [messages, setMessages] = useState(preloadedMessages);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [constraints, setConstraints] = useState([
    { id: 1, text: 'Never schedule product X after product Y on Paint Line 1', status: 'active', source: 'manual', confidence: null },
    { id: 2, text: 'Prioritize WO with critical priority on CNC Mill #1 during morning shift', status: 'active', source: 'learned', confidence: 89 },
    { id: 3, text: 'Minimum 2h changeover buffer between alloy types on Welding Cell A', status: 'active', source: 'learned', confidence: 94 },
  ]);
  const [constraintInput, setConstraintInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const aiResponse = getSimulatedResponse(input);
    setMessages(prev => [...prev, userMsg, aiResponse]);
    setInput('');
  };

  const handleAddConstraint = () => {
    if (!constraintInput.trim()) return;
    setConstraints(prev => [...prev, {
      id: prev.length + 1,
      text: constraintInput,
      status: 'active',
      source: 'manual',
      confidence: null,
    }]);
    setConstraintInput('');
    // Add confirmation message
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `New constraint added and will be applied to the next schedule run:`,
      insights: [
        { icon: 'action', text: `"${constraintInput}" — I'll factor this into all future scheduling decisions.` },
      ],
    }]);
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="px-4 py-3 synciq-card flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <Sparkles size={16} className="text-white flowiq-icon" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">SyncIQ</h2>
          <p className="text-[11px] text-white/60">Adaptive Scheduling Assistant</p>
        </div>
        <button onClick={onClose} className="ml-auto p-1 text-white/50 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare size={12} /> Chat
        </button>
        <button
          onClick={() => setActiveTab('constraints')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'constraints' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Brain size={12} /> Constraints
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="bg-primary-500 text-white text-sm px-3 py-2 rounded-lg rounded-br-sm max-w-[80%]">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700">{msg.content}</p>
                    {msg.insights && (
                      <div className="space-y-2">
                        {msg.insights.map((insight, j) => (
                          <div key={j} className="flex gap-2 p-2.5 synciq-card rounded-lg">
                            {insight.icon === 'alert' && <AlertCircle size={14} className="text-red-300 mt-0.5 shrink-0" />}
                            {insight.icon === 'trend' && <TrendingUp size={14} className="text-amber-300 mt-0.5 shrink-0" />}
                            {insight.icon === 'action' && <Zap size={14} className="text-white mt-0.5 shrink-0" />}
                            {insight.icon === 'learned' && <Brain size={14} className="text-teal-300 mt-0.5 shrink-0" />}
                            <p className="text-xs text-white/90 leading-relaxed"><TypewriterText text={insight.text} delay={400 + j * 800} /></p>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.action && (
                      <button className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:text-indigo-500 mt-1 underline underline-offset-2">
                        {msg.action} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-1.5">
              {quickActions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMessages(prev => [
                      ...prev,
                      { role: 'user', content: q },
                      getSimulatedResponse(q),
                    ]);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <input
                className="flex-1 text-sm bg-transparent outline-none placeholder-slate-400"
                placeholder="Ask SyncIQ..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Constraints tab */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Active Constraints</h3>
              <span className="text-[10px] text-slate-400">{constraints.length} rules</span>
            </div>

            {constraints.map(c => (
              <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-all">
                <div className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    c.source === 'learned' ? 'bg-teal-100' : 'bg-indigo-100'
                  }`}>
                    {c.source === 'learned' ? (
                      <Brain size={10} className="text-teal-600" />
                    ) : (
                      <Plus size={10} className="text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        c.source === 'learned' ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {c.source === 'learned' ? 'Learned' : 'Manual'}
                      </span>
                      {c.confidence && (
                        <span className="text-[10px] text-slate-400">
                          {c.confidence}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add constraint input */}
          <div className="p-3 border-t border-slate-200">
            <p className="text-[10px] text-slate-400 mb-2">Add a constraint in natural language:</p>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <input
                className="flex-1 text-sm bg-transparent outline-none placeholder-slate-400"
                placeholder="e.g. Never schedule X after Y on Line 3..."
                value={constraintInput}
                onChange={e => setConstraintInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddConstraint()}
              />
              <button
                onClick={handleAddConstraint}
                className="p-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-500 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getSimulatedResponse(input) {
  const lower = input.toLowerCase();

  if (lower.includes('fix first') || lower.includes('priorit')) {
    return {
      role: 'assistant',
      content: 'Based on business impact, here\'s your priority list:',
      insights: [
        { icon: 'alert', text: '1. WO-1008 (Pump Impeller) — Past due. Expedite inspection to ship today.' },
        { icon: 'alert', text: '2. WO-1002 (Hydraulic Cylinder) — Due tomorrow, at risk. Resolve material shortage.' },
        { icon: 'action', text: '3. CNC Lathe #1 downtime — Reroute affected ops to CNC-02.' },
      ],
      action: 'View prioritized alerts',
    };
  }

  if (lower.includes('at-risk') || lower.includes('risk')) {
    return {
      role: 'assistant',
      content: '3 orders are currently at risk:',
      insights: [
        { icon: 'alert', text: 'WO-1002: Material shortage (SS-316 steel). Due tomorrow.' },
        { icon: 'alert', text: 'WO-1001: Depends on CNC-03 (down). Can reroute to CNC-02.' },
        { icon: 'trend', text: 'WO-1005: Paint Line overload may push inspection by 4h.' },
      ],
      action: 'Open at-risk orders',
    };
  }

  if (lower.includes('simulat') || lower.includes('rush') || lower.includes('what-if')) {
    return {
      role: 'assistant',
      content: 'I\'ve simulated rushing WO-1002 with overtime:',
      insights: [
        { icon: 'action', text: 'Adding 4h overtime on WELD-02 and PAINT-01 would meet the deadline.' },
        { icon: 'trend', text: 'OTIF improves from 87% → 92%. Utilization goes to 86%.' },
        { icon: 'alert', text: 'Trade-off: WO-1006 (low priority) would be deferred by 1 day.' },
      ],
      action: 'Open scenario comparison',
    };
  }

  if (lower.includes('otif') || lower.includes('dropping')) {
    return {
      role: 'assistant',
      content: 'OTIF analysis for the past 2 weeks:',
      insights: [
        { icon: 'trend', text: 'OTIF dropped from 93% to 87% over 7 days.' },
        { icon: 'alert', text: 'Root cause: 2 material delays + 1 unplanned downtime event.' },
        { icon: 'action', text: 'Recommendation: Build safety stock for SS-316 and add CNC backup routing.' },
      ],
    };
  }

  if (lower.includes('learn') || lower.includes('pattern') || lower.includes('adapt')) {
    return {
      role: 'assistant',
      content: 'Here\'s what I\'ve learned from your scheduling patterns:',
      insights: [
        { icon: 'learned', text: 'You consistently prioritize critical-priority orders on CNC Mill #1 during morning shifts. I\'ve incorporated this as a soft constraint (89% confidence).' },
        { icon: 'learned', text: 'You prefer a 2h changeover buffer between alloy types on welding cells. This pattern was detected across 47 scheduling cycles (94% confidence).' },
        { icon: 'action', text: 'Manual correction rate has dropped from 34% to 12% over the past 3 months as I\'ve adapted.' },
      ],
    };
  }

  if (lower.includes('constraint') || lower.includes('rule') || lower.includes('never')) {
    return {
      role: 'assistant',
      content: 'I can help you add scheduling constraints. You can:',
      insights: [
        { icon: 'action', text: 'Type constraints in natural language, e.g. "Never schedule product X after product Y on Line 3"' },
        { icon: 'learned', text: 'Switch to the Constraints tab to see all active rules — both manual and learned.' },
        { icon: 'trend', text: 'I currently have 3 active constraints, 2 of which were learned from your correction patterns.' },
      ],
    };
  }

  return {
    role: 'assistant',
    content: 'I\'m analyzing your request. Here\'s what I found:',
    insights: [
      { icon: 'action', text: 'The current schedule has 4 open exceptions requiring attention.' },
      { icon: 'trend', text: 'Overall capacity utilization is at 78% — below target.' },
      { icon: 'learned', text: 'Based on your past corrections, I\'ve pre-optimized 3 potential conflicts in today\'s schedule.' },
    ],
  };
}
