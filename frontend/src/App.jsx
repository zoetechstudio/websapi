import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import { motion, useScroll, useSpring } from 'framer-motion';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <Router>
      <div className="min-h-screen bg-primary-50 flex flex-col">
        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[100]"
          style={{ scaleX, background: 'linear-gradient(90deg, #8c6239, #b97e51, #64748b)' }}
        />

        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/catalog"             element={<Catalog />} />
            <Route path="/catalog/detail/:id"  element={<ProductDetail />} />
          </Routes>
        </main>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer
          className="text-white pt-16 pb-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #2c1a10 0%, #1a0f08 60%, #0f0905 100%)' }}
        >
          {/* Decorative background texture */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Warm bronze radial glow top-center */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 rounded-full"
              style={{ background: 'radial-gradient(ellipse, #b97e51 0%, transparent 70%)' }} />
            {/* Silver koin shimmer bottom-right */}
            <div className="absolute bottom-0 right-0 w-72 h-72 opacity-5 rounded-full"
              style={{ background: 'radial-gradient(circle, #94a3b8 0%, transparent 70%)' }} />
            {/* Grain pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '128px',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">

            {/* ── BRAND HERO — BIG ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center gap-0 mb-3"
            >
              {/*
                ══ BRAND NAME: "ind" + LOGO BULAT GANTI "o" + "palm" + "Sapi" ══
                Logo circular menggantikan huruf "o" di "indo"
              */}

              {/* "ind" */}
              <span
                className="text-5xl md:text-7xl font-black tracking-tight leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#e8c285',
                  textShadow: '0 2px 20px rgba(184,126,81,0.3)',
                }}
              >
                ind
              </span>

              {/* Logo menggantikan huruf "o" — BULAT, SANGAT BESAR */}
              <span className="inline-flex items-center justify-center mx-2 md:mx-4" style={{ lineHeight: 1 }}>
                <motion.img
                  src="/Logo%20Farm.png"
                  alt="o"
                  className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 6px 24px rgba(184,126,81,0.65))',
                    transform: 'translateY(4px)',
                  }}
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
                />
              </span>

              {/* "palm" */}
              <span
                className="text-5xl md:text-7xl font-black tracking-tight leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#e8c285',
                  textShadow: '0 2px 20px rgba(184,126,81,0.3)',
                }}
              >
                palm
              </span>

              {/* "Sapi" — silver accent */}
              <span
                className="text-5xl md:text-7xl font-black tracking-tight leading-none ml-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#94a3b8',
                  textShadow: '0 2px 20px rgba(148,163,184,0.2)',
                }}
              >
                Sapi
              </span>
            </motion.div>

            {/* IPS badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex justify-center mb-5"
            >
              <span
                className="px-4 py-1.5 rounded-xl text-sm font-black tracking-[0.35em] uppercase border"
                style={{
                  background: 'linear-gradient(135deg, #8c6239, #b97e51)',
                  borderColor: '#b97e51',
                  color: '#fff',
                  boxShadow: '0 2px 12px rgba(140,98,57,0.4)',
                }}
              >
                IPS
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-primary-300/60 text-xs font-bold tracking-[0.45em] uppercase mb-8"
            >
              Solusi Qurban Lebih Ringan, Terencana &amp; Bermakna
            </motion.p>

            {/* Divider koin shimmer */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="h-px w-32 opacity-20"
                style={{ background: 'linear-gradient(90deg, transparent, #b97e51, transparent)' }} />
              <div className="mx-4 w-1.5 h-1.5 rounded-full bg-primary-400/40" />
              <div className="h-px w-32 opacity-20"
                style={{ background: 'linear-gradient(90deg, transparent, #94a3b8, transparent)' }} />
            </div>

            {/* Partners micro-label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-primary-500/50 text-[10px] font-black uppercase tracking-[0.5em] mb-2"
            >
              Mitra Kandang
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="text-primary-400/40 text-[11px] font-semibold mb-8 tracking-wide"
            >
              Purnama Farm · Nusantara Livestock · Berkah Tani Farm
            </motion.p>

            {/* Copyright */}
            <p className="text-primary-600/40 text-[10px] font-bold uppercase tracking-[0.4em]">
              © 2026 IndoPalm Sapi (IPS) · All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;