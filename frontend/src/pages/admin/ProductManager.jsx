import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit, X, Eye } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kode_unik: '',
    name: '',
    jenis: '',
    bobot: '',
    posisi: '',
    harga: '',
    image_url: '',
    gallery: [],
    category_id: '',
    farm_id: '',
    is_active: true
  });
  const [galleryInput, setGalleryInput] = useState('');

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

  const fetchData = async () => {
    try {
      const [prodRes, catRes, farmRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/farms`)
      ]);
      const [prodData, catData, farmData] = await Promise.all([
        prodRes.json(), catRes.json(), farmRes.json()
      ]);
      setProducts(prodData);
      setCategories(catData);
      setFarms(farmData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        kode_unik: product.kode_unik,
        name: product.name,
        jenis: product.jenis || '',
        bobot: product.bobot || '',
        posisi: product.posisi || '',
        harga: product.harga,
        image_url: product.image_url || '',
        category_id: product.category_id || '',
        farm_id: product.farm_id || '',
        is_active: product.is_active
      });
      // Convert gallery array to comma-separated string for input
      if (product.gallery && Array.isArray(product.gallery)) {
        setGalleryInput(product.gallery.join(', '));
      } else {
        setGalleryInput('');
      }
    } else {
      setEditingId(null);
      setFormData({
        kode_unik: '',
        name: '',
        jenis: '',
        bobot: '',
        posisi: '',
        harga: '',
        image_url: '',
        gallery: [],
        category_id: '',
        farm_id: '',
        is_active: true
      });
      setGalleryInput('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE_URL}/products/${editingId}` : `${API_BASE_URL}/products`;

    // Process gallery string to array of formatted links
    const galleryArray = galleryInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '')
      .map(item => formatGDriveLink(item));

    const processedData = {
      ...formData,
      image_url: formatGDriveLink(formData.image_url),
      gallery: galleryArray
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
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus sapi ini?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus sapi');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary-500" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-900">Kelola Sapi</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-bold transition-colors"
        >
          <Plus className="h-5 w-5" />
          Tambah Sapi
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Nama Sapi</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Kandang</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {p.image_url ? (
                        <img src={p.image_url} alt="Sapi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs opacity-30">🐂</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-sm text-gray-900">{p.kode_unik}</td>
                  <td className="p-4 font-medium text-sm text-gray-700">{p.name}</td>
                  <td className="p-4 font-bold text-sm text-primary-600">Rp {p.harga.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-sm text-gray-600">{p.farm_name}</td>
                  <td className="p-4 text-sm text-gray-600">{p.category_name}</td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => window.open(`/catalog/detail/${p.id}`, '_blank')}
                      className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="View in Website"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleOpenModal(p)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus"
                    >
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
              <h2 className="text-xl font-black text-gray-900">{editingId ? 'Edit Sapi' : 'Tambah Sapi Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Kode Unik</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.kode_unik}
                    onChange={e => setFormData({...formData, kode_unik: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Nama Sapi</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Harga (Rp)</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.harga}
                    onChange={e => setFormData({...formData, harga: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Kategori</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Kandang (Farm)</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.farm_id}
                    onChange={e => setFormData({...formData, farm_id: e.target.value})}
                  >
                    <option value="">Pilih Kandang</option>
                    {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Bobot (Contoh: 950Kg)</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                    value={formData.bobot}
                    onChange={e => setFormData({...formData, bobot: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">ID Google Drive / URL Gambar (Utama)</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Masukkan ID Google Drive saja atau link gambar"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Galeri Foto (Pisahkan dengan Koma)</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 font-medium h-20"
                  value={galleryInput}
                  onChange={e => setGalleryInput(e.target.value)}
                  placeholder="Contoh: ID_DRIVE_1, ID_DRIVE_2, ID_DRIVE_3"
                />
                <p className="text-[10px] text-gray-400 mt-1">Masukkan ID-ID Google Drive yang ingin ditampilkan di galeri detail produk.</p>
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

export default ProductManager;
