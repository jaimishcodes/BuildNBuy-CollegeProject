import React from 'react';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const VerificationBanner = ({ status, rejectionReason }) => {
  if (status === 'verified') {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4 mb-6">
        <FaCheckCircle className="text-lg shrink-0" />
        <p className="text-sm font-medium">You are a Verified Contractor on BuildNBuy. Your listings and profile are publicly visible.</p>
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-6">
        <FaExclamationTriangle className="text-lg shrink-0" />
        <p className="text-sm font-medium">Your verification was rejected. {rejectionReason && `Reason: ${rejectionReason}`} Please update your profile and contact support.</p>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-4 mb-6">
      <FaClock className="text-lg shrink-0" />
      <p className="text-sm font-medium">Your contractor profile is pending admin verification. Complete your profile to speed up review.</p>
    </div>
  );
};

export default VerificationBanner;
