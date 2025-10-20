import React, { useState, useEffect } from 'react';
import { storeOwnerApi } from '../../api/storeOwnerApi';
import type { RatingWithUser, StoreOwnerDashboard } from '../../api/storeOwnerApi';
import type { SortConfig } from '../../types';
import Table from '../../components/Table';
import Card from '../../components/Card';
import RatingStars from '../../components/RatingStars';

const StoreOwnerDashboardPage: React.FC = () => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [dashboard, setDashboard] = useState<StoreOwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ratingsData, dashboardData] = await Promise.all([
        storeOwnerApi.getStoreRatings(),
        storeOwnerApi.getDashboard(),
      ]);
      setRatings(ratingsData);
      setDashboard(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: (sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc',
    });
  };

  const getSortedRatings = () => {
    const sorted = [...ratings];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'user.name') {
        aValue = a.user.name;
        bValue = b.user.name;
      } else if (sortConfig.key === 'user.email') {
        aValue = a.user.email;
        bValue = b.user.email;
      } else if (sortConfig.key === 'rating') {
        aValue = a.rating;
        bValue = b.rating;
      } else if (sortConfig.key === 'createdAt') {
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      } else {
        return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  };

  const columns = [
    {
      key: 'user.name',
      label: 'User Name',
      sortable: true,
      render: (_: any, row: RatingWithUser) => row.user.name
    },
    {
      key: 'user.email',
      label: 'User Email',
      sortable: true,
      render: (_: any, row: RatingWithUser) => row.user.email
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value: number) => <RatingStars rating={value} readonly size="small" />,
    },
    {
      key: 'createdAt',
      label: 'Submitted On',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {dashboard && (
        <>
          <Card title="Store Information" className="stat-card">
            <div style={{ marginBottom: '1rem' }}>
              <strong>Store Name:</strong> {dashboard.storeName}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Email:</strong> {dashboard.email}
            </div>
            <div>
              <strong>Address:</strong> {dashboard.address}
            </div>
          </Card>

          <div className="stats-grid">
            <Card title="Average Rating" className="stat-card">
              <div className="stat-value">
                <RatingStars rating={Math.round(dashboard.averageRating)} readonly />
                <div style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
                  {dashboard.averageRating.toFixed(2)}
                </div>
              </div>
            </Card>

            <Card title="Total Ratings" className="stat-card">
              <div className="stat-value">{dashboard.totalRatings}</div>
            </Card>
          </div>
        </>
      )}

      <Card title="Ratings from Users">
        <Table
          columns={columns}
          data={getSortedRatings()}
          sortConfig={sortConfig}
          onSort={handleSort}
          emptyMessage="No ratings yet"
        />
      </Card>
    </div>
  );
};

export default StoreOwnerDashboardPage;
