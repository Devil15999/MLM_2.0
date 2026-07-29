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
      setPayoutMessage('Weekly MLM Commission Payout Processed Successfully! $48,250.00 credited to distributor wallets.');
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
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>$1,485,000 GV</div>
              <div style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '700', marginTop: '4px' }}>
                Group Volume across legs
              </div>
            </div>

            <div className="light-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>Total Commission Paid</span>
                <div style={{ padding: '8px', background: '#fffbeb', color: '#d97706', borderRadius: '8px' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>$340,000.00</div>
              <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '700', marginTop: '4px' }}>
                Processed to wallets
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
                          ${(u.walletBalance || 4850).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {u.downlineCount || 28} Members
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
