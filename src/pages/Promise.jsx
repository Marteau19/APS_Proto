import { useState } from 'react';
import {
  Handshake, Sparkles, CheckCircle2, XCircle, Clock,
  AlertTriangle, ArrowRight, Calendar, Package, User
} from 'lucide-react';
import { promiseRequests } from '../data/mockData';
import { format } from 'date-fns';

export default function Promise() {
  const [selectedRequest, setSelectedRequest] = useState(promiseRequests[0].id);
  const request = promiseRequests.find(r => r.id === selectedRequest);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Order Promise</h2>
          <p className="text-sm text-slate-500 mt-0.5">ATP / CTP — Check delivery commitments before confirming</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-medium hover:bg-primary-600">
          New promise check
        </button>
      </div>

      {/* FlowIQ insight */}
      <div className="flowiq-card rounded-xl px-5 py-4 flex items-start gap-3">
        <Sparkles size={16} className="text-white mt-0.5 shrink-0 flowiq-icon" />
        <p className="text-sm text-white/90">
          <strong className="text-white">FlowIQ:</strong> PR-002 (Turbine Bracket for Delta Aero) cannot be fulfilled by the requested date with current capacity.
          CTP shows it's feasible by {format(promiseRequests[1].ctpResult.date, 'MMM dd')} with overtime. Want me to simulate the impact?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request list */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Promise Requests</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {promiseRequests.map(pr => (
              <button
                key={pr.id}
                onClick={() => setSelectedRequest(pr.id)}
                className={`w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors ${
                  selectedRequest === pr.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-900">{pr.id}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    pr.status === 'committed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {pr.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{pr.product}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {pr.customer} &middot; Qty {pr.qty} &middot; Req {format(pr.requestedDate, 'MMM dd')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Request details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Handshake size={20} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{request.id} — {request.product}</h3>
                <p className="text-xs text-slate-500">{request.customer} &middot; Qty {request.qty}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Requested Date</p>
                <p className="text-sm font-semibold text-slate-900">{format(request.requestedDate, 'MMM dd, yyyy')}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-sm font-semibold text-slate-900">{request.customer}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Quantity</p>
                <p className="text-sm font-semibold text-slate-900">{request.qty} units</p>
              </div>
            </div>
          </div>

          {/* ATP Result */}
          <div className={`rounded-xl border-2 p-5 ${
            request.atpResult.available
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-red-50/50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {request.atpResult.available ? (
                <CheckCircle2 size={20} className="text-emerald-600" />
              ) : (
                <XCircle size={20} className="text-red-500" />
              )}
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  ATP Check — {request.atpResult.available ? 'Available' : 'Not Available'}
                </h4>
                <p className="text-xs text-slate-500">Available-to-Promise based on current inventory & plan</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Earliest ATP Date</p>
                <p className="text-sm font-semibold text-slate-900">{format(request.atpResult.date, 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        request.atpResult.confidence > 90 ? 'bg-emerald-500' :
                        request.atpResult.confidence > 80 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${request.atpResult.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{request.atpResult.confidence}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTP Result */}
          <div className={`rounded-xl border-2 p-5 ${
            request.ctpResult.feasible
              ? 'bg-blue-50/50 border-blue-200'
              : 'bg-red-50/50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {request.ctpResult.feasible ? (
                <CheckCircle2 size={20} className="text-blue-600" />
              ) : (
                <XCircle size={20} className="text-red-500" />
              )}
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  CTP Check — {request.ctpResult.feasible ? 'Feasible' : 'Not Feasible'}
                </h4>
                <p className="text-xs text-slate-500">Capable-to-Promise with schedule & capacity adjustments</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Earliest CTP Date</p>
                <p className="text-sm font-semibold text-slate-900">{format(request.ctpResult.date, 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Requires Overtime</p>
                <p className="text-sm font-semibold text-slate-900">
                  {request.ctpResult.requiresOvertime ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            {request.ctpResult.affectedOrders.length > 0 && (
              <div className="bg-white/60 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-700">Trade-offs</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Affected orders: {request.ctpResult.affectedOrders.join(', ')}
                    {request.ctpResult.requiresOvertime && ' — requires overtime authorization.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                <CheckCircle2 size={14} /> Commit ATP Date
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                <CheckCircle2 size={14} /> Commit CTP Date
              </button>
              <button className="flowiq-card flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 transition-colors">
                <Sparkles size={14} /> Simulate alternatives
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
