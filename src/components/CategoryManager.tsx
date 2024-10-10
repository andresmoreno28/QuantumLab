import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import useComponentStore from '../hooks/useComponentStore';
import Button from './ui/Button';
import Input from './ui/Input';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useComponentStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({ id: Date.now().toString(), name: newCategoryName.trim() });
      setNewCategoryName('');
    }
  };

  const handleUpdateCategory = (id: string) => {
    if (editedCategoryName.trim()) {
      updateCategory(id, editedCategoryName.trim());
      setEditingCategory(null);
      setEditedCategoryName('');
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Category Manager</h2>
      <div className="mb-4">
        <Input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter new category name"
          className="mr-2"
        />
        <Button onClick={handleAddCategory}>
          <Plus size={20} className="mr-2" />
          Add Category
        </Button>
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
            {editingCategory === category.id ? (
              <Input
                type="text"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                className="mr-2"
              />
            ) : (
              <span>{category.name}</span>
            )}
            <div>
              {editingCategory === category.id ? (
                <Button onClick={() => handleUpdateCategory(category.id)} className="mr-2">
                  Save
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingCategory(category.id);
                    setEditedCategoryName(category.name);
                  }}
                  className="mr-2"
                >
                  <Edit2 size={20} />
                </Button>
              )}
              <Button variant="danger" onClick={() => handleDeleteCategory(category.id)}>
                <Trash2 size={20} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;