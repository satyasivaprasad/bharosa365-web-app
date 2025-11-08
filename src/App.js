import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import PhoneVerification from './components/PhoneVerification';
import RegistrationForm from './components/RegistrationForm';
import SuccessModal from './components/SuccessModal';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registrationData, setRegistrationData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // If user is already authenticated, skip to registration form
      if (user && currentStep === 1) {
        setCurrentStep(2);
        setPhoneNumber(user.phoneNumber);
      }
    });

    return () => unsubscribe();
  }, [currentStep]);

  const handleVerificationSuccess = (user, phone) => {
    setUser(user);
    setPhoneNumber(phone);
    setCurrentStep(2);
  };

  const handleRegistrationComplete = (userData) => {
    setRegistrationData(userData);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Here you can redirect to dashboard or main app
    console.log('Redirecting to dashboard...');
    // For demo purposes, we'll reset to step 1
    // In a real app, you'd navigate to the main application
    setCurrentStep(1);
    setUser(null);
    setPhoneNumber('');
    setRegistrationData(null);
    auth.signOut();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-overlay" style={{ position: 'relative', height: '200px', background: 'transparent' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content">
        {currentStep === 1 && (
          <PhoneVerification 
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
        
        {currentStep === 2 && user && (
          <RegistrationForm 
            user={user}
            phoneNumber={phoneNumber}
            onRegistrationComplete={handleRegistrationComplete}
          />
        )}
        
        <SuccessModal 
          isVisible={showSuccessModal}
          onClose={handleSuccessModalClose}
          userData={registrationData}
        />
      </div>
      
      <div className="footer">
        <p>© 2024 bharosa365 - Smart Scam Protection. All rights reserved.</p>
        <p>Secure registration with Firebase Authentication</p>
      </div>
    </div>
  );
}

export default App;
