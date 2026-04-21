import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Share2, Heart, MapPin, Scale, CalendarDays, Tag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        // Set active image to gallery first item OR main image
        if (data.gallery && data.gallery.length > 0) {
          setActiveImg(data.gallery[0]);
        } else {
          setActiveImg(data.image_url);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        <p className="text-silver-500 font-bold">Memuat Detail Sapi...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center gap-6">
        <p className="text-red-500 font-black text-xl">Error: {error || 'Data tidak tersedia'}</p>
        <button onClick={() => navigate('/catalog')} className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold"> Kembali ke Katalog </button>
      </div>
    );
  }

  const handleWA = () => {
    const text = `Halo IndoPalm Sapi, saya tertarik dengan ${product.name} (Kode: ${product.kode_unik}). Bisa minta info lebih lanjut?`;
    window.open(`https://wa.me/628123456789?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Ensure we have a gallery array
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image_url];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Cek ${product.name} di IndoPalm Sapi!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link berhasil disalin ke clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">

        {/* Header Navigation Area */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-silver-400 font-bold text-xs tracking-widest uppercase
                       hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Katalog
          </motion.button>

          {/* Brand tag - Moved here */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-600 px-4 py-1.5 rounded-full
                             text-[10px] font-black tracking-widest uppercase">
            <img src="/Logo%20Farm.png" alt="IPS" className="h-4 w-4 object-contain" />
            IndoPalm Sapi (IPS)
          </motion.span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-start">

          {/* ── Left Column: Merged Gallery + Photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start"
          >
            {/* Gallery Panel (Docked) */}
            <div className="hidden lg:flex flex-col gap-3 bg-primary-900 border-y-4 border-l-4 border-primary-800 rounded-l-[3rem] p-3 py-6 shadow-2xl relative z-0 mt-12 -mr-1">
              <span className="text-[7px] font-black uppercase text-white/30 tracking-[0.3em] text-center mb-2">Galeri</span>
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImg(img)}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden cursor-pointer transition-all
                    ${activeImg === img ? 'border-primary-400 ring-4 ring-primary-100/20 shadow-lg' : 'border-primary-800 hover:border-primary-600'}`}
                >
                  <img src={img} alt={`${product.name} thumb ${i}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>

            {/* Main Stylized Panel */}
            <div className="flex-1 relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-primary-800 bg-primary-900 flex flex-col p-4 md:p-6 min-h-[550px] z-10">
              
              {/* Header section (Yellow) */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-[#c49a4d] flex flex-col items-center justify-center pt-2">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary-900/60 mb-1">
                  {product.jenis || 'Sapi Qurban'}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-primary-950 leading-none">
                  {product.kode_unik}
                </h3>
                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              </div>

              {/* Main Image Container */}
              <div className="relative z-10 mt-20 mb-6 bg-white rounded-[2rem] shadow-inner overflow-hidden aspect-square flex items-center justify-center border-[6px] border-white/50">
                {activeImg ? (
                  <img src={activeImg} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[8rem] opacity-10">🐂</span>
                )}
                
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={handleShare}
                    className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center
                                     text-primary-600 hover:text-primary-800 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Footer Area */}
              <div className="mt-auto flex flex-col items-center pb-2">
                <div className="flex w-full gap-2 mb-4 px-2">
                  {[
                    { label: 'Bobot', value: `${product.bobot}Kg`, icon: '⚖️' },
                    { label: 'Kategori', value: product.category_name, icon: '🏷️' },
                    { label: 'Kandang', value: product.farm_name, icon: '🏠' },
                  ].map(stat => (
                    <div key={stat.label} className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2 py-3 flex flex-col items-center justify-center gap-1">
                      <span className="text-base">{stat.icon}</span>
                      <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">{stat.label}</span>
                      <span className="text-[10px] font-black text-[#c49a4d] text-center line-clamp-1">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Horizontal Gallery */}
            <div className="lg:hidden flex overflow-x-auto gap-3 py-4 no-scrollbar mt-4">
              {gallery.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(img)} className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden ${activeImg === img ? 'border-primary-400' : 'border-white'}`}>
                  <img src={img} alt={`mob ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: details ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Title */}
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-black text-primary-900 mt-2 mb-1 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </h1>
            <h2 className="text-xl font-black text-primary-400 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              — Pilihan Terbaik Anda
            </h2>

            {/* Code */}
            <p className="text-silver-400 font-bold text-xs mb-8 tracking-[0.3em] uppercase">
              Kode: {product.kode_unik}
            </p>

            {/* Price card */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-primary-100">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-silver-100">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-silver-400 mb-1.5">
                  Harga Investasi
                </p>
                <p className="text-4xl font-black text-primary-500"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Rp {Number(product.harga).toLocaleString('id-ID').replace(/,/g, '.')}
                </p>
                <p className="text-xs text-silver-400 font-medium mt-1">Bisa dicicil · Hubungi kami</p>
              </div>

              {/* Specs */}
              <div className="space-y-3 mb-7">
                {[
                  { label: 'Kode Unik', value: product.kode_unik, icon: Tag },
                  { label: 'Bobot', value: `${product.bobot || '—'} Kg`, icon: Scale },
                  { label: 'Posisi', value: product.posisi || '—', icon: MapPin },
                  { label: 'Jenis', value: product.jenis || 'Sapi', icon: null, emoji: '🐂' },
                  { label: 'Mitra Farm', value: product.farm_name || 'Indopalm Farm', icon: null, emoji: '🏠' },
                  { label: 'Kategori', value: product.category_name || 'Umum', icon: CalendarDays },
                ].map(({ label, value, icon: Icon, emoji }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-silver-50 last:border-0">
                    <span className="flex items-center gap-2 text-sm font-semibold text-silver-400">
                      {Icon ? <Icon className="h-3.5 w-3.5" /> : <span className="text-sm">{emoji}</span>}
                      {label}
                    </span>
                    <span className="text-sm font-black text-primary-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWA}
                className="w-full py-4 rounded-2xl font-black text-sm
                           flex items-center justify-center gap-3 shadow-lg shadow-primary-200/60
                           transition-all"
                style={{
                  background: 'linear-gradient(135deg, #8c6239 0%, #b97e51 100%)',
                  color: 'white',
                }}
              >
                <MessageCircle className="h-5 w-5" />
                TANYA VIA WHATSAPP
              </motion.button>

              <p className="text-center text-xs text-silver-400 font-medium mt-3">
                Respon cepat · Mon–Sat 08.00–17.00 WIB
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
