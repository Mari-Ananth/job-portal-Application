import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building, PlusCircle, Users, LayoutDashboard } from 'lucide-react';
import Loading from '../../components/Loading';

const EmployerDashboard = () => {
  const { user, fetchWithAuth } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/employer/jobs')
      .then(res => res.json())
      .then(async (jobsData) => {
        setJobs(jobsData);
        
        let count = 0;
        for (let job of jobsData) {
          try {
            const res = await fetchWithAuth(`http://localhost:8080/api/employer/jobs/${job.id}/applications`);
            const apps = await res.json();
            count += apps.length;
          } catch (e) {
            console.error('Error fetching applications for job ' + job.id, e);
          }
        }
        setTotalApplicants(count);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Hello, {user.fullName}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your job postings, view applications, and edit company profile.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
          <div className="dashboard-sidebar-menu">
            <Link to="/employer/dashboard" className="dashboard-menu-item active">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/employer/profile" className="dashboard-menu-item">
              <Building size={18} /> Company Profile
            </Link>
            <Link to="/employer/post-job" className="dashboard-menu-item">
              <PlusCircle size={18} /> Post a Job
            </Link>
            <Link to="/employer/jobs" className="dashboard-menu-item">
              <Briefcase size={18} /> My Jobs
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Briefcase size={36} style={{ color: 'var(--accent-color)' }} />
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{jobs.length}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Jobs Published</p>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Users size={36} style={{ color: 'var(--success-color)' }} />
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800 }}>{totalApplicants}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Total Applications Received</p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600 }}>Active Job Postings</h3>
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
                          <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <Briefcase size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <p>No job listings posted yet. Start hiring today!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
