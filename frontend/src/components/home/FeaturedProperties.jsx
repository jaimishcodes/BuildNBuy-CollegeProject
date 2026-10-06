import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import PropertyCard from '../customer/PropertyCard';
import { GridSkeleton } from '../dashboard/Skeletons';
import { propertyApi } from '../../services/propertyApi';
import { fadeUp, viewportOnce } from '../../utils/motion';

const FeaturedProperties = () => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const sectionY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0px', '0px'] : ['24px', '-24px']);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyApi
      .list({ limit: 6, sortBy: 'newest' })
      .then(({ data }) => setProperties(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.section ref={sectionRef} style={{ y: sectionY }} className="section-padding container-x">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <span className="text-primary font-semibold text-sm">Handpicked for you</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-2">Featured Properties</h2>
        </div>
        <Link to="/properties" className="hidden sm:flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">
          View All <FaArrowRight />
        </Link>
      </motion.div>

      {loading ? (
        <GridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <PropertyCard key={p._id} property={p} index={i} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default FeaturedProperties;
