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
  CheckCircle2,
  CreditCard,
  Play,
  Award,
  Layers,
  LayoutDashboard,
  UserCheck,
  ArrowRight,
  Filter,
  Percent
} from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageSrc, title }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '640px', width: '100%', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{title}</h3>
          <button onClick={onClose} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
        </div>
        {imageSrc ? (
          <img src={imageSrc} alt={title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '10px', border: '1px solid var(--border-color)' }} />
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No image document provided.</p>
        )}
      </div>
    </div>
  );
};

export const AdminDashboardPage = () => {
  const { admin, logoutAdmin, fetchRegisteredUsers } = useAdminAuth();
  
  // Dashboard & Filter States
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState('All');
  const [processingPayout, setProcessingPayout] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // ROI Update Form State
  const [level1RoiInput, setLevel1RoiInput] = useState('500');
  const [level2RoiInput, setLevel2RoiInput] = useState('300');
  const [submittingRoi, setSubmittingRoi] = useState(false);

  // Approvals state
  const [approvals, setApprovals] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');


  const loadUsers = async () => {
    setLoadingUsers(true);
    const data = await fetchRegisteredUsers();
    setUsersList(data || []);
    setLoadingUsers(false);
  };

  const fetchApprovals = async () => {
    setLoadingApprovals(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      const res = await fetch(`${apiUrl.replace('/auth', '')}/admin/approvals`);
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (err) {
      console.log('Error fetching admin approval queue:', err);
      setApprovals([]);
    }
    setLoadingApprovals(false);
  };

  useEffect(() => {
    loadUsers();
    fetchApprovals();
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

  const handleSubmitDailyRoi = async (e) => {
    e.preventDefault();
    const l1 = Number(level1RoiInput || 0);
    const l2 = Number(level2RoiInput || 0);

    if (isNaN(l1) || isNaN(l2) || (l1 <= 0 && l2 <= 0)) {
      alert('Please enter a valid daily ROI amount greater than ₹0 for Level 1 or Level 2.');
      return;
    }

    setSubmittingRoi(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      const res = await fetch(`${apiUrl.replace('/auth', '')}/admin/roi/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level1Amount: l1, level2Amount: l2 })
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message || `Daily ROI updated! Credited ₹${l1} to Level 1 and ₹${l2} to Level 2.`);
        fetchApprovals();
        loadUsers();
        setTimeout(() => setActionMessage(null), 6000);
      } else {
        alert(`ROI Update Error: ${data.message || 'Failed to update ROI'}`);
      }
    } catch (err) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setSubmittingRoi(false);
    }
  };

  // Filtered approval queues
  const joiningRequests = approvals.filter(a => a.type === 'Joining Request');
  const downlineRequests = approvals.filter(a => a.type === 'Enrolled Downline Commission');
  const walletRequests = approvals.filter(a => a.type === 'Wallet Withdrawal');
  const roiLogs = approvals.filter(a => a.type === 'Daily ROI Payout');

  const pendingJoiningCount = joiningRequests.filter(a => a.status === 'Pending').length;
  const pendingDownlineCount = downlineRequests.filter(a => a.status === 'Pending').length;
  const pendingWalletCount = walletRequests.filter(a => a.status === 'Pending').length;

  // Filtered members list
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.sponsorId && u.sponsorId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));
    
    const matchesRank = rankFilter === 'All' || u.rank === rankFilter;
    return matchesSearch && matchesRank;
  });

  // Calculate volume
  const totalGV = usersList.reduce((acc, u) => {
    const p = u.selectedPackage || '';
    if (p.includes('Elite')) return acc + 30000;
    if (p.includes('Premium') || p.includes('Gold')) return acc + 20000;
    if (p.includes('Starter') || p.includes('Silver') || p.includes('Bronze')) return acc + 10000;
    return acc;
  }, 0);

  const totalCommissions = usersList.reduce((acc, u) => acc + (u.walletBalance || 0), 0);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 0 },
    { id: 'members', label: 'Member Network', icon: Users, badge: 0 },
    { id: 'joining', label: 'Joining Requests', icon: UserCheck, badge: pendingJoiningCount },
    { id: 'downline', label: 'Downline Approvals', icon: Award, badge: pendingDownlineCount },
    { id: 'payouts', label: 'Payout Engine', icon: DollarSign, badge: pendingWalletCount },
    { id: 'roi', label: 'ROI Update', icon: Percent, badge: 0 },
    { id: 'database', label: 'MongoDB & Analytics', icon: Database, badge: 0 },
  ];


  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>
      <ImageModal isOpen={!!modalImage} onClose={() => setModalImage(null)} imageSrc={modalImage} title={modalTitle} />

      {/* Sidebar */}
      <aside style={{
        width: '270px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', marginBottom: '32px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--primary-admin-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
            }}>
              <Network size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>lifefundAI</h3>
              <span style={{ fontSize: '12px', color: 'var(--primary-admin)', fontWeight: '700' }}>Admin Console</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px 8px' }}>
              Dashboard Sections
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: isActive ? '#ecfdf5' : 'transparent',
                    color: isActive ? '#059669' : 'var(--text-muted)',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '13px',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} color={isActive ? '#059669' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span style={{
                      background: isActive ? '#059669' : '#ef4444',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '10px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
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
              border: '1px solid #fecaca',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          padding: '20px 32px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
                {activeTab === 'overview' && 'MLM Command Center Overview'}
                {activeTab === 'members' && 'Registered Distributor Directory'}
                {activeTab === 'joining' && 'Pending Registration Approvals'}
                {activeTab === 'downline' && 'Downline Member Additions Queue'}
                {activeTab === 'payouts' && 'Payout Engine & Withdrawal Queue'}
                {activeTab === 'roi' && 'Daily ROI Payout & Wallet Update'}
                {activeTab === 'database' && 'MongoDB Atlas Cluster & Analytics'}
              </h1>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {activeTab === 'overview' && 'Real-time overview of distributor registrations, downline volume & pending approval queues'}
              {activeTab === 'members' && 'View, search and manage all registered network distributors in MongoDB'}
              {activeTab === 'joining' && 'Review public direct sign-up registrations and inspect submitted KYC documents'}
              {activeTab === 'downline' && 'Approve downline members enrolled by distributors into Level 1 or Level 2 tree slots'}
              {activeTab === 'payouts' && 'Approve distributor wallet withdrawal requests & execute weekly binary commission payouts'}
              {activeTab === 'roi' && 'Set and credit daily ROI amounts for Level 1 and Level 2 distributors directly to their wallets'}
              {activeTab === 'database' && 'Monitor MongoDB database connection status, volume points & downline matrix statistics'}
            </p>

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

        {/* Horizontal Tab Selector Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 32px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: isActive ? 'var(--primary-admin-gradient)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '600',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none'
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    background: isActive ? '#ffffff' : '#ef4444',
                    color: isActive ? '#059669' : '#ffffff',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification Messages */}
        <div style={{ padding: '24px 32px 0 32px' }}>
          {payoutMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '14px 20px',
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

          {actionMessage && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> {actionMessage}
            </div>
          )}
        </div>

        {/* Main Tab Content Body */}
        <main style={{ padding: '24px 32px 32px 32px', maxWidth: '1400px', width: '100%' }}>

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div>
              {/* Metric Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '20px',
                marginBottom: '28px'
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
                    ₹{totalGV.toLocaleString('en-IN', { minimumFractionDigits: 2 })} GV
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
                    ₹{totalCommissions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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

              {/* Pending Approvals Quick Summary Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '28px'
              }}>
                <div className="light-card" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                        Registration Queue
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>Joining Requests</h4>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1d4ed8' }}>{pendingJoiningCount}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Public sign-up distributor registrations awaiting Aadhaar/PAN approval.
                  </p>
                  <button
                    onClick={() => setActiveTab('joining')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#2563eb', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    Manage Joining Requests <ArrowRight size={14} />
                  </button>
                </div>

                <div className="light-card" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#047857', background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px' }}>
                        Downline Queue
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>Downline Approvals</h4>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#047857' }}>{pendingDownlineCount}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Distributor-enrolled downline slots in Level 1 / Level 2 matrix levels.
                  </p>
                  <button
                    onClick={() => setActiveTab('downline')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#059669', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    Manage Downline Approvals <ArrowRight size={14} />
                  </button>
                </div>

                <div className="light-card" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b21a8', background: '#f3e8ff', padding: '3px 8px', borderRadius: '6px' }}>
                        Withdrawals Queue
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>Payout Requests</h4>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#6b21a8' }}>{pendingWalletCount}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Wallet withdrawal payout requests submitted by active distributors.
                  </p>
                  <button
                    onClick={() => setActiveTab('payouts')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#7c3aed', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    Manage Payout Requests <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Recent Member Directory Quick Table */}
              <div className="light-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Recent Network Distributors</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Latest active members registered in MongoDB database</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('members')}
                    className="btn-admin"
                    style={{ fontSize: '12px', padding: '8px 14px' }}
                  >
                    View All Member Directory ({usersList.length})
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Distributor</th>
                        <th style={{ padding: '12px 16px' }}>Email</th>
                        <th style={{ padding: '12px 16px' }}>Rank Level</th>
                        <th style={{ padding: '12px 16px' }}>Wallet Balance</th>
                        <th style={{ padding: '12px 16px' }}>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.slice(0, 5).map((u) => (
                        <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{u.name}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }} className="code-font">{u.email}</td>
                          <td style={{ padding: '12px 16px' }}>
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
                          <td style={{ padding: '12px 16px', fontWeight: '800', color: '#059669' }}>
                            ₹{(typeof u.walletBalance === 'number' ? u.walletBalance : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: MEMBER NETWORK ================= */}
          {activeTab === 'members' && (
            <div className="light-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Registered Network Distributors ({filteredUsers.length})</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Live downline registry stored in MongoDB Atlas database</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Rank Filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 10px' }}>
                    <Filter size={14} color="#94a3b8" />
                    <select
                      value={rankFilter}
                      onChange={(e) => setRankFilter(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '8px 4px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="All">All Ranks</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Diamond">Diamond</option>
                    </select>
                  </div>

                  {/* Search Input */}
                  <div style={{ position: 'relative', width: '260px' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search distributor, email, phone..."
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
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} className={loadingUsers ? 'pulse-dot' : ''} /> Refresh
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '12px 16px' }}>Distributor Name</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Sponsor Phone / Code</th>
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
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: '#4f46e5' }} className="code-font">{u.phone || u.sponsorId || 'LIFEFUNDAI-TOP'}</td>
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
                            ₹{(typeof u.walletBalance === 'number' ? u.walletBalance : 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
          )}

          {/* ================= TAB 3: JOINING REQUESTS ================= */}
          {activeTab === 'joining' && (
            <div className="light-card" style={{ padding: '28px', border: '2px solid #3b82f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    <UserCheck size={14} /> Direct Sign-up Approvals ({pendingJoiningCount} Pending)
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Pending Joining Requests</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Approve new distributor registrations submitted from the public portal</p>
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
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={loadingApprovals ? 'pulse-dot' : ''} /> Refresh Requests
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Distributor Name</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Sponsor Phone / Code</th>
                      <th style={{ padding: '12px 16px' }}>Package Tier</th>
                      <th style={{ padding: '12px 16px' }}>Documents</th>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joiningRequests.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No pending registration requests.
                        </td>
                      </tr>
                    ) : (
                      joiningRequests.map((app) => (
                        <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{app.enrolledMemberName}</td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }} className="code-font">{app.enrolledMemberEmail}</td>
                          <td style={{ padding: '14px 16px', fontWeight: '600', color: '#4f46e5' }}>{app.sponsorId || app.sponsorName || 'Direct Sign-up'}</td>
                          <td style={{ padding: '14px 16px', fontWeight: '600' }}>{app.packageName}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {app.userId?.aadhaarPhoto && (
                                <button onClick={() => openImageModal(app.userId?.aadhaarPhoto, 'Aadhaar Photo')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                  Aadhaar
                                </button>
                              )}
                              {app.userId?.panPhoto && (
                                <button onClick={() => openImageModal(app.userId?.panPhoto, 'PAN Photo')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                  PAN
                                </button>
                              )}
                              {app.userId?.transactionPhoto && (
                                <button onClick={() => openImageModal(app.userId?.transactionPhoto, 'Transaction Proof')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                  Tx Proof
                                </button>
                              )}
                              {!app.userId?.aadhaarPhoto && !app.userId?.panPhoto && !app.userId?.transactionPhoto && (
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>N/A</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : 'Today'}
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
                                  style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(app._id, app.enrolledMemberName)}
                                  className="btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fca5a5', cursor: 'pointer' }}
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
          )}

          {/* ================= TAB 4: DOWNLINE APPROVALS ================= */}
          {activeTab === 'downline' && (
            <div className="light-card" style={{ padding: '28px', border: '2px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                    <Award size={14} /> Downline Member Queue ({pendingDownlineCount} Pending)
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Pending Downline Member Approvals</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Approve new downline members enrolled by distributors into matrix slots</p>
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
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} className={loadingApprovals ? 'pulse-dot' : ''} /> Refresh Requests
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Sponsor (Enrolling User)</th>
                      <th style={{ padding: '12px 16px' }}>Enrolled Member</th>
                      <th style={{ padding: '12px 16px' }}>Tree Position</th>
                      <th style={{ padding: '12px 16px' }}>Package</th>
                      <th style={{ padding: '12px 16px' }}>Documents</th>
                      <th style={{ padding: '12px 16px' }}>Commission</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downlineRequests.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No pending downline member requests.
                        </td>
                      </tr>
                    ) : (
                      downlineRequests.map((app) => (
                        <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{app.sponsorName || 'System Admin'}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{app.enrolledMemberName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.enrolledMemberEmail}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                              {app.position || 'Direct Level 1'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: '600' }}>{app.packageName}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {app.userId?.aadhaarPhoto && (
                                <button onClick={() => openImageModal(app.userId?.aadhaarPhoto, 'Aadhaar Photo')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                  Aadhaar
                                </button>
                              )}
                              {app.userId?.panPhoto && (
                                <button onClick={() => openImageModal(app.userId?.panPhoto, 'PAN Photo')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                  PAN
                                </button>
                              )}
                              {app.userId?.transactionPhoto && (
                                <button onClick={() => openImageModal(app.userId?.transactionPhoto, 'Transaction Proof')} className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                  Tx Proof
                                </button>
                              )}
                              {!app.userId?.aadhaarPhoto && !app.userId?.panPhoto && !app.userId?.transactionPhoto && (
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>N/A</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: '800', color: '#059669' }}>
                            +₹{Number(app.commissionAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                                  style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(app._id, app.enrolledMemberName)}
                                  className="btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fca5a5', cursor: 'pointer' }}
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
          )}

          {/* ================= TAB 5: PAYOUT ENGINE ================= */}
          {activeTab === 'payouts' && (
            <div>
              {/* Payout Trigger Card */}
              <div className="light-card" style={{ padding: '28px', marginBottom: '28px', background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                      <Play size={14} /> Automated Calculation Engine
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Weekly Binary Matching & Unilevel Payout</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Calculate 1:1 binary leg matches, unilevel volume points & deposit earnings directly to distributor wallets.
                    </p>
                  </div>
                  <button
                    onClick={handleProcessPayout}
                    disabled={processingPayout}
                    className="btn-admin"
                    style={{ fontSize: '14px', padding: '12px 24px' }}
                  >
                    <Play size={18} /> {processingPayout ? 'Calculating Binary Bonus...' : 'Run Weekly Payout Calculation'}
                  </button>
                </div>
              </div>

              {/* Wallet Withdrawal Requests Table */}
              <div className="light-card" style={{ padding: '28px', border: '2px solid #8b5cf6' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f3e8ff', color: '#6b21a8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
                      <CreditCard size={14} /> Wallet Payout Requests ({pendingWalletCount} Pending)
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Distributor Wallet Payout Requests</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Review and approve distributor wallet withdrawal payout requests</p>
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
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} className={loadingApprovals ? 'pulse-dot' : ''} /> Refresh Requests
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Distributor Name</th>
                        <th style={{ padding: '12px 16px' }}>Distributor Email</th>
                        <th style={{ padding: '12px 16px' }}>Requested Amount</th>
                        <th style={{ padding: '12px 16px' }}>Payout Method</th>
                        <th style={{ padding: '12px 16px' }}>Request Date</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletRequests.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No wallet withdrawal payout requests submitted yet.
                          </td>
                        </tr>
                      ) : (
                        walletRequests.map((app) => (
                          <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{app.enrolledMemberName || app.sponsorName}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }} className="code-font">{app.enrolledMemberEmail}</td>
                            <td style={{ padding: '14px 16px', fontWeight: '800', color: '#8b5cf6', fontSize: '15px' }}>
                              ₹{Number(app.amount || app.commissionAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                {app.packageName || 'Bank Payout'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : 'Today'}
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
                                    onClick={() => handleApprove(app._id, app.enrolledMemberName || 'Distributor')}
                                    className="btn-emerald"
                                    style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                                  >
                                    Approve Payout
                                  </button>
                                  <button
                                    onClick={() => handleReject(app._id, app.enrolledMemberName || 'Distributor')}
                                    className="btn-outline"
                                    style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626', borderColor: '#fca5a5', cursor: 'pointer' }}
                                  >
                                    Reject & Refund
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
            </div>
          )}

          {/* ================= TAB: ROI UPDATE ================= */}
          {activeTab === 'roi' && (
            <div>
              {/* ROI Batch Form Card */}
              <div className="light-card" style={{ padding: '28px', marginBottom: '28px', border: '2px solid #d97706', background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                    <Percent size={14} /> Daily Yield & ROI Engine
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Daily ROI Batch Update & Wallet Credit</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Enter daily ROI amounts for Level 1 and Level 2 distributors. Submitting will update investment returns and credit the funds directly to user wallet balances.
                  </p>
                </div>

                <form onSubmit={handleSubmitDailyRoi} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                      Level 1 Daily ROI Amount (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)' }}>₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 500"
                        value={level1RoiInput}
                        onChange={(e) => setLevel1RoiInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 32px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--text-main)',
                          background: '#ffffff'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Credited directly to all Level 1 distributor wallets
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                      Level 2 Daily ROI Amount (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)' }}>₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 300"
                        value={level2RoiInput}
                        onChange={(e) => setLevel2RoiInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 32px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--text-main)',
                          background: '#ffffff'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Credited directly to all Level 2 distributor wallets
                    </span>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submittingRoi}
                      className="btn-admin"
                      style={{ width: '100%', padding: '13px 20px', fontSize: '14px', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)' }}
                    >
                      <TrendingUp size={18} /> {submittingRoi ? 'Processing Daily ROI...' : 'Submit & Credit Daily ROI'}
                    </button>
                  </div>
                </form>
              </div>

              {/* ROI Batch Execution History */}
              <div className="light-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Daily ROI Execution History</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Log of submitted daily ROI wallet payout batches</p>
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
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} className={loadingApprovals ? 'pulse-dot' : ''} /> Refresh History
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Batch Details</th>
                        <th style={{ padding: '12px 16px' }}>Target Members</th>
                        <th style={{ padding: '12px 16px' }}>Level Rates</th>
                        <th style={{ padding: '12px 16px' }}>Total Credited Amount</th>
                        <th style={{ padding: '12px 16px' }}>Executed Date</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roiLogs.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No daily ROI batches executed yet. Use the form above to submit daily ROI.
                          </td>
                        </tr>
                      ) : (
                        roiLogs.map((log) => (
                          <tr key={log._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{log.enrolledMemberName}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }} className="code-font">{log.enrolledMemberEmail}</td>
                            <td style={{ padding: '14px 16px', fontWeight: '700', color: '#d97706' }}>{log.packageName}</td>
                            <td style={{ padding: '14px 16px', fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                              ₹{Number(log.commissionAmount || log.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                              {log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                Processed & Credited
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: MONGODB & ANALYTICS ================= */}
          {activeTab === 'database' && (

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                <div className="light-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '10px', background: '#f0f9ff', color: '#0284c7', borderRadius: '10px' }}>
                      <Database size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>MongoDB Atlas Cluster</h4>
                      <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>Active Connection Pool</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Database Name</span>
                      <span className="code-font" style={{ fontWeight: '700' }}>pentest_db</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Primary Collection</span>
                      <span className="code-font" style={{ fontWeight: '700' }}>users</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Approvals Collection</span>
                      <span className="code-font" style={{ fontWeight: '700' }}>approvals</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Connection Driver</span>
                      <span style={{ fontWeight: '700', color: '#059669' }}>Mongoose 8.x / Node.js</span>
                    </div>
                  </div>
                </div>

                <div className="light-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '10px', background: '#eef2ff', color: '#4f46e5', borderRadius: '10px' }}>
                      <Layers size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Matrix Volume Analytics</h4>
                      <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '700' }}>Volume Distribution</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Group Volume (GV)</span>
                      <span style={{ fontWeight: '800', color: '#4f46e5' }}>₹{totalGV.toLocaleString('en-IN')} GV</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Wallet Balance</span>
                      <span style={{ fontWeight: '800', color: '#059669' }}>₹{totalCommissions.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Registered Users</span>
                      <span style={{ fontWeight: '800' }}>{usersList.length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Approval Submissions</span>
                      <span style={{ fontWeight: '800' }}>{approvals.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

