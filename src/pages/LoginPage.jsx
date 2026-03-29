import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';
import { register, emailLogin, googleLogin } from '../services/authService.js';
import '../styles/login.css';

const features = [
  { icon: '</>', title: 'Code Translation', desc: 'Translate between 10+ languages' },
  { icon: 'Cx', title: 'Complexity Analysis', desc: 'Time & space complexity breakdown' },
  { icon: '#', title: 'AI Optimization', desc: 'Smart code suggestions' },
  { icon: '?', title: 'Code Explanation', desc: 'Understand code in plain English' },
];

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) return toast.error('Please fill in all fields.');
    if (isSignUp && !name) return toast.error('Please enter your name.');
    if (password.length < 6) return toast.error('Password must be at least 6 characters.');

    setLoading(true);
    try {
      const result = isSignUp
        ? await register(name, email, password)
        : await emailLogin(email, password);
      login(result.token, result.user);
      toast.success(isSignUp ? `Welcome, ${result.user.name}!` : `Welcome back, ${result.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      login(result.token, result.user);
      toast.success(`Welcome, ${result.user.name}!`);
      navigate('/');
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* Left */}
      <div className="login-left">
        <div>
          <div className="login-logo">
            <div className="login-logo-icon">{`</>`}</div>
            <span className="login-logo-text">CodeTranslator</span>
          </div>

          <h1 className="login-hero-title">Translate, Analyze &amp; Optimize Your Code</h1>
          <p className="login-hero-subtitle">
            AI-powered code assistant that helps you work across programming languages effortlessly.
          </p>

          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature-card">
                <div className="login-feature-icon">{f.icon}</div>
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-footer">Powered by AI. Built for developers.</div>
        </div>
      </div>

      {/* Right */}
      <div className="login-right">
        <div className="login-form">
          <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <p className="login-form-subtitle">
            {isSignUp ? 'Create your account to get started' : 'Enter your credentials to continue'}
          </p>

          <form className="login-email-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                className="login-input"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              className="login-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <p className="login-toggle">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => { setIsSignUp(!isSignUp); setName(''); setEmail(''); setPassword(''); }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="login-google-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google login failed.')}
              theme="outline"
              shape="rectangular"
              size="large"
              text="continue_with"
              width="300"
            />
          </div>

          <p className="login-terms">
            By continuing you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
