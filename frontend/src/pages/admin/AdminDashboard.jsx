import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Briefcase, Trash2, Calendar, Eye, ShieldAlert } from 'lucide-react';
import Loading from '../../components/Loading';
import ErrorComponent from '../../components/Error';

const AdminDashboard = () => {
  const { user, fetchWithAuth } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users');
  
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    setErrorMsg('');
    
    Promise.all([
      fetchWithAuth('http://localhost:8080/api/admin/users').then(res => res.json()),
      fetchWithAuth('http://localhost:8080/api/admin/jobs').then(res => res.json()),
      fetchWithAuth('http://localhost:8080/api/admin/stats').then(res => res.json())
    ])
      .then(([usersData, jobsData, statsData]) => {
        setUsers(usersData);
        setJobs(jobsData);
        setStats(statsData);
      })
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This will delete all their profiles and job applications.`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter(u => u.id !== id));
      setSuccessMsg(`User "${name}" has been deleted.`);
      loadData();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete job posting "${title}"?`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/admin/jobs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      setJobs(jobs.filter(j => j.id !== id));
      setSuccessMsg(`Job posting "${title}" has been deleted.`);
      loadData();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldAlert size={36} style={{ color: 'var(--error-color)' }} />
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Admin Control Panel</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, Admin {user.fullName}. Control job postings and user accounts.</p>
        </div>
      </div>

      {successMsg && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '16px 20px',
          borderLeft: '4px solid var(--success-color)',
          background: 'var(--success-bg)',
          color: 'var(--success-color)',
          fontWeight: 600,
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          {successMsg}
        </div>
      )}

      {errorMsg && <ErrorComponent message={errorMsg} />}

      {/* Stats Cards Overview */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Users</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{stats.totalUsers}</h3>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--info-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Job Seekers</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{stats.totalJobSeekers}</h3>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Employers</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{stats.totalEmployers}</h3>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--warning-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Jobs</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{stats.totalJobs}</h3>
          </div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #a855f7' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Applications</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>{stats.totalApplications}</h3>
          </div>
        </div>
      )}

      {/* Application Status Breakdown */}
      {stats && stats.applicationStatusCounts && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '32px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Application Pipeline Status</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {Object.entries(stats.applicationStatusCounts).map(([status, count]) => (
              <div key={status} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', minWidth: '150px' }}>
                <span className="badge" style={{ 
                  fontSize: '11px', 
                  marginBottom: '6px',
                  display: 'inline-block',
                  background: status === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.15)' : status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: status === 'ACCEPTED' ? 'var(--success-color)' : status === 'REJECTED' ? 'var(--error-color)' : 'var(--text-secondary)'
                }}>{status}</span>
                <h4 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{count}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            padding: '14px 8px',
            fontSize: '16px',
            fontWeight: 600,
            color: activeTab === 'users' ? 'var(--accent-color)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'users' ? '2px solid var(--accent-color)' : 'none',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <Users size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Manage Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            background: 'none',
            border: 'none',
            padding: '14px 8px',
            fontSize: '16px',
            fontWeight: 600,
            color: activeTab === 'jobs' ? 'var(--accent-color)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'jobs' ? '2px solid var(--accent-color)' : 'none',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <Briefcase size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Manage Jobs ({jobs.length})
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : activeTab === 'users' ? (
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Registered Platform Users</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <th style={{ padding: '12px 16px' }}>NAME</th>
                  <th style={{ padding: '12px 16px' }}>EMAIL</th>
                  <th style={{ padding: '12px 16px' }}>ROLE</th>
                  <th style={{ padding: '12px 16px' }}>CREATED AT</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{u.fullName}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-error' : u.role === 'EMPLOYER' ? 'badge-info' : 'badge-accent'}`} style={{ fontSize: '11px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handleDeleteUser(u.id, u.fullName)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                          <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>Active Job Postings</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <th style={{ padding: '12px 16px' }}>JOB TITLE</th>
                  <th style={{ padding: '12px 16px' }}>COMPANY</th>
                  <th style={{ padding: '12px 16px' }}>LOCATION</th>
                  <th style={{ padding: '12px 16px' }}>SALARY</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{job.title}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{job.companyName}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{job.location}</td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      ${job.salary ? job.salary.toLocaleString() : 'Not disclosed'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={12} /> View
                      </a>
                      <button onClick={() => handleDeleteJob(job.id, job.title)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
