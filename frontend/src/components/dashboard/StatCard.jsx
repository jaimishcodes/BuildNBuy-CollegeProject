import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, accent = 'text-primary', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="card p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center ${accent}`}>
      <Icon className="text-xl" />
    </div>
    <div>
      <p className="text-2xl font-heading font-bold text-ink leading-none">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  </motion.div>
);

export default StatCard;
