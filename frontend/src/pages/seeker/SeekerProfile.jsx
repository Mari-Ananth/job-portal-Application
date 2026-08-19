import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, User as UserIcon, LayoutDashboard, Save, Upload, FileDown, CheckCircle } from 'lucide-react';
import Loading from '../../components/Loading';
import ErrorComponent from '../../components/Error';

const SeekerProfile = () => {
  const { user, fetchWithAuth } = useAuth();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [resumePath, setResumePath] = useState('');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = () => {
    fetchWithAuth('http://localhost:8080/api/seeker/profile')
      .then(res => res.json())
      .then(profile => {
        setFullName(profile.fullName || '');
        setBio(profile.bio || '');
        setSkills(profile.skills || '');
        setExperience(profile.experience || '');
        setEducation(profile.education || '');
        setResumePath(profile.resumePath || '');
      })
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');
    setErrorMsg('');
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/seeker/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName,
          bio,
          skills,
          experience,
          education,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      setMessage('Profile updated successfully!');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.fullName = fullName;
      localStorage.setItem('user', JSON.stringify(storedUser));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Resume file size must be less than 5MB.');
      return;
    }

    setUploadLoading(true);
    setMessage('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetchWithAuth('http://localhost:8080/api/seeker/resume', {
        method: 'POST',
        body: formData,
      });
      const fileName = await response.text();
      if (!response.ok) {
        throw new Error(fileName || 'Failed to upload resume');
      }
      setResumePath(fileName);
      setMessage('Resume uploaded successfully!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Profile Details</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details, skills, experience, and upload your resume.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
          <div className="dashboard-sidebar-menu">
            <Link to="/seeker/dashboard" className="dashboard-menu-item">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/seeker/profile" className="dashboard-menu-item active">
              <UserIcon size={18} /> Profile Details
            </Link>
            <Link to="/seeker/applications" className="dashboard-menu-item">
              <FileText size={18} /> My Applications
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {message && (
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
              <CheckCircle size={18} /> {message}
            </div>
          )}

          {errorMsg && <ErrorComponent message={errorMsg} />}

          {loading ? (
            <Loading />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: '32px'
            }} className="seeker-profile-grid">
              
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Personal Profile</h3>

                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      className="form-input"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bio">Professional Summary (Bio)</label>
                    <textarea
                      id="bio"
                      className="form-input"
                      rows={4}
                      placeholder="Briefly introduce yourself, your goals, and interests..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="skills">Core Skills</label>
                    <input
                      id="skills"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Java, Spring Boot, React, Git (comma-separated)"
                      value={skills}
                      onChange={e => setSkills(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="experience">Work Experience</label>
                    <textarea
                      id="experience"
                      className="form-input"
                      rows={5}
                      placeholder="Describe your previous work experience details..."
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label className="form-label" htmlFor="education">Education</label>
                    <textarea
                      id="education"
                      className="form-input"
                      rows={4}
                      placeholder="Describe your academic qualifications details..."
                      value={education}
                      onChange={e => setEducation(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={saveLoading} style={{ padding: '12px 28px' }}>
                    {saveLoading ? 'Saving...' : 'Save Profile Changes'} <Save size={16} />
                  </button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Resume Attachment</h3>
                  
                  {resumePath ? (
                    <div style={{ marginBottom: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <FileText size={40} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
                      <p style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '12px' }}>Resume Active</p>
                      <a href={`http://localhost:8080/api/files/${resumePath}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', width: '100%' }}>
                        <FileDown size={14} /> Download Resume
                      </a>
                    </div>
                  ) : (
                    <div style={{ padding: '24px 16px', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', color: 'var(--text-muted)' }}>
                      <FileText size={32} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '13px' }}>No resume uploaded yet. Recruiter applications require a resume.</p>
                    </div>
                  )}

                  <div>
                    <label className="btn btn-primary" style={{ width: '100%', padding: '10px 0', fontSize: '14px', cursor: 'pointer' }}>
                      {uploadLoading ? 'Uploading...' : 'Upload New PDF'} <Upload size={14} />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                        disabled={uploadLoading}
                      />
                    </label>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>Supports PDF, DOC, DOCX up to 5MB</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .seeker-profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SeekerProfile;
