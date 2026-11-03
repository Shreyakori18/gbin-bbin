import React, { useState, useEffect } from 'react';
import { localDB } from '../lib/supabaseClient';
import {
  BarChart3,
  Users,
  Trash2,
  ShoppingBag,
  Download,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminReports = () => {
  const [households, setHouseholds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setHouseholds(localDB.getHouseholds());
    setOrders(localDB.getOrders());
    setCollections(localDB.getCollections());
  }, []);

  // Aggregated Metrics
  const totalHouseholds = households.length;
  const totalGBins = households.reduce((sum, h) => sum + (h.g_bin_count || 1), 0);
  const totalBBins = households.reduce((sum, h) => sum + (h.b_bin_count || 1), 0);
  const totalBins = totalGBins + totalBBins;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
  const outForDeliveryOrders = orders.filter(o => o.status === 'Out for Delivery').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;

  const totalOrderRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  // Collections metrics
  const activeRoutes = collections.length;
  const completedTodayRoutes = collections.filter(c => c.status === 'Completed').length;
  const inProgressRoutes = collections.filter(c => c.status === 'In Progress').length;
  const scheduledRoutes = collections.filter(c => c.status === 'Scheduled').length;

  // Breakdown by ward
  const wardBreakdown = households.reduce((acc, h) => {
    const ward = h.ward_zone || 'Unassigned';
    acc[ward] = (acc[ward] || 0) + 1;
    return acc;
  }, {});

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Registered Households,${totalHouseholds}\n` +
      `Total G-Bins Distributed,${totalGBins}\n` +
      `Total B-Bins Distributed,${totalBBins}\n` +
      `Total Bins Active,${totalBins}\n` +
      `Total Orders Placed,${totalOrders}\n` +
      `Pending Orders,${pendingOrders}\n` +
      `Delivered Orders,${completedOrders}\n` +
      `Total Order Value INR,${totalOrderRevenue}\n` +
      `Total Active Collection Routes,${activeRoutes}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gbin_bbin_operational_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <BarChart3 size={16} /> Operational Intelligence
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Municipal Analytics & Reports</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Real-time status of household coverage, bin distribution volume, and collection route operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleExportCSV} className="btn btn-outline" id="export-csv-btn">
            <Download size={16} /> Export Operational CSV
          </button>
          <Link to="/admin" className="btn btn-bbin">
            Back to Admin Panel
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* Total Households */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Registered Households</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }} id="report-total-households">
                {totalHouseholds}
              </div>
            </div>
            <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '8px', color: '#10b981' }}>
              <Users size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>100% Unique ID Allocated</span>
        </div>

        {/* Total Bins Distributed */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Bins Distributed</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }} id="report-total-bins">
                {totalBins}
              </div>
            </div>
            <div style={{ background: '#f0f9ff', padding: '0.5rem', borderRadius: '8px', color: '#0284c7' }}>
              <Trash2 size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
            {totalGBins} G-Bins / {totalBBins} B-Bins
          </span>
        </div>

        {/* Total Bin Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Orders</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }} id="report-total-orders">
                {totalOrders}
              </div>
            </div>
            <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '8px', color: '#d97706' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
            {pendingOrders} Pending | {completedOrders} Delivered
          </span>
        </div>

        {/* Collection Route Coverage */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Scheduled Routes</span>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>
                {activeRoutes}
              </div>
            </div>
            <div style={{ background: '#f5f3ff', padding: '0.5rem', borderRadius: '8px', color: '#7c3aed' }}>
              <Calendar size={22} />
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
            {completedTodayRoutes} Completed Today | {inProgressRoutes} In Progress
          </span>
        </div>
      </div>

      {/* Two Column Detailed Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Ward Distribution Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Household Registrations by Ward
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(wardBreakdown).map(([ward, count]) => {
              const percentage = Math.round((count / totalHouseholds) * 100) || 0;
              return (
                <div key={ward}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{ward}</span>
                    <span style={{ color: '#64748b' }}>{count} Homes ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#10b981', borderRadius: '999px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Bin Orders Fulfillment Pipeline
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#c2410c' }}>{pendingOrders}</div>
              <span style={{ fontSize: '0.75rem', color: '#ea580c' }}>Awaiting dispatch</span>
            </div>

            <div style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#3730a3', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4338ca' }}>{confirmedOrders}</div>
              <span style={{ fontSize: '0.75rem', color: '#4f46e5' }}>Staged for loading</span>
            </div>

            <div style={{ background: '#cffafe', border: '1px solid #a5f3fc', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#155e75', fontWeight: 700, textTransform: 'uppercase' }}>Out for Delivery</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0e7490' }}>{outForDeliveryOrders}</div>
              <span style={{ fontSize: '0.75rem', color: '#0891b2' }}>On vehicle route</span>
            </div>

            <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Delivered</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d' }}>{completedOrders}</div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>Doorstep verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Waste Collection Operational Records */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
          Collection Operations Activity Log
        </h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ward / Zone</th>
                <th>Area Route</th>
                <th>Bin Stream</th>
                <th>Time Window</th>
                <th>Vehicle</th>
                <th>Officer In Charge</th>
                <th>Operational Status</th>
                <th>Last Run Completed</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.ward_zone}</strong></td>
                  <td>{c.area_name}</td>
                  <td>
                    <span className={`status-badge ${c.bin_type.includes('G-Bin') ? 'badge-completed' : c.bin_type.includes('B-Bin') ? 'badge-in-progress' : 'badge-confirmed'}`}>
                      {c.bin_type}
                    </span>
                  </td>
                  <td>{c.time_slot}</td>
                  <td>{c.vehicle_number}</td>
                  <td>{c.driver_name}</td>
                  <td>
                    <span className={`status-badge badge-${c.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {c.last_completed_at ? new Date(c.last_completed_at).toLocaleString() : 'Pending Round'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
