import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, DollarSign, Briefcase, Calendar, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorComponent from '../components/Error';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, fetchWithAuth } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [applied, setApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [hasResume, setHasResume] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/jobs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Job not found');
        return res.json();
      })
      .then(data => setJob(data))
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));

    if (user && user.role === 'JOB_SEEKER') {
      fetchWithAuth('http://localhost:8080/api/seeker/applications')
        .then(res => res.json())
        .then(apps => {
          const alreadyApplied = apps.some(app => app.jobId === parseInt(id));
          setApplied(alreadyApplied);
        })
        .catch(err => console.error('Error checking application status:', err));

      fetchWithAuth('http://localhost:8080/api/seeker/profile')
        .then(res => res.json())
        .then(profile => {
          setHasResume(!!profile.resumePath);
        })
        .catch(err => console.error('Error checking resume status:', err));
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!hasResume) {
      setErrorMsg('Please upload a resume in your profile before applying.');
      return;
    }

    setApplyLoading(true);
    setErrorMsg('');
    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/seeker/apply/${id}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }
      setApplied(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '80px' }}><Loading /></div>;
  if (errorMsg && !job) return <div className="container" style={{ marginTop: '80px' }}><ErrorComponent message={errorMsg} /></div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px', maxWidth: '850px' }}>
      <button onClick={() => navigate(-1)} style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 500,
        marginBottom: '24px'
      }}>
        <ArrowLeft size={16} /> Back to listings
      </button>

      {errorMsg && <ErrorComponent message={errorMsg} />}

      {job && (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '24px',
            marginBottom: '32px'
          }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: '12px' }}>{job.jobType}</span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>{job.title}</h1>
              <p style={{ color: 'var(--accent-color)', fontSize: '18px', fontWeight: 600 }}>{job.companyName}</p>
            </div>

            {(!user || user.role === 'JOB_SEEKER') && (
              <div style={{ flexShrink: 0 }}>
                {applied ? (
                  <button className="btn btn-secondary" style={{ border: '1px solid var(--success-color)', color: 'var(--success-color)', background: 'var(--success-bg)', cursor: 'default' }} disabled>
                    <CheckCircle size={16} /> Applied Successfully
                  </button>
                ) : (
                  <button onClick={handleApply} className="btn btn-primary" style={{ padding: '14px 28px' }} disabled={applyLoading}>
                    {applyLoading ? 'Applying...' : 'Apply Now'} <Send size={16} />
                  </button>
                )}
                {!hasResume && user && (
                  <p style={{ fontSize: '12px', color: 'var(--error-color)', marginTop: '8px', textAlign: 'right' }}>
                    * Requires resume. <Link to="/seeker/profile" style={{ textDecoration: 'underline' }}>Upload here</Link>
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            background: 'rgba(255,255,255,0.02)',
            padding: '24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '36px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>LOCATION</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <MapPin size={16} style={{ color: 'var(--accent-color)' }} />
                <span>{job.location}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SALARY</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <DollarSign size={16} style={{ color: 'var(--success-color)' }} />
                <span>{job.salary ? '$' + job.salary.toLocaleString() + ' / year' : 'Not disclosed'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>EXPERIENCE</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <Briefcase size={16} style={{ color: 'var(--info-color)' }} />
                <span>{job.experienceLevel}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>DATE POSTED</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <Calendar size={16} style={{ color: 'var(--warning-color)' }} />
                <span>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Job Description</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', whiteSpace: 'pre-line' }}>{job.description}</p>
          </div>

          {job.requirements && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Requirements</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', whiteSpace: 'pre-line' }}>{job.requirements}</p>
            </div>
          )}

          {job.skillsRequired && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {job.skillsRequired.split(',').map((skill, index) => (
                  <span key={index} className="badge badge-accent" style={{ padding: '6px 14px', fontSize: '13px' }}>{skill.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
