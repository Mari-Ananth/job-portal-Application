import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, User as UserIcon, LayoutDashboard, CheckCircle, Clock, XCircle, Award } from 'lucide-react';
import Loading from '../../components/Loading';

const SeekerDashboard = () => {
  const { user, fetchWithAuth } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/seeker/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStats = () => {
    let pending = 0, accepted = 0, rejected = 0;
    applications.forEach(app => {
      if (app.status === 'PENDING' || app.status === 'REVIEWING') pending++;
      else if (app.status === 'ACCEPTED') accepted++;
      else if (app.status === 'REJECTED') rejected++;
    });
    return { total: applications.length, pending, accepted, rejected };
  };

  const stats = getStats();

  const getStatusBadgeClass = (status) => {
    if (status === 'ACCEPTED') return 'badge-success';
    if (status === 'REJECTED') return 'badge-error';
    if (status === 'REVIEWING') return 'badge-info';
    return 'badge-warning';
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Hello, {user.fullName}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to your Job Seeker Dashboard. Track your applications and update your profile.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
          <div className="dashboard-sidebar-menu">
            <Link to="/seeker/dashboard" className="dashboard-menu-item active">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/seeker/profile" className="dashboard-menu-item">
              <UserIcon size={18} /> Profile Details
            </Link>
            <Link to="/seeker/applications" className="dashboard-menu-item">
              <FileText size={18} /> My Applications
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <FileText size={32} style={{ color: 'var(--accent-color)' }} />
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{stats.total}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Total Applications</p>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={32} style={{ color: 'var(--warning-color)' }} />
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{stats.pending}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Pending Review</p>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CheckCircle size={32} style={{ color: 'var(--success-color)' }} />
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{stats.accepted}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Offers / Accepted</p>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <XCircle size={32} style={{ color: 'var(--error-color)' }} />
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{stats.rejected}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Rejected</p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Recent Applications</h3>

            {loading ? (
              <Loading />
            ) : applications.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <th style={{ padding: '12px 16px' }}>JOB TITLE</th>
                      <th style={{ padding: '12px 16px' }}>COMPANY</th>
                      <th style={{ padding: '12px 16px' }}>APPLIED DATE</th>
                      <th style={{ padding: '12px 16px' }}>STATUS</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                        <td style={{ padding: '16px', fontWeight: 600 }}>{app.jobTitle}</td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{app.companyName}</td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                          {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            View Job
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <Award size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <p>You haven't submitted any job applications yet.</p>
                <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px', padding: '8px 20px', fontSize: '14px' }}>
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
