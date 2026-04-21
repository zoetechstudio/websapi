import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FarmFilters = ({ activeFarm, onSelect }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch('/api/farms');
        if (!response.ok) throw new Error('Failed to fetch farms');
        const data = await response.json();
        setFarms(data);
      } catch (err) {
        console.error('Error fetching farms:', err);
        // Fallback
        setFarms([
          { id: 1, name: 'Purnama Farm' },
          { id: 2, name: 'Nusantara Livestock' },
          { id: 3, name: 'Berkah Tani Farm' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  if (loading) return <div className="h-20" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="rounded-[2.5rem] p-6 md:p-8 border border-primary-100 shadow-xl overflow-hidden h-full"
      style={{ backgroundColor: '#fffcf5' }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <p className="text-[10px] md:text-xs font-black text-primary-400 uppercase tracking-[0.5em] mb-2 text-center">
          Pilih Kandang Mitra
        </p>
        <div className="w-12 h-0.5 rounded-full bg-primary-200" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3">
        {farms.map((f, index) => {
          const isActive = activeFarm === f.name || (activeFarm === 'Semua Kandang' && false);
          return (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(f.name === activeFarm ? 'Semua Kandang' : f.name)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl
                          transition-all duration-300 border-2 text-left ${
                isActive
                  ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200'
                  : 'bg-[#fefce8] border-yellow-100 text-primary-400 hover:bg-yellow-50 hover:border-yellow-200 hover:text-primary-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
                              ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                🏠
              </div>
              <span className="uppercase tracking-widest font-black text-[9px] md:text-[10px] flex-1">
                {f.name}
              </span>
              {isActive && (
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FarmFilters;
