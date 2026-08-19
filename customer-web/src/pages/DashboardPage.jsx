import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Phone,
  ShieldCheck,
  Package,
  Users,
  Wallet,
  LogOut,
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Lock,
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
  Bell,
  Image as ImageIcon
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout, updatePermanentPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [teamTab, setTeamTab] = useState('level1');
  const [teamViewMode, setTeamViewMode] = useState('tree');
  const [activePackage, setActivePackage] = useState(user?.selectedPackage || 'Starter Package (₹10,000)');

  // Storage key for local persistence
  const userKey = user?._id || user?.email || 'user';

  // Force Permanent Password Modal for OTP users
  const [forcePasswordModalOpen, setForcePasswordModalOpen] = useState(false);
  const [permanentPassForm, setPermanentPassForm] = useState({ newPassword: '', confirmPassword: '' });
  const [permanentPassErr, setPermanentPassErr] = useState(null);
  const [permanentPassLoading, setPermanentPassLoading] = useState(false);

  useEffect(() => {
    if (user?.isOneTimePassword) {
      setForcePasswordModalOpen(true);
    } else {
      setForcePasswordModalOpen(false);
    }
  }, [user]);

  const handleForcePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!permanentPassForm.newPassword || permanentPassForm.newPassword.length < 6) {
      setPermanentPassErr('New permanent password must be at least 6 characters long.');
      return;
    }
    if (permanentPassForm.newPassword !== permanentPassForm.confirmPassword) {
      setPermanentPassErr('Passwords do not match.');
      return;
    }

    setPermanentPassLoading(true);
    setPermanentPassErr(null);

    const res = await updatePermanentPassword(permanentPassForm.newPassword, permanentPassForm.confirmPassword, user._id);
    setPermanentPassLoading(false);
    if (res.success) {
      alert('Permanent password created successfully! Your temporary OTP has been invalidated.');
      setForcePasswordModalOpen(false);
    } else {
      setPermanentPassErr(res.message || 'Failed to set permanent password.');
    }
  };

  // Tree Enrollment Modal State
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedSlotPosition, setSelectedSlotPosition] = useState('');
  const [enrollFormData, setEnrollFormData] = useState({
    memberName: '',
    phone: '',
    memberEmail: '',
    aadhaarNumber: '',
    packageName: 'Starter Package (₹10,000)',
    aadhaarPhoto: '',
    panPhoto: '',
    transactionPhoto: ''
  });
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState('');
  const [issuedCredentialModal, setIssuedCredentialModal] = useState(null);

  const handleEnrollFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEnrollFormData((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Dynamic Nodes State (Persistent across sessions/logins)
  const [enrolledLevel1, setEnrolledLevel1] = useState(() => {
    try {
      const saved = localStorage.getItem(`lifefundai_l1_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [enrolledLevel2, setEnrolledLevel2] = useState(() => {
    try {
      const saved = localStorage.getItem(`lifefundai_l2_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [dynamicWallet, setDynamicWallet] = useState(user?.walletBalance ?? 0);
  const [dynamicTotalIncome, setDynamicTotalIncome] = useState(user?.totalIncome ?? 0);
  const [dynamicL1Income, setDynamicL1Income] = useState(user?.level1AffiliateIncome ?? 0);
  const [dynamicL2Income, setDynamicL2Income] = useState(user?.level2AffiliateIncome ?? 0);

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  const fetchTeamData = useCallback(async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/auth').replace('/auth', '');
      const res = await fetch(`${baseUrl}/customer/team`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.level1Members)) {
          const mappedL1 = data.level1Members.map((m) => ({
            name: m.name,
            email: m.email,
            position: m.legPreference || 'Direct Level 1',
            package: m.selectedPackage || 'Starter Package (₹10,000)',
            joined: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : 'Recent',
            status: m.accountStatus || 'Pending Admin Approval',
            accountStatus: m.accountStatus || 'Pending Admin Approval',
            level1Earned: `₹${(m.level1AffiliateIncome || 0).toLocaleString('en-IN')}`,
            level2Earned: `₹${(m.level2AffiliateIncome || 0).toLocaleString('en-IN')}`,
            sponsor: user?.name || 'You'
          }));
          setEnrolledLevel1(mappedL1);
        }
        if (Array.isArray(data.level2Members)) {
          const mappedL2 = data.level2Members.map((m) => ({
            name: m.name,
            email: m.email,
            position: m.legPreference || 'Level 2 Node',
            package: m.selectedPackage || 'Starter Package (₹10,000)',
            joined: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : 'Recent',
            status: m.accountStatus || 'Pending Admin Approval',
            accountStatus: m.accountStatus || 'Pending Admin Approval',
            level1Earned: `₹${(m.level1AffiliateIncome || 0).toLocaleString('en-IN')}`,
            level2Earned: `₹${(m.level2AffiliateIncome || 0).toLocaleString('en-IN')}`,
            sponsor: 'Level 1 Member'
          }));
          setEnrolledLevel2(mappedL2);
        }
      }
    } catch (err) { }
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/auth').replace('/auth', '');
        const res = await fetch(`${baseUrl}/customer/notifications`, {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setNotificationsList(data.notifications || []);
        }
      } catch (err) { }
    };

    fetchNotifications();
    fetchTeamData();
  }, [user, activeTab, fetchTeamData]);

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
    setEnrollFormData({
      memberName: '',
      phone: '',
      memberEmail: '',
      aadhaarNumber: '',
      packageName: 'Starter Package (₹10,000)',
      aadhaarPhoto: '',
      panPhoto: '',
      transactionPhoto: ''
    });
    setEnrollModalOpen(true);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();

    if (!enrollFormData.memberName || !enrollFormData.phone || !enrollFormData.memberEmail || !enrollFormData.aadhaarNumber || !enrollFormData.aadhaarPhoto || !enrollFormData.transactionPhoto) {
      alert('Please fill out all required Join Network fields (Name, Phone, Email, Aadhaar Number, Aadhaar Photo, Transaction Proof).');
      return;
    }

    const isLevel1 = selectedSlotPosition.includes('Node 1') || selectedSlotPosition === 'Left Leg' || selectedSlotPosition === 'Right Leg' || !selectedSlotPosition.includes('L2');
    const level1BonusMap = {
      'Starter Package (₹10,000)': 1000,
      'Premium Package (₹20,000)': 2000,
      'Elite Package (₹30,000)': 3000,
    };
    const commAmount = isLevel1 ? (level1BonusMap[enrollFormData.packageName] || 1000) : 500;
    const memberEmailToUse = String(enrollFormData.memberEmail || '').trim().toLowerCase();

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/auth').replace('/auth', '');
      const res = await fetch(`${baseUrl}/customer/team/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          memberName: enrollFormData.memberName,
          phone: enrollFormData.phone,
          memberEmail: memberEmailToUse,
          aadhaarNumber: enrollFormData.aadhaarNumber,
          aadhaarPhoto: enrollFormData.aadhaarPhoto,
          panPhoto: enrollFormData.panPhoto,
          transactionPhoto: enrollFormData.transactionPhoto,
          position: selectedSlotPosition,
          packageName: enrollFormData.packageName,
          parentSponsorId: user?._id,
          parentSponsorCode: user?.sponsorId,
          parentSponsorEmail: user?.email,
          sponsorId: user?.sponsorId || user?._id,
          sponsorName: user?.name || user?.email
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const serverOtp = data.dynamicOtp || `LifeFundAI#${Math.floor(1000 + Math.random() * 9000)}`;
        fetchTeamData();
        setEnrollModalOpen(false);
        setIssuedCredentialModal({
          name: enrollFormData.memberName,
          email: memberEmailToUse,
          otp: serverOtp,
          position: selectedSlotPosition,
          package: enrollFormData.packageName,
          commissionAmount: commAmount.toFixed(2),
          status: 'Pending Admin Approval'
        });

        setEnrollSuccessMessage(`Enrolled ${enrollFormData.memberName}! Commission request of ₹${commAmount.toLocaleString('en-IN')} sent to Admin Panel for approval.`);
        setTimeout(() => setEnrollSuccessMessage(''), 5000);
      } else {
        alert(`Enrollment failed: ${data.message || 'Server error occurred. Please try again.'}`);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Enrollment error: ${err.message || 'Error occurred. Please try again.'}`);
    }
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


  // Copy feedback states
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [sidebarCopied, setSidebarCopied] = useState(false);
  const [headerCopied, setHeaderCopied] = useState(false);

  // Forms state (populated ONLY with actual user data, no fake hardcoded defaults)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.sponsorId || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || ''
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || user.sponsorId || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      });
      setPanPhoto(user.panPhoto || '');
      setPanNumber(user.panNumber || '');
    }
  }, [user]);

  const [kycData, setKycData] = useState({
    documentType: 'Aadhaar Card / Govt ID',
    documentNumber: user?.aadhaarNumber || user?.aadhaar || user?.kycData?.documentNumber || '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  });
  const [kycStatus, setKycStatus] = useState('Verified');
  const [kycSaved, setKycSaved] = useState(false);

  const referralCode = profileData.phone || user?.phone || user?.sponsorId || 'N/A';
  const referralLink = `https://lifefundAI.com/join?ref=${encodeURIComponent(referralCode)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSaved(false);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/auth').replace('/auth', '');
      const res = await fetch(`${baseUrl}/customer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          country: profileData.country
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      if (data.user) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('customer_user', JSON.stringify(updatedUser));
      }

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 4000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const [panPhoto, setPanPhoto] = useState(user?.panPhoto || '');
  const [panNumber, setPanNumber] = useState(user?.panNumber || '');
  const [kycLoading, setKycLoading] = useState(false);

  const handlePanFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPanPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (panPhoto && (!panNumber || panNumber.trim() === '')) {
      alert('PAN Card Number is mandatory when uploading a PAN Card photo. Please enter your PAN Number.');
      return;
    }

    setKycLoading(true);
    setKycSaved(false);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/auth').replace('/auth', '');
      const res = await fetch(`${baseUrl}/customer/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          documentType: 'Aadhaar & PAN Card',
          documentNumber: user?.aadhaarNumber || kycData.documentNumber,
          bankName: kycData.bankName,
          accountNumber: kycData.accountNumber,
          ifscCode: kycData.ifscCode,
          upiId: kycData.upiId,
          panPhoto: panPhoto,
          panNumber: panNumber
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'KYC update failed');
      }

      if (data.user) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('customer_user', JSON.stringify(updatedUser));
      }

      setKycStatus('Under Review');
      setKycSaved(true);
      setTimeout(() => setKycSaved(false), 5000);
    } catch (err) {
      alert(`KYC Update Error: ${err.message}`);
    } finally {
      setKycLoading(false);
    }
  };

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('Bank Account (Global Chase - •••• 4920)');
  const [withdrawSuccess, setWithdrawSuccess] = useState(null);
  const [withdrawError, setWithdrawError] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!withdrawAmount || isNaN(amountNum) || amountNum < 500) {
      setWithdrawError('Minimum withdrawal amount is ₹500.');
      return;
    }
    if (amountNum > dynamicWallet) {
      setWithdrawError(`Insufficient balance. Available wallet balance is ₹${dynamicWallet.toLocaleString('en-IN')}.`);
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError(null);
    setWithdrawSuccess(null);

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/auth').replace('/auth', '');
      const res = await fetch(`${baseUrl}/customer/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          amount: amountNum,
          method: withdrawMethod
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Withdrawal request failed');
      }

      if (typeof data.walletBalance === 'number') {
        setDynamicWallet(data.walletBalance);
        if (user) {
          const updatedUser = { ...user, walletBalance: data.walletBalance };
          localStorage.setItem('customer_user', JSON.stringify(updatedUser));
        }
      }

      setWithdrawSuccess(data.message || 'Withdrawal request submitted to admin!');
      setWithdrawAmount('');
      fetchTeamData();
      setTimeout(() => setWithdrawSuccess(null), 6000);
    } catch (err) {
      setWithdrawError(err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const level1MembersList = enrolledLevel1;
  const level2MembersList = enrolledLevel2;

  const safeNotifs = Array.isArray(notificationsList) ? notificationsList : [];

  const approvedL1Members = level1MembersList.filter((m) => {
    const notif = safeNotifs.find(n => n && (n.enrolledMemberName === m.name || n.enrolledMemberEmail === m.email));
    const isRejected = m.status === 'Rejected' || m.accountStatus === 'Rejected' || notif?.status === 'Rejected';
    if (isRejected) return false;
    return m.status === 'Approved' || m.status === 'Active' || m.accountStatus === 'Approved' || m.accountStatus === 'Active' || notif?.status === 'Approved';
  });

  const approvedL2Members = level2MembersList.filter((m) => {
    const notif = safeNotifs.find(n => n && (n.enrolledMemberName === m.name || n.enrolledMemberEmail === m.email));
    const isRejected = m.status === 'Rejected' || m.accountStatus === 'Rejected' || notif?.status === 'Rejected';
    if (isRejected) return false;
    return m.status === 'Approved' || m.status === 'Active' || m.accountStatus === 'Approved' || m.accountStatus === 'Active' || notif?.status === 'Approved';
  });

  const l1Count = approvedL1Members.length;
  const l2Count = approvedL2Members.length;
  const totalCount = l1Count + l2Count;

  // Network Metrics (Unlimited Level 1 & Level 2)
  const statsMetrics = [
    {
      id: 'total-team',
      title: 'Total Approved Network Team',
      value: `${totalCount} Nodes`,
      sub: `${l1Count} Level 1 + ${l2Count} Level 2 (Approved Only)`,
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
      value: `₹${dynamicL1Income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: 'Direct Referral Bonus',
      icon: DollarSign,
      color: '#10b981',
      bg: '#dcfce7'
    },
    {
      id: 'level-2-income',
      title: 'Level 2 Affiliate Income',
      value: `₹${dynamicL2Income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: 'Indirect Override Commission',
      icon: DollarSign,
      color: '#8b5cf6',
      bg: '#f3e8ff'
    },
    {
      id: 'investment-returns',
      title: 'Investment Returns',
      value: `₹${(user?.investmentReturns ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: 'Package Yield & Passive ROI',
      icon: TrendingUp,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      id: 'total-income',
      title: 'Total Income',
      value: `₹${dynamicTotalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: 'Cumulative Lifetime Earnings',
      icon: Award,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      id: 'wallet',
      title: 'Wallet',
      value: `₹${dynamicWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      sub: 'Available Withdrawable Balance',
      icon: Wallet,
      color: '#2563eb',
      bg: '#eff6ff'
    }
  ];

  // Packages list
  const packagesList = [
    {
      id: 'pkg-1',
      name: 'Starter Package',
      price: '₹10,000',
      gst: '₹1,800 (18%)',
      processingFee: '₹200 (2%)',
      totalPrice: '₹12,000',
      dailyRoi: '1%',
      level1Comm: '₹1,000 (10%)',
      level2Comm: '₹500',
      maxReturn: '40% (per month)',
      status: activePackage.includes('Starter') ? 'Active Package' : 'Available'
    },
    {
      id: 'pkg-2',
      name: 'Premium Package',
      price: '₹20,000',
      gst: '₹3,600 (18%)',
      processingFee: '₹400 (2%)',
      totalPrice: '₹24,000',
      dailyRoi: '1%',
      level1Comm: '₹2,000 (10%)',
      level2Comm: '₹500',
      maxReturn: '40% (per month)',
      status: activePackage.includes('Premium') || activePackage === 'Gold Executive (₹20,000)' ? 'Active Package' : 'Available'
    },
    {
      id: 'pkg-3',
      name: 'Elite Package',
      price: '₹30,000',
      gst: '₹5,400 (18%)',
      processingFee: '₹600 (2%)',
      totalPrice: '₹36,000',
      dailyRoi: '1%',
      level1Comm: '₹3,000 (10%)',
      level2Comm: '₹500',
      maxReturn: '40% (per month)',
      status: activePackage.includes('Elite') ? 'Active Package' : 'Available'
    }
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
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>lifefundAI Matrix</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px', padding: '6px 8px', background: '#ffffff', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#059669',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '13px',
                flexShrink: 0
              }}>
                {(user?.name || 'User').charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name || 'Distributor'}
                </div>
                <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  Sponsor: {referralCode}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                setSidebarCopied(true);
                setTimeout(() => setSidebarCopied(false), 3000);
              }}
              title="Copy Sponsor Code (Phone)"
              style={{ background: '#eff6ff', border: '1px solid #c7d2fe', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}
            >
              {sidebarCopied ? <CheckCircle2 size={13} color="#059669" /> : <Copy size={13} />}
            </button>
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
                              ? `Admin approved commission of ₹${Number(n.commissionAmount).toLocaleString('en-IN')}! Credited to Wallet.`
                              : (n.status === 'Rejected' ? `Admin rejected commission request.` : `Commission of ₹${Number(n.commissionAmount).toLocaleString('en-IN')} is pending Admin approval.`)}
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
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                setHeaderCopied(true);
                setTimeout(() => setHeaderCopied(false), 3000);
              }}
              title="Click to Copy Parent Sponsor Code (Phone)"
            >
              <Phone size={15} color="#4f46e5" />
              <span style={{ fontSize: '13px', color: '#3730a3', fontWeight: '700' }}>
                Sponsor Code: <strong>{referralCode}</strong>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', color: '#4f46e5', marginLeft: '2px' }}>
                {headerCopied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              </span>
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
                Wallet: ₹{dynamicWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                      <p style={{ fontSize: '13px', color: '#92400e' }}>Select a product package tier to activate your network account slot and unlock affiliate earnings.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleActivatePackage('Starter Package (₹10,000)')} className="btn-outline" style={{ fontSize: '12px', padding: '8px 14px' }}>
                      Activate Starter (₹10,000)
                    </button>
                    <button onClick={() => handleActivatePackage('Premium Package (₹20,000)')} className="btn-outline" style={{ fontSize: '12px', padding: '8px 14px' }}>
                      Activate Premium (₹20,000)
                    </button>
                    <button onClick={() => handleActivatePackage('Elite Package (₹30,000)')} className="btn-emerald" style={{ fontSize: '12px', padding: '8px 14px' }}>
                      Activate Elite (₹30,000)
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
                  <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Profile details saved successfully!
                  </div>
                )}

                {profileError && (
                  <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#991b1b', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} /> {profileError}
                  </div>
                )}

                <form onSubmit={handleProfileSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      className="form-input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Address * </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter email address"
                      className="form-input"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  {/* MERGED PHONE & PARENT SPONSOR CODE FIELD WITH COPY BUTTON */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Phone Number & Sponsor Code *</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        disabled
                        placeholder="Phone Number (serves as Sponsor Code)"
                        className="form-input"
                        value={profileData.phone}
                        style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: '700', color: '#4f46e5' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(profileData.phone || referralCode);
                          setPhoneCopied(true);
                          setTimeout(() => setPhoneCopied(false), 3000);
                        }}
                        className="btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 18px', whiteSpace: 'nowrap', color: '#4f46e5', borderColor: '#c7d2fe', background: '#eff6ff', fontWeight: '700' }}
                      >
                        {phoneCopied ? <CheckCircle2 size={16} color="#059669" /> : <Copy size={16} />}
                        {phoneCopied ? 'Copied Code!' : 'Copy Sponsor Code'}
                      </button>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Your phone number acts as your official Sponsor Code when enrolling new downlines.
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line</label>
                    <input
                      type="text"
                      placeholder="Enter street address"
                      className="form-input"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">City </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="form-input"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Country </label>
                    <input
                      type="text"
                      placeholder="Enter country"
                      className="form-input"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button type="submit" disabled={profileLoading} className="btn-emerald" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '800' }}>
                      {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
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

                {/* DOCUMENT STATUS CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Aadhaar Card Photo
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                        {user?.aadhaarNumber ? `Aadhaar: ${user.aadhaarNumber}` : 'Photo Uploaded (Registration)'}
                      </div>
                    </div>
                    <span style={{
                      background: '#dcfce7',
                      color: '#166534',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={13} color="#166534" />
                      🟢 Uploaded
                    </span>
                  </div>

                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: (panPhoto || user?.panPhoto) ? '#f0fdf4' : '#eff6ff',
                    border: `1.5px solid ${(panPhoto || user?.panPhoto) ? '#bbf7d0' : '#bfdbfe'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: (panPhoto || user?.panPhoto) ? '#166534' : '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        PAN Card Photo
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                        {(panPhoto || user?.panPhoto) ? 'PAN Photo Uploaded' : 'Upload Required'}
                      </div>
                    </div>
                    <span style={{
                      background: (panPhoto || user?.panPhoto) ? '#dcfce7' : '#dbeafe',
                      color: (panPhoto || user?.panPhoto) ? '#166534' : '#1e40af',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {(panPhoto || user?.panPhoto) ? <CheckCircle2 size={13} color="#166534" /> : <Upload size={13} color="#1e40af" />}
                      {(panPhoto || user?.panPhoto) ? '🟢 Uploaded' : '🔵 Upload Required'}
                    </span>
                  </div>
                </div>

                {kycSaved && (
                  <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> KYC application & PAN details submitted for review!
                  </div>
                )}

                <form onSubmit={handleKycSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label className="form-label">Aadhaar Card Number (Locked)</label>
                    <input
                      type="text"
                      disabled
                      className="form-input"
                      value={user?.aadhaarNumber || user?.aadhaar || user?.kycData?.documentNumber || kycData.documentNumber || '2345 6789 0123'}
                      style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: '700', color: '#059669' }}
                    />
                  </div>

                  <div>
                    <label className="form-label">PAN Card Number {panPhoto ? '*' : ''} {(user?.panNumber) ? '(Locked)' : ''}</label>
                    <input
                      type="text"
                      required={Boolean(panPhoto)}
                      disabled={Boolean(user?.panNumber)}
                      placeholder="Enter PAN Number (e.g. ABCDE1234F)"
                      className="form-input"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      style={Boolean(user?.panNumber) ? { background: '#f1f5f9', cursor: 'not-allowed', fontWeight: '700', color: '#1e40af' } : { fontWeight: '700', color: '#1e40af' }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      placeholder="Enter Bank Name"
                      className="form-input"
                      value={kycData.bankName}
                      onChange={(e) => setKycData({ ...kycData, bankName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Bank Account Number</label>
                    <input
                      type="text"
                      placeholder="Enter Account Number"
                      className="form-input"
                      value={kycData.accountNumber}
                      onChange={(e) => setKycData({ ...kycData, accountNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="Enter IFSC Code"
                      className="form-input"
                      value={kycData.ifscCode}
                      onChange={(e) => setKycData({ ...kycData, ifscCode: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">UPI ID / PhonePe</label>
                    <input
                      type="text"
                      placeholder="Enter UPI ID"
                      className="form-input"
                      value={kycData.upiId}
                      onChange={(e) => setKycData({ ...kycData, upiId: e.target.value })}
                    />
                  </div>

                  {/* PAN CARD FILE UPLOADER SECTION */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Upload PAN Card Photo *</label>
                    <div style={{
                      border: (user?.panPhoto || panPhoto) ? '2px solid #bbf7d0' : '2px dashed #bfdbfe',
                      borderRadius: '14px',
                      padding: '24px',
                      textAlign: 'center',
                      background: (user?.panPhoto || panPhoto) ? '#f0fdf4' : '#eff6ff',
                      position: 'relative'
                    }}>
                      {(panPhoto || user?.panPhoto) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={panPhoto || user?.panPhoto}
                            alt="PAN Card Preview"
                            style={{ maxHeight: '140px', borderRadius: '10px', objectFit: 'contain', border: '2px solid #86efac' }}
                          />
                          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={16} /> 🔒 PAN Card Photo Submitted & Verified (Editing Locked)
                          </div>
                        </div>
                      ) : (
                        <label style={{ cursor: 'pointer', display: 'block' }}>
                          <Upload size={32} color="#2563eb" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                          <div style={{ fontWeight: '800', fontSize: '14px', color: '#1e40af' }}>Click to Upload PAN Card Photo</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>PNG, JPG or JPEG (Max 5MB)</div>
                          <input type="file" accept="image/*" onChange={handlePanFileChange} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <button type="submit" disabled={kycLoading} className="btn-emerald" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: '800' }}>
                      {kycLoading ? 'Submitting KYC...' : 'Submit & Update KYC Details'}
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
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Overview of all investment tiers. Your active package tier is highlighted below.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {packagesList.map((pkg) => {
                  const actStr = String(user?.selectedPackage || activePackage || 'Starter').toLowerCase();
                  const pkgStr = pkg.name.toLowerCase();
                  let isActive = false;
                  if (actStr.includes('elite') || actStr.includes('30,000') || actStr.includes('30000')) {
                    isActive = pkgStr.includes('elite');
                  } else if (actStr.includes('premium') || actStr.includes('20,000') || actStr.includes('20000')) {
                    isActive = pkgStr.includes('premium');
                  } else {
                    isActive = pkgStr.includes('starter');
                  }

                  return (
                    <div key={pkg.id} className="light-card" style={{
                      padding: '28px',
                      position: 'relative',
                      border: isActive ? '2px solid #059669' : '1px solid var(--border-color)',
                      background: isActive ? '#f0fdf4' : '#ffffff'
                    }}>
                      {isActive && (
                        <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#059669', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px' }}>
                          CURRENT ACTIVE TIER
                        </span>
                      )}

                      <h4 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>{pkg.name}</h4>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#059669' }}>{pkg.price}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
                          + 18% GST ({pkg.gst}) + 2% Processing ({pkg.processingFee})
                        </div>
                        <div style={{ fontSize: '13px', color: '#047857', fontWeight: '700', marginTop: '6px', background: '#ecfdf5', padding: '4px 10px', borderRadius: '8px', display: 'inline-block', border: '1px solid #a7f3d0' }}>
                          Total Payable: {pkg.totalPrice}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Daily ROI Yield:</span>
                          <span style={{ fontWeight: '700', color: '#d97706' }}>{pkg.dailyRoi}</span>
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
                          <span style={{ fontWeight: '800', color: '#059669' }}>{pkg.maxReturn}</span>
                        </div>
                      </div>

                      <button
                        disabled={true}
                        style={{
                          width: '100%',
                          padding: '12px 20px',
                          borderRadius: '10px',
                          border: 'none',
                          background: isActive ? '#059669' : '#9ca3af',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '14px',
                          cursor: 'not-allowed',
                          opacity: isActive ? 1 : 0.7
                        }}
                      >
                        {isActive ? 'Active Tier Selected' : 'Buy Package Now'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: TEAM DETAILS */}
          {activeTab === 'team' && (
            <div>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div className="light-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Total Network Team</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#4f46e5', marginTop: '4px' }}>
                    {approvedL1Members.length + approvedL2Members.length} Members
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Level 1 & Level 2 (Approved Nodes Only)</div>
                </div>

                <div className="light-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Direct Level 1 Members</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669', marginTop: '4px' }}>
                    {approvedL1Members.length} Members
                  </div>
                  <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Unlimited Level 1 Width (Approved)</div>
                </div>

                <div className="light-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Indirect Level 2 Members</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#8b5cf6', marginTop: '4px' }}>
                    {approvedL2Members.length} Members
                  </div>
                  <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>Enrolled by Level 1 Downlines</div>
                </div>
              </div>

              {/* Team View Container */}
              <div className="light-card" style={{ padding: '28px' }}>
                {/* Header View Mode Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Unilevel Network Structure (N Level 1 Nodes)</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Enroll unlimited Level 1 direct downlines. Level 2 downlines are enrolled by your Level 1 members.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenEnrollModal('Direct Level 1')}
                      className="btn-emerald"
                      style={{ fontSize: '13px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <PlusCircle size={18} /> + Enroll New Level 1 Member
                    </button>

                    <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
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
                        <Layers size={16} /> Unilevel Network Tree
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
                </div>

                {/* LEVEL 1 & LEVEL 2 ROSTER TABS */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <button
                      onClick={() => setTeamTab('level1')}
                      className={teamTab === 'level1' ? 'btn-emerald' : 'btn-outline'}
                      style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Users size={16} /> Level 1 Direct Members ({approvedL1Members.length})
                    </button>
                    <button
                      onClick={() => setTeamTab('level2')}
                      className={teamTab === 'level2' ? 'btn-indigo' : 'btn-outline'}
                      style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Layers size={16} /> Level 2 Indirect Members ({approvedL2Members.length})
                    </button>
                  </div>
                </div>

                {/* TAB 1: LEVEL 1 DIRECT MEMBERS */}
                {teamTab === 'level1' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Direct Level 1 Downline Roster</h4>
                      <button
                        onClick={() => handleOpenEnrollModal('Direct Level 1')}
                        className="btn-emerald"
                        style={{ fontSize: '12px', padding: '6px 14px' }}
                      >
                        + Add Level 1 Member
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px 16px' }}>Member Name</th>
                            <th style={{ padding: '12px 16px' }}>Email</th>
                            <th style={{ padding: '12px 16px' }}>Package Tier</th>
                            <th style={{ padding: '12px 16px' }}>Level 1 Bonus</th>
                            <th style={{ padding: '12px 16px' }}>Approval Status</th>
                            <th style={{ padding: '12px 16px' }}>Joined Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {level1MembersList.length === 0 ? (
                            <tr>
                              <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No Level 1 downline members added yet. Click <strong>+ Add Level 1 Member</strong> above to start building your team!
                              </td>
                            </tr>
                          ) : (
                            level1MembersList.map((m, idx) => {
                              const notif = safeNotifs.find(n => n && (n.enrolledMemberName === m.name || n.enrolledMemberEmail === m.email));
                              const isRejected = m.status === 'Rejected' || m.accountStatus === 'Rejected' || notif?.status === 'Rejected';
                              const isApproved = !isRejected && (m.status === 'Approved' || m.status === 'Active' || m.accountStatus === 'Approved' || m.accountStatus === 'Active' || notif?.status === 'Approved');

                              return (
                                <tr key={m._id || idx} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{m.name}</td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }} className="code-font">{m.email}</td>
                                  <td style={{ padding: '14px 16px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: '#dcfce7', color: '#166534' }}>
                                      {m.package || 'Starter Package (₹10,000)'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '14px 16px', fontWeight: '800', color: isApproved ? '#059669' : 'var(--text-muted)' }}>
                                    {isApproved ? (m.level1Earned || '₹1,000') : '₹0'}
                                  </td>
                                  <td style={{ padding: '14px 16px' }}>
                                    {isRejected ? (
                                      <span style={{ background: '#fef2f2', color: '#991b1b', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>
                                        🔴 Rejected by Admin
                                      </span>
                                    ) : isApproved ? (
                                      <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>
                                        🟢 Commission Approved
                                      </span>
                                    ) : (
                                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>
                                        🟡 Pending Admin Approval
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{m.joined || 'Today'}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: LEVEL 2 INDIRECT MEMBERS */}
                {teamTab === 'level2' && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Indirect Level 2 Downline Roster</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Members enrolled by your direct Level 1 downlines (earn ₹500 override bonus per approval)</p>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '12px 16px' }}>Member Name</th>
                            <th style={{ padding: '12px 16px' }}>Direct Sponsor (Level 1)</th>
                            <th style={{ padding: '12px 16px' }}>Email</th>
                            <th style={{ padding: '12px 16px' }}>Package Tier</th>
                            <th style={{ padding: '12px 16px' }}>Level 2 Override</th>
                            <th style={{ padding: '12px 16px' }}>Approval Status</th>
                            <th style={{ padding: '12px 16px' }}>Joined Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {level2MembersList.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No Level 2 indirect members yet. When your Level 1 downline members enroll team members from their accounts, they will automatically appear here!
                              </td>
                            </tr>
                          ) : (
                            level2MembersList.map((m, idx) => {
                              const notif = safeNotifs.find(n => n && (n.enrolledMemberName === m.name || n.enrolledMemberEmail === m.email));
                              const isRejected = m.status === 'Rejected' || m.accountStatus === 'Rejected' || notif?.status === 'Rejected';
                              const isApproved = !isRejected && (m.status === 'Approved' || m.status === 'Active' || m.accountStatus === 'Approved' || m.accountStatus === 'Active' || notif?.status === 'Approved');

                              return (
                                <tr key={m._id || idx} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{m.name}</td>
                                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#4f46e5' }}>{m.sponsor || 'Direct Sponsor'}</td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }} className="code-font">{m.email}</td>
                                  <td style={{ padding: '14px 16px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: '#f3e8ff', color: '#6b21a8' }}>
                                      {m.package || 'Premium Package (₹20,000)'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '14px 16px', fontWeight: '800', color: isApproved ? '#8b5cf6' : 'var(--text-muted)' }}>
                                    {isApproved ? (m.level2Earned || '₹500') : '₹0'}
                                  </td>
                                  <td style={{ padding: '14px 16px' }}>
                                    {isRejected ? (
                                      <span style={{ background: '#fef2f2', color: '#991b1b', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>
                                        🔴 Rejected by Admin
                                      </span>
                                    ) : isApproved ? (
                                      <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>
                                        🟢 Approved (₹500 Override)
                                      </span>
                                    ) : (
                                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px' }}>
                                        🟡 Pending Admin Approval
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{m.joined || 'Today'}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
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
                          Level 1 Directs (N Members)
                        </button>
                        <button
                          onClick={() => setTeamTab('level2')}
                          className={teamTab === 'level2' ? 'btn-indigo' : 'btn-outline'}
                          style={{ padding: '8px 18px', fontSize: '13px' }}
                        >
                          Level 2 Indirects (N Members)
                        </button>
                      </div>
                    </div>

                    {/* Level 1 Table */}
                    {teamTab === 'level1' && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                              <th style={{ padding: '12px 16px' }}>Network Level</th>
                              <th style={{ padding: '12px 16px' }}>Member Name</th>
                              <th style={{ padding: '12px 16px' }}>Email Address</th>
                              <th style={{ padding: '12px 16px' }}>Enrollment Date</th>
                              <th style={{ padding: '12px 16px' }}>Subscribed Package</th>
                              <th style={{ padding: '12px 16px' }}>Level 1 Affiliate Income</th>
                              <th style={{ padding: '12px 16px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {level1MembersList.map((m, i) => {
                              const notif = safeNotifs.find(n => n && (n.enrolledMemberName === m.name || n.enrolledMemberEmail === m.email));
                              const isRejected = m.status === 'Rejected' || m.accountStatus === 'Rejected' || notif?.status === 'Rejected';
                              const isApproved = !isRejected && (m.status === 'Approved' || m.status === 'Active' || m.accountStatus === 'Approved' || m.accountStatus === 'Active' || notif?.status === 'Approved');

                              return (
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
                                  <td style={{ padding: '16px', fontWeight: '800', color: isApproved ? '#059669' : 'var(--text-muted)' }}>
                                    {isApproved ? (m.level1Earned || '₹1,000') : '₹0'}
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    {isRejected ? (
                                      <span style={{ background: '#fef2f2', color: '#991b1b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                        🔴 Rejected by Admin
                                      </span>
                                    ) : isApproved ? (
                                      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                        🟢 Approved
                                      </span>
                                    ) : (
                                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                        🟡 Pending Admin Approval
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
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
                              <th style={{ padding: '12px 16px' }}>Network Level</th>
                              <th style={{ padding: '12px 16px' }}>Member Name</th>
                              <th style={{ padding: '12px 16px' }}>Direct Sponsor (Level 1)</th>
                              <th style={{ padding: '12px 16px' }}>Enrollment Date</th>
                              <th style={{ padding: '12px 16px' }}>Package</th>
                              <th style={{ padding: '12px 16px' }}>Level 2 Affiliate Income</th>
                              <th style={{ padding: '12px 16px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {level2MembersList.map((m, i) => {
                              const notif = safeNotifs.find(n => n && (n.enrolledMemberName === m.name || n.enrolledMemberEmail === m.email));
                              const isRejected = m.status === 'Rejected' || m.accountStatus === 'Rejected' || notif?.status === 'Rejected';
                              const isApproved = !isRejected && (m.status === 'Approved' || m.status === 'Active' || m.accountStatus === 'Approved' || m.accountStatus === 'Active' || notif?.status === 'Approved');

                              return (
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
                                  <td style={{ padding: '16px', fontWeight: '800', color: isApproved ? '#8b5cf6' : 'var(--text-muted)' }}>
                                    {isApproved ? (m.level2Earned || '₹500') : '₹0'}
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    {isRejected ? (
                                      <span style={{ background: '#fef2f2', color: '#991b1b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                        🔴 Rejected by Admin
                                      </span>
                                    ) : isApproved ? (
                                      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                        🟢 Approved
                                      </span>
                                    ) : (
                                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                                        🟡 Pending Admin Approval
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
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
                  <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px' }}>₹{dynamicWallet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>Ready for Instant Withdrawal</div>
                </div>

                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Level 1 Affiliate Income</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669', marginTop: '6px' }}>₹{dynamicL1Income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: '12px', color: '#059669' }}>Direct Referral Earnings</div>
                </div>

                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Level 2 Affiliate Income</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#8b5cf6', marginTop: '6px' }}>₹{dynamicL2Income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: '12px', color: '#8b5cf6' }}>Indirect Override Earnings</div>
                </div>

                <div className="light-card" style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Investment Returns</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', marginTop: '6px' }}>₹{Math.max(0, dynamicTotalIncome - dynamicL1Income - dynamicL2Income).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div style={{ fontSize: '12px', color: '#d97706' }}>Daily Yield ROI</div>
                </div>
              </div>

              {/* Request Payout Form & History */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                <div className="light-card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
                    Request Wallet Withdrawal
                  </h3>

                  {withdrawSuccess && (
                    <div style={{ padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} /> {withdrawSuccess}
                    </div>
                  )}

                  {withdrawError && (
                    <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#991b1b', fontSize: '13px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} /> {withdrawError}
                    </div>
                  )}

                  <form onSubmit={handleWithdraw}>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Withdrawal Amount (₹) *</label>
                      <input
                        type="number"
                        required
                        min={500}
                        max={dynamicWallet}
                        className="form-input"
                        placeholder="Enter amount (min ₹500)"
                        value={withdrawAmount}
                        onChange={(e) => {
                          setWithdrawAmount(e.target.value);
                          if (withdrawError) setWithdrawError(null);
                        }}
                      />
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Available: <strong>₹{dynamicWallet.toLocaleString('en-IN')}</strong> (Min: ₹500)
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label className="form-label">Payout Method</label>
                      <select
                        className="form-input"
                        value={withdrawMethod}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                      >
                        <option value="Bank Account (Global Chase - •••• 4920)">Bank Account (Global Chase - •••• 4920)</option>
                        <option value="UPI Transfer (alexrivera@upi)">UPI Transfer (alexrivera@upi)</option>
                        <option value="USDT (TRC20 Wallet)">USDT (TRC20 Wallet)</option>
                      </select>
                    </div>

                    <button type="submit" disabled={withdrawLoading} className="btn-emerald" style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '800' }}>
                      {withdrawLoading ? 'Submitting Request...' : 'Submit Withdrawal Payout'}
                    </button>
                  </form>
                </div>

                {/* Recent Payout Statement & Withdrawal Requests */}
                <div className="light-card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px' }}>
                    Payout Withdrawal Requests & Status
                  </h3>

                  {safeNotifs.filter(n => n && n.type === 'Wallet Withdrawal').length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                      No withdrawal requests raised yet. Submit a payout request on the left to start.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {safeNotifs.filter(n => n && n.type === 'Wallet Withdrawal').map((req, idx) => {
                        const isAppr = req.status === 'Approved';
                        const isRej = req.status === 'Rejected';
                        return (
                          <div key={req._id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                                Withdrawal via {req.packageName || 'Bank Payout'}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Requested on {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: '800', fontSize: '15px', color: isRej ? '#dc2626' : (isAppr ? '#059669' : '#d97706') }}>
                                -₹{Number(req.amount || req.commissionAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                              <span style={{
                                display: 'inline-block',
                                marginTop: '4px',
                                background: isAppr ? '#dcfce7' : (isRej ? '#fef2f2' : '#fef3c7'),
                                color: isAppr ? '#166534' : (isRej ? '#991b1b' : '#92400e'),
                                fontSize: '11px',
                                fontWeight: '800',
                                padding: '2px 8px',
                                borderRadius: '8px'
                              }}>
                                {isAppr ? '🟢 Payout Approved' : (isRej ? '🔴 Rejected (Refunded)' : '🟡 Pending Admin Review')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
          <div className="light-card" style={{ maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Enroll New Downline Member</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Placing member into <strong style={{ color: '#059669' }}>{selectedSlotPosition}</strong></p>
              </div>
              <button onClick={() => setEnrollModalOpen(false)} style={{ background: 'transparent', padding: '4px' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Sponsor Phone Number</label>
                <input type="text" disabled value={referralCode} className="form-input" style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#4f46e5', fontWeight: '700' }} />
              </div>

              <div>
                <label className="form-label">Network Position / Label</label>
                <input type="text" disabled value={selectedSlotPosition} className="form-input" style={{ background: '#ecfdf5', cursor: 'not-allowed', color: '#059669', fontWeight: '700' }} />
              </div>

              <div>
                <label className="form-label">Member Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Michael Scott"
                  className="form-input"
                  value={enrollFormData.memberName}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, memberName: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  className="form-input"
                  value={enrollFormData.phone}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Member Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="michael.scott@example.com"
                  className="form-input"
                  value={enrollFormData.memberEmail}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, memberEmail: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Aadhaar Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="e.g. 2345 6789 0123"
                    className="form-input"
                    value={enrollFormData.aadhaarNumber}
                    onChange={(e) => setEnrollFormData({ ...enrollFormData, aadhaarNumber: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Product Package *</label>
                  <select
                    className="form-input"
                    required
                    value={enrollFormData.packageName}
                    onChange={(e) => setEnrollFormData({ ...enrollFormData, packageName: e.target.value })}
                  >
                    <option value="Starter Package (₹10,000)">Starter (₹10,000)</option>
                    <option value="Premium Package (₹20,000)">Premium (₹20,000)</option>
                    <option value="Elite Package (₹30,000)">Elite (₹30,000)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Verification Document Proofs</div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
                    <span>Aadhaar Photo</span>
                    <span style={{ color: '#ef4444' }}>* Required</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="aadhaarPhoto"
                    required
                    onChange={handleEnrollFileChange}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
                    <span>PAN Photo</span>
                    <span style={{ color: 'var(--text-muted)' }}>Optional</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="panPhoto"
                    onChange={handleEnrollFileChange}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
                    <span>Transaction Proof</span>
                    <span style={{ color: '#ef4444' }}>* Required</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="transactionPhoto"
                    required
                    onChange={handleEnrollFileChange}
                    style={{ width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
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
                  navigator.clipboard.writeText(`lifefundAI Member Credentials:\nEmail: ${issuedCredentialModal.email}\nOne-Time Password: ${issuedCredentialModal.otp}\nLogin URL: http://localhost:5173/login`);
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

      {/* FORCE CREATION OF PERMANENT PASSWORD MODAL */}
      {forcePasswordModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="light-card" style={{ maxWidth: '440px', width: '100%', padding: '32px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#fef3c7',
                color: '#d97706',
                marginBottom: '16px'
              }}>
                <Lock size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>🔑 Set Permanent Password</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
                You logged in using a temporary One-Time Password (OTP). You must create a permanent password before proceeding. Once created, your temporary OTP will no longer work for login.
              </p>
            </div>

            {permanentPassErr && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#991b1b',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                ⚠️ {permanentPassErr}
              </div>
            )}

            <form onSubmit={handleForcePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">New Permanent Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters (e.g. MyPass#2026)"
                  className="form-input"
                  value={permanentPassForm.newPassword}
                  onChange={(e) => setPermanentPassForm({ ...permanentPassForm, newPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Confirm Permanent Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  className="form-input"
                  value={permanentPassForm.confirmPassword}
                  onChange={(e) => setPermanentPassForm({ ...permanentPassForm, confirmPassword: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={permanentPassLoading}
                className="btn-emerald"
                style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '800', marginTop: '8px' }}
              >
                {permanentPassLoading ? 'Updating Password...' : 'Create Password & Invalidate OTP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
