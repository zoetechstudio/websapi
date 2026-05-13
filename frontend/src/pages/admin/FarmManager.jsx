import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit, X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const FarmManager = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    badge: 'Premium',
    image_url: '',
    stats_sapi: '0',
    stats_luas: '0 m2',
    stats_tahun: '2024',
    accent_color: '#8c6239'
  });

  const formatGDriveLink = (input) => {
    if (!input) return '';
    // Jika input adalah URL Google Drive, ambil ID-nya
    if (input.includes('drive.google.com') || input.includes('lh3.googleusercontent.com')) {
      const regex = /\/d\/([^/=]+)/;
      const match = input.match(regex);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=s1000?authuser=0`;
      }
    }
    // Jika input bukan URL (berarti kemungkinan besar ID Drive), format jadi link lh3
    if (!input.startsWith('http')) {
      return `https://lh3.googleusercontent.com/d/${input}=s1000?authuser=0`;
    }
    return input;
  };

  const fetchFarms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/farms`);
      const data = await res.json();
      setFarms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleOpenModal = (farm = null) => {
    if (farm) {
      setEditingId(farm.id);
      setFormData({
        name: farm.name,
        location: farm.location,
        description: farm.description || '',
        badge: farm.badge || 'Premium',
        image_url: farm.image_url || '',
        stats_sapi: farm.stats_sapi || '0',
        stats_luas: farm.stats_luas || '0 m2',
        stats_tahun: farm.stats_tahun || '2024',
        accent_color: farm.accent_color || '#8c6239'
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        badge: 'Premium',
        image_url: '',
        stats_sapi: '0',
        stats_luas: '0 m2',
        stats_tahun: '2024',
        accent_color: '#8c6239'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE_URL}/farms/${editingId}` : `${API_BASE_URL}/farms`;

    const processedData = {
      ...formData,
      image_url: formatGDriveLink(formData.image_url)
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(processedData)
      });
      if (!res.ok) throw new Error('Gagal menyimpan data');
      setIsModalOpen(false);
      fetchFarms();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus kandang ini? (Sapi yang ada di kandang ini mungkin akan error)')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE_URL}/farms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus kandang');
      }
      fetchFarms();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary-500" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-900">Kelola Kandang (Farms)</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-bold transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tambah Kandang
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Nama Kandang</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Badge</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {farms.map(f => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-sm text-gray-900">{f.name}</td>
                  <td className="p-4 text-sm text-gray-600">{f.location}</td>
                  <td className="p-4"><span className="bg-primary-100 text-primary-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">{f.badge || '-'}</span></td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(f)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(f.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900">{editingId ? 'Edit Kandang' : 'Tambah Kandang Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Nama Kandang</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Lokasi</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Badge</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.badge}
                    onChange={e => setFormData({...formData, badge: e.target.value})}
                    placeholder="Contoh: Premium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Tahun Berdiri</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.stats_tahun}
                    onChange={e => setFormData({...formData, stats_tahun: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Deskripsi</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium h-24"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">ID Google Drive / URL Gambar</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Masukkan ID Google Drive saja atau link gambar"
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-sm transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmManager;
