import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    sku: '', name: '', category: '', supplier: '', price: 0, stock: 0, minStock: 10
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
      setEditingId(product._id);
    } else {
      setFormData({ sku: '', name: '', category: '', supplier: '', price: 0, stock: 0, minStock: 10 });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        toast.success('Product updated');
      } else {
        await api.post('/products', formData);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredProducts = products?.filter(p => 
    (p.name && p.name.toLowerCase().includes(search.toLowerCase())) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100/50">
        <div className="p-4 border-b border-slate-200 flex items-center bg-slate-50/50">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search SKU or Name..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Stock</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredProducts.map(product => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{product.sku}</td>
                  <td className="px-6 py-4 text-slate-700">{product.name}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 text-right">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${product.stock < product.minStock ? 'text-red-600' : 'text-slate-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center space-x-3">
                    <button onClick={() => handleOpenModal(product)} className="text-slate-400 hover:text-brand-600 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">{editingId ? 'Edit Product' : 'Add Product'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">SKU</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} disabled={!!editingId} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier</label>
                  <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Initial Stock</label>
                  <input required type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} disabled={!!editingId} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Min Stock Alert</label>
                  <input required type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-lg hover:bg-brand-700 transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
