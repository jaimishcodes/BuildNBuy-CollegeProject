import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyForm from '../../components/customer/PropertyForm';
import { propertyApi } from '../../services/propertyApi';

const EditPropertyPage = ({ redirectTo = '/dashboard/my-properties' }) => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyApi.getOne(id)
      .then(({ data }) => setProperty(data.data.property))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load property'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-muted">Loading property...</p>;
  if (!property) return <p className="text-sm text-red-600">Property could not be loaded.</p>;

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-1">Edit Property</h1>
      <p className="text-muted text-sm mb-6">Update your property details. Changes will be sent for admin approval again.</p>
      <PropertyForm property={property} redirectTo={redirectTo} />
    </div>
  );
};

export default EditPropertyPage;