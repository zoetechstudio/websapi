import React from 'react';
import Hero from '../components/Hero';
import FeaturePanel from '../components/FeaturePanel';
import CategoryFilters from '../components/CategoryFilters';
import FarmList from '../components/FarmList';
import ProductGrid from '../components/ProductGrid';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pb-16">

      {/* Banner */}
      <Hero />

      {/* Feature pills */}
      <FeaturePanel />

      {/* Category grid */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <CategoryFilters
          activeCategory={null}
          onSelect={(cat) => navigate(`/catalog?category=${encodeURIComponent(cat)}`)}
        />
      </div>

      {/* Farm partner */}
      <FarmList
        activeFarm={null}
        onSelectFarm={(farm) => navigate(`/catalog?farm=${encodeURIComponent(farm)}`)}
      />

      {/* ── Featured products ── */}
      <div className="w-full max-w-7xl mx-auto px-4 mt-12">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 mb-2">
            Pilihan Terbaik Kami
          </p>
          <h2
            className="text-3xl md:text-4xl font-black text-primary-800 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sapi Qurban Pilihan
          </h2>
          <p className="text-silver-500 font-medium mt-2 text-sm">
            Temukan sapi terbaik untuk ibadah qurban Anda tahun ini
          </p>
          <div className="w-16 h-0.5 mx-auto mt-4 rounded-full"
            style={{ background: 'linear-gradient(90deg, #8c6239, #94a3b8)' }} />
        </motion.div>

        <ProductGrid limit={6} />

        {/* Show all CTA */}
        <div className="mt-10 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/catalog')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm
                       border-2 border-primary-300 text-primary-600
                       hover:bg-primary-500 hover:text-white hover:border-primary-500
                       transition-all duration-200 shadow-sm"
          >
            Tampilkan Semua Sapi
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Home;
