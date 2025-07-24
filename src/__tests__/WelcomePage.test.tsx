import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WelcomePage } from '../Home/page';

describe('WelcomePage Component', () => {
  const mockOnLogout = jest.fn();
  const testPassword = 'TestPassword123!';

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  describe('Initial render', () => {
    it('should render welcome message', () => {
      render(<WelcomePage password={testPassword} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
      expect(screen.getByText('You have successfully logged in.')).toBeInTheDocument();
    });

    it('should display the password that was used to login', () => {
      render(<WelcomePage password={testPassword} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Your password was:')).toBeInTheDocument();
      expect(screen.getByText(testPassword)).toBeInTheDocument();
    });

    it('should render logout button', () => {
      render(<WelcomePage password={testPassword} onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      expect(logoutButton).toBeInTheDocument();
    });
  });

  describe('Logout functionality', () => {
    it('should call onLogout when logout button is clicked', async () => {
      render(<WelcomePage password={testPassword} onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' });
      await userEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props handling', () => {
    it('should handle different password values', () => {
      const differentPassword = 'AnotherSecureP@ss456';
      render(<WelcomePage password={differentPassword} onLogout={mockOnLogout} />);
      
      expect(screen.getByText(differentPassword)).toBeInTheDocument();
      expect(screen.queryByText(testPassword)).not.toBeInTheDocument();
    });

    it('should handle empty password', () => {
      render(<WelcomePage password="" onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Your password was:')).toBeInTheDocument();
      // The password box should still exist even if empty
      const passwordBox = screen.getByText('Your password was:').parentElement?.querySelector('.password-box');
      expect(passwordBox).toBeInTheDocument();
    });
  });
});
