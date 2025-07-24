import { validatePassword } from '../passwordValidator';

describe('Password Validator', () => {
  describe('Length validation', () => {
    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject passwords longer than 64 characters', () => {
      const longPassword = 'a'.repeat(65);
      const result = validatePassword(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must not exceed 64 characters');
    });

    it('should accept passwords with valid length', () => {
      const result = validatePassword('ValidPass123!');
      expect(result.errors).not.toContain('Password must be at least 8 characters long');
      expect(result.errors).not.toContain('Password must not exceed 64 characters');
    });
  });

  describe('Character type validation', () => {
    it('should reject passwords with less than 3 character types', () => {
      const result = validatePassword('lowercase');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters');
    });

    it('should accept passwords with 3 character types (lowercase, uppercase, numbers)', () => {
      const result = validatePassword('ValidPass123');
      expect(result.errors).not.toContain('Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters');
    });

    it('should accept passwords with 3 character types (lowercase, uppercase, special)', () => {
      const result = validatePassword('ValidPass!@#');
      expect(result.errors).not.toContain('Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters');
    });

    it('should accept passwords with all 4 character types', () => {
      const result = validatePassword('ValidPass123!');
      expect(result.errors).not.toContain('Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters');
    });
  });

  describe('Common password validation', () => {
    it('should reject common passwords', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is too common and has been found in data breaches');
    });

    it('should accept non-common passwords', () => {
      const result = validatePassword('MyUniqueP@ss123');
      expect(result.errors).not.toContain('Password is too common and has been found in data breaches');
    });
  });

  describe('Repeated character validation', () => {
    it('should reject passwords with more than 2 consecutive repeated characters', () => {
      const result = validatePassword('ValidPassss123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password cannot contain the same character repeated more than 2 times consecutively');
    });

    it('should accept passwords with 2 or fewer consecutive repeated characters', () => {
      const result = validatePassword('ValidPass123!');
      expect(result.errors).not.toContain('Password cannot contain the same character repeated more than 2 times consecutively');
    });
  });

  describe('Dictionary word validation', () => {
    it('should reject passwords containing common words', () => {
      const result = validatePassword('MyPassword123!');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((error: string) => error.includes('Password cannot contain common words'))).toBe(true);
    });

    it('should accept passwords without common words', () => {
      const result = validatePassword('MySecureP@ss123');
      expect(result.errors).not.toContain('Password cannot contain common words like "password"');
    });
  });

  describe('Valid password scenarios', () => {
    const validPasswords = [
      'MySecureP@ss123',
      'StrongP@ssw0rd',
      'ComplexPassw0rd!',
      'Secure123!@#',
      'Valid8Password!'
    ];

    validPasswords.forEach(password => {
      it(`should accept valid password: ${password}`, () => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Invalid password scenarios', () => {
    const invalidPasswords = [
      { password: 'short', expectedErrorCount: 2 }, // too short, not enough character types
      { password: 'password123', expectedErrorCount: 2 }, // common password, common word
      { password: 'ALLUPPERCASE123!', expectedErrorCount: 1 }, // missing lowercase
      { password: 'alllowercase123!', expectedErrorCount: 1 }, // missing uppercase
      { password: 'NoNumbers!@#', expectedErrorCount: 1 }, // missing numbers
      { password: 'NoSpecialChars123', expectedErrorCount: 1 }, // missing special chars
      { password: 'ValidPasssss123!', expectedErrorCount: 1 }, // repeated characters
    ];

    invalidPasswords.forEach(({ password, expectedErrorCount }) => {
      it(`should reject invalid password: ${password}`, () => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(expectedErrorCount);
      });
    });
  });
});
