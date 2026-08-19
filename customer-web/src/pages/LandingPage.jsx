import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Network, Lock, Mail, User, Phone, Share2, ArrowRight, AlertCircle, Sparkles, 
  CheckCircle, ShieldCheck, TrendingUp, Award, Users, Layers, DollarSign, 
  HelpCircle, ChevronDown, Check, Zap, Globe, LockKeyhole, ArrowUpRight, X, Menu
} from 'lucide-react';

export const LandingPage = ({ defaultAuthMode = null }) => {
  const [authModalOpen, setAuthModalOpen] = useState(defaultAuthMode); // 'login' | 'signup' | null
  const [isLogin, setIsLogin] = useState(defaultAuthMode === 'signup' ? false : true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const { user, login, updatePermanentPassword, register, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (defaultAuthMode) {
      setAuthModalOpen(defaultAuthMode);
      setIsLogin(defaultAuthMode === 'signup' ? false : true);
    }
  }, [defaultAuthMode]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    sponsorId: '',
    aadhaarNumber: '',
    selectedPackage: 'Starter Package (₹10,000)',
    aadhaarPhoto: '',
    panPhoto: '',
    transactionPhoto: ''
  });

  const [registrationMessage, setRegistrationMessage] = useState(null);
  const [showPermanentPasswordStep, setShowPermanentPasswordStep] = useState(false);
  const [permanentPasswordData, setPermanentPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [targetUserId, setTargetUserId] = useState(null);

  const openAuthModal = (mode = 'login', packageChoice = null) => {
    setIsLogin(mode === 'login');
    if (packageChoice) {
      let fullPackage = packageChoice;
      if (packageChoice.includes('Starter') && !packageChoice.includes('10,000')) {
        fullPackage = 'Starter Package (₹10,000)';
      } else if (packageChoice.includes('Premium') && !packageChoice.includes('20,000')) {
        fullPackage = 'Premium Package (₹20,000)';
      } else if (packageChoice.includes('Elite') && !packageChoice.includes('30,000')) {
        fullPackage = 'Elite Package (₹30,000)';
      }
      setFormData(prev => ({ ...prev, selectedPackage: fullPackage }));
    }
    setAuthModalOpen(mode);
    if (error) setError(null);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(null);
    if (error) setError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    setRegistrationMessage(null);

    if (isLogin) {
      result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.user?.isOneTimePassword) {
          setTargetUserId(result.user._id);
          setShowPermanentPasswordStep(true);
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      result = await register(
        formData.name,
        formData.phone,
        formData.email,
        formData.password,
        formData.sponsorId,
        formData.aadhaarNumber,
        formData.selectedPackage,
        formData.aadhaarPhoto,
        formData.panPhoto,
        formData.transactionPhoto
      );
      if (result.success) {
        setRegistrationMessage(result.message);
        setIsLogin(true);
      }
    }
  };

  const handlePermanentPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!permanentPasswordData.newPassword || permanentPasswordData.newPassword.length < 6) {
      setError('New permanent password must be at least 6 characters long.');
      return;
    }
    if (permanentPasswordData.newPassword !== permanentPasswordData.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    const res = await updatePermanentPassword(permanentPasswordData.newPassword, permanentPasswordData.confirmPassword, targetUserId);
    if (res.success) {
      alert('Permanent password created successfully! Your temporary OTP has been invalidated.');
      navigate('/dashboard');
    }
  };

  const packages = [
    {
      name: 'Starter Package',
      price: '₹10,000',
      badge: 'Popular Entry',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      l1Commission: '₹1,000 (10%)',
      l2Commission: '₹500 Fixed Override',
      roi: 'Weekly Package Yield',
      features: [
        '10% Direct Referral Bonus',
        '₹500 Level 2 Indirect Override',
        'Standard Matrix Tree Visibility',
        '24/7 UPI & Bank Withdrawals',
        'Instant Admin Approval Pipeline'
      ]
    },
    {
      name: 'Premium Package',
      price: '₹20,000',
      badge: 'Most Popular',
      color: '#4f46e5',
      bg: '#eff6ff',
      border: '#bfdbfe',
      popular: true,
      l1Commission: '₹2,000 (10%)',
      l2Commission: '₹500 Fixed Override',
      roi: 'Accelerated Package Yield',
      features: [
        '10% Direct Referral Bonus',
        '₹500 Level 2 Indirect Override',
        'Accelerated ROI Yield Payouts',
        'Advanced Network Analytics',
        'Priority Customer Support'
      ]
    },
    {
      name: 'Elite Package',
      price: '₹30,000',
      badge: 'Maximum Yield',
      color: '#7c3aed',
      bg: '#f3e8ff',
      border: '#ddd6fe',
      l1Commission: '₹3,000 (10%)',
      l2Commission: '₹500 Fixed Override',
      roi: 'Maximum Passive ROI Yield',
      features: [
        '10% Direct Referral Bonus',
        '₹500 Level 2 Indirect Override',
        'Maximum Passive Weekly Yield',
        'VIP Matrix Analytics Access',
        'Express Fast-Track Payouts'
      ]
    }
  ];

  const faqs = [
    {
      q: 'What is lifefundAI Network?',
      a: 'lifefundAI Network is a next-generation distributor and investment platform combining automated 2-tier affiliate matrix commissions with AI-enhanced investment package yields.'
    },
    {
      q: 'How does the 2-Tier Commission Structure work?',
      a: 'Level 1 allows unlimited (N) direct referrals where you earn 10% on each package value upon Admin approval. Level 2 allows unlimited (N) indirect team referrals where you earn a flat ₹500 override for every downline sponsored by your Level 1 members.'
    },
    {
      q: 'What is required for Registration & KYC?',
      a: 'To register, you need a valid Sponsor Phone Number or ID, your Aadhaar Number, and payment transaction details. Admin reviews and approves all accounts for maximum security.'
    },
    {
      q: 'How do I withdraw my earnings?',
      a: 'All direct commissions, team overrides, and investment returns are deposited into your Available Wallet. You can request payouts directly to your UPI ID or Bank Account 24/7.'
    },
    {
      q: 'Can I upgrade my package later?',
      a: 'Yes, members can select higher tier packages to unlock increased direct commissions and higher ROI yields as their network grows.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #059669 0%, #4f46e5 100%)',
        color: '#ffffff',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Sparkles size={16} />
        <span>🎉 Level 2 Indirect Overrides are Active — Earn ₹500 per Team Downline!</span>
      </div>

      {/* Sticky Header Nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}>
              <Network size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                lifefundAI
              </h1>
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Network Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', gap: '28px', alignItems: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }} className="desktop-nav">
            <a href="#features" style={{ transition: 'color 0.2s' }}>Features</a>
            <a href="#how-it-works" style={{ transition: 'color 0.2s' }}>How It Works</a>
            <a href="#packages" style={{ transition: 'color 0.2s' }}>Packages</a>
            <a href="#matrix" style={{ transition: 'color 0.2s' }}>2-Tier Matrix</a>
            <a href="#security" style={{ transition: 'color 0.2s' }}>Security</a>
            <a href="#faq" style={{ transition: 'color 0.2s' }}>FAQ</a>
          </nav>

          {/* Top Right Action Buttons (Login & Sign Up) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-emerald"
                style={{ padding: '9px 18px', fontSize: '14px' }}
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => openAuthModal('login')}
                  style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LockKeyhole size={16} color="#059669" /> Login
                </button>

                <button 
                  onClick={() => openAuthModal('signup')}
                  className="btn-emerald"
                  style={{ padding: '9px 18px', fontSize: '14px' }}
                >
                  Sign Up <ArrowRight size={16} />
                </button>
              </>
            )}

            {/* Mobile menu icon */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', background: 'none', color: 'var(--text-main)', padding: '6px' }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{ padding: '16px 0 8px 0', borderTop: '1px solid var(--border-color)', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#packages" onClick={() => setMobileMenuOpen(false)}>Packages</a>
            <a href="#matrix" onClick={() => setMobileMenuOpen(false)}>2-Tier Matrix</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={{ padding: '70px 24px 60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '24px'
          }}>
            <Sparkles size={16} /> AI-Powered Financial & Distributor Network
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: '800',
            letterSpacing: '-1.2px',
            lineHeight: 1.15,
            color: 'var(--text-main)',
            marginBottom: '20px'
          }}>
            Multiply Your Capital with Intelligent Investment & <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2-Tier Network Commissions</span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '36px',
            maxWidth: '720px',
            margin: '0 auto 36px auto'
          }}>
            Join <strong>lifefundAI Network</strong>. Earn 10% direct commission on Level 1 referrals, ₹500 team overrides on Level 2 downlines, and enjoy passive weekly package yields with instant 24/7 wallet withdrawals.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <button 
              onClick={() => openAuthModal('signup')}
              className="btn-emerald"
              style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '12px' }}
            >
              Get Started Now <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => openAuthModal('login')}
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Member Login
            </button>
          </div>

          {/* Stat Badges */}
          <div style={{
            marginTop: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            padding: '24px',
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>₹10,000</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Entry Investment</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#4f46e5' }}>10% Direct</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Level 1 Commission</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#7c3aed' }}>₹500 Flat</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Level 2 Override</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669' }}>Instant 24/7</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>UPI / Bank Payouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{ padding: '60px 24px', background: '#f1f5f9' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Why Choose lifefundAI Network?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>
              Built for speed, transparency, and high distributor returns
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            <div className="light-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>AI-Optimized Yields</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Algorithmic investment pool yields distributed weekly into member wallets based on package tier.
              </p>
            </div>

            <div className="light-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>2-Tier Matrix Model</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Direct Level 1 payouts (10%) plus indirect Level 2 overrides (₹500) per sponsored downline.
              </p>
            </div>

            <div className="light-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <DollarSign size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Instant Withdrawals</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Request payouts to your UPI ID or Bank Account with 24/7 instant wallet processing.
              </p>
            </div>

            <div className="light-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>KYC Document Vault</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Aadhaar & PAN document verification ensures full regulatory safety and network integrity.
              </p>
            </div>

            <div className="light-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Dynamic Tree Visualizer</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Inspect your Level 1 and Level 2 matrix downlines with real-time status and earnings tracking.
              </p>
            </div>

            <div className="light-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Admin Verification Pipeline</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                System Admin accounts review member registrations and payments before node activation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '60px 24px', background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              How To Start Earning in 3 Simple Steps
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>
              Simple registration, package selection, and commission payout flow
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', position: 'relative' }}>
            
            <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 16px auto', fontSize: '16px' }}>
                1
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>Register & Submit KYC</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Enter your details, Sponsor Phone Number/ID, and upload Aadhaar/PAN for instant Admin approval.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-indigo-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 16px auto', fontSize: '16px' }}>
                2
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>Select Investment Package</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Choose Starter (₹10k), Premium (₹20k), or Elite (₹30k) to unlock your matrix earning potential.
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', margin: '0 auto 16px auto', fontSize: '16px' }}>
                3
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>Build Matrix & Withdraw</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Earn 10% direct Level 1 commission + ₹500 Level 2 team overrides + weekly package ROI directly into your wallet.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" style={{ padding: '60px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Choose Your Investment Package
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>
              Transparent pricing with guaranteed 10% direct commission and ₹500 indirect team overrides
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {packages.map((pkg, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '20px',
                  border: `2px solid ${pkg.popular ? pkg.color : 'var(--border-color)'}`,
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: pkg.popular ? '0 12px 30px -10px rgba(79, 70, 229, 0.25)' : 'var(--shadow-md)'
                }}
              >
                {pkg.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: pkg.color,
                    color: '#fff',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {pkg.badge}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: pkg.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {pkg.name}
                  </span>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    {pkg.price}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>One-time investment package</span>
                </div>

                <div style={{ background: pkg.bg, padding: '14px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>Level 1 Direct:</span>
                    <span style={{ color: pkg.color }}>{pkg.l1Commission}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>Level 2 Team Override:</span>
                    <span style={{ color: '#7c3aed' }}>{pkg.l2Commission}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>ROI / Yield Rate:</span>
                    <span style={{ color: '#059669' }}>{pkg.roi}</span>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', flex: 1 }}>
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-main)' }}>
                      <CheckCircle size={18} color={pkg.color} style={{ shrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openAuthModal('signup', `${pkg.name} (${pkg.price})`)}
                  className={pkg.popular ? 'btn-indigo' : 'btn-emerald'}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '15px' }}
                >
                  Join with {pkg.name} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unlimited 2-Tier Network Section */}
      <section id="matrix" style={{ padding: '60px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px', marginBottom: '12px' }}>
            Unlimited 2-Tier Network Commission Structure
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' }}>
            Sponsor N members in Level 1 and earn 10% on each. Earn ₹500 team override on N members in Level 2 — zero limits on network growth!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            
            {/* Level 1 Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
              border: '2px solid #bfdbfe',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'left',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#dbeafe',
                color: '#1e40af',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '800',
                marginBottom: '16px'
              }}>
                <Users size={16} /> LEVEL 1 — UNLIMITED (N MEMBERS)
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                10% Direct Referral Income
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                Directly sponsor as many distributors as you want (N direct members). Earn 10% instant commission on every single package purchased.
              </p>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #dbeafe', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>Starter (₹10,000):</span>
                  <span style={{ color: '#2563eb' }}>₹1,000 per member</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>Premium (₹20,000):</span>
                  <span style={{ color: '#2563eb' }}>₹2,000 per member</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>Elite (₹30,000):</span>
                  <span style={{ color: '#2563eb' }}>₹3,000 per member</span>
                </div>
              </div>
            </div>

            {/* Level 2 Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
              border: '2px solid #ddd6fe',
              borderRadius: '20px',
              padding: '32px 24px',
              textAlign: 'left',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f3e8ff',
                color: '#6b21a8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '800',
                marginBottom: '16px'
              }}>
                <Layers size={16} /> LEVEL 2 — UNLIMITED (N MEMBERS)
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                ₹500 Fixed Team Override
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                Whenever any of your Level 1 members sponsor downlines (N indirect members), you earn a flat ₹500 override for every single Level 2 referral.
              </p>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e9d5ff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>Indirect Override:</span>
                  <span style={{ color: '#7c3aed' }}>₹500 per Level 2 member</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>Member Limit:</span>
                  <span style={{ color: '#059669' }}>Unlimited (N Growth)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span>Payout Trigger:</span>
                  <span style={{ color: '#2563eb' }}>Instant Admin Approval</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '60px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>
              Everything you need to know about joining lifefundAI Network
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    textAlign: 'left',
                    background: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: '700',
                    fontSize: '15px',
                    color: 'var(--text-main)'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </button>
                {activeFaq === idx && (
                  <div style={{ padding: '0 20px 18px 20px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '16px' }}>
            Ready to Build Your Network & Capitalize on AI Yields?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px' }}>
            Register your distributor account today and get verified by our System Admin team.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => openAuthModal('signup')}
              className="btn-emerald"
              style={{ padding: '14px 32px', fontSize: '16px' }}
            >
              Sign Up Now <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => openAuthModal('login')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700'
              }}
            >
              Member Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#090d16', color: '#64748b', padding: '32px 24px', fontSize: '13px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Network size={16} />
            </div>
            <span style={{ color: '#f8fafc', fontWeight: '800', fontSize: '15px' }}>lifefundAI Network</span>
          </div>
          <div>
            © 2026 lifefundAI Network. All rights reserved. Distributor Commission & Investment Portal.
          </div>
        </div>
      </footer>

      {/* Auth Modal Overlay (Login & Sign Up) */}
      {authModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color)',
            padding: '32px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            
            {/* Close Button */}
            <button 
              onClick={closeAuthModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-subtle)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                marginBottom: '12px',
                boxShadow: '0 8px 20px -4px rgba(5, 150, 105, 0.3)'
              }}>
                <Network size={28} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
                lifefundAI Network
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Distributor Growth & Commission Portal
              </p>
            </div>

            {/* Permanent Password Change Step for OTP users */}
            {showPermanentPasswordStep ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#92400e',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  🔐 You logged in with a One-Time Password (OTP). Please create your permanent password to secure your account.
                </div>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#991b1b', fontSize: '13px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handlePermanentPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Create Permanent Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={permanentPasswordData.newPassword}
                      onChange={(e) => setPermanentPasswordData({ ...permanentPasswordData, newPassword: e.target.value })}
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Confirm Permanent Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={permanentPasswordData.confirmPassword}
                      onChange={(e) => setPermanentPasswordData({ ...permanentPasswordData, confirmPassword: e.target.value })}
                      style={{ width: '100%', padding: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '14px' }}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-emerald" style={{ width: '100%', marginTop: '8px' }}>
                    {loading ? 'Updating...' : 'Save Password & Enter Dashboard'}
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Login / Register Toggle Tabs */}
                <div style={{ display: 'flex', background: 'var(--bg-subtle)', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(null); }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      background: isLogin ? 'var(--bg-surface)' : 'transparent',
                      color: isLogin ? 'var(--text-main)' : 'var(--text-muted)',
                      boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Member Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(null); }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      background: !isLogin ? 'var(--bg-surface)' : 'transparent',
                      color: !isLogin ? 'var(--text-main)' : 'var(--text-muted)',
                      boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Create Account
                  </button>
                </div>

                {registrationMessage && (
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#065f46', fontSize: '13px', fontWeight: '600' }}>
                    ✅ {registrationMessage}
                  </div>
                )}

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px', color: '#991b1b', fontSize: '13px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {!isLogin && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Full Legal Name</label>
                        <input type="text" name="name" required placeholder="e.g. Rahul Sharma" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Phone Number (Acts as your Sponsor ID)</label>
                        <input type="text" name="phone" required placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Sponsor Phone / Sponsor ID (Required)</label>
                        <input type="text" name="sponsorId" required placeholder="e.g. +91 98765 43210 or MASTER-HEAD" value={formData.sponsorId} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Aadhaar Number (KYC Verification)</label>
                        <input type="text" name="aadhaarNumber" required placeholder="12-digit Aadhaar Number" value={formData.aadhaarNumber} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }} />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Select Investment Package</label>
                        <select name="selectedPackage" value={formData.selectedPackage} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }}>
                          <option value="Starter Package (₹10,000)">Starter Package (₹10,000)</option>
                          <option value="Premium Package (₹20,000)">Premium Package (₹20,000)</option>
                          <option value="Elite Package (₹30,000)">Elite Package (₹30,000)</option>
                        </select>
                      </div>

                      {/* File Uploads */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>KYC Proofs (Aadhaar & PAN Photo)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <label style={{ background: 'var(--bg-subtle)', border: '1px dashed var(--border-color)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '11px', cursor: 'pointer' }}>
                            {formData.aadhaarPhoto ? '✓ Aadhaar Uploaded' : '+ Upload Aadhaar'}
                            <input type="file" name="aadhaarPhoto" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                          </label>
                          <label style={{ background: 'var(--bg-subtle)', border: '1px dashed var(--border-color)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '11px', cursor: 'pointer' }}>
                            {formData.panPhoto ? '✓ PAN Uploaded' : '+ Upload PAN'}
                            <input type="file" name="panPhoto" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>Email Address</label>
                    <input type="email" name="email" required placeholder="e.g. user@domain.com" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                      {isLogin ? 'Account Password / OTP' : 'Create Account Password'}
                    </label>
                    <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px' }} />
                  </div>

                  <button type="submit" disabled={loading} className="btn-emerald" style={{ marginTop: '8px', width: '100%', padding: '12px' }}>
                    {loading ? 'Processing...' : (isLogin ? 'Enter Member Portal' : 'Submit Joining Request')}
                    <ArrowRight size={18} />
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
