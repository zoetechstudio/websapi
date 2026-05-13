import React from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';



const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const FarmList = ({ activeFarm, onSelectFarm }) => {
  const [farms, setFarms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/farms`);
        if (!response.ok) throw new Error('Failed to fetch farms');
        const data = await response.json();
        
        // Map API data to component structure
        const mappedFarms = data.map(f => ({
          id: f.id,
          name: f.name,
          location: f.location,
          image: f.image_url,
          description: f.description,
          badge: f.badge,
          stats: { 
            sapi: f.stats_sapi, 
            luas: f.stats_luas, 
            tahun: f.stats_tahun 
          },
          accent: f.accent_color
        }));
        
        setFarms(mappedFarms);
      } catch (err) {
        console.error('Error fetching farms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  if (loading) return <div className="h-40" />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-10 mb-6">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-primary-400 mb-2">Rekanan Resmi</p>
        <h2
          className="text-3xl md:text-4xl font-black text-primary-800 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Mitra Peternakan
        </h2>
        <p className="text-silver-500 font-medium mt-2 text-sm max-w-md mx-auto">
          {farms.length} kandang terverifikasi yang siap memenuhi kebutuhan qurban Anda dengan kualitas terbaik
        </p>
        <div className="w-16 h-0.5 mx-auto mt-5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #8c6239, #94a3b8)' }} />
      </motion.div>

      {/* Farm cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {farms.map((farm, index) => {
          const isActive = activeFarm === farm.id;
          return (
            <motion.div
              key={farm.id}
              variants={item}
              whileHover={{ y: -8 }}
              onClick={() => onSelectFarm(farm.name)}
              className={`cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-300 bg-white group ${
                isActive
                  ? 'border-primary-500 shadow-2xl shadow-primary-200/50'
                  : 'border-primary-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50'
              }`}
            >
              {/* Image */}
              <div className="h-52 overflow-hidden relative">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-900/30 to-transparent" />

                {/* Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-primary-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {farm.badge}
                  </span>
                </div>

                {/* Verified pill */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">
                    ✓ Terverifikasi
                  </span>
                </div>

                {/* Index number - decorative */}
                <div className="absolute top-4 left-4">
                  <span className="text-white/20 text-5xl font-black leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-black text-primary-800 mb-1.5 group-hover:text-primary-600 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {farm.name}
                </h3>
                <p className="text-sm font-medium text-silver-500 mb-4 leading-relaxed line-clamp-2">
                  {farm.description}
                </p>

                {/* Stats row: Location and Since */}
                <div className="grid grid-cols-[1.5fr_1fr] gap-2 mb-4">
                  <div className="bg-primary-50 rounded-2xl px-4 py-3 flex flex-col justify-center border border-primary-100/50">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-400 mb-0.5">Lokasi Mitra</p>
                    <p className="text-[11px] font-black text-primary-800 flex items-center gap-1.5 truncate">
                      <span className="text-xs">📍</span> {farm.location}
                    </p>
                  </div>
                  <div className="bg-primary-50 rounded-2xl px-3 py-3 text-center border border-primary-100/50 flex flex-col justify-center">
                    <p className="text-sm font-black text-primary-700" style={{ fontFamily: "'Playfair Display', serif" }}>{farm.stats.tahun}</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-400">Berdiri Sejak</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FarmList;
