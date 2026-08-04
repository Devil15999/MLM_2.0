import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Network, Lock, Mail, User, Share2, ArrowRight, AlertCircle, Sparkles, Image as ImageIcon, CheckCircle } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sponsorId: 'SP-1001',
    aadhaarNumber: '',
    selectedPackage: 'Starter (₹10,000)',
    aadhaarPhoto: '',
    panPhoto: '',
    transactionPhoto: ''
  });
  const [registrationMessage, setRegistrationMessage] = useState(null);

  const { login, register, loading, error, setError } = useAuth();
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
        navigate('/dashboard');
      }
    } else {
      result = await register(
        formData.name,
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
            Nexis MLM Network
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Distributor Growth & Commission Portal
          </p>
        </div>

        {/* Card Form */}
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
                    Sponsor ID Code
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Share2 size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      name="sponsorId"
                      placeholder="e.g. SP-1001"
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
                      placeholder="e.g. 1234 5678 9012"
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
                        accept="image/*"
                        name="aadhaarPhoto"
                        required
                        onChange={handleFileChange}
                        style={{
                          width: '100%',
                          padding: '8px 14px 8px 42px',
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
                      <span>PAN Photo</span>
                      <span style={{ color: 'var(--text-muted)' }}>Optional</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <ImageIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="file"
                        accept="image/*"
                        name="panPhoto"
                        onChange={handleFileChange}
                        style={{
                          width: '100%',
                          padding: '8px 14px 8px 42px',
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
                      <span>Transaction Proof</span>
                      <span style={{ color: '#ef4444' }}>* Required</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <ImageIcon size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="file"
                        accept="image/*"
                        name="transactionPhoto"
                        required
                        onChange={handleFileChange}
                        style={{
                          width: '100%',
                          padding: '8px 14px 8px 42px',
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
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="alex@nexismlm.com"
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
                Account Password
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

          {/* Quick Demo Fill buttons */}
          {isLogin && (
            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    email: 'alex@nexismlm.com',
                    password: 'User@123456',
                  }));
                  setIsLogin(true);
                  if (error) setError(null);
                }}
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '700',
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={16} /> Demo Login: Alex Rivera
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
