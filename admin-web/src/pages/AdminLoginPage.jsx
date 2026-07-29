import React, { useState } from 'react';
import { useAdminAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Network, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin, loading, error, setError } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginAdmin(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@nexismlm.com');
    setPassword('Admin@123456');
    if (error) setError(null);
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
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#ffffff',
            marginBottom: '16px',
            boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4)'
          }}>
            <Network size={34} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Nexis MLM Command
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            System Administrator & Network Operations Center
          </p>
        </div>

        {/* Login Card */}
        <div className="light-card" style={{ padding: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            marginBottom: '24px',
            color: '#065f46',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            <ShieldCheck size={18} style={{ shrink: 0 }} />
            <span>Master Console: Verified Admin Credentials Required</span>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#991b1b',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="admin@nexismlm.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: '#f8fafc',
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
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-main)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-admin" style={{ marginTop: '8px', width: '100%' }}>
              {loading ? 'Verifying Admin Session...' : 'Enter MLM Command Console'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Fill button */}
          <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
            <button
              onClick={handleFillDemoAdmin}
              style={{
                background: 'transparent',
                color: 'var(--primary-admin)',
                fontSize: '13px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={16} /> Auto-fill Admin Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
