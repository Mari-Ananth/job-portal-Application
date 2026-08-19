import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, TrendingUp, Users, Building } from 'lucide-react';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/jobs')
      .then(res => res.json())
      .then(data => {
        setRecentJobs(data.slice(0, 3));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = [];
    if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    navigate(`/jobs${queryString}`);
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '40px' }}>
      <section style={{
        textAlign: 'center',
        padding: '80px 0 60px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', maxWidth: '800px' }}>
          Find Your Dream Job <br /><span className="title-gradient">Elevate Your Career</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', marginBottom: '40px' }}>
          Explore thousands of jobs, connect with top companies, and take the next step in your professional journey.
        </p>

        <form onSubmit={handleSearch} className="glass-panel" style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '850px',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          gap: '12px'
        }}>
          <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <Search size={20} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Job title, keywords, skills..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '15px' }}
            />
          </div>
          <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <MapPin size={20} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="City, state, or remote..."
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '15px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto', padding: '14px 28px' }}>
            Search Jobs
          </button>
        </form>
      </section>

      <section style={{ margin: '40px 0 80px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={36} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '32px', fontWeight: 800 }}>12,000+</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Active Job Postings</p>
          </div>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Building size={36} style={{ color: 'var(--success-color)', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '32px', fontWeight: 800 }}>850+</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Verified Employers</p>
          </div>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Users size={36} style={{ color: 'var(--info-color)', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '32px', fontWeight: 800 }}>25,000+</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Registered Job Seekers</p>
          </div>
        </div>
      </section>

      <section style={{ margin: '60px 0 40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '30px', fontWeight: 700 }}>Featured Job Openings</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>Hand-picked opportunities from leading tech companies.</p>
          </div>
          <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color)', fontWeight: 600, fontSize: '15px' }}>
            See All Jobs <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : recentJobs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {recentJobs.map(job => (
              <div key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No recent job openings available. Check back soon!
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
