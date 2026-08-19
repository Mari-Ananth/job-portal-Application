import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building, PlusCircle, Trash2, LayoutDashboard, Eye } from 'lucide-react';
import Loading from '../../components/Loading';

const EmployerJobs = () => {
  const { fetchWithAuth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    fetchWithAuth('http://localhost:8080/api/employer/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/employer/jobs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      setJobs(jobs.filter(job => job.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>My Job Postings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View, manage, or delete your active job openings.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
          <div className="dashboard-sidebar-menu">
            <Link to="/employer/dashboard" className="dashboard-menu-item">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/employer/profile" className="dashboard-menu-item">
              <Building size={18} /> Company Profile
            </Link>
            <Link to="/employer/post-job" className="dashboard-menu-item">
              <PlusCircle size={18} /> Post a Job
            </Link>
            <Link to="/employer/jobs" className="dashboard-menu-item active">
              <Briefcase size={18} /> My Jobs
            </Link>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600 }}>Active Listings</h3>
            <Link to="/employer/post-job" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <PlusCircle size={14} /> Post New Job
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : jobs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <th style={{ padding: '12px 16px' }}>JOB TITLE</th>
                    <th style={{ padding: '12px 16px' }}>LOCATION</th>
                    <th style={{ padding: '12px 16px' }}>TYPE</th>
                    <th style={{ padding: '12px 16px' }}>SALARY</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{job.title}</td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{job.location}</td>
                      <td style={{ padding: '16px' }}>
                        <span className="badge badge-accent" style={{ fontSize: '11px' }}>{job.jobType}</span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        ${job.salary ? job.salary.toLocaleString() : 'Not disclosed'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link to={`/employer/jobs/${job.id}/applicants`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                          Applicants
                        </Link>
                        <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={12} /> View
                        </Link>
                        <button onClick={() => handleDelete(job.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <Briefcase size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p>No jobs published yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;
