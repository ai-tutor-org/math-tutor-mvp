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
          padding: 'clamp(15px, 3vh, 40px) clamp(20px, 4vw, 30px)',
          width: 'clamp(280px, 85vw, 400px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: 'clamp(10px, 2vh, 20px)' }}>🎉</div>
          <h2 style={{ 
            color: '#333', 
            marginBottom: 'clamp(8px, 1.5vh, 15px)',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: 'bold'
          }}>
            The Real Fun is on a Bigger Screen!
          </h2>
          <p style={{ 
            color: '#666', 
            lineHeight: '1.5',
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            margin: '0 0 clamp(8px, 1.5vh, 15px) 0'
          }}>
            This awesome interactive math adventure is designed for laptops and desktops where you can really spread out and explore!
          </p>
          <p style={{ 
            color: '#666', 
            lineHeight: '1.5',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            margin: '0 0 clamp(15px, 3vh, 25px) 0',
            fontStyle: 'italic'
          }}>
            Grab your laptop and let's dive into some mathematical fun! 🚀
          </p>
          <button 
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: 'clamp(8px, 2vh, 12px) clamp(16px, 4vw, 24px)',
              fontSize: 'clamp(0.8rem, 2.2vw, 1rem)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Go Back
          </button>
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