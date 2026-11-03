import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { localDB } from '../lib/supabaseClient';
import {
  Users,
  Trash2,
  Truck,
  ShoppingBag,
  ShieldAlert,
  Search,
  Plus,
  FileText,
  Trash
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState('households'); // households, orders, collections, distribution
  const [households, setHouseholds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // Search & Filters
  const [householdSearch, setHouseholdSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // New Collection Schedule Modal / Form
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    ward_zone: 'Ward 12 - Green Valley',
    area_name: '',
    bin_type: 'G-Bin (Wet Waste)',
    collection_day: 'Mon, Wed, Fri',
    time_slot: '07:00 AM - 09:30 AM',
    vehicle_number: 'GV-04-WM-108',
    driver_name: '',
    driver_phone: '+91 98000 ',
    status: 'Scheduled',
    operational_notes: ''
  });

  // Reload data
  const loadData = () => {
    setHouseholds(localDB.getHouseholds());
    setOrders(localDB.getOrders());
    setCollections(localDB.getCollections());
    setProfiles(localDB.getProfiles());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Order Status Handler
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const target = orders.find(o => o.id === orderId);
    if (target) {
      const updated = { ...target, status: newStatus };
      localDB.saveOrder(updated);
      loadData();
    }
  };

  // Update Collection Status Handler
  const handleUpdateCollectionStatus = (collectionId, newStatus) => {
    const target = collections.find(c => c.id === collectionId);
    if (target) {
      const updated = {
        ...target,
        status: newStatus,
        last_completed_at: newStatus === 'Completed' ? new Date().toISOString() : target.last_completed_at
      };
      localDB.saveCollection(updated);
      loadData();
    }
  };

  // Create New Regular Collection Schedule
  const handleCreateSchedule = (e) => {
    e.preventDefault();
    const newEntry = {
      id: 'col-' + Date.now(),
      ...newSchedule,
      created_at: new Date().toISOString()
    };
    localDB.saveCollection(newEntry);
    setIsScheduleModalOpen(false);
    setNewSchedule({
      ward_zone: 'Ward 12 - Green Valley',
      area_name: '',
      bin_type: 'G-Bin (Wet Waste)',
      collection_day: 'Mon, Wed, Fri',
      time_slot: '07:00 AM - 09:30 AM',
      vehicle_number: 'GV-04-WM-108',
      driver_name: '',
      driver_phone: '+91 98000 ',
      status: 'Scheduled',
      operational_notes: ''
    });
    loadData();
  };

  // Delete Collection
  const handleDeleteCollection = (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled collection route?')) {
      localDB.deleteCollection(id);
      loadData();
    }
  };

  // Filtered lists
  const filteredHouseholds = households.filter(h => {
    const term = householdSearch.toLowerCase();
    return (
      h.household_id?.toLowerCase().includes(term) ||
      h.street_address?.toLowerCase().includes(term) ||
      h.ward_zone?.toLowerCase().includes(term)
    );
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.household_id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.delivery_address?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Bin Distribution Totals
  const totalGBinsDistributed = households.reduce((sum, h) => sum + (h.g_bin_count || 1), 0);
  const totalBBinsDistributed = households.reduce((sum, h) => sum + (h.b_bin_count || 1), 0);

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <ShieldAlert size={16} /> Municipal Operations Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Administrative Management</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Oversee registered households, monitor regular collection schedules, and fulfill bin orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/reports" className="btn btn-outline" id="admin-view-reports-btn">
            <FileText size={16} /> View Reports & Analytics
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #cbd5e1', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('households')}
          className={`btn ${activeTab === 'households' ? 'btn-bbin' : 'btn-outline'}`}
          id="tab-households"
        >
          <Users size={16} /> Registered Households ({households.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-bbin' : 'btn-outline'}`}
          id="tab-orders"
        >
          <ShoppingBag size={16} /> Bin Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`btn ${activeTab === 'collections' ? 'btn-bbin' : 'btn-outline'}`}
          id="tab-collections"
        >
          <Truck size={16} /> Scheduled Collections ({collections.length})
        </button>

        <button
          onClick={() => setActiveTab('distribution')}
          className={`btn ${activeTab === 'distribution' ? 'btn-bbin' : 'btn-outline'}`}
          id="tab-distribution"
        >
          <Trash2 size={16} /> Bin Distribution Records
        </button>
      </div>

      {/* TAB 1: REGISTERED HOUSEHOLDS */}
      {activeTab === 'households' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Household Database & Unique IDs</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search Household ID or Ward..."
                value={householdSearch}
                onChange={(e) => setHouseholdSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', width: '280px', fontSize: '0.85rem' }}
                id="household-search-input"
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Household ID</th>
                  <th>Ward / Zone</th>
                  <th>Street Address</th>
                  <th>PIN</th>
                  <th>Residents</th>
                  <th>Bin Quota</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseholds.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#065f46', fontFamily: 'monospace', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                        {h.household_id}
                      </span>
                    </td>
                    <td><strong>{h.ward_zone}</strong></td>
                    <td>{h.street_address}</td>
                    <td>{h.pincode}</td>
                    <td>{h.residents_count} Members</td>
                    <td>
                      <span style={{ color: '#059669', fontWeight: 600 }}>{h.g_bin_count || 1} G-Bin</span> / <span style={{ color: '#0284c7', fontWeight: 600 }}>{h.b_bin_count || 1} B-Bin</span>
                    </td>
                    <td>{new Date(h.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BIN ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Manage Bin Orders & Fulfillment</h3>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Search Order # or Household..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '32px', width: '240px', fontSize: '0.85rem' }}
                  id="order-search-input"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto', fontSize: '0.85rem' }}
                id="order-filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Household ID</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Delivery Address</th>
                  <th>Current Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td><strong>#{ord.id}</strong></td>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#047857' }}>
                        {ord.household_id}
                      </span>
                    </td>
                    <td>
                      {ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td><strong>₹{ord.total_amount}</strong></td>
                    <td style={{ maxWidth: '240px', fontSize: '0.8rem' }}>
                      {ord.delivery_address}
                      <div style={{ color: '#64748b' }}>Tel: {ord.contact_phone}</div>
                    </td>
                    <td>
                      <span className={`status-badge badge-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="form-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                        id={`update-order-status-${ord.id}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGULAR SCHEDULED WASTE COLLECTIONS */}
      {activeTab === 'collections' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Operational Waste Collection Schedules</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage regular scheduled routes, drivers, and route progress</p>
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="btn btn-gbin btn-sm"
              id="add-collection-schedule-btn"
            >
              <Plus size={16} /> Add New Collection Route
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Stream / Bin</th>
                  <th>Ward & Area</th>
                  <th>Frequency & Day</th>
                  <th>Time Slot</th>
                  <th>Vehicle</th>
                  <th>Officer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr key={col.id}>
                    <td>
                      <span className={`status-badge ${col.bin_type.includes('G-Bin') ? 'badge-completed' : col.bin_type.includes('B-Bin') ? 'badge-in-progress' : 'badge-confirmed'}`}>
                        {col.bin_type}
                      </span>
                    </td>
                    <td>
                      <strong>{col.area_name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{col.ward_zone}</div>
                    </td>
                    <td>{col.collection_day}</td>
                    <td>{col.time_slot}</td>
                    <td>{col.vehicle_number}</td>
                    <td>
                      {col.driver_name}
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{col.driver_phone}</div>
                    </td>
                    <td>
                      <select
                        value={col.status}
                        onChange={(e) => handleUpdateCollectionStatus(col.id, e.target.value)}
                        className="form-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                        id={`update-collection-status-${col.id}`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteCollection(col.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: '#fecaca', padding: '0.3rem 0.5rem' }}
                        title="Delete Schedule"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BIN DISTRIBUTION RECORDS */}
      {activeTab === 'distribution' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Municipal Bin Distribution Records
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card card-gbin">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Total G-Bins Distributed</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#065f46', margin: '0.5rem 0' }}>
                {totalGBinsDistributed} Bins
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Designated for domestic wet/biodegradable waste</p>
            </div>

            <div className="card card-bbin">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Total B-Bins Distributed</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#075985', margin: '0.5rem 0' }}>
                {totalBBinsDistributed} Bins
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Designated for dry packaging and recyclables</p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #8b5cf6' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>Total Dual-Bin Coverage</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#5b21b6', margin: '0.5rem 0' }}>
                {totalGBinsDistributed + totalBBinsDistributed} Total Units
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Active across registered residential households</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Household ID</th>
                  <th>Registered Head</th>
                  <th>Zone</th>
                  <th>Green Bins Active</th>
                  <th>Blue Bins Active</th>
                  <th>Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                {households.map((h) => {
                  const prof = profiles.find(p => p.id === h.user_id);
                  return (
                    <tr key={h.id}>
                      <td><span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{h.household_id}</span></td>
                      <td>{prof?.full_name || 'Resident'}</td>
                      <td>{h.ward_zone}</td>
                      <td><strong>{h.g_bin_count || 1} Unit</strong></td>
                      <td><strong>{h.b_bin_count || 1} Unit</strong></td>
                      <td><span className="status-badge badge-completed">Compliant</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE NEW COLLECTION ROUTE MODAL */}
      {isScheduleModalOpen && (
        <div className="drawer-overlay" onClick={() => setIsScheduleModalOpen(false)}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '540px', width: '100%', margin: 'auto', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Add Regular Scheduled Collection Route
            </h3>

            <form onSubmit={handleCreateSchedule}>
              <div className="form-group">
                <label className="form-label">Ward / Administrative Zone</label>
                <select
                  className="form-select"
                  value={newSchedule.ward_zone}
                  onChange={(e) => setNewSchedule({ ...newSchedule, ward_zone: e.target.value })}
                >
                  <option value="Ward 12 - Green Valley">Ward 12 - Green Valley</option>
                  <option value="Ward 08 - Eco Heights">Ward 08 - Eco Heights</option>
                  <option value="Ward 15 - Central Park">Ward 15 - Central Park</option>
                  <option value="Ward 03 - Sunrise Colony">Ward 03 - Sunrise Colony</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Area / Sector Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Palm Meadows & 5th Block"
                  value={newSchedule.area_name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, area_name: e.target.value })}
                  id="new-route-area"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bin Type Stream</label>
                <select
                  className="form-select"
                  value={newSchedule.bin_type}
                  onChange={(e) => setNewSchedule({ ...newSchedule, bin_type: e.target.value })}
                >
                  <option value="G-Bin (Wet Waste)">G-Bin (Wet Waste)</option>
                  <option value="B-Bin (Dry Waste)">B-Bin (Dry Waste)</option>
                  <option value="Both (G-Bin & B-Bin)">Both (G-Bin & B-Bin)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Collection Frequency / Days</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Daily, Mon-Sat"
                    value={newSchedule.collection_day}
                    onChange={(e) => setNewSchedule({ ...newSchedule, collection_day: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Window</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="07:00 AM - 09:30 AM"
                    value={newSchedule.time_slot}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time_slot: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vehicle Registration Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. KA-05-WM-9821"
                    value={newSchedule.vehicle_number}
                    onChange={(e) => setNewSchedule({ ...newSchedule, vehicle_number: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sanitation Driver Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Officer Full Name"
                    value={newSchedule.driver_name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, driver_name: e.target.value })}
                    id="new-route-driver"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Driver Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 98000 12345"
                  value={newSchedule.driver_phone}
                  onChange={(e) => setNewSchedule({ ...newSchedule, driver_phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gbin"
                  id="confirm-create-schedule-btn"
                >
                  Save Route Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
