import React, { useState } from 'react';

const SuccessModal = ({ isVisible, onClose, userData }) => {
  const [copied, setCopied] = useState(false);

  if (!isVisible) return null;

  const copyReferralLink = () => {
    if (userData?.referralLink) {
      navigator.clipboard.writeText(userData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="success-icon">✓</div>
          <h3>Registration Successful!</h3>
        </div>
        
        <div className="modal-body">
          <p>
            Welcome to Bharosa365, {userData?.firstName}! 
            Your account has been created successfully.
          </p>
          
          {userData?.referralLink && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: '#f0f9ff', 
              borderRadius: '10px',
              border: '2px solid #26A69A'
            }}>
              <p style={{ fontWeight: '600', color: '#004D40', marginBottom: '0.5rem' }}>
                Your Referral Link:
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                alignItems: 'center',
                background: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <input 
                  type="text" 
                  value={userData.referralLink} 
                  readOnly 
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#26A69A',
                    fontWeight: '500'
                  }}
                />
                <button 
                  onClick={copyReferralLink}
                  style={{
                    padding: '0.5rem 1rem',
                    background: copied ? '#4caf50' : '#26A69A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                Share this link to earn rewards!
              </p>
            </div>
          )}
          
          <p style={{ marginTop: '1rem' }}>
            You can now access your dashboard and start exploring our services.
          </p>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={onClose}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;