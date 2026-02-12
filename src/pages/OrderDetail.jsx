import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, CheckCircle2, Circle, Loader2,
  Sparkles, AlertTriangle, ArrowRight, Package, User,
  Calendar, Hash
} from 'lucide-react';
import { orders, alerts, getStatusColor, getPriorityColor } from '../data/mockData';
import { format, differenceInDays } from 'date-fns';
import TypewriterText from '../components/TypewriterText';

export default function OrderDetail() {
  const { id } = useParams();
  const order = orders.find(o => o.id === id) || orders[0];
  const relatedAlerts = alerts.filter(a => a.impactedOrders.includes(order.id));
  const daysUntilDue = differenceInDays(order.dueDate, new Date());

  const opStatusIcon = {
    complete: <CheckCircle2 size={16} className="text-emerald-500" />,
    'in-progress': <Loader2 size={16} className="text-blue-500" />,
    pending: <Circle size={16} className="text-slate-300" />,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/orders" className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Orders
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{order.id}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-slate-900">{order.id}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${getStatusColor(order.status)}`}>
                {order.status.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getPriorityColor(order.priority)}`}>
                {order.priority}
              </span>
            </div>
            <h3 className="text-lg text-slate-700">{order.product}</h3>
          </div>
          <div className="flex gap-2">
            <Link to="/schedule" className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              View on schedule
            </Link>
            <Link to="/scenarios" className="flowiq-card text-xs px-3 py-1.5 rounded-lg text-white font-medium hover:opacity-90 flex items-center gap-1.5">
              <Sparkles size={12} /> What-if
            </Link>
          </div>
        </div>

        {/* Key facts */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {[
            { icon: User, label: 'Customer', value: order.customer },
            { icon: Hash, label: 'Quantity', value: order.qty },
            { icon: Calendar, label: 'Due Date', value: format(order.dueDate, 'MMM dd, yyyy') },
            { icon: Clock, label: 'Days to Due', value: daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d late` : `${daysUntilDue}d`, alert: daysUntilDue < 0 },
            { icon: Package, label: 'Progress', value: `${order.progress}%` },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <f.icon size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{f.label}</p>
                <p className={`text-sm font-semibold ${f.alert ? 'text-red-600' : 'text-slate-900'}`}>{f.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Overall Progress</span>
            <span className="text-xs font-medium text-slate-700">{order.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                order.status === 'late' ? 'bg-red-500' :
                order.status === 'at-risk' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${order.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* FlowIQ Context Card */}
      {(relatedAlerts.length > 0 || order.status === 'at-risk' || order.status === 'late') && (
        <div className="flowiq-card rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-white mt-0.5 shrink-0 flowiq-icon" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">FlowIQ Analysis</h4>
              {order.status === 'late' ? (
                <p className="text-sm text-white/90">
                  <TypewriterText text={`This order is past due by ${Math.abs(daysUntilDue)} day(s). Remaining operations (inspection + packaging) can be expedited to ship by end of day if prioritized now. I recommend fast-tracking inspection and using express logistics.`} />
                </p>
              ) : order.status === 'at-risk' ? (
                <p className="text-sm text-white/90">
                  <TypewriterText text={`Material shortage (SS-316 steel) is the primary risk. If the expedited supplier delivery arrives tomorrow, we can still meet the deadline with 4h overtime on welding. Otherwise, need to negotiate a 1-day extension with ${order.customer}.`} />
                </p>
              ) : (
                <p className="text-sm text-white/90">
                  <TypewriterText text={`This order has ${relatedAlerts.length} related alert(s) that may affect delivery. Operations are currently on track, but monitoring is recommended.`} />
                </p>
              )}
              <div className="flex gap-2 mt-3 flowiq-actions-reveal">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-white text-indigo-700 font-medium hover:bg-white/90">
                  Simulate expedite
                </button>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-white/30 text-white font-medium hover:bg-white/10">
                  Show alternatives
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations / Routing */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Operations / Routing</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {order.operations.map((op, i) => (
              <div key={op.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                {/* Status line */}
                <div className="flex flex-col items-center gap-1">
                  {opStatusIcon[op.status]}
                  {i < order.operations.length - 1 && (
                    <div className={`w-px h-8 ${
                      op.status === 'complete' ? 'bg-emerald-200' : 'bg-slate-200'
                    }`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{op.id}</span>
                    <span className="text-sm font-medium text-slate-900">{op.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {op.resource} &middot; {op.duration}h &middot;
                    {op.status === 'complete'
                      ? ` Completed ${format(op.end, 'MMM dd')}`
                      : op.status === 'in-progress'
                      ? ` Started ${format(op.start, 'MMM dd HH:mm')}`
                      : ` Scheduled ${format(op.start, 'MMM dd HH:mm')}`
                    }
                  </p>
                </div>

                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(op.status)}`}>
                  {op.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Alerts */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Related Alerts</h3>
          </div>
          {relatedAlerts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {relatedAlerts.map(alert => (
                <Link
                  to="/alerts"
                  key={alert.id}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <AlertTriangle size={14} className={
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'
                  } />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{alert.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{alert.impactSummary}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No alerts for this order</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
