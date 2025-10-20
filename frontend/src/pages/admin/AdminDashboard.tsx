import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import type { DashboardStats } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="text-center py-12 text-slate-500 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="px-4 py-3 rounded-md font-medium bg-red-100 text-red-900 border border-red-300">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-8 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-600 mt-2">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-600 mt-2">{stats.totalStores}</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Total Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-600 mt-2">{stats.totalRatings}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
