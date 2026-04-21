import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import CategoryFilters from '../components/CategoryFilters';
import FarmFilters from '../components/FarmFilters';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, X } from 'lucide-react';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('category') || 'Semua Kategori';
  const farm     = searchParams.get('farm')     || 'Semua Kandang';
  const search   = searchParams.get('search')   || '';

  const [localSearch, setLocalSearch] = useState(search);

  const handleCategorySelect = (cat) => setSearchParams({ category: cat, farm, search });
  const handleFarmSelect     = (f)   => setSearchParams({ category, farm: f, search });
  const handleSearchSubmit   = ()    => setSearchParams({ category, farm, search: localSearch });

  const resetCategory = () => setSearchParams({ category: 'Semua Kategori', farm, search });
  const resetFarm     = () => setSearchParams({ category, farm: 'Semua Kandang', search });

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4">

      {/* ── Page header ── */}
      <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">

        {/* Left */}
        <div className="flex items-center gap-4 flex-wrap">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-100 text-primary-700
                       font-bold text-sm hover:bg-primary-200 transition-all"
          >
            <ChevronLeft className="h-4 w-4 stroke-2" />
            Kembali
          </motion.button>

          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 eyebrow leading-none">Katalog</p>
            <div className="flex items-center gap-2 flex-wrap">
              {category && category !== 'Semua Kategori' ? (
                <div className="bg-primary-500 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary-200">
                  <span className="text-[10px] font-black leading-none uppercase tracking-wider">
                    Kategory: {category}
                  </span>
                  <button onClick={resetCategory} className="hover:bg-white/20 p-0.5 rounded-full transition-colors">
                    <X className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-black text-primary-800 leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Semua Sapi
                </h2>
              )}

              {farm && farm !== 'Semua Kandang' && (
                <div className="bg-silver-500 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-silver-200">
                  <span className="text-[10px] font-black leading-none uppercase tracking-wider">
                    🏠 {farm}
                  </span>
                  <button onClick={resetFarm} className="hover:bg-white/20 p-0.5 rounded-full transition-colors">
                    <X className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: search */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-primary-200
                        shadow-sm bg-white w-full sm:max-w-xs focus-within:ring-4 focus-within:ring-primary-50 transition-all">
          <input
            type="text"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Cari sapi..."
            className="flex-1 px-3 py-1.5 text-sm text-silver-700 focus:outline-none font-medium bg-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearchSubmit}
            className="p-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-md shadow-primary-200"
          >
            <Search className="h-4 w-4 stroke-[3]" />
          </motion.button>
        </div>
      </div>

      {/* ── Filters Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-8 h-full">
          <CategoryFilters
            activeCategory={category}
            onSelect={handleCategorySelect}
          />
        </div>
        <div className="lg:col-span-4 h-full">
          <FarmFilters
            activeFarm={farm}
            onSelect={handleFarmSelect}
          />
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="mt-8">
        <ProductGrid categoryId={category} farmName={farm} searchQuery={search} />
      </div>

      {/* ── Pagination ── */}
      <div className="mt-10 flex justify-center items-center gap-2">
        {[1, 2, '›'].map((page, i) => (
          <button
            key={i}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
              page === 1
                ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                : 'bg-white border border-primary-200 text-primary-500 hover:bg-primary-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
