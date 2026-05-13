import React, { useState, useEffect } from 'react';
import { Package, Tent, Tags, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, farms: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, farmRes, catRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/farms`),
          fetch(`${API_BASE_URL}/categories`)
        ]);

        const [prodData, farmData, catData] = await Promise.all([
          prodRes.json(), farmRes.json(), catRes.json()
        ]);

        setStats({
          products: prodData.length || 0,
          farms: farmData.length || 0,
          categories: catData.length || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary-500" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Selamat datang di Admin Panel IndoPalm Sapi.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sapi</p>
            <p className="text-3xl font-black text-gray-900">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Tent className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Kandang Mitra</p>
            <p className="text-3xl font-black text-gray-900">{stats.farms}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Tags className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Kategori</p>
            <p className="text-3xl font-black text-gray-900">{stats.categories}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
