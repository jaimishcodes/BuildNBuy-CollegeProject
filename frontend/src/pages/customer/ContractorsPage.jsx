import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaHardHat } from 'react-icons/fa';
import ContractorCard from '../../components/contractor/ContractorCard';
import { GridSkeleton, ContractorCardSkeleton } from '../../components/dashboard/Skeletons';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { contractorApi } from '../../services/contractorApi';
import { majorIndianCities } from '../../utils/indianCities';

const ContractorsPage = () => {
  const [searchParams] = useSearchParams();
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState('rating');

  const fetchContractors = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { search, city, sortBy, page, limit: 9 };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        const { data } = await contractorApi.list(params);
        setContractors(data.data);
        setMeta(data.meta);
      } catch (err) {
        // empty state handles this
      } finally {
        setLoading(false);
      }
    },
    [search, city, sortBy]
  );

  useEffect(() => {
    fetchContractors(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-section min-h-screen">
      <div className="bg-white border-b border-border py-10">
        <div className="container-x">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary mb-5">
            <FaArrowLeft aria-hidden="true" /> Back to home
          </Link>
          <span className="text-primary font-semibold text-sm flex items-center gap-2">
            <FaHardHat /> Build Your Home
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink mt-2 mb-1">Find a Verified Contractor</h1>
          <p className="text-muted text-sm mb-5">{meta.total} contractors available</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 border border-border rounded-xl px-4 bg-white">
              <FaSearch className="text-muted" />
              <input
                type="text"
                placeholder="Search by contractor or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchContractors(1)}
                className="w-full py-3 outline-none text-sm"
              />
            </div>
            <select value={city} onChange={(e) => { setCity(e.target.value); setTimeout(() => fetchContractors(1), 0); }} className="input-field sm:w-52 text-sm">
              <option value="">All Cities</option>
              {majorIndianCities.map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setTimeout(() => fetchContractors(1), 0); }} className="input-field sm:w-52 text-sm">
              <option value="rating">Top Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-x py-10">
        {loading ? (
          <GridSkeleton Item={ContractorCardSkeleton} count={6} cols="md:grid-cols-2 xl:grid-cols-3" />
        ) : contractors.length === 0 ? (
          <EmptyState icon={FaHardHat} title="No contractors found" description="Try a different city or search term." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contractors.map((c, i) => (
                <ContractorCard key={c._id} contractor={c} index={i} />
              ))}
            </div>
            <Pagination page={meta.page} pages={meta.pages} onChange={(p) => fetchContractors(p)} />
          </>
        )}
      </div>
    </div>
  );
};

export default ContractorsPage;
