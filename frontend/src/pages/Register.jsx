import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Key, User as UserIcon, Building, MapPin } from 'lucide-react';
import ErrorComponent from '../components/Error';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('JOB_SEEKER');
  
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const payload = {
      email,
      password,
      fullName,
      role
    };

    if (role === 'EMPLOYER') {
      payload.companyName = companyName;
      payload.location = companyLocation;
    }

    try {
      const user = await register(payload);
      if (user.role === 'JOB_SEEKER') navigate('/seeker/dashboard');
      else if (user.role === 'EMPLOYER') navigate('/employer/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - var(--nav-height) - 150px)',
      marginTop: '40px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '40px',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Join CareersHub today and elevate your career</p>
        </div>

        {errorMsg && <ErrorComponent message={errorMsg} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Register As</label>
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <button
                type="button"
                onClick={() => setRole('JOB_SEEKER')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: role === 'JOB_SEEKER' ? 'var(--accent-color)' : 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('EMPLOYER')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: role === 'EMPLOYER' ? 'var(--accent-color)' : 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Employer
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: role === 'EMPLOYER' ? '20px' : '28px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          {role === 'EMPLOYER' && (
            <div className="animate-fade-in" style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              marginBottom: '28px'
            }}>
              <h4 style={{ fontSize: '15px', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '16px' }}>Company Information</h4>
              <div className="form-group">
                <label className="form-label" htmlFor="companyName">Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="companyName"
                    type="text"
                    className="form-input"
                    placeholder="Tech Solutions Inc"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    required={role === 'EMPLOYER'}
                    style={{ paddingLeft: '48px' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="companyLocation">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="companyLocation"
                    type="text"
                    className="form-input"
                    placeholder="New York, NY"
                    value={companyLocation}
                    onChange={e => setCompanyLocation(e.target.value)}
                    required={role === 'EMPLOYER'}
                    style={{ paddingLeft: '48px' }}
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'} <UserPlus size={16} />
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
