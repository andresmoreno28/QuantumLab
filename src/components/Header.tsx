import React from 'react';
import { Link } from 'react-router-dom';
import { Library } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center text-2xl font-bold">
            <Library size={32} className="mr-2" />
            Component Library
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-200 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/add-component" className="hover:text-gray-200 transition-colors duration-200">
                  Add Component
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;