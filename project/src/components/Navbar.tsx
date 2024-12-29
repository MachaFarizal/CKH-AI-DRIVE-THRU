import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, BarChart2, Settings, Layout } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CKH Analytics</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" icon={<Layout />} active={isActive('/')}>
              Dashboard
            </NavLink>
            <NavLink to="/live" icon={<Camera />} active={isActive('/live')}>
              Live Monitor
            </NavLink>
            <NavLink to="/analytics" icon={<BarChart2 />} active={isActive('/analytics')}>
              Analytics
            </NavLink>
            <NavLink to="/settings" icon={<Settings />} active={isActive('/settings')}>
              Settings
            </NavLink>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Connect Camera
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
      active
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Navbar;