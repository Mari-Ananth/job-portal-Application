import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, DollarSign, SlidersHorizontal, Briefcase } from 'lucide-react';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const Jobs = () => {
  const routerLocation = useLocation();
  
  const getParam = (name) => {
    const params = new URLSearchParams(routerLocation.search);
    return params.get(name) || '';
  };

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState(getParam('keyword'));
  const [location, setLocation] = useState(getParam('location'));
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [minSalary, setMinSalary] = useState('');

  const fetchJobs = () => {
    setLoading(true);
    const queryParams = [];
    if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    if (jobType) queryParams.push(`jobType=${encodeURIComponent(jobType)}`);
    if (experienceLevel) queryParams.push(`experienceLevel=${encodeURIComponent(experienceLevel)}`);
    if (minSalary) queryParams.push(`minSalary=${encodeURIComponent(minSalary)}`);

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    fetch(`http://localhost:8080/api/jobs${queryString}`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [routerLocation.search]);

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setMinSalary('');
    
    setLoading(true);
    fetch('http://localhost:8080/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 700 }}>Find Your Next Opportunity</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Browse listed jobs or refine your search with our dynamic filters.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '32px'
      }} className="jobs-layout-grid">
        
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <SlidersHorizontal size={18} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Filter Options</h3>
          </div>

          <form onSubmit={handleFilterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Keyword Search</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Job title or skills..."
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="City or Remote..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Job Type</label>
              <select
                className="form-input form-select"
                value={jobType}
                onChange={e => setJobType(e.target.value)}
                style={{ fontSize: '14px' }}
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Experience Level</label>
              <select
                className="form-input form-select"
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                style={{ fontSize: '14px' }}
              >
                <option value="">All Levels</option>
                <option value="ENTRY_LEVEL">Entry Level</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR">Senior Level</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Min Annual Salary ($)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 60000"
                  value={minSalary}
                  onChange={e => setMinSalary(e.target.value)}
                  style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px 0', fontSize: '14px' }}>
                Apply Filters
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ width: '100%', padding: '10px 0', fontSize: '14px' }}>
                Reset All
              </button>
            </div>
          </form>
        </div>

        <div>
          {loading ? (
            <Loading />
          ) : jobs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {jobs.map(job => (
                <div key={job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '64px 24px', textAlign: 'center' }}>
              <Briefcase size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No Jobs Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                We couldn't find any jobs matching your search parameters. Try adjusting your filters or search keywords.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .jobs-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Jobs;
