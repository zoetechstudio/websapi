import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const ProductGrid = ({ categoryId, farmName, searchQuery, limit }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (categoryId) queryParams.append('category', categoryId);
        if (farmName)   queryParams.append('farm', farmName);
        if (searchQuery) queryParams.append('search', searchQuery);

        const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, farmName, searchQuery]);

  const display = limit ? products.slice(0, limit) : products;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const kategoriColor = (k) => {
    if (k === 'Premium') return { bg: '#8c6239', text: '#fff' };
    if (k === 'Medium')  return { bg: '#64748b', text: '#fff' };
    return { bg: '#e8c285', text: '#7a5232' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <p className="text-silver-500 font-bold animate-pulse">Memuat Sapi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-primary-500 underline">Coba Lagi</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-silver-500 font-bold text-lg">Tidak ada sapi yang ditemukan.</p>
        <p className="text-silver-400 text-sm mt-1">Gunakan kata kunci lain atau hapus filter.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {display.map((p) => {
        const kColor = kategoriColor(p.category_name);
        return (
          <motion.div
            key={p.id}
            variants={item}
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/catalog/detail/${p.id}`)}
            className="bg-white rounded-3xl overflow-hidden border border-primary-100
                       shadow-sm hover:shadow-xl hover:shadow-primary-100/60
                       cursor-pointer group transition-all duration-300"
          >
            {/* Image placeholder */}
            <div className="h-52 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #f9f4ef 0%, #e2e8f0 100%)' }}>
              
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[7rem] opacity-[0.07] select-none">🐂</span>
                </div>
              )}
              
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(135deg, #b97e51 0%, transparent 50%)' }} />

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black px-3 py-1 rounded-full shadow-md tracking-wider uppercase"
                  style={{ background: kColor.bg, color: kColor.text }}>
                  {p.category_name}
                </span>
              </div>

              {/* Code badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-white/80 backdrop-blur-sm text-silver-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-silver-200">
                  {p.kode_unik}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-all duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-base font-black text-primary-800 mb-1 truncate group-hover:text-primary-600 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {p.name}
              </h3>

              <p className="text-2xl font-black text-primary-500 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Rp {p.harga.toLocaleString('id-ID')}
              </p>

              {/* Specs row */}
              <div className="flex items-center gap-2 text-xs font-semibold text-silver-500 mb-5 flex-wrap">
                <span className="flex items-center gap-1 bg-silver-50 px-2.5 py-1.5 rounded-lg border border-silver-100">
                  🏠 {p.farm_name}
                </span>
                <span className="flex items-center gap-1 bg-silver-50 px-2.5 py-1.5 rounded-lg border border-silver-100">
                  🐂 {p.jenis}
                </span>
                {p.bobot && (
                  <span className="flex items-center gap-1 bg-silver-50 px-2.5 py-1.5 rounded-lg border border-silver-100">
                    ⚖️ {p.bobot}kg
                  </span>
                )}
              </div>

              {/* CTA */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold
                                 border-2 border-primary-200 text-primary-600
                                 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white
                                 transition-all duration-300">
                Lihat Detail
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProductGrid;
