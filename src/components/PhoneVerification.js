import React, { useState, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';

const PhoneVerification = ({ onVerificationSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef();

  const setupRecaptcha = () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          'size': 'invisible',
          'callback': (response) => {
            console.log('reCAPTCHA solved');
          }
        }
      );
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = `+91${phoneNumber}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmationResult);
      setOtpSent(true);
      setError('');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log('User signed in:', user);
      onVerificationSuccess(user, `+91${phoneNumber}`);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    setOtpSent(false);
    setOtp('');
    await sendOTP({ preventDefault: () => {} });
  };

  return (
    <div className="signup-card">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Please wait...</p>
        </div>
      )}
      
      <div className="card-header">
        <div className="logo">
          <img src="/splash.png" alt="bharosa365 Logo" />
        </div>
        <div className="brand-name">Bharosa365</div>
        <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: '1.5rem', opacity: '0.95' }}>
          Smart, Private & Trusted Fraud Alerts. Protect yourself with bharosa365's scam protection app!
        </p>
        <h2>Phone Verification</h2>
        <p>Enter your mobile number to get started</p>
      </div>

      <div className="signup-form">
        {!otpSent ? (
          <form onSubmit={sendOTP}>
            <div className="form-section">
              <div className="section-title">
                <span className="section-icon">📱</span>
                <span>Mobile Number</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Enter mobile number</label>
                <div className="phone-input-container">
                  <select value="+91" disabled>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>
                {error && <div style={{ color: '#f44336', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</div>}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || !phoneNumber}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <div className="form-section">
              <div className="section-title">
                <span className="section-icon">🔐</span>
                <span>Verify OTP</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                  OTP sent to +91{phoneNumber}
                </p>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem' }}
                  required
                />
                {error && <div style={{ color: '#f44336', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</div>}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || !otp}>
              Verify OTP
            </button>
            
            <button type="button" className="btn-secondary" onClick={resendOTP} style={{ marginTop: '1rem', width: '100%' }}>
              Resend OTP
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneVerification;