# FlowAPS — Advanced Planning & Scheduling Prototype

A modern, minimalist APS (Advanced Planning & Scheduling) UI/UX prototype powered by **FlowIQ**, an AI scheduling assistant. Built with React + Vite + TailwindCSS, deployable to GitHub Pages.

## Quick Start

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

---

## Daily APS User Loop

The typical daily workflow for a planner/scheduler follows this sequence:

1. **Dashboard** — Start of day. Glance at KPI health, critical alerts, and at-risk orders. FlowIQ provides a morning briefing with prioritized action items.
2. **Alerts Inbox** — Triage exceptions by severity and business impact. Review FlowIQ's recommendations for each alert. Apply, simulate, or dismiss suggestions.
3. **Schedule / Planning Board** — The primary workspace. Visualize the Gantt, identify conflicts, frozen zones, and resource assignments. Drag or reassign operations as needed.
4. **Order Detail** — Drill into specific orders flagged as at-risk or late. Understand operation routing, progress, and related alerts.
5. **Capacity View** — Check resource load vs. capacity. Identify bottlenecks and overloaded resources. Use FlowIQ to suggest load leveling.
6. **Scenarios** — Build what-if alternatives. Compare baseline vs. proposed changes side by side. Promote the best scenario to the active plan.
7. **KPIs** — End-of-day or periodic check. Track OTIF, adherence, throughput, WIP, tardiness trends. Understand root causes of degradation.
8. **Promise** — On-demand. Sales or CS requests a delivery commitment. Run ATP/CTP checks. Commit or counter-propose dates.

Users cycle between Schedule, Alerts, and Order Detail throughout the day. KPIs and Promise are used periodically or on demand.

---

## Core Screen Definitions

### A) Master Schedule / Planning Board

- **Primary users:** Production planners, schedulers
- **Primary JTBD:** See the full production schedule, identify conflicts, and adjust assignments
- **Business value:** The central workspace — every scheduling decision flows through here. Schedule quality directly impacts OTIF, utilization, and customer satisfaction.
- **Key information displayed:**
  - Resource-centric Gantt chart (rows = resources, bars = operations)
  - Day/hour timeline with zoom control (3–14 days)
  - Frozen horizon overlay (locked zone highlighted)
  - Now line (current time marker)
  - Color-coded bars: scheduled, in-progress, at-risk, late, complete
  - Resource status indicators (running, down, changeover)
- **Key daily actions:**
  - Zoom in/out on timeline
  - Filter by department, status, priority
  - Click a bar to navigate to Order Detail
  - Toggle resource vs. order view
  - Trigger FlowIQ optimization
- **High-value interaction patterns:**
  - Click-to-drill on any operation bar → Order Detail
  - Inline FlowIQ hints for detected conflicts
  - Frozen zone visual enforcement
  - Zoom and scroll for timeline navigation
- **Typical exceptions handled:** Scheduling conflicts, resource overlaps, frozen zone violations
- **KPIs impacted:** Schedule adherence, OTIF, utilization, makespan
- **FlowIQ on this screen:**
  - **Explain:** "WO-1003 and WO-1001 overlap on CNC Mill #1 by 2 hours"
  - **Recommend:** "Move WO-1003 OP10 to CNC-02 — zero delivery impact"
  - **Simulate:** "What happens if I add overtime on this resource?"
  - **Prioritize:** Highlight bars that need immediate attention with visual cues
- **Navigation:**
  - From: Dashboard, Alerts
  - To: Order Detail, Capacity, Scenarios

---

### B) Exception & Alert Inbox

- **Primary users:** Planners, schedulers, operations managers
- **Primary JTBD:** Triage and resolve exceptions that threaten the plan
- **Business value:** Converts solver outputs and system events into actionable, prioritized tasks. Reduces reaction time from hours to minutes.
- **Key information displayed:**
  - Prioritized alert list (critical → warning → info)
  - Severity badge, type icon, timestamp
  - Impact summary (affected orders, revenue at risk, KPI impact)
  - FlowIQ recommendation per alert
- **Key daily actions:**
  - Filter by severity and status (open, acknowledged)
  - Expand alert for full detail + FlowIQ suggestion
  - Apply suggestion, simulate first, or dismiss
  - Acknowledge alerts
  - Navigate to impacted orders or resources
- **High-value interaction patterns:**
  - Expand/collapse for progressive disclosure
  - One-click "Apply suggestion" from FlowIQ
  - "Simulate first" before committing changes
  - Direct links to affected orders and resources
