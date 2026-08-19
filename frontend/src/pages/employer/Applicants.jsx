import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, FileDown, ArrowLeft, CheckCircle, Mail, Clock, LayoutDashboard, Building, PlusCircle, Briefcase } from 'lucide-react';
import Loading from '../../components/Loading';
import ErrorComponent from '../../components/Error';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();

  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = () => {
    setLoading(true);
    setErrorMsg('');
    
    fetch(`http://localhost:8080/api/jobs/${jobId}`)
      .then(res => res.json())
      .then(job => setJobTitle(job.title))
      .catch(err => console.error(err));

    fetchWithAuth(`http://localhost:8080/api/employer/jobs/${jobId}/applications`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to retrieve applicants');
        return res.json();
      })
      .then(data => setApplicants(data))
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdateLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/employer/applications/${appId}/status?status=${newStatus}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      setApplicants(applicants.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      setSuccessMsg('Candidate status updated to ' + newStatus);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'ACCEPTED') return 'badge-success';
    if (status === 'REJECTED') return 'badge-error';
    if (status === 'REVIEWING') return 'badge-info';
    return 'badge-warning';
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Applicants for: <span className="title-gradient">{jobTitle}</span></h2>
        <p style={{ color: 'var(--text-secondary)' }}>Review candidate profile details, download resumes, and manage their recruitment stage.</p>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <button onClick={() => navigate(-1)} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 500,
            width: 'fit-content'
          }}>
            <ArrowLeft size={16} /> Back to listings
          </button>

          {successMsg && (
            <div className="glass-panel animate-fade-in" style={{
              padding: '16px 20px',
              borderLeft: '4px solid var(--success-color)',
              background: 'var(--success-bg)',
              color: 'var(--success-color)',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle size={18} /> {successMsg}
            </div>
          )}

          {errorMsg && <ErrorComponent message={errorMsg} />}

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Applications Received</h3>

            {loading ? (
              <Loading />
            ) : applicants.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {applicants.map(app => (
                  <div key={app.id} className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 600 }}>{app.seekerName}</h4>
                        <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <Mail size={14} />
                        <span>{app.seekerEmail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Clock size={14} />
                        <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
                      {app.resumePath && (
                        <a href={`http://localhost:8080/api/files/${app.resumePath}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                          <FileDown size={14} /> Resume
                        </a>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status:</span>
                        <select
                          className="form-input form-select"
                          value={app.status}
                          onChange={e => handleStatusChange(app.id, e.target.value)}
                          disabled={statusUpdateLoading}
                          style={{ padding: '8px 36px 8px 12px', fontSize: '13px', width: '140px', backgroundPosition: 'right 12px center' }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWING">Reviewing</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <Users size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <p>No candidates have applied for this job yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
