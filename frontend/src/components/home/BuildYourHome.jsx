import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHardHat } from 'react-icons/fa';
import { fadeUp, viewportOnce } from '../../utils/motion';

const projectImages = [
  {
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
    alt: 'Architect working on a home design',
    className: 'col-span-1 row-span-2 min-h-64 sm:min-h-80',
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    alt: 'Modern home interior',
    className: 'min-h-32 sm:min-h-40',
  },
  {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    alt: 'Construction professionals at work',
    className: 'min-h-32 sm:min-h-40',
  },
];

const BuildYourHome = () => (
  <section className="relative overflow-hidden bg-ink text-white">
    <div className="absolute inset-0 opacity-15" aria-hidden="true">
      <img
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-ink/70" aria-hidden="true" />

    <div className="container-x relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16 md:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm mb-5">
          <FaHardHat /> Build Your Home
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-xl">
          Have a Plot? Build Your Dream Home.
        </h2>
        <p className="text-white/75 leading-relaxed mt-5 mb-8 max-w-lg">
          Find verified contractors, explore their past projects, and connect with the right professional for your construction requirements.
        </p>
        <Link to="/contractors" className="btn-accent group">
          Find a Contractor
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.65 }}
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {projectImages.map((image) => (
          <div key={image.src} className={`overflow-hidden rounded-xl ${image.className}`}>
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BuildYourHome;