export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.length < 20) {
    return { isValid: false, error: 'Name must be at least 20 characters' };
  }
  if (name.length > 60) {
    return { isValid: false, error: 'Name must not exceed 60 characters' };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim().length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  if (password.length > 16) {
    return { isValid: false, error: 'Password must not exceed 16 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  return { isValid: true };
};

export const validateAddress = (address: string): ValidationResult => {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Address is required' };
  }
  if (address.length > 400) {
    return { isValid: false, error: 'Address must not exceed 400 characters' };
  }
  return { isValid: true };
};

export const validateRating = (rating: number): ValidationResult => {
  if (!rating || rating < 1 || rating > 5) {
    return { isValid: false, error: 'Rating must be between 1 and 5' };
  }
  return { isValid: true };
};
