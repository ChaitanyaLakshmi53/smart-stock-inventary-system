import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft, History, FileText } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Inventory', path: '/inventory', icon: ArrowRightLeft },
    { name: 'Transactions', path: '/transactions', icon: History },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col transition-all duration-300 fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wide">SmartStock</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                  ? 'bg-brand-600 text-white' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
