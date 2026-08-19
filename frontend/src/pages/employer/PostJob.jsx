import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building, PlusCircle, Save, ArrowLeft, LayoutDashboard } from 'lucide-react';
import ErrorComponent from '../../components/Error';

const PostJob = () => {
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [experienceLevel, setExperienceLevel] = useState('ENTRY_LEVEL');
  const [salary, setSalary] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetchWithAuth('http://localhost:8080/api/employer/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          requirements,
          skillsRequired,
          location,
          jobType,
          experienceLevel,
          salary: parseFloat(salary),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to post job');
      }

      navigate('/employer/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Post a New Job</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Publish a new job opportunity to find outstanding candidates.</p>
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
            <Link to="/employer/post-job" className="dashboard-menu-item active">
              <PlusCircle size={18} /> Post a Job
            </Link>
            <Link to="/employer/jobs" className="dashboard-menu-item">
              <Briefcase size={18} /> My Jobs
            </Link>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 500,
            marginBottom: '20px'
          }}>
            <ArrowLeft size={16} /> Cancel and go back
          </button>

          {errorMsg && <ErrorComponent message={errorMsg} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Job Title</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Java Full Stack Developer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-mobile">
              <div className="form-group">
                <label className="form-label" htmlFor="jobType">Job Type</label>
                <select
                  id="jobType"
                  className="form-input form-select"
                  value={jobType}
                  onChange={e => setJobType(e.target.value)}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="experienceLevel">Experience Level</label>
                <select
                  id="experienceLevel"
                  className="form-input form-select"
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value)}
                >
                  <option value="ENTRY_LEVEL">Entry Level</option>
                  <option value="MID_LEVEL">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-mobile">
              <div className="form-group">
                <label className="form-label" htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="salary">Annual Salary (USD)</label>
                <input
                  id="salary"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 120000"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="skillsRequired">Required Skills</label>
              <input
                id="skillsRequired"
                type="text"
                className="form-input"
                placeholder="e.g. Java, Spring Boot, React, MySQL (comma-separated)"
                value={skillsRequired}
                onChange={e => setSkillsRequired(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Job Description</label>
              <textarea
                id="description"
                className="form-input"
                rows={6}
                placeholder="Detail the day-to-day responsibilities, about company..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" htmlFor="requirements">Job Requirements</label>
              <textarea
                id="requirements"
                className="form-input"
                rows={5}
                placeholder="Detail qualifications, credentials, must-have experiences..."
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px 28px' }}>
              {loading ? 'Posting...' : 'Publish Job Posting'} <Save size={16} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .form-row-mobile {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PostJob;
