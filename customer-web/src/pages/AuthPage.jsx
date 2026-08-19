import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Network, Lock, Mail, User, Phone, Share2, ArrowRight, AlertCircle, Sparkles, Image as ImageIcon, CheckCircle } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    sponsorId: '',
    aadhaarNumber: '',
    selectedPackage: 'Starter (₹10,000)',
    aadhaarPhoto: '',
    panPhoto: '',
    transactionPhoto: ''
  });
  const [registrationMessage, setRegistrationMessage] = useState(null);
  const [showPermanentPasswordStep, setShowPermanentPasswordStep] = useState(false);
  const [permanentPasswordData, setPermanentPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [targetUserId, setTargetUserId] = useState(null);

  const { login, updatePermanentPassword, register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-main)'
    }}>
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#fff',
            marginBottom: '16px',
            boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4)'
          }}>
            <Network size={36} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>
            lifefundAI Network
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Distributor Growth & Commission Portal
          </p>
        </div>

        {/* Card Form */}
        {showPermanentPasswordStep ? (
          <div className="light-card" style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: '#fef3c7',
                color: '#d97706',
                marginBottom: '12px'
              }}>
                <Lock size={26} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Create Permanent Password</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
                You logged in using a temporary One-Time Password (OTP). Please create a new permanent password. Once set, your temporary OTP will be <strong>permanently invalidated</strong>.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#991b1b',
                fontSize: '13px'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePermanentPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                  New Permanent Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters (e.g. MyPass#2026)"
                    value={permanentPasswordData.newPassword}
                    onChange={(e) => {
                      setPermanentPasswordData({ ...permanentPasswordData, newPassword: e.target.value });
                      if (error) setError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Confirm Permanent Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-enter new password"
                    value={permanentPasswordData.confirmPassword}
                    onChange={(e) => {
                      setPermanentPasswordData({ ...permanentPasswordData, confirmPassword: e.target.value });
                      if (error) setError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-emerald" style={{ marginTop: '8px', width: '100%', padding: '12px', fontSize: '14px', fontWeight: '800' }}>
                {loading ? 'Saving Permanent Password...' : 'Save Password & Access Portal'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="light-card" style={{ padding: '32px' }}>
            {/* Tab switch */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-subtle)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => { setIsLogin(true); setError(null); setRegistrationMessage(null); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: '700',
                  background: isLogin ? 'var(--primary-gradient)' : 'transparent',
                  color: isLogin ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.25s ease'
                }}
              >
                Distributor Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(null); setRegistrationMessage(null); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: '700',
                  background: !isLogin ? 'var(--primary-gradient)' : 'transparent',
                  color: !isLogin ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.25s ease'
                }}
              >
                Join Network
              </button>
            </div>

            {registrationMessage && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#166534',
                fontSize: '13px'
              }}>
                <CheckCircle size={18} />
                <span>{registrationMessage}</span>
              </div>
            )}

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#991b1b',
                fontSize: '13px'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {!isLogin && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Full Legal Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Alex Rivera"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--text-main)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Phone Number <span style={{ color: '#ef4444' }}>* Required</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--text-main)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                      Sponsor Phone Number <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>(Optional)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Share2 size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        name="sponsorId"
                        placeholder="e.g. +919876543210"
                        value={formData.sponsorId}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 42px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--text-main)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        name="aadhaarNumber"
                        required
                        maxLength={14}
                        placeholder="e.g. 2345 6789 0123"
                        value={formData.aadhaarNumber}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--text-main)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                        Select Package
                      </label>
                      <select
                        name="selectedPackage"
                        required
                        value={formData.selectedPackage}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          color: 'var(--text-main)',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Starter (₹10,000)">Starter (₹10,000)</option>
                        <option value="Premium (₹20,000)">Premium (₹20,000)</option>
                        <option value="Elite (₹30,000)">Elite (₹30,000)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                        <span>Aadhaar Photo</span>
                        <span style={{ color: '#ef4444' }}>* Required</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <ImageIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="file"
                          name="aadhaarPhoto"
                          required
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{
                            width: '100%',
                            padding: '10px 14px 10px 42px',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            color: 'var(--text-main)',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                        <span>PAN Card Photo</span>
                        <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>(Optional)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <ImageIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="file"
                          name="panPhoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{
                            width: '100%',
                            padding: '10px 14px 10px 42px',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            color: 'var(--text-main)',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                        <span>Transaction Proof Photo</span>
                        <span style={{ color: '#ef4444' }}>* Required</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <ImageIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="file"
                          name="transactionPhoto"
                          required
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{
                            width: '100%',
                            padding: '10px 14px 10px 42px',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            color: 'var(--text-main)',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                  {isLogin ? 'Phone Number or Email Address' : 'Email Address (Unique Login)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="e.g. +91 98765 43210 or user@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                  {isLogin ? 'Account Password / Temporary OTP' : 'Create Account Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-emerald" style={{ marginTop: '8px', width: '100%' }}>
                {loading ? 'Processing...' : (isLogin ? 'Enter Member Portal' : 'Submit Joining Request')}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
