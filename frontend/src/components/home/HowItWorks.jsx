import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaSearch, FaCalendarCheck, FaHandshake, FaHardHat } from 'react-icons/fa';
import { fadeUp, viewportOnce } from '../../utils/motion';

const steps = [
  { icon: FaSearch, title: 'Search & Explore', desc: 'Browse verified properties or trusted contractors near you.' },
  { icon: FaCalendarCheck, title: 'Connect & Visit', desc: 'Book a site visit or a meeting directly through the platform.' },
  { icon: FaHandshake, title: 'Discuss & Decide', desc: 'Chat, negotiate, and finalize the details that matter to you.' },
  { icon: FaHardHat, title: 'Move In or Build', desc: 'Close the deal, or start building your dream home.' },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const lineX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
  <section ref={sectionRef} className="section-padding container-x relative overflow-hidden">
    <motion.div style={{ x: lineX }} className="absolute top-28 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center mb-14">
      <span className="text-primary font-semibold text-sm">Simple Process</span>
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-2">How BuildNBuy Works</h2>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((s, i) => (
        <motion.div
          key={s.title}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <s.icon className="text-2xl text-primary" />
          </div>
          <span className="absolute top-0 right-1/2 translate-x-12 -translate-y-1 text-4xl font-heading font-bold text-primary/10">
            0{i + 1}
          </span>
          <h3 className="font-heading font-semibold text-ink mb-2">{s.title}</h3>
          <p className="text-muted text-sm">{s.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
  );
};

export default HowItWorks;
