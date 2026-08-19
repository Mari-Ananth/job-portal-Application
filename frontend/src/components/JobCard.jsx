import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    return '$' + salary.toLocaleString();
  };

  return (
    <div className="glass-panel glass-panel-hover animate-fade-in" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {job.title}
            </h3>
            <p style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: 500 }}>
              {job.companyName || 'Confidential Company'}
            </p>
          </div>
          <span className="badge badge-accent">{job.jobType}</span>
        </div>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          display: '-webkit-box',
          WebkitLineBreak: 'auto',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: '20px'
        }}>
          {job.description}
        </p>
      </div>

      <div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={14} />
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={14} />
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Calendar size={12} />
            <span>Posted: {formatDate(job.createdAt)}</span>
          </div>
          <Link to={`/jobs/${job.id}`} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px', borderRadius: 'var(--radius-sm)' }}>
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
