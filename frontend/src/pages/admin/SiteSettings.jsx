import React, { useState, useEffect } from 'react';
import { Loader2, Save, Image, Globe, MessageCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const formatGDriveLink = (input) => {
  if (!input) return '';
  if (input.includes('drive.google.com') || input.includes('lh3.googleusercontent.com')) {
    const match = input.match(/\/d\/([^/=?&]+)/);
    if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}=s1000?authuser=0`;
  }
  if (!input.startsWith('http')) {
    return `https://lh3.googleusercontent.com/d/${input}=s1000?authuser=0`;
  }
  return input;
};

const SiteSettings = () => {
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);
  const [settings, setSettings] = useState({
    logo_url:        '',
    banner_url:      '',
    hero_title:      '',
    hero_subtitle:   '',
    whatsapp_number: '',
    site_name:       '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/settings`);
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const token = localStorage.getItem('adminToken');
    try {
      const processed = {
        ...settings,
        logo_url:   settings.logo_url   ? formatGDriveLink(settings.logo_url)   : '',
        banner_url: settings.banner_url ? formatGDriveLink(settings.banner_url) : '',
      };
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(processed),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      setSettings(processed);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin h-8 w-8 text-primary-500" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Pengaturan Website</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola logo, banner, dan konten utama website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-colors shadow-md"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Menyimpan...' : saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="space-y-6">

        {/* ── MEDIA ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <Image className="h-5 w-5 text-primary-500" />
            <h2 className="font-black text-gray-800">Media (Logo & Banner)</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Logo */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Logo (ID Google Drive atau URL)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-sm"
                value={settings.logo_url}
                onChange={e => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="Masukkan ID Google Drive atau URL gambar logo..."
              />
              {settings.logo_url && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formatGDriveLink(settings.logo_url)}
                    alt="Preview Logo"
                    className="h-16 w-16 object-contain rounded-xl border border-gray-200 bg-gray-50 p-1"
                    referrerPolicy="no-referrer"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-xs text-gray-400">Preview Logo</span>
                </div>
              )}
            </div>

            {/* Banner */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Banner Hero (ID Google Drive atau URL)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-sm"
                value={settings.banner_url}
                onChange={e => setSettings({ ...settings, banner_url: e.target.value })}
                placeholder="Masukkan ID Google Drive atau URL gambar banner..."
              />
              {settings.banner_url && (
                <div className="mt-3">
                  <img
                    src={formatGDriveLink(settings.banner_url)}
                    alt="Preview Banner"
                    className="w-full max-h-40 object-cover rounded-xl border border-gray-200"
                    referrerPolicy="no-referrer"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-xs text-gray-400 mt-1 block">Preview Banner</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── KONTEN HERO ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <Globe className="h-5 w-5 text-primary-500" />
            <h2 className="font-black text-gray-800">Konten Halaman Utama</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Nama Website</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-sm"
                value={settings.site_name}
                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                placeholder="Nama website..."
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Judul Hero (Teks Besar)</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-sm"
                value={settings.hero_title}
                onChange={e => setSettings({ ...settings, hero_title: e.target.value })}
                placeholder="Judul utama di banner..."
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Subjudul Hero</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-sm"
                value={settings.hero_subtitle}
                onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })}
                placeholder="Teks kecil di bawah judul..."
              />
            </div>
          </div>
        </div>

        {/* ── KONTAK ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <h2 className="font-black text-gray-800">Nomor WhatsApp</h2>
          </div>
          <div className="p-6">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">
              Nomor WA (format: 628xxx tanpa + atau spasi)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-sm"
              value={settings.whatsapp_number}
              onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="6281234567890"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Nomor ini akan digunakan untuk tombol "Tanya via WhatsApp" di setiap halaman produk.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SiteSettings;
