import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/recipes');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-dark-text">Create Account</h2>
          <p className="mt-2 text-dark-text-muted">
            Sign up to start saving your favorite recipes
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border-l-4 border-red-600 text-dark-text rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-dark-text font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 rounded bg-dark-surface border border-dark-border text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-dark-primary"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-dark-text font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded bg-dark-surface border border-dark-border text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-dark-primary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-dark-text font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded bg-dark-surface border border-dark-border text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-dark-primary"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-dark-text font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 rounded bg-dark-surface border border-dark-border text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-dark-primary"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-dark-primary text-dark-text rounded hover:bg-opacity-80 transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="text-center">
            <p className="text-dark-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-dark-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 