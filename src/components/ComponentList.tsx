import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import useComponentStore from '../hooks/useComponentStore';
import Button from './ui/Button';
import Input from './ui/Input';
import CategoryManager from './CategoryManager';

const ComponentList: React.FC = () => {
  const { components, categories } = useComponentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const filteredComponents = components.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(component.category);
    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Component Library</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative flex-grow mr-4 w-full md:w-auto mb-4 md:mb-0">
          <Input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="mr-2"
          >
            {showCategoryManager ? 'Hide' : 'Manage'} Categories
          </Button>
          <Link to="/add-component">
            <Button>
              <Plus size={20} className="mr-2" />
              Add New Component
            </Button>
          </Link>
        </div>
      </div>
      {showCategoryManager && <CategoryManager />}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategories.includes(category.id) ? 'primary' : 'secondary'}
              onClick={() => handleCategoryToggle(category.id)}
              className="text-sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <div key={component.id} className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{component.name}</h2>
            <p className="text-gray-600 mb-4">{component.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{categories.find(c => c.id === component.category)?.name}</span>
              <Link to={`/component/${component.id}`}>
                <Button variant="secondary">View Details</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {filteredComponents.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No components found.</p>
      )}
    </div>
  );
};

export default ComponentList;