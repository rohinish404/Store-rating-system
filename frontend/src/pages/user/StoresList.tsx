import React, { useState, useEffect } from 'react';
import { storeApi } from '../../api/storeApi';
import { ratingApi } from '../../api/ratingApi';
import { validateRating } from '../../utils/validators';
import type { StoreWithUserRating, SortConfig } from '../../types';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { Button } from '../../components/ui/button';
import Modal from '../../components/Modal';
import RatingStars from '../../components/RatingStars';

const StoresList: React.FC = () => {
  const [stores, setStores] = useState<StoreWithUserRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    name: '',
    address: '',
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  });

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreWithUserRating | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');

  // Load stores on mount only
  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await storeApi.getAllStores({
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

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    loadStores();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({ key, direction: direction as 'asc' | 'desc' });
    // Trigger reload after state update
    setTimeout(() => loadStores(), 0);
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      address: '',
    });
    // Manually trigger load after reset
    setTimeout(() => loadStores(), 0);
  };

  const openRatingModal = (store: StoreWithUserRating) => {
    setSelectedStore(store);
    // Backend returns userSubmittedRating
    setSelectedRating(store.userSubmittedRating || store.userRating || 0);
    setIsRatingModalOpen(true);
    setRatingError('');
  };

  const handleRatingSubmit = async () => {
    if (!selectedStore) return;

    const validation = validateRating(selectedRating);
    if (!validation.isValid) {
      setRatingError(validation.error || 'Invalid rating');
      return;
    }

    setRatingLoading(true);
    setRatingError('');

    try {
      // Check both userSubmittedRating and userRating for update vs create
      if (selectedStore.userSubmittedRating || selectedStore.userRating) {
        await ratingApi.updateRating(selectedStore.id, selectedRating);
      } else {
        await ratingApi.createRating(selectedStore.id, selectedRating);
      }

      setIsRatingModalOpen(false);
      loadStores();
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="page-container">

      <Card title="Search Stores">
        <div className="filter-grid">
          <Input
            label="Store Name"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Search by store name"
          />
          <Input
            label="Address"
            value={filters.address}
            onChange={(e) => handleFilterChange('address', e.target.value)}
            placeholder="Search by address"
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={resetFilters} variant="secondary">
            Reset
          </Button>
        </div>
      </Card>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading stores...</div>
      ) : (
        <>
          <div className="sort-controls">
            <label>Sort by:</label>
            <select
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={handleSortChange}
              className="input-field"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="address-asc">Address (A-Z)</option>
              <option value="address-desc">Address (Z-A)</option>
              <option value="averageRating-desc">Rating (High to Low)</option>
              <option value="averageRating-asc">Rating (Low to High)</option>
            </select>
          </div>

          {stores.length === 0 ? (
            <Card>
              <div className="empty-message">No stores found</div>
            </Card>
          ) : (
            <div className="stores-grid">
              {stores.map((store) => (
                <Card key={store.id} className="store-card">
                  <h3>{store.name}</h3>
                  <p className="store-address">{store.address}</p>

                  <div className="store-rating">
                    <div>
                      <strong>Overall Rating:</strong>
                      <RatingStars
                        rating={store.overallRating ? Math.round(store.overallRating) : (store.averageRating ? Math.round(store.averageRating) : 0)}
                        readonly
                        size="small"
                      />
                      <span className="rating-text">
                        {store.overallRating ? store.overallRating.toFixed(2) : (store.averageRating ? store.averageRating.toFixed(2) : 'No ratings yet')}
                      </span>
                    </div>

                    {(store.userSubmittedRating || store.userRating) && (
                      <div>
                        <strong>Your Rating:</strong>
                        <RatingStars rating={store.userSubmittedRating || store.userRating || 0} readonly size="small" />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => openRatingModal(store)}
                    className="w-full"
                    variant={(store.userSubmittedRating || store.userRating) ? 'secondary' : 'default'}
                  >
                    {(store.userSubmittedRating || store.userRating) ? 'Update Your Rating' : 'Rate This Store'}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title={selectedStore ? `Rate ${selectedStore.name}` : 'Rate Store'}
      >
        {selectedStore && (
          <div>
            {ratingError && <div className="alert alert-error">{ratingError}</div>}

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem' }}>Select your rating:</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RatingStars
                  rating={selectedRating}
                  onRate={setSelectedRating}
                  size="large"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button onClick={handleRatingSubmit} disabled={ratingLoading || selectedRating === 0}>
                {ratingLoading ? 'Submitting...' : (selectedStore.userSubmittedRating || selectedStore.userRating) ? 'Update Rating' : 'Submit Rating'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsRatingModalOpen(false)}
                disabled={ratingLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoresList;
