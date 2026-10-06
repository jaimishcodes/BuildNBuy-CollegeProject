import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

const NotFoundPage = () => (
  <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-8xl font-heading font-bold text-primary/20 mb-2">404</h1>
      <h2 className="text-2xl font-heading font-bold text-ink mb-3">Page not found</h2>
      <p className="text-muted mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or may have been moved.</p>
      <Link to="/" className="btn-primary inline-flex"><FaHome /> Back to Home</Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
