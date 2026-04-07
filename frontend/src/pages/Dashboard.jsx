import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Package, AlertTriangle, ArrowRightLeft, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/reports/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center shadow-slate-100/50">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center shadow-slate-100/50">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Stock Value</p>
            <p className="text-2xl font-bold text-slate-800">${stats.totalStockValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center shadow-slate-100/50">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600 mr-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-slate-800">{stats.lowStockItemsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center shadow-slate-100/50">
          <div className="p-3 rounded-lg bg-violet-50 text-violet-600 mr-4">
            <ArrowRightLeft className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Recent Movements</p>
            <p className="text-2xl font-bold text-slate-800">{stats.recentTransactions.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm shadow-slate-100/50 col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Transactions Last 7 Days</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="transactions" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm shadow-slate-100/50">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex justify-between items-center">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {stats.recentTransactions.map((tx) => (
              <div key={tx._id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{tx.product?.name || 'Deleted Product'}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  tx.type === 'stock-in' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {tx.type === 'stock-in' ? '+' : '-'}{tx.quantity}
                </div>
              </div>
            ))}
            {stats.recentTransactions.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
