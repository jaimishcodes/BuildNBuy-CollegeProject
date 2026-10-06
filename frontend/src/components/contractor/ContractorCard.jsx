import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBriefcase, FaCheckCircle } from 'react-icons/fa';
import { placeholderImage } from '../../utils/format';

const ContractorCard = ({ contractor, index = 0 }) => {
  const { user, companyName, location, experienceYears, completedProjectsCount, specializations, coverImage } = contractor;
  const coverPhoto = coverImage?.url || placeholderImage(companyName || user?.name || 'contractor');
  const profilePhoto = user?.avatar?.url || placeholderImage(user?.name || companyName || 'contractor');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/contractors/${user?._id}`} className="card overflow-hidden block h-full group">
        <div className="relative h-36 overflow-hidden">
          <img
            src={coverPhoto}
            alt={companyName}
            loading="lazy"
            onError={(event) => { event.currentTarget.src = placeholderImage('contractor'); }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="badge-verified absolute bottom-3 left-3 bg-white">
            <FaCheckCircle className="text-emerald-600" /> Verified
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 -mt-10 mb-3 relative z-10">
            <img
              src={profilePhoto}
              alt={user?.name}
              onError={(event) => { event.currentTarget.src = placeholderImage('contractor-profile'); }}
              className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-card"
            />
          </div>
          <h3 className="font-heading font-semibold text-ink line-clamp-1">{companyName || user?.name}</h3>
          <p className="text-sm text-muted mb-2">{user?.name}</p>

          <p className="flex items-center gap-1.5 text-sm text-muted mb-3">
            <FaMapMarkerAlt className="text-primary shrink-0" /> {location?.city}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {(specializations || []).slice(0, 2).map((s) => (
              <span key={s} className="text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted">
              <FaBriefcase className="text-primary" /> {experienceYears}+ yrs · {completedProjectsCount} projects
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ContractorCard;
