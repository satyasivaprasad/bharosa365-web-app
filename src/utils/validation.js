// Validation utilities for the signup form

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  
  if (!phoneNumber) {
    return 'Phone number is required';
  }
  
  if (phoneNumber.length !== 10) {
    return 'Phone number must be 10 digits';
  }
  
  if (!phoneRegex.test(phoneNumber)) {
    return 'Please enter a valid Indian mobile number';
  }
  
  return null;
};

export const validateOTP = (otp) => {
  if (!otp) {
    return 'OTP is required';
  }
  
  if (otp.length !== 6) {
    return 'OTP must be 6 digits';
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return 'OTP must contain only numbers';
  }
  
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return 'Email is required';
  }
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validateName = (name, fieldName) => {
  if (!name || !name.trim()) {
    return `${fieldName} is required`;
  }
  
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  
  if (name.trim().length > 50) {
    return `${fieldName} must not exceed 50 characters`;
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return `${fieldName} must contain only letters and spaces`;
  }
  
  return null;
};

export const validateAddress = (address, fieldName) => {
  if (!address || !address.trim()) {
    return `${fieldName} is required`;
  }
  
  if (address.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  
  if (address.trim().length > 100) {
    return `${fieldName} must not exceed 100 characters`;
  }
  
  return null;
};

export const validateCompanyName = (companyName) => {
  if (!companyName || !companyName.trim()) {
    return 'Company name is required';
  }
  
  if (companyName.trim().length < 2) {
    return 'Company name must be at least 2 characters long';
  }
  
  if (companyName.trim().length > 100) {
    return 'Company name must not exceed 100 characters';
  }
  
  return null;
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate first name
  const firstNameError = validateName(formData.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;
  
  // Validate last name
  const lastNameError = validateName(formData.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;
  
  // Validate email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  // Validate address fields
  const villageError = validateAddress(formData.address?.village, 'Village');
  if (villageError) errors.village = villageError;
  
  const mandalError = validateAddress(formData.address?.mandal, 'Mandal');
  if (mandalError) errors.mandal = mandalError;
  
  const cityError = validateAddress(formData.address?.city, 'City');
  if (cityError) errors.city = cityError;
  
  if (!formData.address?.state) {
    errors.state = 'State is required';
  }
  
  // Validate company name
  const companyError = validateCompanyName(formData.companyName);
  if (companyError) errors.companyName = companyError;
  
  // Validate terms acceptance
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'Please accept the terms and conditions';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};