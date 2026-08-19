import React from 'react';
import { AlertCircle } from 'lucide-react';

const Error = ({ message }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '24px',
      margin: '20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      borderLeft: '4px solid var(--error-color)',
      background: 'var(--error-bg)'
    }}>
      <AlertCircle size={24} style={{ color: 'var(--error-color)', flexShrink: 0 }} />
      <div>
        <h4 style={{ color: 'var(--error-color)', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Error Encountered</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{message || 'An unexpected error occurred. Please try again later.'}</p>
      </div>
    </div>
  );
};

export default Error;
