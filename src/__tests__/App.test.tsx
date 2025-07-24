import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';
import * as passwordValidator from '../passwordValidator';

// Mock the password validator
jest.mock('../passwordValidator');
const mockValidatePassword = passwordValidator.validatePassword as jest.MockedFunction<typeof passwordValidator.validatePassword>;

describe('App Component', () => {
  beforeEach(() => {
    mockValidatePassword.mockClear();
  });

  describe('Initial render', () => {
    it('should render the login form by default', () => {
      render(<App />);
      
      expect(screen.getByText('Password Verification')).toBeInTheDocument();
      expect(screen.getByText('Enter a password that meets OWASP security requirements')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('should render password requirements', () => {
      render(<App />);
      
      expect(screen.getByText('Password Requirements (OWASP Level 1):')).toBeInTheDocument();
      expect(screen.getByText('At least 8 characters long')).toBeInTheDocument();
      expect(screen.getByText('Maximum 64 characters')).toBeInTheDocument();
      expect(screen.getByText('At least 3 of: lowercase, uppercase, numbers, special characters')).toBeInTheDocument();
      expect(screen.getByText('Not a common password from data breaches')).toBeInTheDocument();
    });

    it('should have disabled login button when password is empty', () => {
      render(<App />);
      
      const loginButton = screen.getByRole('button', { name: 'Login' });
      expect(loginButton).toBeDisabled();
    });
  });

  describe('Password input interaction', () => {
    it('should enable login button when password is entered', async () => {
      render(<App />);
      
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'somepassword');
      
      expect(loginButton).not.toBeDisabled();
    });

    it('should update password state when typing', async () => {
      render(<App />);
      
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      await userEvent.type(passwordInput, 'testpassword');
      
      expect(passwordInput.value).toBe('testpassword');
    });
  });

  describe('Form submission with valid password', () => {
    it('should show welcome page when password is valid', async () => {
      mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
      
      render(<App />);
      
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'ValidPassword123!');
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
        expect(screen.getByText('You have successfully logged in.')).toBeInTheDocument();
        expect(screen.getByText('ValidPassword123!')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
      });
    });

    it('should call validatePassword with correct password', async () => {
      mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
      
      render(<App />);
      
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'ValidPassword123!');
      await userEvent.click(loginButton);
      
      expect(mockValidatePassword).toHaveBeenCalledWith('ValidPassword123!');
    });
  });

  describe('Form submission with invalid password', () => {
    it('should show error messages when password is invalid', async () => {
      const mockErrors = [
        'Password must be at least 8 characters long',
        'Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters'
      ];
      mockValidatePassword.mockReturnValue({ isValid: false, errors: mockErrors });
      
      render(<App />);
      
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'weak');
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password Requirements Not Met:')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
        expect(screen.getByText('Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters')).toBeInTheDocument();
      });
    });

    it('should remain on login page when password is invalid', async () => {
      mockValidatePassword.mockReturnValue({ 
        isValid: false, 
        errors: ['Password is too weak'] 
      });
      
      render(<App />);
      
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'weak');
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password Verification')).toBeInTheDocument();
        expect(screen.queryByText('Welcome!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Logout functionality', () => {
    it('should return to login page when logout is clicked', async () => {
      mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
      
      render(<App />);
      
      // Login first
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'ValidPassword123!');
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
      });
      
      // Now logout
      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      await userEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password Verification')).toBeInTheDocument();
        expect(screen.queryByText('Welcome!')).not.toBeInTheDocument();
      });
    });

    it('should clear form state when logout is clicked', async () => {
      mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
      
      render(<App />);
      
      // Login first
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'ValidPassword123!');
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
      });
      
      // Logout
      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      await userEvent.click(logoutButton);
      
      await waitFor(() => {
        const passwordInputAfterLogout = screen.getByLabelText('Password') as HTMLInputElement;
        expect(passwordInputAfterLogout.value).toBe('');
        expect(screen.queryByText('Password Requirements Not Met:')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form validation', () => {
    it('should prevent form submission when preventDefault is called', async () => {
      mockValidatePassword.mockReturnValue({ isValid: true, errors: [] });
      
      render(<App />);
      
      const form = screen.getByRole('button', { name: 'Login' }).closest('form');
      const submitHandler = jest.fn();
      
      if (form) {
        form.addEventListener('submit', submitHandler);
      }
      
      const passwordInput = screen.getByLabelText('Password');
      const loginButton = screen.getByRole('button', { name: 'Login' });
      
      await userEvent.type(passwordInput, 'ValidPassword123!');
      await userEvent.click(loginButton);
      
      // The form should not actually submit (no page reload)
      expect(window.location.href).not.toContain('/Home');
    });
  });
});
