import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Network,
  LogOut,
  Wallet,
  Users,
  Award,
  TrendingUp,
  Share2,
  Copy,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.sponsorId || 'SP-1001';
  const referralLink = `https://nexismlm.com/join?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const stats = [
    { title: 'Available Wallet Balance', value: `$${(user?.walletBalance || 4850).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Ready for withdrawal', icon: Wallet, color: '#059669', bg: '#ecfdf5' },
    { title: 'Lifetime Commission', value: `$${(user?.totalEarnings || 18450).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: '+18.4% this month', icon: DollarSign, color: '#4f46e5', bg: '#eef2ff' },
    { title: 'Direct Downline Team', value: `${user?.downlineCount || 32} Members`, sub: '12 Active Directs', icon: Users, color: '#d97706', bg: '#fffbeb' },
    { title: 'Group Sales Volume (GV)', value: `${(user?.groupVolume || 48500).toLocaleString()} Points`, sub: 'Rank Progress: 82%', icon: TrendingUp, color: '#0284c7', bg: '#f0f9ff' },
  ];

  const downlineMembers = [
    { name: 'Sarah Connor', rank: 'Platinum', joined: 'July 14, 2026', pv: '2,800 PV', commission: '$1,240.00' },
    { name: 'David Vance', rank: 'Silver', joined: 'July 18, 2026', pv: '800 PV', commission: '$320.00' },
    { name: 'Elena Rostova', rank: 'Gold', joined: 'July 21, 2026', pv: '1,450 PV', commission: '$680.00' },
    { name: 'Marcus Brody', rank: 'Member', joined: 'July 26, 2026', pv: '350 PV', commission: '$140.00' },
  ];

  const payoutHistory = [
    { id: 'PAY-8921', type: 'Weekly Binary Matching Bonus', date: 'July 28, 2026', amount: '+$850.00', status: 'Completed' },
    { id: 'PAY-8840', type: 'Unilevel Leadership Commission', date: 'July 21, 2026', amount: '+$1,420.00', status: 'Completed' },
    { id: 'PAY-8712', type: 'Direct Sponsor Fast-Start Bonus', date: 'July 14, 2026', amount: '+$600.00', status: 'Completed' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Navigation Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}>
              <Network size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>Nexis MLM Network</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Distributor Member Portal</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>{user?.name || 'Alex Rivera'}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600' }} className="code-font">Sponsor ID: {referralCode}</div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  transition: 'all 0.2s ease'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome Hero Card */}
        <div className="light-card" style={{
          padding: '32px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          border: '1px solid #bbf7d0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
              <Sparkles size={14} /> Active Commission Cycle: Week 30
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
              Welcome back, {user?.name || 'Distributor'}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px' }}>
              Your Nexis MLM matrix is expanding rapidly. Track direct downlines, rank qualifications, and request instant wallet payouts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-emerald">
              <Wallet size={18} /> Request Payout
            </button>
          </div>
        </div>

        {/* Copy Referral Link Banner */}
        <div className="light-card" style={{ padding: '24px', marginBottom: '32px', background: '#eef2ff', border: '1px solid #c7d2fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Your Unique Referral Recruitment Link</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Share this link to automatically enroll new members into your direct downline leg.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '6px 6px 6px 16px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
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

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="light-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>{stat.title}</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: stat.color, fontWeight: '700' }}>{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Direct Downline Table */}
        <div className="light-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Direct Downline Network Members</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Top performing direct referrals in your unilevel structure</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 16px' }}>Distributor Name</th>
                  <th style={{ padding: '12px 16px' }}>Rank Level</th>
                  <th style={{ padding: '12px 16px' }}>Enrollment Date</th>
                  <th style={{ padding: '12px 16px' }}>Personal Volume (PV)</th>
                  <th style={{ padding: '12px 16px' }}>Commission Generated</th>
                </tr>
              </thead>
              <tbody>
                {downlineMembers.map((member, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{member.name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: member.rank === 'Platinum' ? '#e0e7ff' : (member.rank === 'Gold' ? '#fef3c7' : '#f1f5f9'),
                        color: member.rank === 'Platinum' ? '#3730a3' : (member.rank === 'Gold' ? '#92400e' : '#475569'),
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {member.rank}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>{member.joined}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }} className="code-font">{member.pv}</td>
                    <td style={{ padding: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{member.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Payout History */}
        <div className="light-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Recent Commission Payout History</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Statement of binary matching, bonus, and unilevel earnings</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {payoutHistory.map((pay, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px' }}>{pay.type}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }} className="code-font">
                      {pay.id} • Processed: {pay.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '16px', color: '#059669', fontWeight: '800' }}>{pay.amount}</span>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                    {pay.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
