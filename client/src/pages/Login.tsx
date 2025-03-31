import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, Label, Input, Button } from '../components/ui';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/recipes');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
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
    <div className="min-h-screen bg-dark-background">
      <div className="main-content">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-dark-text">Welcome Back</h2>
              <p className="mt-2 text-dark-text-muted">
                Please sign in to your account
              </p>
            </div>

            {error && (
              <div className="p-4 mb-8 bg-red-900/50 border-l-4 border-red-600 text-dark-text rounded-lg">
                {error}
              </div>
            )}

            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-dark-text">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-dark-surface border-dark-border text-dark-text"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-dark-text">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-dark-surface border-dark-border text-dark-text"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-dark-primary text-dark-text hover:bg-dark-primary/80"
                  >
                    Sign In
                  </Button>

                  <div className="text-center">
                    <p className="text-dark-text-muted">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-dark-primary hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
