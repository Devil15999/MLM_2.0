import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Package,
  Users,
  Wallet,
  LogOut,
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Award,
  Search,
  Upload,
  CreditCard,
  Building,
  Check,
  Clock,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [teamTab, setTeamTab] = useState('level1');
  const [backendStats, setBackendStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
        const res = await fetch(`${apiUrl.replace('/auth', '')}/customer/dashboard`, {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.metrics) {
            setBackendStats(data.metrics);
          }
        }
      } catch (err) {
        console.log('Customer API fallback to client state');
      }
    };
    fetchDashboardStats();
  }, [user]);


  // Forms state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    country: 'United States'
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [kycData, setKycData] = useState({
    documentType: 'Aadhaar Card / Govt ID',
    documentNumber: '8942-1049-5821',
    bankName: 'Global Chase Bank',
    accountNumber: '•••• •••• 4920',
    ifscCode: 'CHAS0009182',
    upiId: 'alexrivera@upi'
  });
  const [kycStatus, setKycStatus] = useState('Verified');
  const [kycSaved, setKycSaved] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const referralCode = user?.sponsorId || 'SP-1001';
  const referralLink = `https://nexismlm.com/join?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleKycSubmit = (e) => {
    e.preventDefault();
    setKycStatus('Under Review');
    setKycSaved(true);
    setTimeout(() => setKycSaved(false), 3000);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawAmount('');
    }, 3000);
  };

  // Metrics required by user (2 Nodes Max Level 1, 2 Max Levels)
  const statsMetrics = [
    {
      id: 'total-team',
      title: 'Total Team (Includes Level 1 & 2)',
      value: '6 Nodes',
      sub: '2 Level 1 + 4 Level 2 (Max 2 Levels)',
      icon: Users,
      color: '#4f46e5',
      bg: '#eef2ff'
    },
    {
      id: 'level-1-members',
      title: 'Level 1 Members',
      value: '2 Nodes',
      sub: 'Max 2 Direct Child Nodes (Left & Right)',
      icon: Layers,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      id: 'level-2-members',
      title: 'Level 2 Members',
      value: '4 Nodes',
      sub: 'Secondary Downline Nodes (Max Level 2)',
      icon: Users,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      id: 'level-1-income',
      title: 'Level 1 Affiliate Income',
      value: '$4,850.00',
      sub: 'Direct Referral Bonus',
      icon: DollarSign,
      color: '#10b981',
      bg: '#dcfce7'
    },
    {
      id: 'level-2-income',
      title: 'Level 2 Affiliate Income',
      value: '$2,420.00',
      sub: 'Indirect Override Commission',
      icon: DollarSign,
      color: '#8b5cf6',
      bg: '#f3e8ff'
    },
    {
      id: 'investment-returns',
      title: 'Investment Returns',
      value: '$3,180.00',
      sub: 'Package Yield & Passive ROI',
      icon: TrendingUp,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      id: 'total-income',
      title: 'Total Income',
      value: '$10,450.00',
      sub: 'Cumulative Lifetime Earnings',
      icon: Award,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      id: 'wallet',
      title: 'Wallet',
      value: '$6,250.00',
      sub: 'Available Withdrawable Balance',
      icon: Wallet,
      color: '#2563eb',
      bg: '#eff6ff'
    }
  ];

  // Team Data (Exactly 2 Nodes Level 1, 4 Nodes Level 2)
  const level1MembersList = [
    { name: 'Sarah Connor', position: 'Left Leg (Node 1)', email: 'sarah.c@gmail.com', joined: 'July 14, 2026', package: 'Executive Gold ($2,500)', level1Earned: '$1,250.00', status: 'Active' },
    { name: 'David Vance', position: 'Right Leg (Node 2)', email: 'david.vance@tech.io', joined: 'July 18, 2026', package: 'Pro Silver ($1,000)', level1Earned: '$500.00', status: 'Active' }
  ];

  const level2MembersList = [
    { name: 'Kevin Flynn', position: 'Left-Left Leg (L2 Node 1)', sponsor: 'Sarah Connor', joined: 'July 19, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
    { name: 'Claire Bennet', position: 'Left-Right Leg (L2 Node 2)', sponsor: 'Sarah Connor', joined: 'July 22, 2026', package: 'Pro Silver ($1,000)', level2Earned: '$100.00', status: 'Active' },
    { name: 'Arthur Pendelton', position: 'Right-Left Leg (L2 Node 3)', sponsor: 'David Vance', joined: 'July 24, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
    { name: 'Rachel Green', position: 'Right-Right Leg (L2 Node 4)', sponsor: 'David Vance', joined: 'July 28, 2026', package: 'Starter Bronze ($500)', level2Earned: '$50.00', status: 'Active' }
  ];

  // Packages list
  const packagesList = [
    { id: 'pkg-1', name: 'Bronze Starter', price: '$500', dailyRoi: '0.8%', duration: '200 Days', level1Comm: '10%', level2Comm: '5%', totalReturn: '$800', status: 'Available' },
    { id: 'pkg-2', name: 'Silver Pro', price: '$1,000', dailyRoi: '1.0%', duration: '200 Days', level1Comm: '12%', level2Comm: '6%', totalReturn: '$2,000', status: 'Active Package' },
    { id: 'pkg-3', name: 'Gold Executive', price: '$2,500', dailyRoi: '1.25%', duration: '200 Days', level1Comm: '15%', level2Comm: '8%', totalReturn: '$6,250', status: 'Active Package' },
    { id: 'pkg-4', name: 'Diamond VIP', price: '$5,000', dailyRoi: '1.5%', duration: '200 Days', level1Comm: '18%', level2Comm: '10%', totalReturn: '$15,000', status: 'Available' }
  ];

  // Side navigation menu items
  const sidebarNavItems = [
    { id: 'home', label: 'Home (Dashboard)', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'kyc', label: 'Update KYC', icon: ShieldCheck },
    { id: 'packages', label: 'Product Packages', icon: Package },
    { id: 'team', label: 'Team Details', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>
      {/* Left Side Pane Navigation Sidebar */}
      <aside style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        {/* Sidebar Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}>
            <Package size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>Customer Portal</h1>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nexis MLM Matrix</span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 10px 8px 10px' }}>
            Main Menu
          </div>
          {sidebarNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <IconComponent size={18} color={isActive ? '#059669' : '#64748b'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar User Profile Summary & Logout */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '4px 6px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#059669',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '14px'
            }}>
              {(user?.name || 'Alex Rivera').charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Alex Rivera'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {referralCode}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="sidebar-nav-item logout-item"
            style={{ padding: '10px 14px' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '68px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
              {sidebarNavItems.find(item => item.id === activeTab)?.label || 'Home (Dashboard)'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '20px'
            }}>
              <Award size={16} color="#059669" />
              <span style={{ fontSize: '13px', color: '#166534', fontWeight: '700' }}>
                Rank: {user?.rank || 'Gold Executive'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '20px'
            }}>
              <Wallet size={16} color="#2563eb" />
              <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: '700' }}>
                Wallet: $6,250.00
              </span>
            </div>
          </div>
        </header>

        {/* View Container */}
        <main style={{ flex: 1, padding: '32px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
          
          {/* TAB 1: HOME (DASHBOARD) */}
          {activeTab === 'home' && (
            <div>
              {/* Hero Banner */}
              <div className="light-card" style={{
                padding: '28px 32px',
                marginBottom: '28px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                border: '1px solid #bbf7d0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                    <Sparkles size={14} /> Account Status: Active Distributor
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>
                    Welcome to Customer Portal, {user?.name || 'Alex Rivera'}!
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Overview of your Level 1 & Level 2 team metrics, affiliate incomes, investment returns, and wallet balance.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setActiveTab('wallet')} className="btn-emerald">
                    <Wallet size={18} /> Request Wallet Payout
                  </button>
                </div>
              </div>

              {/* Referral Link Bar */}
              <div className="light-card" style={{ padding: '20px 24px', marginBottom: '28px', background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Your Unique Referral Link</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Share this link to enroll direct Level 1 downline members into your network.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '6px 6px 6px 14px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                    <span className="code-font" style={{ fontSize: '13px', fontWeight: '600', color: '#4338ca' }}>{referralLink}</span>
                    <button
                      onClick={handleCopyLink}
                      className="btn-indigo"
                      style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </div>

              {/* REQUIRED STATISTICAL METRICS GRID (8 Core Cards) */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
                  Key Performance Indicators
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px'
                }}>
                  {statsMetrics.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.id} className="light-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>{stat.title}</span>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={20} />
                          </div>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>{stat.value}</div>
                        <div style={{ fontSize: '12px', color: stat.color, fontWeight: '700' }}>{stat.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Summary Tables */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Level 1 Direct Overview */}
                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Level 1 Members Overview</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Directly sponsored referrals</p>
                    </div>
                    <button onClick={() => { setActiveTab('team'); setTeamTab('level1'); }} className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {level1MembersList.slice(0, 3).map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{m.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.package}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: '#059669' }}>{m.level1Earned}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Commission</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level 2 Indirect Overview */}
                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Level 2 Members Overview</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Secondary downline team referrals</p>
                    </div>
                    <button onClick={() => { setActiveTab('team'); setTeamTab('level2'); }} className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {level2MembersList.slice(0, 3).map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{m.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sponsor: {m.sponsor}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: '#8b5cf6' }}>{m.level2Earned}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>L2 Override</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '800px' }}>
              <div className="light-card" style={{ padding: '32px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
                  Distributor Profile Information
                </h3>

                {profileSaved && (
                  <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontSize: '14px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Profile details saved successfully!
                  </div>
                )}

                <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Sponsor Referral Code</label>
                    <input
                      type="text"
                      className="form-input"
                      disabled
                      value={referralCode}
                      style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: '700', color: '#4f46e5' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button type="submit" className="btn-emerald">
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: UPDATE KYC */}
          {activeTab === 'kyc' && (
            <div style={{ maxWidth: '800px' }}>
              <div className="light-card" style={{ padding: '32px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Know Your Customer (KYC) Verification</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Submit official documents to enable direct bank & crypto wallet withdrawals.</p>
                  </div>

                  <span style={{
                    background: kycStatus === 'Verified' ? '#dcfce7' : '#fef3c7',
                    color: kycStatus === 'Verified' ? '#166534' : '#92400e',
                    border: `1px solid ${kycStatus === 'Verified' ? '#86efac' : '#fde68a'}`,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <ShieldCheck size={16} /> Status: {kycStatus}
                  </span>
                </div>

                {kycSaved && (
                  <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontSize: '14px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> KYC application submitted for verification review!
                  </div>
                )}

                <form onSubmit={handleKycSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="form-label">Identity Document Type</label>
                    <select
                      className="form-input"
                      value={kycData.documentType}
                      onChange={(e) => setKycData({ ...kycData, documentType: e.target.value })}
                    >
                      <option>Aadhaar Card / Govt ID</option>
                      <option>Passport</option>
                      <option>National Identity Card</option>
                      <option>Driving License</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Document Identification Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kycData.documentNumber}
                      onChange={(e) => setKycData({ ...kycData, documentNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kycData.bankName}
                      onChange={(e) => setKycData({ ...kycData, bankName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Bank Account Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kycData.accountNumber}
                      onChange={(e) => setKycData({ ...kycData, accountNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">IFSC Code / Swift Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kycData.ifscCode}
                      onChange={(e) => setKycData({ ...kycData, ifscCode: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">UPI ID / Crypto Wallet</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kycData.upiId}
                      onChange={(e) => setKycData({ ...kycData, upiId: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Upload Proof Document (Front & Back)</label>
                    <div style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer'
                    }}>
                      <Upload size={32} color="#059669" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                      <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>Click or drag PDF/JPG image files here</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Max file size 5MB</div>
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button type="submit" className="btn-emerald">
                      Update KYC Document Details
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT PACKAGES */}
          {activeTab === 'packages' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Product & Investment Packages</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Choose investment tiers to boost daily returns, Level 1, and Level 2 affiliate commissions.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {packagesList.map((pkg) => (
                  <div key={pkg.id} className="light-card" style={{
                    padding: '28px',
                    position: 'relative',
                    border: pkg.status === 'Active Package' ? '2px solid #059669' : '1px solid var(--border-color)',
                    background: pkg.status === 'Active Package' ? '#f0fdf4' : '#ffffff'
                  }}>
                    {pkg.status === 'Active Package' && (
                      <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#059669', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px' }}>
                        ACTIVE
                      </span>
                    )}

                    <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>{pkg.name}</h4>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#059669', marginBottom: '16px' }}>{pkg.price}</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Daily ROI Yield:</span>
                        <span style={{ fontWeight: '700', color: '#d97706' }}>{pkg.dailyRoi}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Yield Duration:</span>
                        <span style={{ fontWeight: '700' }}>{pkg.duration}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Level 1 Affiliate Bonus:</span>
                        <span style={{ fontWeight: '700', color: '#059669' }}>{pkg.level1Comm}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Level 2 Affiliate Bonus:</span>
                        <span style={{ fontWeight: '700', color: '#8b5cf6' }}>{pkg.level2Comm}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Max Return:</span>
                        <span style={{ fontWeight: '800', color: '#059669' }}>{pkg.totalReturn}</span>
                      </div>
                    </div>

                    <button
                      className={pkg.status === 'Active Package' ? 'btn-indigo' : 'btn-emerald'}
                      style={{ width: '100%' }}
                    >
                      {pkg.status === 'Active Package' ? 'Upgrade Tier' : 'Buy Package Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TEAM DETAILS */}
          {activeTab === 'team' && (
            <div>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div className="light-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Total Downline Team</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#4f46e5', marginTop: '4px' }}>6 Nodes</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Level 1 & 2 (Max 2 Levels)</div>
                </div>

                <div className="light-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Level 1 Members</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>2 Nodes</div>
                  <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Max 2 Child Nodes (Left & Right)</div>
                </div>

                <div className="light-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Level 2 Members</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>4 Nodes</div>
                  <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>Max Level 2 Depth</div>
                </div>
              </div>

              {/* Team Table Box */}
              <div className="light-card" style={{ padding: '28px' }}>
                {/* Level Toggle Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setTeamTab('level1')}
                      className={teamTab === 'level1' ? 'btn-emerald' : 'btn-outline'}
                      style={{ padding: '8px 18px', fontSize: '13px' }}
                    >
                      Level 1 Directs (2 Nodes Max)
                    </button>
                    <button
                      onClick={() => setTeamTab('level2')}
                      className={teamTab === 'level2' ? 'btn-indigo' : 'btn-outline'}
                      style={{ padding: '8px 18px', fontSize: '13px' }}
                    >
                      Level 2 Indirects (4 Nodes Max)
                    </button>
                  </div>
                </div>

                {/* Level 1 Table */}
                {teamTab === 'level1' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 16px' }}>Binary Leg Position</th>
                          <th style={{ padding: '12px 16px' }}>Member Name</th>
                          <th style={{ padding: '12px 16px' }}>Email Address</th>
                          <th style={{ padding: '12px 16px' }}>Enrollment Date</th>
                          <th style={{ padding: '12px 16px' }}>Subscribed Package</th>
                          <th style={{ padding: '12px 16px' }}>Level 1 Affiliate Income</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {level1MembersList.map((m, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                            <td style={{ padding: '16px' }}>
                              <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                {m.position}
                              </span>
                            </td>
                            <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{m.name}</td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{m.email}</td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{m.joined}</td>
                            <td style={{ padding: '16px', fontWeight: '600' }}>{m.package}</td>
                            <td style={{ padding: '16px', fontWeight: '800', color: '#059669' }}>{m.level1Earned}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Level 2 Table */}
                {teamTab === 'level2' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 16px' }}>Binary Leg Position</th>
                          <th style={{ padding: '12px 16px' }}>Member Name</th>
                          <th style={{ padding: '12px 16px' }}>Direct Sponsor (Level 1)</th>
                          <th style={{ padding: '12px 16px' }}>Enrollment Date</th>
                          <th style={{ padding: '12px 16px' }}>Package</th>
                          <th style={{ padding: '12px 16px' }}>Level 2 Affiliate Income</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {level2MembersList.map((m, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                            <td style={{ padding: '16px' }}>
                              <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                {m.position}
                              </span>
                            </td>
                            <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{m.name}</td>
                            <td style={{ padding: '16px', fontWeight: '600', color: '#059669' }}>{m.sponsor}</td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{m.joined}</td>
                            <td style={{ padding: '16px', fontWeight: '600' }}>{m.package}</td>
                            <td style={{ padding: '16px', fontWeight: '800', color: '#8b5cf6' }}>{m.level2Earned}</td>
                            <td style={{ padding: '16px' }}>
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: WALLET */}
          {activeTab === 'wallet' && (
            <div>
              {/* Wallet Summary Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div className="light-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#ffffff' }}>
                  <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '700' }}>Available Wallet Balance</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px' }}>$6,250.00</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Ready for Instant Withdrawal</div>
                </div>

                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Level 1 Affiliate Income</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669', marginTop: '6px' }}>$4,850.00</div>
                  <div style={{ fontSize: '12px', color: '#059669' }}>Direct Referral Earnings</div>
                </div>

                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Level 2 Affiliate Income</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#8b5cf6', marginTop: '6px' }}>$2,420.00</div>
                  <div style={{ fontSize: '12px', color: '#8b5cf6' }}>Indirect Override Earnings</div>
                </div>

                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Investment Returns</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', marginTop: '6px' }}>$3,180.00</div>
                  <div style={{ fontSize: '12px', color: '#d97706' }}>Daily Yield ROI</div>
                </div>
              </div>

              {/* Request Payout Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                <div className="light-card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
                    Request Wallet Withdrawal
                  </h3>

                  {withdrawSuccess && (
                    <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontSize: '14px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} /> Withdrawal request submitted to admin!
                    </div>
                  )}

                  <form onSubmit={handleWithdraw}>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Withdrawal Amount ($)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Enter amount (min $50)"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label className="form-label">Payout Method</label>
                      <select className="form-input">
                        <option>Bank Account (Global Chase - •••• 4920)</option>
                        <option>USDT (TRC20 Wallet)</option>
                        <option>UPI Transfer (alexrivera@upi)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-emerald" style={{ width: '100%' }}>
                      Submit Withdrawal Payout
                    </button>
                  </form>
                </div>

                {/* Recent Payout Statement */}
                <div className="light-card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
                    Recent Wallet Transactions
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>Level 1 Referral Commission</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>From Sarah Connor • Aug 01, 2026</div>
                      </div>
                      <span style={{ color: '#059669', fontWeight: '800' }}>+$1,250.00</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>Daily Package Yield ROI</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gold Package • Aug 02, 2026</div>
                      </div>
                      <span style={{ color: '#d97706', fontWeight: '800' }}>+$31.25</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>Level 2 Override Commission</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>From Kevin Flynn • July 29, 2026</div>
                      </div>
                      <span style={{ color: '#8b5cf6', fontWeight: '800' }}>+$250.00</span>
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
