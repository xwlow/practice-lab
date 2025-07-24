import { commonPasswords } from './commonPasswords';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // OWASP Level 1: Password Requirements
  
  // 1. Minimum length of 8 characters
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // 2. Maximum length of 64 characters (to prevent DoS attacks)
  if (password.length > 64) {
    errors.push("Password must not exceed 64 characters");
  }

  // 3. Must contain at least 3 of the following 4 character types:
  // - Lowercase letters
  // - Uppercase letters
  // - Numbers
  // - Special characters
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);

  const characterTypeCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars]
    .filter(Boolean).length;

  if (characterTypeCount < 3) {
    errors.push("Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters");
  }

  // 4. Check against common passwords list
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common and has been found in data breaches");
  }

  // 5. No repeated characters more than 2 times consecutively
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password cannot contain the same character repeated more than 2 times consecutively");
  }

  // 6. No dictionary words (basic check for common English words)
  const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'test', 'guest'];
  const lowerPassword = password.toLowerCase();
  for (const word of commonWords) {
    if (lowerPassword.includes(word)) {
      errors.push(`Password cannot contain common words like "${word}"`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
