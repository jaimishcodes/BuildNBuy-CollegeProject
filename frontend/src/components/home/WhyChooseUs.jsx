import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaShieldAlt, FaUsers, FaHardHat, FaHome } from 'react-icons/fa';
import { fadeLeft, fadeRight, viewportOnce } from '../../utils/motion';

const points = [
  { icon: FaShieldAlt, title: 'Verified Listings', desc: 'Every property and contractor is reviewed by our admin team before going live.' },
  { icon: FaUsers, title: 'Trusted Community', desc: 'Thousands of buyers, renters, and contractors use BuildNBuy every month.' },
  { icon: FaHardHat, title: 'Skilled Contractors', desc: 'Compare experience, past projects, and genuine customer reviews.' },
  { icon: FaHome, title: 'End-to-End Support', desc: 'From search to site visit to construction — we support the full journey.' },
];

const WhyChooseUs = () => {
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
  <section className="section-padding container-x">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
      <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <span className="text-primary font-semibold text-sm">Why BuildNBuy</span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-2 mb-8">
          Everything You Need, All in One Trusted Place
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {points.map((p) => (
            <div key={p.title}>
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <p.icon className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-ink mb-1">{p.title}</h3>
              <p className="text-muted text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative overflow-hidden rounded-2xl shadow-cardHover">
        <motion.img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1000&q=80"
          alt="Happy family in new home"
          style={{ y: imageY, scale: 1.08 }}
          className="w-full h-[420px] object-cover will-change-transform"
        />
      </motion.div>
    </div>

  </section>
  );
};

export default WhyChooseUs;
