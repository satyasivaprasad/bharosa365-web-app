import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { stateCitiesMap } from '../utils/stateCitiesData';

const RegistrationForm = ({ user, phoneNumber, onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: phoneNumber || '',
    email: '',
    password: '',
    address: {
    //  village: '',
    //  mandal: '',
      city: '',
      state: ''
    },
    companyName: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      // Reset city when state changes
      if (child === 'state') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
            city: '' // Reset city when state changes
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Get cities for the selected state
  const availableCities = formData.address.state ? stateCitiesMap[formData.address.state] || [] : [];

  const validateForm = () => {
    const { firstName, lastName, email, password, address, companyName, acceptTerms } = formData;
    
    if (!firstName.trim()) return 'First name is required';
    if (!lastName.trim()) return 'Last name is required';
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Please enter a valid email';
    if (!password.trim()) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
   // if (!address.village.trim()) return 'Village is required';
   // if (!address.mandal.trim()) return 'Mandal is required';
    if (!address.city.trim()) return 'City is required';
    if (!address.state) return 'State is required';
    if (!companyName.trim()) return 'Company name is required';
    if (!acceptTerms) return 'Please accept the terms and conditions';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save user data to Firestore
      const userDoc = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        address: {
       //   village: formData.address.village.trim(),
       //   mandal: formData.address.mandal.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state
        },
        companyName: formData.companyName.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      await setDoc(doc(db, 'affiliate', user.uid), userDoc);
      
      console.log('User registered successfully');
      
      // Save data to TapAffiliate
      try {
        const tapAffiliateResponse = await fetch('https://asia-south1-weprotect-dfcd7.cloudfunctions.net/createandenrollaffiliate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: formData.firstName.trim(),
            lastname: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            programId: 'findvend-solutions',
            company: {
              name: formData.companyName.trim(),
              description: `Affiliate from ${formData.address.city.trim()}, ${formData.address.state.trim()}`
            },
            address: {
            //  address: `${formData.address.village.trim()}, ${formData.address.mandal.trim()}`,
              address: 'address',
              postal_code: '000000', // Add postal code field if needed
              city: formData.address.city.trim(),
              state: formData.address.state.trim(),
              country: {
                code: 'IN',
                name: 'India'
              }
            }
          })
        });

        const tapAffiliateData = await tapAffiliateResponse.json();
        
        if (tapAffiliateData.success) {
          console.log('TapAffiliate created successfully:', tapAffiliateData);
          // Add referral link to user document
          userDoc.referralLink = tapAffiliateData.data.referralLink;
          userDoc.affiliateId = tapAffiliateData.data.affiliateId;
          
          // Update Firestore with referral link
          await setDoc(doc(db, 'affiliate', user.uid), userDoc);
        } else {
          console.error('TapAffiliate creation failed:', tapAffiliateData);
        }
      } catch (tapError) {
        console.error('Error creating TapAffiliate:', tapError);
        // Continue even if TapAffiliate fails
      }
      
      onRegistrationComplete(userDoc);
      
    } catch (error) {
      console.error('Error saving user data:', error);
      setError('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }

    //save the data to tapaffiliate also

  };

  return (
    <div className="signup-card">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Completing registration...</p>
        </div>
      )}
      
      <div className="card-header">
       <div className="logo">
          <img src="/splash.png" alt="bharosa365 Logo" />
        </div>
        <div className="brand-name">Bharosa365</div>
       
        <h2>Complete Registration</h2>
        <p>Fill in your details to get started</p>
      </div>

      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">👤</span>
              Personal Information
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span style={{ color: '#f50606' }}>*</span></label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name <span style={{ color: '#f50606' }}>*</span></label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  disabled
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address <span style={{ color: '#f50606' }}>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password <span style={{ color: '#f50606' }}>*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password (min 6 characters)"
                  required
                  minLength="6"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">📍</span>
              Address Details
            </div>
            
            <div className="form-grid">
             {/*  <div className="form-group">
                <label htmlFor="village">Village <span style={{ color: '#f50606' }}>*</span></label>
                <input
                  type="text"
                  id="village"
                  name="address.village"
                  value={formData.address.village}
                  onChange={handleInputChange}
                  placeholder="Enter your village"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="mandal">Mandal <span style={{ color: '#f50606' }}>*</span></label>
                <input
                  type="text"
                  id="mandal"
                  name="address.mandal"
                  value={formData.address.mandal}
                  onChange={handleInputChange}
                  placeholder="Enter your mandal"
                  required
                />
              </div> */}
              
             <div className="form-group">
                <label htmlFor="state">State <span style={{ color: '#f50606' }}>*</span></label>
                <select
                  id="state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your state</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

               <div className="form-group">
                <label htmlFor="city">City <span style={{ color: '#f50606' }}>*</span></label>
                <select
                  id="city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.address.state}
                >
                  <option value="">
                    {formData.address.state ? 'Select your city' : 'Select state first'}
                  </option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
            </div>
          </div>

          {/* Company Information */}
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">🏢</span>
              Company Information
            </div>
            
            <div className="form-group">
              <label htmlFor="companyName">Company Name <span style={{ color: '#f50606' }}>*</span></label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="form-section">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="acceptTerms">
                I accept the <a href="#" className="link">Terms and Conditions</a> and <a href="#" className="link">Privacy Policy</a>
              </label>
            </div>
          </div>

          {error && (
            <div style={{ 
              color: '#f44336', 
              fontSize: '0.9rem', 
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#ffebee',
              borderRadius: '8px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;