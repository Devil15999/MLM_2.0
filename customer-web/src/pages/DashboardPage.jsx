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
  X,
  Bell
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [teamTab, setTeamTab] = useState('level1');
  const [teamViewMode, setTeamViewMode] = useState('tree');
  const isFreshUser = user?.email === 'fresh@nexismlm.com' || user?.sponsorId === 'SP-2000';
  const [activePackage, setActivePackage] = useState(user?.selectedPackage || (isFreshUser ? 'None' : 'Gold Executive ($2,500)'));
  
  // Storage key for local persistence
  const userKey = user?._id || user?.email || 'fresh';

  // Tree Enrollment Modal State
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedSlotPosition, setSelectedSlotPosition] = useState('');
  const [enrollFormData, setEnrollFormData] = useState({ memberName: '', memberEmail: '', packageName: 'Silver Pro ($1,000)' });
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState('');
  const [issuedCredentialModal, setIssuedCredentialModal] = useState(null);

  // Dynamic Nodes State (Persistent across sessions/logins)
  const [enrolledLevel1, setEnrolledLevel1] = useState(() => {
    try {
      const saved = localStorage.getItem(`nexis_l1_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [enrolledLevel2, setEnrolledLevel2] = useState(() => {
    try {
      const saved = localStorage.getItem(`nexis_l2_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [dynamicWallet, setDynamicWallet] = useState(user?.walletBalance ?? (isFreshUser ? 0 : 6250));
  const [dynamicTotalIncome, setDynamicTotalIncome] = useState(user?.totalIncome ?? (isFreshUser ? 0 : 10450));
  const [dynamicL1Income, setDynamicL1Income] = useState(user?.level1AffiliateIncome ?? (isFreshUser ? 0 : 4850));
  const [dynamicL2Income, setDynamicL2Income] = useState(user?.level2AffiliateIncome ?? (isFreshUser ? 0 : 2420));

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
        const res = await fetch(`${apiUrl.replace('/auth', '')}/customer/notifications`, {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setNotificationsList(data.notifications || []);
        }
      } catch (err) {}
    };
    fetchNotifications();
  }, [user]);

  // Sync state when user changes or DB metrics are fetched
  useEffect(() => {
    if (user) {
      if (typeof user.walletBalance === 'number') setDynamicWallet(user.walletBalance);
      if (typeof user.totalIncome === 'number') setDynamicTotalIncome(user.totalIncome);
      if (typeof user.level1AffiliateIncome === 'number') setDynamicL1Income(user.level1AffiliateIncome);
      if (typeof user.level2AffiliateIncome === 'number') setDynamicL2Income(user.level2AffiliateIncome);
    }
  }, [user]);

  const handleOpenEnrollModal = (position) => {
    setSelectedSlotPosition(position);
    setEnrollFormData({ memberName: '', memberEmail: '', packageName: 'Silver Pro ($1,000)' });
    setEnrollModalOpen(true);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollFormData.memberName) return;

    const packagePrices = {
      'Bronze Starter ($500)': 500,
      'Silver Pro ($1,000)': 1000,
      'Gold Executive ($2,500)': 2500,
      'Diamond VIP ($5,000)': 5000,
    };
    const price = packagePrices[enrollFormData.packageName] || 1000;
    const isLevel1 = selectedSlotPosition.includes('Node 1') || selectedSlotPosition === 'Left Leg' || selectedSlotPosition === 'Right Leg' || !selectedSlotPosition.includes('L2');
    const commRate = isLevel1 ? 0.10 : 0.05;
    const commAmount = price * commRate;

    const memberEmailToUse = enrollFormData.memberEmail || `${enrollFormData.memberName.toLowerCase().replace(/\s+/g, '.')}@example.com`;

    const newNode = {
      name: enrollFormData.memberName,
      position: selectedSlotPosition,
      email: memberEmailToUse,
      package: enrollFormData.packageName,
      joined: 'Today',
      status: 'Active',
      level1Earned: isLevel1 ? `$${commAmount.toFixed(2)}` : '$0.00',
      level2Earned: isLevel1 ? '$0.00' : `$${commAmount.toFixed(2)}`,
      sponsor: isLevel1 ? (user?.name || 'You') : 'Sarah Connor'
    };

    if (isLevel1) {
      setEnrolledLevel1(prev => {
        const nextList = [...prev, newNode];
        try { localStorage.setItem(`nexis_l1_${userKey}`, JSON.stringify(nextList)); } catch(e){}
        return nextList;
      });
    } else {
      setEnrolledLevel2(prev => {
        const nextList = [...prev, newNode];
        try { localStorage.setItem(`nexis_l2_${userKey}`, JSON.stringify(nextList)); } catch(e){}
        return nextList;
      });
    }

    let dynamicOtp = `Nexis#${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      const res = await fetch(`${apiUrl.replace('/auth', '')}/customer/team/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          memberName: enrollFormData.memberName,
          memberEmail: enrollFormData.memberEmail,
          position: selectedSlotPosition,
          packageName: enrollFormData.packageName
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dynamicOtp) dynamicOtp = data.dynamicOtp;
      }
    } catch (err) {
      console.log('Enrollment updated locally');
    }

    setEnrollModalOpen(false);
    setIssuedCredentialModal({
      name: enrollFormData.memberName,
      email: memberEmailToUse,
      otp: dynamicOtp,
      position: selectedSlotPosition,
      package: enrollFormData.packageName,
      commissionAmount: commAmount.toFixed(2),
      status: 'Pending Admin Approval'
    });

    setEnrollSuccessMessage(`Enrolled ${enrollFormData.memberName}! Commission of $${commAmount.toFixed(2)} sent to Admin Panel for approval.`);
    setTimeout(() => setEnrollSuccessMessage(''), 5000);
  };

  const handleActivatePackage = async (pkgName) => {
    setActivePackage(pkgName);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://mlm-2-0.onrender.com/api';
      await fetch(`${apiUrl.replace('/auth', '')}/customer/packages/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({ packageName: pkgName })
      });
    } catch (err) {
      console.log('Package activated locally');
    }
  };


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

  const defaultL1 = [
    { name: 'Sarah Connor', position: 'Left Leg (Node 1)', email: 'sarah.c@gmail.com', joined: 'July 14, 2026', package: 'Executive Gold ($2,500)', level1Earned: '$1,250.00', status: 'Active' },
    { name: 'David Vance', position: 'Right Leg (Node 2)', email: 'david.vance@tech.io', joined: 'July 18, 2026', package: 'Pro Silver ($1,000)', level1Earned: '$500.00', status: 'Active' }
  ];

  const defaultL2 = [
    { name: 'Kevin Flynn', position: 'Left-Left Leg (L2 Node 1)', sponsor: 'Sarah Connor', joined: 'July 19, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
    { name: 'Claire Bennet', position: 'Left-Right Leg (L2 Node 2)', sponsor: 'Sarah Connor', joined: 'July 22, 2026', package: 'Pro Silver ($1,000)', level2Earned: '$100.00', status: 'Active' },
    { name: 'Arthur Pendelton', position: 'Right-Left Leg (L2 Node 3)', sponsor: 'David Vance', joined: 'July 24, 2026', package: 'Executive Gold ($2,500)', level2Earned: '$250.00', status: 'Active' },
    { name: 'Rachel Green', position: 'Right-Right Leg (L2 Node 4)', sponsor: 'David Vance', joined: 'July 28, 2026', package: 'Starter Bronze ($500)', level2Earned: '$50.00', status: 'Active' }
  ];

  const level1MembersList = isFreshUser ? enrolledLevel1 : [...defaultL1, ...enrolledLevel1];
  const level2MembersList = isFreshUser ? enrolledLevel2 : [...defaultL2, ...enrolledLevel2];

  const l1Count = isFreshUser ? enrolledLevel1.length : (2 + enrolledLevel1.length);
  const l2Count = isFreshUser ? enrolledLevel2.length : (4 + enrolledLevel2.length);
  const totalCount = l1Count + l2Count;

  // Metrics required by user (2 Nodes Max Level 1, 2 Max Levels)
  const statsMetrics = [
    {
      id: 'total-team',
      title: 'Total Team (Includes Level 1 & 2)',
      value: `${totalCount} Nodes`,
      sub: `${l1Count} Level 1 + ${l2Count} Level 2 (Max 2 Levels)`,
      icon: Users,
      color: '#4f46e5',
      bg: '#eef2ff'
    },
    {
      id: 'level-1-members',
      title: 'Level 1 Members',
      value: `${l1Count} Nodes`,
      sub: 'Max 2 Direct Child Nodes (Left & Right)',
      icon: Layers,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      id: 'level-2-members',
      title: 'Level 2 Members',
      value: `${l2Count} Nodes`,
      sub: 'Secondary Downline Nodes (Max Level 2)',
      icon: Users,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      id: 'level-1-income',
      title: 'Level 1 Affiliate Income',
      value: `$${dynamicL1Income.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Direct Referral Bonus',
      icon: DollarSign,
      color: '#10b981',
      bg: '#dcfce7'
    },
    {
      id: 'level-2-income',
      title: 'Level 2 Affiliate Income',
      value: `$${dynamicL2Income.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Indirect Override Commission',
      icon: DollarSign,
      color: '#8b5cf6',
      bg: '#f3e8ff'
    },
    {
      id: 'investment-returns',
      title: 'Investment Returns',
      value: isFreshUser ? '$0.00' : '$3,180.00',
      sub: 'Package Yield & Passive ROI',
      icon: TrendingUp,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      id: 'total-income',
      title: 'Total Income',
      value: `$${dynamicTotalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Cumulative Lifetime Earnings',
      icon: Award,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      id: 'wallet',
      title: 'Wallet',
      value: `$${dynamicWallet.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Available Withdrawable Balance',
      icon: Wallet,
      color: '#2563eb',
      bg: '#eff6ff'
    }
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
            {/* Notification Bell Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <Bell size={20} />
                {notificationsList.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}>
                    {notificationsList.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="light-card" style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '360px',
                  padding: '16px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border-color)',
                  zIndex: 100
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Commission Activity</h4>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>Live Approval Tracking</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {notificationsList.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                        No commission notifications yet.
                      </div>
                    ) : (
                      notificationsList.map((n, idx) => (
                        <div key={n._id || idx} style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: n.status === 'Approved' ? '#f0fdf4' : (n.status === 'Rejected' ? '#fef2f2' : '#fffbeb'),
                          border: `1px solid ${n.status === 'Approved' ? '#bbf7d0' : (n.status === 'Rejected' ? '#fecaca' : '#fef08a')}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              color: n.status === 'Approved' ? '#166534' : (n.status === 'Rejected' ? '#991b1b' : '#92400e'),
                              background: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '8px'
                            }}>
                              {n.status === 'Approved' ? '🟢 APPROVED' : (n.status === 'Rejected' ? '🔴 REJECTED' : '🟡 PENDING APPROVAL')}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(n.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                            Enrolled: {n.enrolledMemberName || 'Downline Member'} ({n.position})
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {n.status === 'Approved'
                              ? `Admin approved commission of $${Number(n.commissionAmount).toFixed(2)}! Credited to Wallet.`
                              : (n.status === 'Rejected' ? `Admin rejected commission request.` : `Commission of $${Number(n.commissionAmount).toFixed(2)} is pending Admin approval.`)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
              {/* Unactivated Package Banner for Fresh Accounts */}
              {activePackage === 'None' && (
                <div className="light-card" style={{
                  padding: '24px 28px',
                  marginBottom: '24px',
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  border: '2px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#78350f' }}>Account Status: Pending Package Activation</h3>
                      <p style={{ fontSize: '13px', color: '#92400e' }}>Select a product package tier to activate your binary tree slot and unlock affiliate earnings.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleActivatePackage('Bronze Starter ($500)')} className="btn-outline" style={{ fontSize: '12px', padding: '8px 14px' }}>
                      Activate Bronze ($500)
                    </button>
                    <button onClick={() => handleActivatePackage('Silver Pro ($1,000)')} className="btn-outline" style={{ fontSize: '12px', padding: '8px 14px' }}>
                      Activate Silver ($1,000)
                    </button>
                    <button onClick={() => handleActivatePackage('Gold Executive ($2,500)')} className="btn-emerald" style={{ fontSize: '12px', padding: '8px 14px' }}>
                      Activate Gold ($2,500)
                    </button>
                  </div>
                </div>
              )}

              {/* Enrollment Success Toast Feedback */}
              {enrollSuccessMessage && (
                <div style={{ padding: '14px 20px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', color: '#166534', fontWeight: '700', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} color="#166534" />
                  <span>{enrollSuccessMessage}</span>
                </div>
              )}

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
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: activePackage === 'None' ? '#fef3c7' : '#dcfce7', color: activePackage === 'None' ? '#92400e' : '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
                    <Sparkles size={14} /> Package Active: {activePackage}
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

              {/* Team View Container */}
              <div className="light-card" style={{ padding: '28px' }}>
                {/* Header View Mode Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Binary Matrix Structure (Max 2 Levels)</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Visual representation of your direct Level 1 & Level 2 downlines</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                    <button
                      onClick={() => setTeamViewMode('tree')}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        background: teamViewMode === 'tree' ? '#ffffff' : 'transparent',
                        color: teamViewMode === 'tree' ? '#059669' : '#64748b',
                        boxShadow: teamViewMode === 'tree' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Layers size={16} /> Visual Tree Diagram
                    </button>

                    <button
                      onClick={() => setTeamViewMode('table')}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        background: teamViewMode === 'table' ? '#ffffff' : 'transparent',
                        color: teamViewMode === 'table' ? '#059669' : '#64748b',
                        boxShadow: teamViewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Users size={16} /> Member Table List
                    </button>
                  </div>
                </div>

                {/* VIEW 1: VISUAL BINARY TREE DIAGRAM */}
                {teamViewMode === 'tree' && (
                  <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px 16px', overflowX: 'auto' }}>
                    <div className="tree-container">
                      {/* LEVEL 0: ROOT NODE */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="tree-node-card root-card">
                          <span style={{ background: '#059669', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginBottom: '6px' }}>
                            ROOT NODE (YOU)
                          </span>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{user?.name || 'Alex Rivera'}</div>
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>{user?.rank || 'Gold Executive'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }} className="code-font">ID: {referralCode}</div>
                        </div>

                        <div className="tree-connector-line"></div>
                      </div>

                      {/* LEVEL 1: DIRECT CHILD NODES (MAX 2) */}
                      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-around', position: 'relative' }}>
                        {/* Horizontal connecting line across Level 1 */}
                        <div style={{ position: 'absolute', top: '-16px', left: '25%', right: '25%', height: '2px', background: '#cbd5e1' }}></div>

                        {/* Level 1 - Left Child Node */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <div className="tree-connector-line" style={{ height: '16px' }}></div>
                          
                          {/* Node Card or Empty Slot */}
                          {level1MembersList[0] ? (
                            <div className="tree-node-card level1-card">
                              <span style={{ background: '#3b82f6', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginBottom: '6px' }}>
                                LEFT LEG (NODE 1)
                              </span>
                              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{level1MembersList[0].name}</div>
                              <div style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: '700' }}>{level1MembersList[0].package}</div>
                              <div style={{ marginTop: '6px' }}>
                                {notificationsList.find(n => n.enrolledMemberName === level1MembersList[0].name)?.status === 'Approved' || level1MembersList[0].name === 'Sarah Connor' ? (
                                  <span style={{ background: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>
                                    🟢 Commission Approved
                                  </span>
                                ) : (
                                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>
                                    🟡 Pending Admin Approval
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleOpenEnrollModal('Left Leg (Node 1)')}
                              className="tree-node-card"
                              style={{ border: '2px dashed #059669', background: '#ecfdf5', cursor: 'pointer' }}
                            >
                              <PlusCircle size={24} color="#059669" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                              <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669' }}>+ Enroll Left Node</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Empty Slot</div>
                            </div>
                          )}

                          <div className="tree-connector-line"></div>

                          {/* LEVEL 2: UNDER LEFT NODE (LEFT & RIGHT) */}
                          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative', width: '100%' }}>
                            <div style={{ position: 'absolute', top: '-16px', left: '20%', right: '20%', height: '2px', background: '#cbd5e1' }}></div>

                            {/* L2 Node 1 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className="tree-connector-line" style={{ height: '16px' }}></div>
                              {level2MembersList[0] ? (
                                <div className="tree-node-card level2-card">
                                  <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', display: 'inline-block', marginBottom: '4px' }}>
                                    LEFT-LEFT
                                  </span>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{level2MembersList[0].name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{level2MembersList[0].package}</div>
                                  <div style={{ marginTop: '4px' }}>
                                    {notificationsList.find(n => n.enrolledMemberName === level2MembersList[0].name)?.status === 'Approved' || level2MembersList[0].name === 'Kevin Flynn' ? (
                                      <span style={{ background: '#dcfce7', color: '#166534', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                                        🟢 Approved
                                      </span>
                                    ) : (
                                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                                        🟡 Pending Approval
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleOpenEnrollModal('Left-Left Leg (L2 Node 1)')}
                                  className="tree-node-card"
                                  style={{ border: '2px dashed #8b5cf6', background: '#faf5ff', cursor: 'pointer', minWidth: '140px', padding: '12px' }}
                                >
                                  <PlusCircle size={18} color="#8b5cf6" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#8b5cf6' }}>+ Add Downline</div>
                                </div>
                              )}
                            </div>

                            {/* L2 Node 2 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className="tree-connector-line" style={{ height: '16px' }}></div>
                              {level2MembersList[1] ? (
                                <div className="tree-node-card level2-card">
                                  <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', display: 'inline-block', marginBottom: '4px' }}>
                                    LEFT-RIGHT
                                  </span>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{level2MembersList[1].name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{level2MembersList[1].package}</div>
                                  <div style={{ marginTop: '4px' }}>
                                    {notificationsList.find(n => n.enrolledMemberName === level2MembersList[1].name)?.status === 'Approved' || level2MembersList[1].name === 'Claire Bennet' ? (
                                      <span style={{ background: '#dcfce7', color: '#166534', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                                        🟢 Approved
                                      </span>
                                    ) : (
                                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                                        🟡 Pending Approval
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleOpenEnrollModal('Left-Right Leg (L2 Node 2)')}
                                  className="tree-node-card"
                                  style={{ border: '2px dashed #8b5cf6', background: '#faf5ff', cursor: 'pointer', minWidth: '140px', padding: '12px' }}
                                >
                                  <PlusCircle size={18} color="#8b5cf6" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#8b5cf6' }}>+ Add Downline</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Level 1 - Right Child Node */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <div className="tree-connector-line" style={{ height: '16px' }}></div>

                          {level1MembersList[1] ? (
                            <div className="tree-node-card level1-card">
                              <span style={{ background: '#3b82f6', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginBottom: '6px' }}>
                                RIGHT LEG (NODE 2)
                              </span>
                              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{level1MembersList[1].name}</div>
                              <div style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: '700' }}>{level1MembersList[1].package}</div>
                              <div style={{ marginTop: '6px' }}>
                                {notificationsList.find(n => n.enrolledMemberName === level1MembersList[1].name)?.status === 'Approved' || level1MembersList[1].name === 'David Vance' ? (
                                  <span style={{ background: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>
                                    🟢 Commission Approved
                                  </span>
                                ) : (
                                  <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>
                                    🟡 Pending Admin Approval
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleOpenEnrollModal('Right Leg (Node 2)')}
                              className="tree-node-card"
                              style={{ border: '2px dashed #059669', background: '#ecfdf5', cursor: 'pointer' }}
                            >
                              <PlusCircle size={24} color="#059669" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                              <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669' }}>+ Enroll Right Node</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Empty Slot</div>
                            </div>
                          )}

                          <div className="tree-connector-line"></div>

                          {/* LEVEL 2: UNDER RIGHT NODE (LEFT & RIGHT) */}
                          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative', width: '100%' }}>
                            <div style={{ position: 'absolute', top: '-16px', left: '20%', right: '20%', height: '2px', background: '#cbd5e1' }}></div>

                            {/* L2 Node 3 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className="tree-connector-line" style={{ height: '16px' }}></div>
                              {level2MembersList[2] ? (
                                <div className="tree-node-card level2-card">
                                  <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', display: 'inline-block', marginBottom: '4px' }}>
                                    RIGHT-LEFT
                                  </span>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{level2MembersList[2].name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{level2MembersList[2].package}</div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleOpenEnrollModal('Right-Left Leg (L2 Node 3)')}
                                  className="tree-node-card"
                                  style={{ border: '2px dashed #8b5cf6', background: '#faf5ff', cursor: 'pointer', minWidth: '140px', padding: '12px' }}
                                >
                                  <PlusCircle size={18} color="#8b5cf6" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#8b5cf6' }}>+ Add Downline</div>
                                </div>
                              )}
                            </div>

                            {/* L2 Node 4 */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className="tree-connector-line" style={{ height: '16px' }}></div>
                              {level2MembersList[3] ? (
                                <div className="tree-node-card level2-card">
                                  <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', display: 'inline-block', marginBottom: '4px' }}>
                                    RIGHT-RIGHT
                                  </span>
                                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>{level2MembersList[3].name}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{level2MembersList[3].package}</div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleOpenEnrollModal('Right-Right Leg (L2 Node 4)')}
                                  className="tree-node-card"
                                  style={{ border: '2px dashed #8b5cf6', background: '#faf5ff', cursor: 'pointer', minWidth: '140px', padding: '12px' }}
                                >
                                  <PlusCircle size={18} color="#8b5cf6" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#8b5cf6' }}>+ Add Downline</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: MEMBER TABLE LIST */}
                {teamViewMode === 'table' && (
                  <div>
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

      {/* ENROLL DOWNLINE MEMBER MODAL */}
      {enrollModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="light-card" style={{ maxWidth: '480px', width: '100%', padding: '28px', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Enroll New Downline Member</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Placing member into <strong style={{ color: '#059669' }}>{selectedSlotPosition}</strong></p>
              </div>
              <button onClick={() => setEnrollModalOpen(false)} style={{ background: 'transparent', padding: '4px' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Sponsor ID</label>
                <input type="text" disabled value={referralCode} className="form-input" style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#4f46e5', fontWeight: '700' }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Target Binary Leg Position</label>
                <input type="text" disabled value={selectedSlotPosition} className="form-input" style={{ background: '#ecfdf5', cursor: 'not-allowed', color: '#059669', fontWeight: '700' }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Member Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Scott"
                  className="form-input"
                  value={enrollFormData.memberName}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, memberName: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Member Email Address</label>
                <input
                  type="email"
                  placeholder="michael.scott@example.com"
                  className="form-input"
                  value={enrollFormData.memberEmail}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, memberEmail: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Product Package Choice *</label>
                <select
                  className="form-input"
                  value={enrollFormData.packageName}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, packageName: e.target.value })}
                >
                  <option>Bronze Starter ($500) — 10% Level 1 Comm ($50)</option>
                  <option>Silver Pro ($1,000) — 12% Level 1 Comm ($120)</option>
                  <option>Gold Executive ($2,500) — 15% Level 1 Comm ($375)</option>
                  <option>Diamond VIP ($5,000) — 18% Level 1 Comm ($900)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setEnrollModalOpen(false)} className="btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>
                  Enroll & Place Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUED CREDENTIAL & DYNAMIC OTP RECEIPT MODAL */}
      {issuedCredentialModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="light-card" style={{ maxWidth: '500px', width: '100%', padding: '32px', background: '#ffffff', borderRadius: '20px', border: '2px solid #059669' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Enrollment Successful!</h3>
              <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px', display: 'inline-block', marginTop: '6px' }}>
                Commission Pending Admin Approval (${issuedCredentialModal.commissionAmount})
              </span>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Member Name:</span>
                <strong style={{ color: 'var(--text-main)' }}>{issuedCredentialModal.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Login Email:</span>
                <strong style={{ color: 'var(--text-main)' }}>{issuedCredentialModal.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tree Placement:</span>
                <strong style={{ color: '#059669' }}>{issuedCredentialModal.position}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Package:</span>
                <strong style={{ color: '#4f46e5' }}>{issuedCredentialModal.package}</strong>
              </div>

              {/* Dynamic One-Time Password Callout */}
              <div style={{ background: '#eff6ff', border: '1px dashed #3b82f6', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dynamic One-Time Temporary Password</div>
                <div className="code-font" style={{ fontSize: '24px', fontWeight: '800', color: '#1d4ed8', margin: '4px 0', letterSpacing: '2px' }}>
                  {issuedCredentialModal.otp}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Provide this OTP to {issuedCredentialModal.name}. <strong>Login will activate once Admin approves the request.</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Nexis MLM Member Credentials:\nEmail: ${issuedCredentialModal.email}\nOne-Time Password: ${issuedCredentialModal.otp}\nLogin URL: http://localhost:5173/login`);
                  alert('Credentials copied to clipboard! Share with the member via WhatsApp/Email.');
                }}
                className="btn-outline"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Copy size={16} /> Copy Credentials
              </button>
              <button onClick={() => setIssuedCredentialModal(null)} className="btn-emerald" style={{ flex: 1 }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
