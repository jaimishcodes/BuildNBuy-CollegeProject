import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import ContractorCard from '../contractor/ContractorCard';
import { GridSkeleton, ContractorCardSkeleton } from '../dashboard/Skeletons';
import { contractorApi } from '../../services/contractorApi';
import { fadeUp, viewportOnce } from '../../utils/motion';

const FeaturedContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contractorApi
      .list({ limit: 4, sortBy: 'newest' })
      .then(({ data }) => setContractors(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-section">
      <div className="container-x">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-primary font-semibold text-sm">Trusted Professionals</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-2">Featured Contractors</h2>
          </div>
          <Link to="/contractors" className="hidden sm:flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">
            View All <FaArrowRight />
          </Link>
        </motion.div>

        {loading ? (
          <GridSkeleton Item={ContractorCardSkeleton} count={4} cols="md:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contractors.map((c, i) => (
              <ContractorCard key={c._id} contractor={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedContractors;
