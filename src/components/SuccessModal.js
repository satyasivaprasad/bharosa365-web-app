import React from 'react';

const SuccessModal = ({ isVisible, onClose, userData }) => {
  if (!isVisible) return null;

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
          <p>
            You can now access your dashboard and start exploring our services.
          </p>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={onClose}
          style={{ width: '100%' }}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;