import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Alerts from './pages/Alerts';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Capacity from './pages/Capacity';
import Scenarios from './pages/Scenarios';
import KPIs from './pages/KPIs';
import Promise from './pages/Promise';
import Adaptive from './pages/Adaptive';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/capacity" element={<Capacity />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/kpis" element={<KPIs />} />
          <Route path="/promise" element={<Promise />} />
          <Route path="/adaptive" element={<Adaptive />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
