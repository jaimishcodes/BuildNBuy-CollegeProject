import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaHome } from 'react-icons/fa';
import PropertyCard from '../../components/customer/PropertyCard';
import PropertyFilters from '../../components/customer/PropertyFilters';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { propertyApi } from '../../services/propertyApi';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const [filters, setFilters] = useState({
    listingType: searchParams.get('listingType') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnishing: searchParams.get('furnishing') || '',
    amenities: searchParams.get('amenities') || '',
    city: searchParams.get('city') || '',
  });

  const fetchProperties = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { ...filters, search, sortBy, page, limit: 9 };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        const { data } = await propertyApi.list(params);
        setProperties(data.data);
        setMeta(data.meta);
      } catch (err) {
        // silently fail, empty state will show
      } finally {
        setLoading(false);
      }
    },
    [filters, search, sortBy]
  );

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    const params = { ...filters, search, sortBy };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    setSearchParams(params);
    fetchProperties(1);
  };

  const handleReset = () => {
    setFilters({ listingType: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', furnishing: '', amenities: '', city: '' });
    setSearch('');
    setSortBy('newest');
    setSearchParams({});
    setTimeout(() => fetchProperties(1), 0);
  };

  return (
    <div className="bg-section min-h-screen">
      <div className="bg-white border-b border-border py-8">
        <div className="container-x">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-1">
            {filters.city ? `Properties in ${filters.city}` : 'Explore Properties'}
          </h1>
          <p className="text-muted text-sm">{meta.total} properties found</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <div className="flex-1 flex items-center gap-2 border border-border rounded-xl px-4 bg-white">
              <FaSearch className="text-muted" />
              <input
                type="text"
                placeholder="Search by title, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                className="w-full py-3 outline-none text-sm"
              />
            </div>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setTimeout(handleApply, 0); }} className="input-field sm:w-52 text-sm">
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 shrink-0">
            <PropertyFilters filters={filters} setFilters={setFilters} onApply={handleApply} onReset={handleReset} />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <GridSkeleton count={6} cols="md:grid-cols-2 xl:grid-cols-3" />
            ) : properties.length === 0 ? (
              <EmptyState
                icon={FaHome}
                title="No properties found"
                description="Try adjusting your filters or search terms to find more results."
                action={<button onClick={handleReset} className="btn-primary text-sm">Clear Filters</button>}
              />
            ) : (
              <>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p, i) => (
                    <PropertyCard key={p._id} property={p} index={i} />
                  ))}
                </motion.div>
                <Pagination page={meta.page} pages={meta.pages} onChange={(p) => fetchProperties(p)} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
