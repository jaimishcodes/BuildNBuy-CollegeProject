import React from 'react';

const styles = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Sold: 'bg-slate-100 text-slate-600 border-slate-200',
  Rented: 'bg-slate-100 text-slate-600 border-slate-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Responded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
  Open: 'bg-blue-50 text-blue-700 border-blue-200',
  'In Discussion': 'bg-amber-50 text-amber-700 border-amber-200',
  Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Declined: 'bg-red-50 text-red-700 border-red-200',
  Requested: 'bg-blue-50 text-blue-700 border-blue-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rescheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
    {status}
  </span>
);

export default StatusBadge;
