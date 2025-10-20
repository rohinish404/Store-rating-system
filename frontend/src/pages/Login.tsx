import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { validateEmail, validatePassword } from '../utils/validators';
import { ROUTES } from '../constants/routes';
import Input from '../components/Input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newErrors: { email?: string; password?: string } = {};
    if (!emailValidation.isValid) newErrors.email = emailValidation.error;
    if (!passwordValidation.isValid)
      newErrors.password = passwordValidation.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      // Validate response structure
      if (!response || !response.user || !response.user.role) {
        throw new Error('Invalid response from server');
      }

      // Set auth state - PublicOnlyRoute will handle the redirect
      login(response.access_token, response.user);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <Card className="max-w-[500px] w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
          {apiError && (
            <div className="px-4 py-3 rounded-md mb-4 font-medium bg-red-100 text-red-900 border border-red-300">
              {apiError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center mt-6 pt-6 border-t border-slate-200">
            <p>
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-blue-600 no-underline font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
