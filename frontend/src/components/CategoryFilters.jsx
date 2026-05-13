import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const CategoryFilters = ({ activeCategory, onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        
        // Use data directly without adding "Semua Kategori"
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback dummy if failed
        setCategories([
          { id: 1, name: 'Ekonomis', icon: '🐄' },
          { id: 2, name: 'Medium', icon: '🐄' },
          { id: 3, name: 'Premium', icon: '🐄' },
          { id: 4, name: 'Kambing Domba', icon: '🐑' },
          { id: 5, name: 'Sapi Bali', icon: '🐂' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="h-20" />;

  return (
    <div className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2.5rem] p-6 md:p-10 border border-primary-100 shadow-xl overflow-hidden h-full flex flex-col justify-center"
        style={{ backgroundColor: '#fffcf5' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-[10px] md:text-xs font-black text-primary-400 uppercase tracking-[0.5em] mb-2 text-center">
            Pilih Kategori Hewan
          </p>
          <div className="w-12 h-0.5 rounded-full bg-primary-200" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat.name;
            return (
              <motion.button
                key={cat.id || cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(cat.name)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center justify-center gap-2.5 px-3 py-6 rounded-3xl
                            transition-all duration-300 border-2 ${
                  isActive
                    ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200'
                    : 'bg-[#fefce8] border-yellow-100 text-primary-400 hover:bg-yellow-50 hover:border-yellow-200 hover:text-primary-600'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-1
                                ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                  {cat.icon || '🐄'}
                </div>
                <span className="uppercase tracking-widest font-black text-[9px] md:text-[10px]">
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryFilters;