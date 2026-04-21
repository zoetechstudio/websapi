import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const categories = ['Ekonomis', 'Medium', 'Premium', 'Kambing', 'Sapi Bali'];
const farms      = ['Semua Kandang', 'Purnama Farm', 'Nusantara Livestock', 'Berkah Tani Farm'];

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled,       setIsScrolled]       = useState(false);
  const [filterOpen,       setFilterOpen]        = useState(false);
  const [searchQuery,      setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedFarm,     setSelectedFarm]      = useState('Semua Kandang');
  const [categoryOpen,     setCategoryOpen]      = useState(false);
  const [farmOpen,         setFarmOpen]          = useState(false);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleClose = () => {
    setFilterOpen(false);
    setCategoryOpen(false);
    setFarmOpen(false);
  };

  const handleSearch = () => {
    navigate(`/catalog?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}&farm=${encodeURIComponent(selectedFarm)}`);
    setFilterOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/97 backdrop-blur-xl shadow-lg border-b border-primary-100'
          : 'bg-white border-b border-silver-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full">

          {/* Logo */}
          <div className="w-full md:w-auto flex justify-start">
            <Link to="/" className="flex-shrink-0">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
                <img
                  src="/Logo%20Farm.png"
                  alt="IPS"
                  className="h-12 md:h-14 w-auto drop-shadow-md"
                />
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-400/80"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Platform Qurban
                  </span>
                  <span
                    className="text-[23px] md:text-[26px] font-black tracking-tight leading-none"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#8c6239' }}
                  >
                    indopalm<span style={{ color: '#64748b' }}>Sapi</span>
                  </span>
                </div>
                <span className="px-2 py-1 bg-[#8c6239] text-white rounded-lg text-[10px] font-black tracking-widest shadow-md self-center">IPS</span>
              </motion.div>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="w-full md:flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Cari sapi kurban..."
                className="w-full h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-4 pr-12 text-[#334155] text-sm font-medium placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#8c6239]/40 focus:border-[#8c6239] transition-all shadow-inner"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-[#8c6239] hover:bg-[#754b2a] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex-shrink-0 flex items-center justify-center gap-2 h-11 px-3 sm:px-4 rounded-xl font-bold text-sm transition-all border ${
                filterOpen
                  ? 'bg-[#8c6239] text-white border-[#8c6239] shadow-inner'
                  : 'bg-[#f5ede6] text-[#8c6239] border-[#e7d2c3] hover:bg-[#e7d2c3]'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:block">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Drawer */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="z-50"
            >
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-4 pb-2 border-t border-[#e2e8f0] mt-3 relative">
                {/* Category */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => { setCategoryOpen(!categoryOpen); setFarmOpen(false); }}
                    className="w-full flex items-center justify-between gap-2 h-10 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl font-semibold text-sm hover:border-[#d4b097] transition-all shadow-sm"
                  >
                    <span className="truncate">{selectedCategory}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${categoryOpen ? 'rotate-180 text-[#8c6239]' : 'text-[#94a3b8]'}`} />
                  </button>
                  <AnimatePresence>
                    {categoryOpen && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-[#e2e8f0] z-50 min-w-[180px] py-2">
                        {['Semua Kategori', ...categories].map(c => (
                          <button key={c} onClick={() => { setSelectedCategory(c); setCategoryOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#f5ede6] ${
                              selectedCategory === c ? 'text-[#8c6239] font-bold bg-[#f5ede6]/50 border-l-2 border-[#8c6239]' : 'text-[#64748b] border-l-2 border-transparent'
                            }`}>{c}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Farm */}
                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => { setFarmOpen(!farmOpen); setCategoryOpen(false); }}
                    className="w-full flex items-center justify-between gap-2 h-10 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl font-semibold text-sm hover:border-[#d4b097] transition-all shadow-sm"
                  >
                    <span className="truncate">{selectedFarm}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${farmOpen ? 'rotate-180 text-[#8c6239]' : 'text-[#94a3b8]'}`} />
                  </button>
                  <AnimatePresence>
                    {farmOpen && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-[#e2e8f0] z-50 min-w-[200px] py-2">
                        {farms.map(f => (
                          <button key={f} onClick={() => { setSelectedFarm(f); setFarmOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#f5ede6] ${
                              selectedFarm === f ? 'text-[#8c6239] font-bold bg-[#f5ede6]/50 border-l-2 border-[#8c6239]' : 'text-[#64748b] border-l-2 border-transparent'
                            }`}>{f}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={handleSearch}
                  className="h-10 px-6 bg-[#8c6239] text-white font-bold text-sm rounded-xl hover:bg-[#754b2a] transition-all shadow-md">
                  Terapkan
                </button>
                <button onClick={() => { setSelectedCategory('Semua Kategori'); setSelectedFarm('Semua Kandang'); }}
                  className="h-10 px-5 bg-[#f8fafc] text-[#64748b] font-bold text-sm rounded-xl border border-[#e2e8f0] hover:bg-[#e2e8f0] transition-all">
                  Reset
                </button>
                <button onClick={handleClose}
                  className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-1.5 text-[#94a3b8] hover:text-[#8c6239] font-bold text-sm transition-colors py-2">
                  <X className="h-4 w-4" /> Tutup
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
