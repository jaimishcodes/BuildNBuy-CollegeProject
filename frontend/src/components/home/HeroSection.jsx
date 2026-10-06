import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHardHat } from 'react-icons/fa';
import { useRef } from 'react';
import HeroSearch from './HeroSearch';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1.08, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0px', '0px'] : ['0px', '50px']);

  return (
  <section ref={sectionRef} className="relative min-h-[680px] overflow-hidden bg-section">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <motion.img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        alt="Premium property"
        style={{ y: imageY, scale: imageScale }}
        className="w-full h-[118%] object-cover object-center will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/35" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(15,23,42,0.08)_100%)]" />
    </div>

    <motion.div style={{ y: contentY }} className="container-x relative section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-5">
          Buy. Rent. List. Build.
        </span>
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-ink leading-tight mb-5">
          Find a Home. <br /> Build a Dream.
        </h1>
        <p className="text-muted text-lg mb-8 max-w-xl">
          Buy, rent, or list your property — or connect with verified contractors to build your dream home from the ground up, all on one trusted platform.
        </p>

        <Link to="/contractors" className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all mb-10">
          <FaHardHat /> Have a plot? Build Your Home →
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroSearch />
      </motion.div>
    </motion.div>
  </section>
  );
};

export default HeroSection;
