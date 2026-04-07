import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6 fixed top-0 right-0 left-64 z-10 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="text-xs text-slate-500">{user?.role}</span>
        </div>
        
        <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
          <User className="h-5 w-5" />
        </div>
        
        <button 
          onClick={logout}
          className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
