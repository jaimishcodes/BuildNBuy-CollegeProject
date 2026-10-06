import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../utils/motion';

const categories = [
  {
    title: 'Buy a Property',
    desc: 'Explore homes, apartments and plots ready for purchase.',
    to: '/properties?listingType=Sale',
    img: 'photo-1613977257363-707ba9348227',
  },
  {
    title: 'Rent a Property',
    desc: 'Find fully furnished or semi-furnished rentals near you.',
    to: '/properties?listingType=Rent',
    img: 'photo-1512917774080-9991f1c4c750',
  },
  {
    title: 'List Your Property',
    desc: 'Sell or rent out your property to thousands of buyers.',
    to: '/dashboard/list-property',
    img: 'photo-1560448204-e02f11c3d0e2',
  },
];

const BuyRentCategories = () => (
  <section className="bg-section section-padding">
    <div className="container-x">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-3xl md:text-4xl font-heading font-bold text-ink mb-10 text-center"
      >
        Whatever Your Goal, We've Got You
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.title}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Link to={c.to} className="card overflow-hidden block group h-full">
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${c.img}?auto=format&fit=crop&w=900&q=80`}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-ink mb-2">{c.title}</h3>
                <p className="text-muted text-sm">{c.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BuyRentCategories;
