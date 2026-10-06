import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center text-center py-16 px-6"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="text-primary text-3xl" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-ink mb-1">{title}</h3>
    {description && <p className="text-muted max-w-sm mb-5">{description}</p>}
    {action}
  </motion.div>
);

export default EmptyState;
