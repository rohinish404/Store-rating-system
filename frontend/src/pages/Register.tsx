import React, { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators';
import { ROUTES } from '../constants/routes';
import { getRedirectPathByRole } from '../utils/navigation';
import Input from '../components/Input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated and on register page, redirect based on role
  if (isAuthenticated && user && location.pathname === ROUTES.REGISTER) {
    return <Navigate to={getRedirectPathByRole(user.role)} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validations = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      address: validateAddress(formData.address),
    };

    const newErrors: Record<string, string> = {};
    Object.entries(validations).forEach(([key, validation]) => {
      if (!validation.isValid && validation.error) {
        newErrors[key] = validation.error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await authApi.register(formData);
      login(response.access_token, response.user);
      navigate(ROUTES.USER.STORES);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <Card className="max-w-[500px] w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
          {apiError && (
            <div className="px-4 py-3 rounded-md mb-4 font-medium bg-red-100 text-red-900 border border-red-300">
              {apiError}
            </div>
          )}

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Minimum 20 characters, maximum 60"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="8-16 chars, 1 uppercase, 1 special character"
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
            multiline
            rows={3}
            placeholder="Maximum 400 characters"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <div className="text-center mt-6 pt-6 border-t border-slate-200">
            <p>
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-blue-600 no-underline font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
