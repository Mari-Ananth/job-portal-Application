import React from 'react';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '40px 0',
      background: 'rgba(9, 13, 22, 0.95)',
      marginTop: 'auto',
      flexShrink: 0
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase style={{ color: 'var(--accent-color)' }} size={20} />
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit' }}>CareersHub</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} CareersHub. All rights reserved. Built with Java, Spring Boot & React.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
