import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-heading font-bold text-lg">B</div>
            <span className="font-heading font-bold text-xl">
              Build<span className="text-primary-light">N</span>Buy
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-5">
            Find a home, rent or sell your property, or build your dream home with a trusted contractor — all in one place.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/properties?listingType=Sale" className="hover:text-white">Buy Property</Link></li>
            <li><Link to="/properties?listingType=Rent" className="hover:text-white">Rent Property</Link></li>
            <li><Link to="/contractors" className="hover:text-white">Find Contractor</Link></li>
            <li><Link to="/dashboard/list-property" className="hover:text-white">List Your Property</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2"><FaMapMarkerAlt className="mt-1 text-primary-light shrink-0" /> Surat, Gujarat, India</li>
            <li className="flex items-center gap-2"><FaPhoneAlt className="text-primary-light shrink-0" /> +91 95584 53510</li>
            <li className="flex items-center gap-2"><FaEnvelope className="mt-1 text-primary-light shrink-0" /> <span className="break-all">hello@buildnbuy.com</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs text-white/50">
          <p>© {new Date().getFullYear()} BuildNBuy. All rights reserved.</p>
          <p>Buy. Rent. List. Build.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
