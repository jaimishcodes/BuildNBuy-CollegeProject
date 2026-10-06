import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { fadeUp, viewportOnce } from '../../utils/motion';

const values = [
  { icon: FaShieldAlt, title: 'Trust & Verification', desc: 'Every contractor and property goes through careful admin review.' },
  { icon: FaHeart, title: 'Customer First', desc: 'We build tools that put transparency and ease at the center of your journey.' },
  { icon: FaBullseye, title: 'One Platform', desc: 'Real estate and construction, seamlessly combined in a single experience.' },
];

const AboutPage = () => (
  <div>
    <section className="section-padding bg-section">
      <div className="container-x text-center max-w-2xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <span className="text-primary font-semibold text-sm">Welcome to BuildNBuy</span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-ink mt-3 mb-5">
            Your Real Estate Journey, Connected
          </h1>
          <p className="text-muted text-lg">
            Finding a place to call home or managing your property journey should feel seamless, transparent, and less stressful. BuildNBuy brings property search, listings, and connections with construction professionals together in one place.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-ink">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="container-x section-padding relative">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="max-w-3xl">
              <span className="text-white/80 font-semibold text-sm">Who We Are</span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mt-2 mb-4">
                A simpler way to move from searching to building
              </h2>
              <p className="text-white/90 leading-relaxed mb-4">
                BuildNBuy is a real estate and construction platform that connects property seekers, owners, and local contractors. We bring these parts of the home journey together so people can explore properties, share listings, and find professionals for their next project in one convenient place.
              </p>
              <p className="text-white/90 leading-relaxed">
                Our goal is to make each step easier to understand and act on. Property seekers can browse available options, owners can present their properties, and contractors can showcase their services and past work directly to potential clients.
              </p>
            </motion.div>
          </div>
    </section>

    <section className="section-padding container-x">
        <div className="text-center mb-10">
          <span className="text-primary font-semibold text-sm">What Guides Us</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mt-2">Built around trust and clarity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div key={v.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={viewportOnce} className="card p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <v.icon className="text-2xl text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-ink mb-2">{v.title}</h3>
              <p className="text-muted text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
    </section>

  </div>
);

export default AboutPage;
