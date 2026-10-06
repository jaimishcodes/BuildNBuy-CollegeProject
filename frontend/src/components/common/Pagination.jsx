import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const nums = Array.from({ length: pages }).map((_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-30 hover:bg-section"
      >
        <FaChevronLeft className="text-xs" />
      </button>
      {nums.slice(Math.max(0, page - 3), page + 2).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
            n === page ? 'bg-primary text-white' : 'border border-border hover:bg-section'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center disabled:opacity-30 hover:bg-section"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

export default Pagination;
