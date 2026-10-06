import React from 'react';
import PropertyForm from '../../components/customer/PropertyForm';

const ListPropertyPage = ({ redirectTo = '/dashboard/my-properties' }) => (
  <div>
    <h1 className="text-xl font-heading font-bold text-ink mb-1">List Your Property</h1>
    <p className="text-muted text-sm mb-6">Submit your property details below. Our team will review and approve it before it goes live.</p>
    <PropertyForm redirectTo={redirectTo} />
  </div>
);

export default ListPropertyPage;
