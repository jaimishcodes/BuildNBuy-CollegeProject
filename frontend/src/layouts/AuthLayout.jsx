import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    <div className="flex items-center justify-center p-6 sm:p-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold text-lg">B</div>
          <span className="font-heading font-bold text-xl text-ink">Build<span className="text-primary">N</span>Buy</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-2">{title}</h1>
        {subtitle && <p className="text-muted mb-8">{subtitle}</p>}
        {children}
      </motion.div>
    </div>

    <div className="hidden lg:block relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"
        alt="Premium home"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
      <div className="absolute bottom-12 left-12 right-12 text-white">
        <h2 className="text-3xl font-heading font-bold mb-2">Buy. Rent. List. Build.</h2>
        <p className="text-white/80">Everything you need for your next home, on one trusted platform.</p>
      </div>
    </div>
  </div>
);

export default AuthLayout;
