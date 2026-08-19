import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building, PlusCircle, Save, Upload, CheckCircle, Image } from 'lucide-react';
import Loading from '../../components/Loading';
import ErrorComponent from '../../components/Error';

const EmployerProfile = () => {
  const { user, fetchWithAuth } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [logoPath, setLogoPath] = useState('');
  const [fullName, setFullName] = useState('');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchWithAuth('http://localhost:8080/api/employer/profile')
      .then(res => res.json())
      .then(profile => {
        setCompanyName(profile.companyName || '');
        setDescription(profile.description || '');
        setWebsite(profile.website || '');
        setLocation(profile.location || '');
        setLogoPath(profile.logoPath || '');
        setFullName(profile.fullName || '');
      })
      .catch(err => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');
    setErrorMsg('');
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/employer/profile', {
        method: 'PUT',
        body: JSON.stringify({
          companyName,
          description,
          website,
          location,
          fullName,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      setMessage('Company profile updated successfully!');
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.fullName = fullName;
      localStorage.setItem('user', JSON.stringify(storedUser));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Logo file size must be less than 2MB.');
      return;
    }

    setUploadLoading(true);
    setMessage('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetchWithAuth('http://localhost:8080/api/employer/logo', {
        method: 'POST',
        body: formData,
      });
      const fileName = await response.text();
      if (!response.ok) {
        throw new Error(fileName || 'Failed to upload logo');
      }
      setLogoPath(fileName);
      setMessage('Logo uploaded successfully!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Company Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your company profile details, contact information, and logo branding.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '20px', height: 'fit-content' }}>
          <div className="dashboard-sidebar-menu">
            <Link to="/employer/dashboard" className="dashboard-menu-item">
              <Building size={18} /> Dashboard
            </Link>
            <Link to="/employer/profile" className="dashboard-menu-item active">
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
              gridTemplateColumns: '1fr 300px',
              gap: '32px'
            }} className="employer-profile-grid">
              
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Company Information</h3>

                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="companyName">Company Name</label>
                    <input
                      id="companyName"
                      type="text"
                      className="form-input"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Primary Contact Person</label>
                    <input
                      id="fullName"
                      type="text"
                      className="form-input"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-mobile">
                    <div className="form-group">
                      <label className="form-label" htmlFor="location">Company Location</label>
                      <input
                        id="location"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Chicago, IL"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="website">Website Link</label>
                      <input
                        id="website"
                        type="url"
                        className="form-input"
                        placeholder="https://example.com"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label className="form-label" htmlFor="description">About the Company</label>
                    <textarea
                      id="description"
                      className="form-input"
                      rows={5}
                      placeholder="Detail company details, values, tech stacks, domains..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={saveLoading} style={{ padding: '12px 28px' }}>
                    {saveLoading ? 'Saving...' : 'Save Profile Changes'} <Save size={16} />
                  </button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', textAlign: 'left' }}>Company Logo</h3>
                  
                  {logoPath ? (
                    <div style={{ marginBottom: '20px' }}>
                      <img src={`http://localhost:8080/api/files/${logoPath}`} alt="Logo" style={{
                        maxWidth: '120px',
                        maxHeight: '120px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'contain',
                        border: '1px solid var(--border-color)',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.02)'
                      }} />
                    </div>
                  ) : (
                    <div style={{ padding: '32px 16px', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', color: 'var(--text-muted)' }}>
                      <Image size={36} style={{ margin: '0 auto 8px auto' }} />
                      <p style={{ fontSize: '12px' }}>No logo uploaded. Standard company branding helps candidate trust.</p>
                    </div>
                  )}

                  <label className="btn btn-primary" style={{ width: '100%', padding: '10px 0', fontSize: '14px', cursor: 'pointer' }}>
                    {uploadLoading ? 'Uploading...' : 'Upload Logo'} <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                      disabled={uploadLoading}
                    />
                  </label>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Supports PNG, JPG, JPEG up to 2MB</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .employer-profile-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row-mobile {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployerProfile;
