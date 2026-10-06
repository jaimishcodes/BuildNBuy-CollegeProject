import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

const ImageGallery = ({ images = [] }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return <div className="skeleton h-96 w-full rounded-2xl" />;

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-4 gap-3 h-[420px]">
        <div className="col-span-4 md:col-span-3 relative rounded-2xl overflow-hidden group">
          <img src={images[active]?.url} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaExpand />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                <FaChevronLeft />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
        <div className="hidden md:flex md:col-span-1 flex-col gap-3 overflow-y-auto">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-xl overflow-hidden h-24 shrink-0 border-2 transition-colors ${
                active === i ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          >
            <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 text-white text-2xl">
              <FaTimes />
            </button>
            <button onClick={prev} className="absolute left-6 text-white text-3xl">
              <FaChevronLeft />
            </button>
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[active]?.url}
              alt=""
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            <button onClick={next} className="absolute right-6 text-white text-3xl">
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
