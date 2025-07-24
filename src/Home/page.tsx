interface WelcomePageProps {
  password: string;
  onLogout: () => void;
}

export function WelcomePage({ password, onLogout }: WelcomePageProps) {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome!</h1>
        <p>You have successfully logged in.</p>
        <div className="password-display">
          <strong>Your password was:</strong>
          <div className="password-box">{password}</div>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}