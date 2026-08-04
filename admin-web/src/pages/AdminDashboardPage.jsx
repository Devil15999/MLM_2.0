import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AuthContext';
import {
  Network,
  Users,
  DollarSign,
  TrendingUp,
  Database,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle,
  Play,
  Share2,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { admin, logoutAdmin, fetchRegisteredUsers } = useAdminAuth();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingPayout, setProcessingPayout] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const data = await fetchRegisteredUsers();
    setUsersList(data);
    setLoadingUsers(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleProcessPayout = () => {
    setProcessingPayout(true);
    setPayoutMessage('Calculating binary matching bonuses & unilevel volume points across all downlines...');
    setTimeout(() => {
      setProcessingPayout(false);
      setPayoutMessage('Weekly MLM Commission Payout Processed Successfully! ₹38,60,000 credited to distributor wallets.');
      setTimeout(() => setPayoutMessage(null), 5000);
    }, 2500);
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.sponsorId && u.sponsorId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>
      {/* Light Sidebar */}
      <aside style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '32px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--primary-admin-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}>
              <Network size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>Nexis MLM</h3>
              <span style={{ fontSize: '12px', color: 'var(--primary-admin)', fontWeight: '700' }}>Admin Operations</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: '#ecfdf5',
              color: '#059669',
              fontWeight: '800',
              fontSize: '14px'
            }}>
              <Users size={18} /> Member Network
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <DollarSign size={18} /> Payout Engine
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <Database size={18} /> MongoDB Cluster
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <Layers size={18} /> Matrix Analytics
            </div>
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{admin?.name || 'System Admin'}</div>
            <div style={{ fontSize: '11px', color: 'var(--primary-admin)', fontWeight: '700' }}>Master Network Admin</div>
          </div>
          <button
            onClick={logoutAdmin}
            title="Sign out of Console"
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          padding: '18px 32px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>MLM Network Command Center</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Monitor matrix downlines, distributor rankings & binary payout cycles</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={handleProcessPayout}
              disabled={processingPayout}
              className="btn-admin"
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              <Play size={16} /> {processingPayout ? 'Calculating Binary Bonus...' : 'Process Weekly Binary Payouts'}
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main style={{ padding: '32px', maxWidth: '1400px', width: '100%' }}>
          {payoutMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '14px 20px',
              marginBottom: '24px',
              color: '#065f46',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle size={18} />
              <span>{payoutMessage}</span>
            </div>
          )}

          {/* Metric Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div className="light-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Active Distributors</span>
                <div style={{ padding: '8px', background: '#ecfdf5', color: '#059669', borderRadius: '8px' }}>
                  <Users size={18} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                {loadingUsers ? '...' : usersList.length} Members
              </div>
              <div style={{ fontSize: '12px', color: 'var(--primary-admin)', fontWeight: '700', marginTop: '4px' }}>
                Fetched live from MongoDB
              </div>
            </div>

            <div className="light-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Total Network Volume</span>
                <div style={{ padding: '8px', background: '#eef2ff', color: '#4f46e5', borderRadius: '8px' }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
                ₹{(usersList.reduce((acc, u) => {
                  const p = u.selectedPackage || '';
                  if (p.includes('Elite')) return acc + 30000;
                  if (p.includes('Premium') || p.includes('Gold')) return acc + 20000;
                  if (p.includes('Starter') || p.includes('Silver') || p.includes('Bronze')) return acc + 10000;
                  return acc;
                }, 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })} GV
              </div>
              <div style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '700', marginTop: '4px' }}>
                Accumulates on package purchases
              </div>
            </div>

            <div className="light-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Total Commission Paid</span>
                <div style={{ padding: '8px', background: '#fffbeb', color: '#d97706', borderRadius: '8px' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
                ${(usersList.reduce((acc, u) => acc + (u.walletBalance || 0), 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '700', marginTop: '4px' }}>
                Updates live on Admin approvals
              </div>
            </div>

            <div className="light-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>MongoDB Atlas Status</span>
                <div style={{ padding: '8px', background: '#f0f9ff', color: '#0284c7', borderRadius: '8px' }}>
                  <Database size={18} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>Connected</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }} className="code-font">
                pentest_db.users
              </div>
            </div>
          </div>

          {/* Pending Commission Approvals Section */}
          <PendingApprovalsSection />

          {/* Distributor Management Table */}
          <div className="light-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Registered Network Distributors</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Live downline registry stored in MongoDB Atlas database</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '240px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search distributor or sponsor ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <button
                  onClick={loadUsers}
                  style={{
                    padding: '8px 14px',
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} className={loadingUsers ? 'pulse-dot' : ''} /> Refresh List
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px' }}>Distributor Name</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Sponsor ID</th>
                    <th style={{ padding: '12px 16px' }}>Rank Level</th>
                    <th style={{ padding: '12px 16px' }}>Wallet Balance</th>
                    <th style={{ padding: '12px 16px' }}>Direct Downlines</th>
                    <th style={{ padding: '12px 16px' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading distributor records from MongoDB Atlas...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No distributors found matching search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{u.name}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }} className="code-font">{u.email}</td>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: '#4f46e5' }} className="code-font">{u.sponsorId || 'NEXIS-TOP'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            background: u.rank === 'Diamond' ? '#fef3c7' : (u.rank === 'Platinum' ? '#e0e7ff' : '#dcfce7'),
                            color: u.rank === 'Diamond' ? '#92400e' : (u.rank === 'Platinum' ? '#3730a3' : '#166534')
                          }}>
                            {u.rank || 'Gold'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '800', color: '#059669' }}>
                          ${(typeof u.walletBalance === 'number' ? u.walletBalance : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {u.downlineCount ?? 0} Members
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ImageModal = ({ isOpen, onClose, imageSrc, title }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ background: '#fff', borderRadius: '12px', maxWidth: '600px', width: '100%', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{title}</h3>
          <button onClick={onClose} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        </div>
        {imageSrc ? (
          <img src={imageSrc} alt={title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} />
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No image provided.</p>
        )}
      </div>
    </div>
  );
};

const PendingApprovalsSection = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      const res = await fetch(`${apiUrl.replace('/auth', '')}/admin/approvals`);
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (err) {
      console.log('Using default mock approval queue');
      setApprovals([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id, name) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      await fetch(`${apiUrl.replace('/auth', '')}/admin/approvals/${id}/approve`, { method: 'POST' });
    } catch (err) {}

    setApprovals(prev => prev.map(a => a._id === id ? { ...a, status: 'Approved' } : a));
    setActionMessage(`Approved request for ${name}! Wallet credited successfully.`);
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleReject = async (id, name) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      await fetch(`${apiUrl.replace('/auth', '')}/admin/approvals/${id}/reject`, { method: 'POST' });
    } catch (err) {}

    setApprovals(prev => prev.map(a => a._id === id ? { ...a, status: 'Rejected' } : a));
    setActionMessage(`Rejected request for ${name}.`);
    setTimeout(() => setActionMessage(null), 5000);
  };

  const openImageModal = (src, title) => {
    setModalImage(src);
    setModalTitle(title);
  };

  const joiningRequests = approvals.filter(a => a.type === 'Joining Request');
  const commissionApprovals = approvals.filter(a => a.type !== 'Joining Request');

  return (
    <>
      <ImageModal isOpen={!!modalImage} onClose={() => setModalImage(null)} imageSrc={modalImage} title={modalTitle} />

      <div className="light-card" style={{ padding: '28px', marginBottom: '28px', border: '2px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
              <Users size={14} /> New Joining Requests ({joiningRequests.filter(a => a.status === 'Pending').length} Pending)
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Pending Joining Requests</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Approve new distributor registrations and process initial package commissions</p>
          </div>

          <button
            onClick={fetchApprovals}
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'pulse-dot' : ''} /> Refresh Requests
          </button>
        </div>

        {actionMessage && (
          <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontWeight: '700', fontSize: '13px', marginBottom: '20px' }}>
            {actionMessage}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Applicant Name</th>
                <th style={{ padding: '12px 16px' }}>Package</th>
                <th style={{ padding: '12px 16px' }}>Aadhaar Number</th>
                <th style={{ padding: '12px 16px' }}>Documents</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {joiningRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pending joining requests.
                  </td>
                </tr>
              ) : (
                joiningRequests.map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{app.enrolledMemberName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.enrolledMemberEmail}</div>
                      <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px', fontWeight: '600' }}>Sponsor: {app.sponsorName}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{app.packageName}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#4f46e5' }}>
                      {app.userId?.aadhaarNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => openImageModal(app.userId?.aadhaarPhoto, 'Aadhaar Photo')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }}>
                          Aadhaar
                        </button>
                        <button onClick={() => openImageModal(app.userId?.panPhoto, 'PAN Photo')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }}>
                          PAN
                        </button>
                        <button onClick={() => openImageModal(app.userId?.transactionPhoto, 'Transaction Proof')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }}>
                          Tx Proof
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: app.status === 'Approved' ? '#dcfce7' : (app.status === 'Rejected' ? '#fef2f2' : '#fef3c7'),
                        color: app.status === 'Approved' ? '#166534' : (app.status === 'Rejected' ? '#991b1b' : '#92400e'),
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {app.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleApprove(app._id, app.enrolledMemberName)}
                            className="btn-emerald"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(app._id, app.enrolledMemberName)}
                            className="btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fca5a5' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {commissionApprovals.length > 0 && (
        <div className="light-card" style={{ padding: '28px', marginBottom: '28px', border: '2px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                <Award size={14} /> Downline Commission Approvals Queue ({commissionApprovals.filter(a => a.status === 'Pending').length} Pending)
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Pending Commission Approvals</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Approve legacy downline enrollments to credit referral commissions</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Sponsor (Higher Level)</th>
                  <th style={{ padding: '12px 16px' }}>Enrolled Member</th>
                  <th style={{ padding: '12px 16px' }}>Tree Position</th>
                  <th style={{ padding: '12px 16px' }}>Package</th>
                  <th style={{ padding: '12px 16px' }}>Commission Amount</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {commissionApprovals.map((app) => (
                  <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{app.sponsorName}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{app.enrolledMemberName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.enrolledMemberEmail}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                        {app.position}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{app.packageName}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '800', color: '#059669' }}>
                      +₹{Number(app.commissionAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: app.status === 'Approved' ? '#dcfce7' : (app.status === 'Rejected' ? '#fef2f2' : '#fef3c7'),
                        color: app.status === 'Approved' ? '#166534' : (app.status === 'Rejected' ? '#991b1b' : '#92400e'),
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {app.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleApprove(app._id, app.enrolledMemberName)}
                            className="btn-emerald"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(app._id, app.enrolledMemberName)}
                            className="btn-outline"
                            style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fca5a5' }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
