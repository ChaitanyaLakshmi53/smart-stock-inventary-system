import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { RefreshCcw } from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ productId: '', quantity: '', type: 'stock-in' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.quantity) return toast.error('Please fill all fields');
    
    setLoading(true);
    try {
      await api.post('/inventory/update', formData);
      toast.success('Inventory updated successfully');
      setFormData({ productId: '', quantity: '', type: 'stock-in' });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Quick Inventory Adjustment</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm shadow-slate-100/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Product</label>
            <select
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              <option value="" disabled>-- Choose a product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.sku} - {p.name} (Current: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Type</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.type === 'stock-in' 
                    ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setFormData({ ...formData, type: 'stock-in' })}
                >
                  Stock In
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.type === 'stock-out' 
                    ? 'bg-white text-rose-600 shadow-sm border border-rose-100' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                  onClick={() => setFormData({ ...formData, type: 'stock-out' })}
                >
                  Stock Out
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                placeholder="Enter amount"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <RefreshCcw className="animate-spin h-5 w-5 mr-2" />
              ) : null}
              {loading ? 'Processing...' : 'Confirm Transaction'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
        <RefreshCcw className="h-5 w-5 flex-shrink-0 text-blue-500" />
        <p>Use this tool to rapidly adjust stock levels when new shipments arrive or when items are utilized. All actions here are recorded in the transaction history.</p>
      </div>
    </div>
  );
};

export default Inventory;
