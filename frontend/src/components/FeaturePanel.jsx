import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🌙',
    title: 'Lebih Ringan',
    desc: 'Cicil tabungan qurban sesuai kemampuan, tanpa beban di momen terakhir.',
    highlight: true,
  },
  {
    icon: '📅',
    title: 'Lebih Terencana',
    desc: 'Rencanakan qurban dari jauh hari. Pilih waktu dan hewan yang terbaik.',
    highlight: false,
  },
  {
    icon: '✨',
    title: 'Lebih Bermanfaat',
    desc: 'Qurban tersalurkan tepat sasaran ke yang membutuhkan, langsung dari farm.',
    highlight: false,
  },
  {
    icon: '🛡️',
    title: 'Terpercaya',
    desc: 'Mitra kandang terverifikasi dan transparan — kamu tahu hewanmu ada di mana.',
    highlight: false,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const FeaturePanel = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-6 w-full">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {features.map((f, index) => (
          <motion.div
            key={f.title}
            variants={item}
            className={`relative rounded-2xl px-5 py-6 flex flex-col items-center text-center gap-3
                       shadow-sm border transition-all duration-300 cursor-default
                       hover:shadow-md hover:-translate-y-1`}
            style={{
              backgroundColor: index === 0 ? '#f0f9ff' : index === 1 ? '#f0fdf4' : index === 2 ? '#fdf2f8' : '#fff7ed',
              borderColor: 'rgba(0,0,0,0.05)',
            }}
          >
            {/* Silver koin accent top-right */}
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-5"
              style={{ background: 'radial-gradient(circle, #64748b 0%, transparent 70%)' }}
            />

            {/* Icon circle */}
            <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-2xl
                            border border-black/5 shadow-inner relative z-10">
              {f.icon}
            </div>

            <h3 className="font-black text-primary-900 text-sm tracking-tight leading-tight relative z-10"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {f.title}
            </h3>
            <p className="text-primary-800/70 text-xs font-medium leading-relaxed relative z-10">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturePanel;
