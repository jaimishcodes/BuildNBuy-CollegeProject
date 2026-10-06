import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaBuilding,
} from 'react-icons/fa';
import ConstructionRequirementModal from '../../components/customer/ConstructionRequirementModal';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import { contractorApi } from '../../services/contractorApi';
import { requirementApi } from '../../services/resourceApi';
import { formatINR, placeholderImage } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const ContractorDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('projects');
  const [requirementOpen, setRequirementOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    contractorApi
      .getOne(id)
      .then(({ data }) => {
        setProfile(data.data.profile);
        setProjects(data.data.projects);
        setServices(data.data.services);
      })
      .catch(() => toast.error('Contractor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequirement = async (form) => {
    if (!user) {
      toast.error('Please login to submit a requirement');
      throw new Error('not logged in');
    }
    await requirementApi.create({ ...form, contractor: id });
  };

  if (loading) {
    return (
      <div className="container-x py-10">
        <div className="skeleton h-56 w-full rounded-2xl mb-8" />
        <GridSkeleton count={3} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-x py-24 text-center">
        <h2 className="text-2xl font-heading font-bold text-ink mb-2">Contractor not found</h2>
        <Link to="/contractors" className="btn-primary inline-flex mt-4">Browse Contractors</Link>
      </div>
    );
  }

  const profileImage = profile.user?.avatar?.url
    || placeholderImage(profile.user?.name || profile.companyName || 'contractor');
  const bannerImage = profile.coverImage?.url
    || placeholderImage(profile.companyName || profile.user?.name || 'contractor-cover');

  return (
    <div className="bg-white">
      <div className="container-x pt-5">
        <Link to="/contractors" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary">
          <FaArrowLeft aria-hidden="true" /> Back to contractors
        </Link>
      </div>
      <div className="relative h-64 md:h-80">
        <img
          src={bannerImage}
          alt={profile.companyName || profile.user?.name || 'Contractor'}
          onError={(event) => { event.currentTarget.src = placeholderImage('contractor-cover'); }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container-x -mt-20 relative pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-end gap-4">
              <img
                src={profileImage}
                alt={profile.user?.name || profile.companyName || 'Contractor'}
                onError={(event) => { event.currentTarget.src = placeholderImage('contractor-profile'); }}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-card -mt-16 bg-white"
              />
              <div>
                <span className="badge-verified mb-2">
                  <FaCheckCircle className="text-emerald-600" /> Verified Contractor
                </span>
                <h1 className="text-2xl font-heading font-bold text-ink">{profile.companyName || profile.user?.name}</h1>
                <p className="text-muted text-sm">{profile.user?.name}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => setRequirementOpen(true)} className="btn-primary text-sm">Send Requirement</button>
            </div>
          </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <FaBriefcase className="text-primary mx-auto mb-1" />
              <p className="font-semibold text-ink">{profile.experienceYears}+ yrs</p>
              <p className="text-xs text-muted">Experience</p>
            </div>
            <div className="text-center">
              <FaBuilding className="text-primary mx-auto mb-1" />
              <p className="font-semibold text-ink">{profile.completedProjectsCount}</p>
              <p className="text-xs text-muted">Projects Done</p>
            </div>
            <div className="text-center">
              <FaMapMarkerAlt className="text-primary mx-auto mb-1" />
              <p className="font-semibold text-ink">{profile.location?.city}</p>
              <p className="text-xs text-muted">Location</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div>
              <h2 className="font-heading font-semibold text-lg text-ink mb-3">About</h2>
              <p className="text-muted leading-relaxed mb-6">{profile.about}</p>

              {profile.specializations?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {profile.specializations.map((s) => (
                    <span key={s} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 border-b border-border mb-6">
                {['projects', 'services'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                      tab === t ? 'border-primary text-primary' : 'border-transparent text-muted'
                    }`}
                  >
                    {t} {t === 'projects' && `(${projects.length})`} {t === 'services' && `(${services.length})`}
                  </button>
                ))}
              </div>

              {tab === 'projects' && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {projects.length === 0 && <p className="text-muted text-sm">No previous projects listed yet.</p>}
                  {projects.map((p) => {
                    const projectImages = p.images?.length ? p.images : [{ url: placeholderImage(p.name || p.title || 'project') }];
                    const projectName = p.name || p.title || 'Previous Project';
                    return (
                      <div key={p._id} className="card overflow-hidden">
                        <Swiper
                          className="project-image-swiper h-44"
                          modules={[Autoplay, Navigation, Pagination]}
                          navigation={projectImages.length > 1}
                          pagination={projectImages.length > 1 ? { clickable: true } : false}
                          autoplay={projectImages.length > 1 ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                          loop={projectImages.length > 1}
                          speed={600}
                        >
                          {projectImages.map((image, index) => (
                            <SwiperSlide key={image._id || image.publicId || image.url || index}>
                              <img
                                src={image.url || image}
                                alt={`${projectName} ${index + 1}`}
                                onError={(event) => { event.currentTarget.src = placeholderImage(projectName); }}
                                className="w-full h-full object-cover"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        <div className="p-4">
                          <h4 className="font-semibold text-ink text-sm mb-1">{projectName}</h4>
                          {p.description && <p className="text-xs text-muted leading-relaxed mb-2">{p.description}</p>}
                          <p className="text-xs text-muted mb-2">
                            {p.projectType || p.category}
                            {(p.location?.city || p.location) && ` · ${p.location?.city || p.location}`}
                            {p.completionYear && ` · ${p.completionYear}`}
                          </p>
                          {(p.areaSqft || p.budgetSpent) && (
                            <p className="text-xs text-muted">
                              {p.areaSqft && `${p.areaSqft} sqft`}
                              {p.areaSqft && p.budgetSpent && ' · '}
                              {p.budgetSpent && formatINR(p.budgetSpent)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'services' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.length === 0 && <p className="text-muted text-sm">No services listed yet.</p>}
                  {services.map((s) => (
                    <div key={s._id} className="card p-4">
                      <h4 className="font-semibold text-ink text-sm mb-1">{s.title}</h4>
                      <p className="text-xs text-muted mb-2">{s.description}</p>
                      <p className="text-sm font-semibold text-primary">₹{s.priceRange?.min}–{s.priceRange?.max} {s.unit}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-heading font-semibold text-ink mb-4">Contact Details</h3>
              <div className="space-y-3 text-sm">
                {profile.user?.phone && (
                  <a href={`tel:${profile.user.phone}`} className="flex items-center gap-2 text-muted hover:text-primary">
                    <FaPhoneAlt /> {profile.user.phone}
                  </a>
                )}
                <p className="flex items-center gap-2 text-muted">
                  <FaEnvelope /> {profile.user?.email}
                </p>
                <p className="flex items-center gap-2 text-muted">
                  <FaMapMarkerAlt /> {profile.location?.address}, {profile.location?.city}
                </p>
              </div>
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs text-muted mb-1">Typical Budget Range</p>
                <p className="font-semibold text-ink">{formatINR(profile.minBudget)} – {formatINR(profile.maxBudget)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConstructionRequirementModal open={requirementOpen} onClose={() => setRequirementOpen(false)} onSubmit={handleRequirement} />
    </div>
  );
};

export default ContractorDetailsPage;
