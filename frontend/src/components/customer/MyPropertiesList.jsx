import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaEye, FaHome, FaEdit } from 'react-icons/fa';
import StatusBadge from '../dashboard/StatusBadge';
import EmptyState from '../common/EmptyState';
import { GridSkeleton } from '../dashboard/Skeletons';
import { propertyApi } from '../../services/propertyApi';
import { formatPrice, formatDate, placeholderImage } from '../../utils/format';

const MyPropertiesList = ({ listPropertyPath, editPropertyPath = '/dashboard/edit-property' }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    propertyApi.mine().then(({ data }) => setProperties(data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return;
    try {
      await propertyApi.remove(id);
      toast.success('Property deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold text-ink">My Properties</h1>
        <Link to={listPropertyPath} className="btn-primary text-sm"><FaPlus /> Add Property</Link>
      </div>

      {loading ? (
        <GridSkeleton count={4} cols="md:grid-cols-2" />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={FaHome}
          title="No properties listed yet"
          description="Add your first property to start reaching buyers and renters."
          action={<Link to={listPropertyPath} className="btn-primary text-sm">Add Property</Link>}
        />
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <div key={p._id} className="card p-4 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-40 h-32 shrink-0">
                <div className={`w-full h-full overflow-hidden rounded-xl ${p.images?.length === 2 ? 'grid grid-cols-2 gap-1' : p.images?.length > 2 ? 'grid grid-cols-2 grid-rows-2 gap-1' : ''}`}>
                  {(p.images?.length ? p.images.slice(-4).reverse() : [{ url: placeholderImage(p.title || 'property') }]).map((image, index) => (
                    <img
                      key={image.url || index}
                      src={image.url}
                      alt={`${p.title} photo ${index + 1}`}
                      className="w-full h-full min-w-0 min-h-0 object-cover"
                    />
                  ))}
                </div>
                {p.images?.length > 4 && (
                  <span className="absolute bottom-2 right-2 bg-ink/80 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    +{p.images.length - 4}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={p.listedBy?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.listedBy?.name || 'Customer')}`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-muted">{p.location?.city} · {p.propertyType} · {p.images?.length || 0} photos</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-lg font-heading font-bold text-primary mt-2">{formatPrice(p)}</p>
                {p.status === 'Rejected' && p.rejectionReason && (
                  <p className="text-xs text-red-600 mt-1">Reason: {p.rejectionReason}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <Link to={`/properties/${p.slug}`} className="flex items-center gap-1.5 text-primary font-medium"><FaEye /> View</Link>
                  <Link to={`${editPropertyPath}/${p._id}`} className="flex items-center gap-1.5 text-primary font-medium"><FaEdit /> Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1.5 text-red-600 font-medium"><FaTrash /> Delete</button>
                  <span className="text-muted ml-auto text-xs">Listed {formatDate(p.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesList;
