import React, { useState } from 'react';
import './App.css';
import { validatePassword } from './passwordValidator';
import { WelcomePage } from './Home/page';

function App() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [validatedPassword, setValidatedPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password according to OWASP guidelines
    const validation = validatePassword(password);
    
    if (validation.isValid) {
      // Password is valid, proceed to welcome page
      setValidatedPassword(password);
      setIsLoggedIn(true);
      setErrors([]);
    } else {
      // Password is invalid, show errors and remain on home page
      setErrors(validation.errors);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setValidatedPassword('');
    setErrors([]);
  };

  // If logged in, show welcome page
  if (isLoggedIn) {
    //window.location.href = '/Home'; // Redirect to welcome page
    return <WelcomePage password={validatedPassword} onLogout={handleLogout} />;

  }

  // Otherwise, show login form
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Password Verification</h1>
          <p>Enter a password that meets OWASP security requirements</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Display validation errors */}
          {errors.length > 0 && (
            <div className="error-messages">
              <h4>Password Requirements Not Met:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={password.length === 0}
            className={`login-button ${password.length === 0 ? 'disabled' : ''}`}
          >
            Login
          </button>
        </form>

        {/* Password requirements info */}
        <div className="requirements-info">
          <h4>Password Requirements (OWASP Level 1):</h4>
          <ul>
            <li>At least 8 characters long</li>
            <li>Maximum 64 characters</li>
            <li>At least 3 of: lowercase, uppercase, numbers, special characters</li>
            <li>Not a common password from data breaches</li>
            <li>No repeated characters more than 2 times consecutively</li>
            <li>No common dictionary words</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