- **Typical exceptions handled:** Machine downtime, material shortages, capacity overloads, late orders, schedule conflicts, changeovers
- **KPIs impacted:** OTIF, schedule adherence, utilization
- **FlowIQ on this screen:**
  - **Explain:** "CNC Lathe #1 spindle failure — 2 orders affected"
  - **Recommend:** "Reschedule to CNC-02 (available in 2h), keeps delivery on track"
  - **Simulate:** "Apply suggestion" → preview impact before committing
  - **Prioritize:** Alerts sorted by business impact, not just timestamp
- **Navigation:**
  - From: Dashboard
  - To: Order Detail, Schedule, Capacity

---

### C) Order / Job Detail View

- **Primary users:** Planners, customer service, expeditors
- **Primary JTBD:** Understand the full picture of a specific order — status, routing, risks, and options
- **Business value:** Single source of truth for any order. Enables fast decisions on expediting, rerouting, or communicating delays.
- **Key information displayed:**
  - Order header: ID, status, priority, customer, product, quantity, due date
  - Progress bar with status coloring
  - Days-to-due countdown (or overdue indicator)
  - Operation routing as vertical timeline (complete → in-progress → pending)
  - Related alerts
  - FlowIQ contextual analysis
- **Key daily actions:**
  - Review operation status and routing
  - Navigate to schedule view for this order
  - Launch what-if simulation
  - View related alerts
- **High-value interaction patterns:**
  - Vertical operation timeline with status icons
  - Contextual FlowIQ card based on order status
  - Quick-action buttons: "Simulate expedite," "Show alternatives"
  - Breadcrumb navigation back to orders list
- **Typical exceptions handled:** Late orders, at-risk deliveries, blocked operations
- **KPIs impacted:** OTIF, lead time, customer satisfaction
- **FlowIQ on this screen:**
  - **Explain:** "This order is past due because inspection was delayed by CNC downtime"
  - **Recommend:** "Fast-track inspection, use express shipping to recover today"
  - **Simulate:** "What if we add overtime to welding?"
  - **Prioritize:** Highlights which operation is the current bottleneck
- **Navigation:**
  - From: Orders list, Dashboard, Alerts, Schedule
  - To: Schedule, Scenarios, Alerts

---

### D) Capacity & Load View

- **Primary users:** Planners, operations managers
- **Primary JTBD:** Identify resource bottlenecks and balance load across the planning horizon
- **Business value:** Prevents overloads that cascade into delays. Enables proactive rebalancing before problems occur.
- **Key information displayed:**
  - Resource list with inline sparkline bars (7-day load preview)
  - Status indicators (running, down, changeover)
  - Average utilization percentage
  - Overload warnings
  - Expandable detail: day-by-day load vs. capacity with 100% reference line
- **Key daily actions:**
  - Filter by department
  - Expand resource for detailed daily view
  - Click "Find bottlenecks" for FlowIQ analysis
  - Navigate to specific resource on schedule
- **High-value interaction patterns:**
  - Inline sparkline bars for at-a-glance load assessment
  - Expand/collapse for progressive disclosure
  - Color-coded utilization (<85% green, 85–100% amber, >100% red)
  - FlowIQ suggestion cards for overloaded resources
- **Typical exceptions handled:** Capacity overloads, machine downtime, changeover bottlenecks
- **KPIs impacted:** Utilization, throughput, OTIF
- **FlowIQ on this screen:**
  - **Explain:** "Paint Line 1 is at 135% for 3 days due to concurrent paint ops"
  - **Recommend:** "Shift WO-1007 paint to Day +5, reduces to 95%"
  - **Simulate:** Load leveling preview
  - **Prioritize:** Highlights the single biggest bottleneck first
- **Navigation:**
  - From: Dashboard, Schedule, Alerts
  - To: Schedule, Scenarios

---

### E) What-If / Scenario Builder

- **Primary users:** Planners, operations managers
- **Primary JTBD:** Compare plan alternatives before committing changes
- **Business value:** Reduces risk of schedule changes. Enables data-driven decisions by showing KPI trade-offs across options.
- **Key information displayed:**
  - Scenario cards: baseline + what-if alternatives
  - Per-scenario KPIs: OTIF, utilization, late orders, makespan
  - Change descriptions (what was modified)
  - Delta indicators vs. baseline
  - Side-by-side comparison table
- **Key daily actions:**
  - Create new scenario (manual or FlowIQ-generated)
  - Select scenarios for comparison
  - Promote a scenario to the active plan
  - Clone or delete scenarios
- **High-value interaction patterns:**
  - Card selection with visual highlight
  - Side-by-side KPI comparison table
  - "Generate with FlowIQ" button
  - "Promote to plan" one-click action
  - Color-coded deltas (green = improvement, red = degradation)
