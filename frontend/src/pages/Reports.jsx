import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import { Download, FileText, Table } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load data for reports');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Report', 14, 15);
    
    const tableColumn = ["SKU", "Name", "Category", "Supplier", "Price", "Stock", "Status"];
    const tableRows = [];

    data.forEach(item => {
      const rowData = [
        item.sku,
        item.name,
        item.category,
        item.supplier,
        `$${item.price.toFixed(2)}`,
        item.stock.toString(),
        item.stock < item.minStock ? 'Low Stock' : 'Good'
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('inventory_report.pdf');
    toast.success('PDF Downloaded');
  };

  const csvHeaders = [
    { label: "SKU", key: "sku" },
    { label: "Product Name", key: "name" },
    { label: "Category", key: "category" },
    { label: "Supplier", key: "supplier" },
    { label: "Unit Price", key: "price" },
    { label: "Current Stock", key: "stock" },
    { label: "Minimum Threshold", key: "minStock" }
  ];

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">Reports & Exports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Export */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 hover:border-brand-300 transition-colors group cursor-pointer" onClick={exportPDF}>
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Export PDF Report</h3>
            <p className="text-sm text-slate-500 mt-1">Generate a formatted PDF document containing current inventory status.</p>
          </div>
          <button className="flex items-center text-red-600 font-medium text-sm mt-2">
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </button>
        </div>

        {/* CSV Export */}
        <CSVLink 
          data={data} 
          headers={csvHeaders} 
          filename="inventory_data.csv"
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 hover:border-brand-300 transition-colors group cursor-pointer"
          onClick={() => toast.success('CSV Downloaded')}
        >
          <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Table className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Export CSV Data</h3>
            <p className="text-sm text-slate-500 mt-1">Download raw inventory data in CSV format for Excel or other tools.</p>
          </div>
          <div className="flex items-center text-emerald-600 font-medium text-sm mt-2">
            <Download className="h-4 w-4 mr-2" /> Download CSV
          </div>
        </CSVLink>
      </div>
    </div>
  );
};

export default Reports;
