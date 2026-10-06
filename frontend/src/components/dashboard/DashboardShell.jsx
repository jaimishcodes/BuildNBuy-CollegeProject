import React from 'react';
import { motion } from 'framer-motion';

const DashboardShell = ({ sidebar, title, subtitle, actions, children }) => (
  <div className="bg-section min-h-screen">
    <div className="container-x py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">{title}</h1>
          {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {sidebar}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  </div>
);

export default DashboardShell;