- **Typical exceptions handled:** Evaluating rush order impact, overtime trade-offs, resource reallocation
- **KPIs impacted:** All — scenarios show projected impact on OTIF, utilization, lateness, makespan
- **FlowIQ on this screen:**
  - **Explain:** "This scenario adds overtime on 2 resources to meet WO-1002 deadline"
  - **Recommend:** "SCN-001 shows best OTIF improvement with moderate cost"
  - **Simulate:** Auto-generates scenarios from current exceptions
  - **Prioritize:** Ranks scenarios by net benefit
- **Navigation:**
  - From: Schedule, Alerts, Order Detail
  - To: Schedule (after promoting)

---

### F) KPI & Performance Dashboard

- **Primary users:** Operations managers, planners
- **Primary JTBD:** Monitor schedule performance and identify degradation trends
- **Business value:** Closes the feedback loop. Connects scheduling decisions to business outcomes. Enables continuous improvement.
- **Key information displayed:**
  - KPI summary cards: OTIF, adherence, throughput, WIP, lead time, utilization, tardiness, changeovers
  - Trend sparklines with target reference
  - 14-day trend charts (line charts for OTIF/adherence, bar charts for throughput/utilization)
  - Performance alerts (metrics below target)
- **Key daily actions:**
  - Click any KPI card to see detailed trend
  - Review FlowIQ root cause analysis
  - Navigate to related alerts or orders
- **High-value interaction patterns:**
  - Selectable KPI cards with highlight
  - Interactive Recharts trend visualizations
  - Progress bars vs. target with color coding
  - Performance alert list with severity
- **Typical exceptions handled:** KPI threshold breaches, trend degradation
- **KPIs impacted:** All tracked KPIs
- **FlowIQ on this screen:**
  - **Explain:** "OTIF dropped 6 points — caused by 2 material delays + 1 downtime"
  - **Recommend:** "Build safety stock for SS-316 and add CNC backup routing"
  - **Simulate:** "What if we improved material availability by 1 day?"
  - **Prioritize:** Highlights the KPI with biggest gap to target
- **Navigation:**
  - From: Dashboard
  - To: Alerts, Orders, Capacity

---

### G) Order Promise / Commit Screen

- **Primary users:** Sales, customer service, expeditors
- **Primary JTBD:** Check if a new order can be delivered by the requested date and commit a promise
- **Business value:** Reliable promise dates build customer trust and prevent over-commitment. ATP/CTP reduces manual back-and-forth between sales and planning.
- **Key information displayed:**
  - Promise request list (pending, committed)
  - Request details: customer, product, quantity, requested date
  - ATP result: available/not, earliest date, confidence score
  - CTP result: feasible/not, earliest date, overtime needs, affected orders
  - Trade-off summary
- **Key daily actions:**
  - Select a promise request
  - Review ATP and CTP results
  - Commit ATP date or CTP date
  - Simulate alternatives
  - Create new promise check
- **High-value interaction patterns:**
  - Split view: request list + detail panel
  - Color-coded ATP/CTP result cards (green = available, red = not)
  - Confidence score progress bar
  - Trade-off warnings for CTP (affected orders, overtime)
  - One-click commit buttons
- **Typical exceptions handled:** Capacity-constrained dates, material-limited availability
- **KPIs impacted:** OTIF (promise accuracy), customer satisfaction
- **FlowIQ on this screen:**
  - **Explain:** "ATP shows earliest date is +1 day from request. CTP can meet it with overtime."
  - **Recommend:** "Commit CTP date — overtime cost is minimal, protects relationship"
  - **Simulate:** "What if we defer WO-1006 to make room?"
  - **Prioritize:** Highlights highest-value customer requests first
- **Navigation:**
  - From: Dashboard (on demand), external request
  - To: Schedule, Scenarios

---

## Navigation Model

### Primary Navigation (Sidebar)
```
[F] FlowAPS logo
├── Dashboard        (/)
├── Schedule         (/schedule)
├── Alerts [4]       (/alerts)
├── Orders           (/orders)
├── Capacity         (/capacity)
├── Scenarios        (/scenarios)
├── KPIs             (/kpis)
├── Promise          (/promise)
└── [FlowIQ button]  (opens side panel)
```

### Secondary / Contextual Navigation
- **Top bar:** Page title + Command bar (Ctrl+K) + Notifications + User
- **Breadcrumbs:** On detail pages (Orders → WO-1001)
- **Inline links:** Alert → affected orders, Order → schedule view, etc.
- **Quick actions:** Context-sensitive buttons per screen

