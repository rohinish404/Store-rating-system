import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../../utils/validators';
import Table from '../../components/Table';
import { Button } from '../../components/ui/button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Card from '../../components/Card';
import type { User, SortConfig, Role } from '../../types';
import { Role as RoleEnum } from '../../types';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '' as Role | '',
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: '' as Role | '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formApiError, setFormApiError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getUsers({
        ...filters,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction === 'asc' ? 'ASC' : 'DESC',
      });
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadUsersWithParams = async (
    currentFilters: typeof filters,
    currentSort: SortConfig
  ) => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getUsers({
        ...currentFilters,
        sortBy: currentSort.key,
        sortOrder: currentSort.direction === 'asc' ? 'ASC' : 'DESC',
      });
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
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
    loadUsersWithParams(filters, newSortConfig);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    loadUsersWithParams(filters, sortConfig);
  };

  const resetFilters = () => {
    const emptyFilters = {
      name: '',
      email: '',
      address: '',
      role: '' as Role | '',
    };
    setFilters(emptyFilters);
    loadUsersWithParams(emptyFilters, sortConfig);
  };

  const openUserDetails = (user: User) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormApiError('');

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

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
    setFormLoading(true);

    try {
      await adminApi.createUser(formData as typeof formData & { role: Role });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: '',
      });
      loadUsers();
    } catch (err) {
      setFormApiError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: Role) => value.replace('_', ' '),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: User) => (
        <Button onClick={() => openUserDetails(row)} variant="secondary">
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <Button onClick={() => setIsAddModalOpen(true)}>Add New User</Button>
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
          <Select
            label="Role"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            options={[
              { value: RoleEnum.ADMIN, label: 'Admin' },
              { value: RoleEnum.NORMAL_USER, label: 'Normal User' },
              { value: RoleEnum.STORE_OWNER, label: 'Store Owner' },
            ]}
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
        <div className="loading">Loading users...</div>
      ) : (
        <Card>
          <Table
            columns={columns}
            data={users}
            sortConfig={sortConfig}
            onSort={handleSort}
            emptyMessage="No users found"
          />
        </Card>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            role: '',
          });
          setFormErrors({});
          setFormApiError('');
        }}
        title="Add New User"
      >
        <form onSubmit={handleAddUser}>
          {formApiError && <div className="alert alert-error">{formApiError}</div>}

          <Input
            label="Name"
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

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
              if (formErrors.password) {
                setFormErrors((prev) => ({ ...prev, password: '' }));
              }
            }}
            error={formErrors.password}
            required
            placeholder="8-16 chars, 1 uppercase, 1 special character"
          />

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

          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, role: e.target.value as Role }));
              if (formErrors.role) {
                setFormErrors((prev) => ({ ...prev, role: '' }));
              }
            }}
            error={formErrors.role}
            required
            options={[
              { value: RoleEnum.ADMIN, label: 'Admin' },
              { value: RoleEnum.NORMAL_USER, label: 'Normal User' },
              { value: RoleEnum.STORE_OWNER, label: 'Store Owner' },
            ]}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create User'}
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

export default AdminUsers;
