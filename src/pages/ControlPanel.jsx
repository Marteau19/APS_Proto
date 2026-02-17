import {
  Settings, Cpu, Package, Users, Wrench, Box, Lock,
  ChevronRight, Plus
} from 'lucide-react';

const sections = [
  {
    title: 'Machines',
    description: 'Define and manage production machines, CNC mills, lathes, and assembly lines.',
    icon: Cpu,
    color: 'text-blue-600 bg-blue-50',
    count: 10,
  },
  {
    title: 'Raw Materials',
    description: 'Track raw material inventory, safety stock levels, and supplier lead times.',
    icon: Package,
    color: 'text-amber-600 bg-amber-50',
    count: 24,
  },
  {
    title: 'Resources',
    description: 'Manage workforce, shifts, operator certifications, and availability calendars.',
    icon: Users,
    color: 'text-emerald-600 bg-emerald-50',
    count: 18,
  },
  {
    title: 'Skills',
    description: 'Define skill matrices, operator qualifications, and machine-skill mappings.',
    icon: Wrench,
    color: 'text-violet-600 bg-violet-50',
    count: 12,
  },
  {
    title: 'Products',
    description: 'Maintain product catalog, BOMs, routing templates, and cycle times.',
    icon: Box,
    color: 'text-rose-600 bg-rose-50',
    count: 32,
  },
  {
    title: 'Constraints',
    description: 'Configure scheduling rules, frozen zones, sequencing constraints, and priorities.',
    icon: Lock,
    color: 'text-slate-600 bg-slate-100',
    count: 8,
  },
];

export default function ControlPanel() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Control Panel</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage master data: machines, materials, resources, skills, products, and scheduling constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                  {section.count} items
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{section.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{section.description}</p>
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1 text-xs text-primary-500 font-medium hover:text-primary-600 transition-colors">
                  <Plus size={12} />
                  Add new
                </button>
                <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                  Manage
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center">
        <Settings size={24} className="text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">
          This is where you would configure all master data for the APS system.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Each section above will open a dedicated management view for creating, editing, and deleting records.
        </p>
      </div>
    </div>
  );
}
