import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { contractorApi } from '../../services/contractorApi';
import CityInput from '../../components/common/CityInput';

const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxImageSize = 8 * 1024 * 1024;

const ProjectEditor = ({ project, index, onChange, onRemove }) => {
  const [previews, setPreviews] = useState([]);
  const projectFiles = project.newFiles;

  useEffect(() => {
    const urls = projectFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [projectFiles]);

  const addImages = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => supportedImageTypes.has(file.type) && file.size <= maxImageSize);
    if (validFiles.length !== files.length) toast.error('Use JPG, PNG, or WebP images up to 8 MB each.');
    onChange(index, 'newFiles', [...projectFiles, ...validFiles]);
    event.target.value = '';
  };

  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-ink">Past project {index + 1}</h2>
        <button type="button" onClick={() => onRemove(index)} aria-label={`Remove project ${index + 1}`} title="Remove project" className="w-8 h-8 inline-flex items-center justify-center rounded-full text-red-600 hover:bg-red-50">
          <FaTimes />
        </button>
      </div>
      <input required value={project.name || ''} onChange={(event) => onChange(index, 'name', event.target.value)} placeholder="Project name" className="input-field" />
      <div className="grid sm:grid-cols-3 gap-3">
        <input value={project.projectType || ''} onChange={(event) => onChange(index, 'projectType', event.target.value)} placeholder="Project type" className="input-field" />
        <CityInput value={project.location || ''} onChange={(event) => onChange(index, 'location', event.target.value)} placeholder="Project city or location" />
        <input type="number" min={1900} max={2100} value={project.completionYear || ''} onChange={(event) => onChange(index, 'completionYear', event.target.value)} placeholder="Completion year" className="input-field" />
      </div>
      <textarea rows={2} value={project.description || ''} onChange={(event) => onChange(index, 'description', event.target.value)} placeholder="Project details" className="input-field resize-y" />
      <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
        <FaCloudUploadAlt /> Add project photos
        <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={addImages} />
      </label>
      {(project.images?.length > 0 || projectFiles.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(project.images || []).map((image, imageIndex) => (
            <div key={image.url || imageIndex} className="relative aspect-square overflow-hidden rounded-lg">
              <img src={image.url} alt={`${project.name || 'Project'} photo ${imageIndex + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange(index, 'images', project.images.filter((item) => item.url !== image.url))} aria-label="Remove project photo" title="Remove photo" className="absolute top-1 right-1 w-6 h-6 inline-flex items-center justify-center rounded-full bg-white/95 text-red-600 shadow-card">
                <FaTimes />
              </button>
            </div>
          ))}
          {projectFiles.map((file, fileIndex) => (
            <div key={`${file.name}-${file.lastModified}-${fileIndex}`} className="relative aspect-square overflow-hidden rounded-lg">
              {previews[fileIndex] && <img src={previews[fileIndex]} alt={`New project photo ${fileIndex + 1}`} className="w-full h-full object-cover" />}
              <button type="button" onClick={() => onChange(index, 'newFiles', projectFiles.filter((_, currentIndex) => currentIndex !== fileIndex))} aria-label="Remove newly selected project photo" title="Remove photo" className="absolute top-1 right-1 w-6 h-6 inline-flex items-center justify-center rounded-full bg-white/95 text-red-600 shadow-card">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const PastWorkPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    contractorApi.me()
      .then(({ data }) => setProjects((data.data.previousProjects || []).map((project) => ({ ...project, newFiles: [] }))))
      .catch((error) => toast.error(error?.response?.data?.message || 'Unable to load past work'))
      .finally(() => setLoading(false));
  }, []);

  const updateProject = (index, key, value) => {
    setProjects((current) => current.map((project, projectIndex) => (
      projectIndex === index ? { ...project, [key]: value } : project
    )));
  };

  const addProject = () => setProjects((current) => [...current, {
    name: '', location: '', projectType: '', completionYear: '', description: '', images: [], newFiles: [],
  }]);

  const saveProjects = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('previousProjects', JSON.stringify(projects.map(({ newFiles, ...project }) => project)));
      projects.forEach((project, index) => {
        project.newFiles.forEach((file) => formData.append(`projectImages_${index}`, file));
      });
      const { data } = await contractorApi.updateMe(formData);
      setProjects((data.data.previousProjects || []).map((project) => ({ ...project, newFiles: [] })));
      toast.success('Past work updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update past work');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="skeleton h-96 w-full" />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-heading font-bold text-ink mb-2">Past Work</h1>
      <p className="text-sm text-muted mb-6">Manage the projects and photos displayed on your public contractor profile.</p>

      <form onSubmit={saveProjects} className="space-y-4">
        <div className="flex justify-end">
          <button type="button" onClick={addProject} className="btn-secondary !px-3 !py-2 text-sm">
            <FaCloudUploadAlt /> Add Project
          </button>
        </div>
        {projects.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">No past projects yet. Add a project to feature it on your public profile.</div>
        )}
        {projects.map((project, index) => (
          <ProjectEditor
            key={project._id || `project-${index}`}
            project={project}
            index={index}
            onChange={updateProject}
            onRemove={(projectIndex) => setProjects((current) => current.filter((_, currentIndex) => currentIndex !== projectIndex))}
          />
        ))}
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving...' : 'Save Past Work'}
        </button>
      </form>
    </div>
  );
};

export default PastWorkPage;