import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import { formatPrice, placeholderImage } from '../../utils/format';

const PropertyCard = ({ property, index = 0 }) => {

  const cover = property.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/properties/${property.slug || property._id}`} className="card overflow-hidden block h-full">
        <div className="relative">
          <div className="relative h-52 overflow-hidden">
            <img
              src={cover || placeholderImage(property.title || 'property')}
              alt={property.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {property.listingType}
              </span>
              {property.isFeatured && (
                <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">Featured</span>
              )}
            </div>
          </div>
          {property.listedBy && (
            <img
              src={property.listedBy.avatar?.url || placeholderImage(property.listedBy.name || 'customer')}
              alt={`${property.listedBy.name || 'Property owner'} profile`}
              loading="lazy"
              className="absolute left-5 -bottom-7 w-14 h-14 rounded-full object-cover border-4 border-white shadow-card bg-white"
            />
          )}
        </div>

        <div className={`p-5 ${property.listedBy ? 'pt-9' : ''}`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-semibold text-ink line-clamp-1">{property.title}</h3>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted mb-3">
            <FaMapMarkerAlt className="text-primary shrink-0" />
            <span className="line-clamp-1">{property.location?.city}</span>
          </p>

          <p className="text-xl font-heading font-bold text-primary mb-3">{formatPrice(property)}</p>

          <div className="flex items-center gap-4 text-sm text-muted border-t border-border pt-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <FaBed /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <FaBath /> {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FaRulerCombined /> {property.area?.value} {property.area?.unit}
            </span>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
