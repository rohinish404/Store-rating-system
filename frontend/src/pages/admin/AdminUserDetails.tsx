import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import Card from '../../components/Card';
import { Button } from '../../components/ui/button';
import RatingStars from '../../components/RatingStars';
import type { User } from '../../types';
import { Role } from '../../types';

interface UserDetailsWithStores extends User {
  stores?: Array<{
    id: string;
    name: string;
    email: string;
    address: string;
    averageRating: number;
  }>;
}

const AdminUserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetailsWithStores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadUserDetails();
    }
  }, [id]);

  const loadUserDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getUserById(id);
      setUser(data as UserDetailsWithStores);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <Button onClick={() => navigate('/admin/users')} variant="secondary">
          Back to Users
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="alert alert-error">User not found</div>
        <Button onClick={() => navigate('/admin/users')} variant="secondary">
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Button onClick={() => navigate('/admin/users')} variant="secondary">
          Back to Users
        </Button>
      </div>

      <Card title="User Information">
        <div className="details-grid">
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Address:</strong> {user.address}
          </div>
          <div>
            <strong>Role:</strong> {user.role.replace('_', ' ')}
          </div>
          {user.createdAt && (
            <div>
              <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      </Card>

      {user.role === Role.STORE_OWNER && user.stores && user.stores.length > 0 && (
        <Card title="Store Owner - Stores">
          {user.stores.map((store) => (
            <div key={store.id} className="mb-4 p-4 border border-slate-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
              <div className="details-grid">
                <div>
                  <strong>Email:</strong> {store.email}
                </div>
                <div>
                  <strong>Address:</strong> {store.address}
                </div>
                <div>
                  <strong>Rating:</strong>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars
                      rating={store.averageRating ? Math.round(store.averageRating) : 0}
                      readonly
                      size="small"
                    />
                    <span className="text-lg font-medium">
                      {store.averageRating ? store.averageRating.toFixed(2) : 'No ratings yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {user.role === Role.STORE_OWNER && (!user.stores || user.stores.length === 0) && (
        <Card title="Store Information">
          <div className="text-slate-500 text-center py-4">
            This store owner has no stores assigned yet.
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminUserDetails;
