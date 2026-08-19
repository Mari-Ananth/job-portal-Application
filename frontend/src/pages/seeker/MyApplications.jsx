import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, User as UserIcon, LayoutDashboard, Calendar, Eye } from 'lucide-react';
import Loading from '../../components/Loading';

const MyApplications = () => {
  const { fetchWithAuth } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/seeker/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeClass = (status) => {
    if (status === 'ACCEPTED') return 'badge-success';
    if (status === 'REJECTED') return 'badge-error';
    if (status === 'REVIEWING') return 'badge-info';
    return 'badge-warning';
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>My Applications</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View and track the status of all your submitted job applications.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
          <div className="dashboard-sidebar-menu">
            <Link to="/seeker/dashboard" className="dashboard-menu-item">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/seeker/profile" className="dashboard-menu-item">
              <UserIcon size={18} /> Profile Details
            </Link>
            <Link to="/seeker/applications" className="dashboard-menu-item active">
              <FileText size={18} /> My Applications
            </Link>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Application History</h3>

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
                  {applications.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{app.jobTitle}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{app.companyName}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} />
                          {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={12} /> View Job
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <FileText size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p>You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px', padding: '8px 20px', fontSize: '14px' }}>
                Find Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
