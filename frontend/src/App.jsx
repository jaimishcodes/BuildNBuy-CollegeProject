import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layouts/MainLayout';
import CustomerLayout from './layouts/CustomerLayout';
import ContractorLayout from './layouts/ContractorLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public pages
import HomePage from './pages/customer/HomePage';
import PropertiesPage from './pages/customer/PropertiesPage';
import PropertyDetailsPage from './pages/customer/PropertyDetailsPage';
import ContractorsPage from './pages/customer/ContractorsPage';
import ContractorDetailsPage from './pages/customer/ContractorDetailsPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';
import NotFoundPage from './pages/customer/NotFoundPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PropertyInquiriesPage from './pages/property/PropertyInquiriesPage';

// Shared dashboard pages
import ProfilePage from './pages/customer/ProfilePage';

// Customer dashboard pages
import CustomerOverviewPage from './pages/customer/CustomerOverviewPage';
import ListPropertyPage from './pages/customer/ListPropertyPage';
import EditPropertyPage from './pages/customer/EditPropertyPage';
import MyPropertiesPage from './pages/customer/MyPropertiesPage';
import ConstructionRequirementsPage from './pages/customer/ConstructionRequirementsPage';

// Contractor dashboard pages
import ContractorOverviewPage from './pages/contractor/ContractorOverviewPage';
import ContractorProfilePage from './pages/contractor/ContractorProfilePage';
import ReceivedRequirementsPage from './pages/contractor/ReceivedRequirementsPage';
import PastWorkPage from './pages/contractor/PastWorkPage';

// Admin dashboard pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContractorManagementPage from './pages/admin/ContractorManagementPage';
import PropertyManagementPage from './pages/admin/PropertyManagementPage';
import ContactMessagesPage from './pages/admin/ContactMessagesPage';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:idOrSlug" element={<PropertyDetailsPage />} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/contractors/:id" element={<ContractorDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/build-your-home" element={<ContractorsPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Customer dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerOverviewPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="list-property" element={<ListPropertyPage />} />
          <Route path="edit-property/:id" element={<EditPropertyPage />} />
          <Route path="my-properties" element={<MyPropertiesPage />} />
          <Route path="property-inquiries" element={<PropertyInquiriesPage />} />
          <Route path="construction-requirements" element={<ConstructionRequirementsPage />} />
        </Route>

        {/* Contractor dashboard */}
        <Route
          path="/contractor"
          element={
            <ProtectedRoute roles={['contractor']}>
              <ContractorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ContractorOverviewPage />} />
          <Route path="profile" element={<ContractorProfilePage />} />
          <Route path="past-work" element={<PastWorkPage />} />
          <Route path="properties" element={<Navigate to="/contractor/dashboard" replace />} />
          <Route path="property-inquiries" element={<Navigate to="/contractor/dashboard" replace />} />
          <Route path="list-property" element={<Navigate to="/contractor/dashboard" replace />} />
          <Route path="edit-property/:id" element={<Navigate to="/contractor/dashboard" replace />} />
          <Route path="requirements" element={<ReceivedRequirementsPage />} />
        </Route>

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="contractors" element={<ContractorManagementPage />} />
          <Route path="properties" element={<PropertyManagementPage />} />
          <Route path="contact-messages" element={<ContactMessagesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
