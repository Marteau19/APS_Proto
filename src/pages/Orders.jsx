import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, ArrowUpDown, ChevronRight,
  ArrowUpRight, ArrowDownRight, Minus, Plus, X
} from 'lucide-react';
import { orders as initialOrders, getStatusColor, getPriorityColor } from '../data/mockData';
import { format, addDays, startOfDay } from 'date-fns';

const statusFilters = ['all', 'late', 'at-risk', 'in-progress', 'on-track'];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = ordersList
    .filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) ||
               o.customer.toLowerCase().includes(q) ||
               o.product.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') return a.dueDate - b.dueDate;
      if (sortBy === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  const handleAddOrder = (newOrder) => {
    setOrdersList(prev => [...prev, newOrder]);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
          <p className="text-sm text-slate-500 mt-0.5">{ordersList.length} active work orders</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          Add Order
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400" />
          <input
            className="text-sm bg-transparent outline-none flex-1 placeholder-slate-400"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortBy(sortBy === 'dueDate' ? 'priority' : 'dueDate')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50"
        >
          <ArrowUpDown size={12} />
          {sortBy === 'dueDate' ? 'Due Date' : 'Priority'}
        </button>
      </div>

      {/* Order cards */}
      <div className="space-y-2">
        {filtered.map(order => (
          <Link
            to={`/orders/${order.id}`}
            key={order.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-5 py-4 hover:shadow-md hover:border-slate-300 transition-all group"
          >
            {/* Priority indicator */}
            <div className={`w-1.5 h-12 rounded-full ${
              order.priority === 'critical' ? 'bg-red-500' :
              order.priority === 'high' ? 'bg-orange-500' :
              order.priority === 'medium' ? 'bg-blue-400' : 'bg-slate-300'
            }`} />

            {/* Order info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-900">{order.id}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ')}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              <p className="text-sm text-slate-600">{order.product}</p>
              <p className="text-xs text-slate-400 mt-0.5">{order.customer} &middot; Qty {order.qty}</p>
            </div>

            {/* Due / Progress */}
            <div className="text-right shrink-0">
              <p className={`text-sm font-medium ${
                order.status === 'late' ? 'text-red-600' : 'text-slate-700'
              }`}>
                {format(order.dueDate, 'MMM dd')}
              </p>
              <div className="flex items-center gap-2 mt-1.5 justify-end">
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      order.status === 'late' ? 'bg-red-500' :
                      order.status === 'at-risk' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${order.progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{order.progress}%</span>
              </div>
            </div>

            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <AddOrderModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddOrder}
          nextId={`WO-${1000 + ordersList.length + 1}`}
        />
      )}
    </div>
  );
}

function AddOrderModal({ onClose, onAdd, nextId }) {
  const today = startOfDay(new Date());
  const [form, setForm] = useState({
    customer: '',
    product: '',
    qty: '',
    priority: 'medium',
    dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const dueDate = new Date(form.dueDate);
    const newOrder = {
      id: nextId,
      customer: form.customer,
      product: form.product,
      qty: parseInt(form.qty, 10),
      priority: form.priority,
      status: 'on-track',
      dueDate,
      startDate: today,
      progress: 0,
      promised: dueDate,
      operations: [],
    };
    onAdd(newOrder);
  };

  const isValid = form.customer && form.product && form.qty && parseInt(form.qty, 10) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">New Work Order</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{nextId}</span>
            <span className="text-xs text-slate-400">will be assigned automatically</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
            <input
              type="text"
              value={form.customer}
              onChange={e => update('customer', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-colors"
              placeholder="e.g. Apex Motors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <input
              type="text"
              value={form.product}
              onChange={e => update('product', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-colors"
              placeholder="e.g. Drive Shaft Assembly"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={e => update('qty', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-colors"
                placeholder="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => update('priority', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-colors bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => update('dueDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-colors"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
