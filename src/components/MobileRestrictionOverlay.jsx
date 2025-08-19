import React from 'react'

const MobileRestrictionOverlay = () => {
  return (
    <>
      {/* Full screen overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Message card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '40px 30px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💻</div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '15px',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Desktop Required
          </h2>
          <p style={{ 
            color: '#666', 
            lineHeight: '1.5',
            fontSize: '1rem',
            margin: '0 0 15px 0'
          }}>
            This interactive lesson is designed for desktop/laptop screens and is not optimized for mobile devices.
          </p>
          <p style={{ 
            color: '#666', 
            lineHeight: '1.5',
            fontSize: '0.9rem',
            margin: '0',
            fontStyle: 'italic'
          }}>
            Please open this on a desktop or laptop for the best learning experience.
          </p>
        </div>
      </div>
      
      {/* CSS-level enforcement for additional protection */}
      <style>{`
        @media (max-width: 768px), (max-height: 600px) {
          .lesson-content {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default MobileRestrictionOverlay