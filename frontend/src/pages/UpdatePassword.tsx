import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { validatePassword } from '../utils/validators';
import Input from '../components/Input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const UpdatePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);

    const currentPasswordValidation = validatePassword(currentPassword);
    const newPasswordValidation = validatePassword(newPassword);

    const newErrors: Record<string, string> = {};

    if (!currentPasswordValidation.isValid && currentPasswordValidation.error) {
      newErrors.currentPassword = currentPasswordValidation.error;
    }

    if (!newPasswordValidation.isValid && newPasswordValidation.error) {
      newErrors.newPassword = newPasswordValidation.error;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await userApi.updatePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 bg-slate-50 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
          {apiError && (
            <div className="px-4 py-3 rounded-md mb-4 font-medium bg-red-100 text-red-900 border border-red-300">
              {apiError}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-md mb-4 font-medium bg-green-100 text-green-900 border border-green-300">
              Password updated successfully!
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (errors.currentPassword) {
                setErrors((prev) => ({ ...prev, currentPassword: '' }));
              }
            }}
            error={errors.currentPassword}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: '' }));
              }
            }}
            error={errors.newPassword}
            required
            placeholder="8-16 chars, 1 uppercase, 1 special character"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }
            }}
            error={errors.confirmPassword}
            required
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