### FlowIQ Access Points
1. **Side panel** — Persistent AI assistant, opened via sidebar button
2. **Command bar** (Ctrl+K) — "Ask FlowIQ..." typed queries
3. **Inline hints** — Contextual banners on Schedule, Capacity, etc.
4. **Per-alert recommendations** — Embedded in each alert card
5. **Per-order analysis** — Contextual card on Order Detail
6. **Scenario generation** — "Generate with FlowIQ" button

---

## End-to-End Daily User Flows

### Flow 1: Handling a Rush Order Without Breaking Key Commitments

**Screens:** Dashboard → Promise → Scenarios → Schedule

1. **Dashboard** — Sales notifies planner of rush order. FlowIQ brief mentions new promise request.
2. **Promise** — Planner opens PR-002 (Turbine Bracket, Delta Aero). ATP says earliest is Day +8. CTP says feasible by Day +5 with overtime. FlowIQ explains trade-offs: WO-1003 and WO-1007 affected.
3. **Scenarios** — Planner clicks "Simulate alternatives." FlowIQ generates a what-if: rush order with overtime + defer WO-1006. Comparison shows OTIF improves by 3 points, utilization goes to 86%.
4. **Schedule** — Planner promotes scenario. Gantt updates. Frozen zone is respected. Planner verifies no conflicts in the frozen horizon.
5. **Promise** — Planner commits CTP date (Day +5) to sales.

**FlowIQ assists at every step:** explains ATP/CTP results, recommends CTP with overtime, generates scenario automatically, validates no frozen zone violations.

---

### Flow 2: Resolving a Material Shortage Impacting Multiple Orders

**Screens:** Alerts → Order Detail → Capacity → Scenarios → Schedule

1. **Alerts** — FlowIQ has surfaced ALT-002 (SS-316 shortage, critical). Impact: 3 orders, $180K revenue at risk. Planner expands the alert.
2. **FlowIQ Recommendation:** "Prioritize WO-1002 (due tomorrow). Defer WO-1004 by 2 days. Source expedited shipment."
3. **Order Detail** — Planner clicks WO-1002 to review routing. FlowIQ shows: "If expedited delivery arrives tomorrow, meet deadline with 4h overtime on welding. Otherwise, negotiate 1-day extension."
4. **Capacity** — Planner checks WELD-02 load. FlowIQ confirms overtime is feasible — 4h buffer available.
5. **Scenarios** — Planner creates "Rush WO-1002 + Overtime" scenario. FlowIQ shows OTIF recovery from 87% to 92%. WO-1006 deferred.
6. **Schedule** — Promote scenario. Planner acknowledges the alert in the inbox.

**FlowIQ assists:** surfaces the alert with business impact, recommends prioritization, confirms capacity feasibility, generates and evaluates scenario.

---

### Flow 3: Recovering from Machine Downtime and Rebalancing

**Screens:** Alerts → Capacity → Schedule → Scenarios → Orders

1. **Alerts** — ALT-001 fires: CNC Lathe #1 down (spindle failure). 2 orders affected (WO-1001, WO-1005). FlowIQ suggests rerouting to CNC-02.
2. **Capacity** — Planner opens Capacity view, expands CNC-02. FlowIQ confirms: "CNC-02 has an available slot in 2 hours. Rerouting keeps both deliveries on track."
3. **Schedule** — Planner views the Gantt. CNC-03 row is empty (down). Inline FlowIQ hint confirms the conflict and suggested fix.
4. **Scenarios** — Planner generates a "Reroute CNC jobs" scenario. Comparison shows: zero OTIF impact, utilization recovers from 78% to 83%.
5. **Schedule** — Promote scenario. Operations updated on the Gantt. CNC-02 now shows the rerouted operations.
6. **Orders** — Planner checks WO-1001 and WO-1005 — both show "on-track" status restored.

**FlowIQ assists:** detects downtime impact, suggests specific rerouting, validates alternate resource availability, generates recovery scenario.

---

## Tech Stack

- **React 19** + **Vite 7** — Fast dev and build
- **TailwindCSS 4** — Utility-first styling
- **React Router 7** — Client-side routing (HashRouter for GitHub Pages)
- **Recharts** — Charting (KPI trends)
- **Lucide React** — Icon library
- **date-fns** — Date formatting and manipulation

## Design Principles

- Minimalist, modern web-app UI — no cluttered tables by default
- Progressive disclosure — details only when needed (expand/collapse)
- Planner stays in control — AI assists, does not auto-execute
- Every screen answers: "What do I need to know or fix right now?"
- Prefer explanations and recommendations over raw solver outputs
- FlowIQ is visible, present, and useful — not hidden in a menu
