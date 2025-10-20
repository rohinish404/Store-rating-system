import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import {
  validateName,
  validateEmail,
  validateAddress,
} from '../../utils/validators';
import Table from '../../components/Table';
import { Button } from '../../components/ui/button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Card from '../../components/Card';
import type { Store, SortConfig, User } from '../../types';

const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [storeOwners, setStoreOwners] = useState<User[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formApiError, setFormApiError] = useState('');

  // Load stores on mount only
  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getStores({
        ...filters,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction === 'asc' ? 'ASC' : 'DESC',
      });
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const newSortConfig = {
      key,
      direction: (sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc',
    };
    setSortConfig(newSortConfig);
    // Manually reload with new sort
    loadStoresWithParams(filters, newSortConfig);
  };

  const loadStoresWithParams = async (
    currentFilters: typeof filters,
    currentSort: SortConfig
  ) => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getStores({
        ...currentFilters,
        sortBy: currentSort.key,
        sortOrder: currentSort.direction === 'asc' ? 'ASC' : 'DESC',
      });
      setStores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    loadStoresWithParams(filters, sortConfig);
  };

  const resetFilters = () => {
    const emptyFilters = {
      name: '',
      email: '',
      address: '',
    };
    setFilters(emptyFilters);
    loadStoresWithParams(emptyFilters, sortConfig);
  };

  const openStoreDetails = async (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const loadStoreOwners = async () => {
    try {
      setLoadingOwners(true);
      const owners = await adminApi.getStoreOwners();
      setStoreOwners(owners);
    } catch (err) {
      console.error('Failed to load store owners:', err);
    } finally {
      setLoadingOwners(false);
    }
  };

  const openAddStoreModal = () => {
    setIsAddModalOpen(true);
    loadStoreOwners();
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormApiError('');

    const validations = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
      ownerId: formData.ownerId ? { isValid: true } : { isValid: false, error: 'Store owner is required' },
    };

    const newErrors: Record<string, string> = {};
    Object.entries(validations).forEach(([key, validation]) => {
      if (!validation.isValid && validation.error) {
        newErrors[key] = validation.error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
    setFormLoading(true);

    try {
      await adminApi.createStore(formData);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerId: '',
      });
      loadStores();
    } catch (err) {
      setFormApiError(err instanceof Error ? err.message : 'Failed to create store');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (value: number | undefined) => (value ? value.toFixed(2) : 'No ratings'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Store) => (
        <Button onClick={() => openStoreDetails(row)} variant="secondary">
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <Button onClick={openAddStoreModal}>Add New Store</Button>
      </div>

      <Card title="Filters">
        <div className="filter-grid">
          <Input
            label="Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
          <Input
            label="Email"
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
          />
          <Input
            label="Address"
            value={filters.address}
            onChange={(e) => handleFilterChange('address', e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={resetFilters} variant="secondary">
            Reset Filters
          </Button>
        </div>
      </Card>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading stores...</div>
      ) : (
        <Card>
          <Table
            columns={columns}
            data={stores}
            sortConfig={sortConfig}
            onSort={handleSort}
            emptyMessage="No stores found"
          />
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Store Details"
      >
        {selectedStore && (
          <div className="details-grid">
            <div>
              <strong>Name:</strong> {selectedStore.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedStore.email}
            </div>
            <div>
              <strong>Address:</strong> {selectedStore.address}
            </div>
            <div>
              <strong>Rating:</strong>{' '}
              {selectedStore.averageRating
                ? selectedStore.averageRating.toFixed(2)
                : 'No ratings yet'}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            name: '',
            email: '',
            address: '',
            ownerId: '',
          });
          setFormErrors({});
          setFormApiError('');
          setStoreOwners([]);
        }}
        title="Add New Store"
      >
        <form onSubmit={handleAddStore}>
          {formApiError && <div className="alert alert-error">{formApiError}</div>}

          <Input
            label="Store Name"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (formErrors.name) {
                setFormErrors((prev) => ({ ...prev, name: '' }));
              }
            }}
            error={formErrors.name}
            required
            placeholder="Minimum 20 characters, maximum 60"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, email: e.target.value }));
              if (formErrors.email) {
                setFormErrors((prev) => ({ ...prev, email: '' }));
              }
            }}
            error={formErrors.email}
            required
          />

          <Select
            label="Store Owner"
            value={formData.ownerId}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, ownerId: e.target.value }));
              if (formErrors.ownerId) {
                setFormErrors((prev) => ({ ...prev, ownerId: '' }));
              }
            }}
            error={formErrors.ownerId}
            required
            options={storeOwners.map(owner => ({
              value: owner.id,
              label: `${owner.name} (${owner.email})`
            }))}
            disabled={loadingOwners}
          />
          {loadingOwners && <div className="text-sm text-slate-500">Loading store owners...</div>}

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, address: e.target.value }));
              if (formErrors.address) {
                setFormErrors((prev) => ({ ...prev, address: '' }));
              }
            }}
            error={formErrors.address}
            required
            multiline
            rows={3}
            placeholder="Maximum 400 characters"
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create Store'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStores;
