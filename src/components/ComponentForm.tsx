import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';
import useComponentStore from '../hooks/useComponentStore';
import Button from './ui/Button';
import Input from './ui/Input';
import LivePreview from './LivePreview';

const ComponentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addComponent, updateComponent, components, categories } = useComponentStore();
  const [activeTab, setActiveTab] = useState('html');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [html, setHtml] = useState('');
  const [styles, setStyles] = useState('');
  const [javascript, setJavascript] = useState('');
  const [isScss, setIsScss] = useState(false);

  useEffect(() => {
    if (id) {
      const component = components.find((c) => c.id === id);
      if (component) {
        setName(component.name);
        setDescription(component.description);
        setCategory(component.category);
        setHtml(component.html);
        setStyles(component.styles);
        setJavascript(component.javascript);
        setIsScss(component.isScss);
      }
    }
  }, [id, components]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const componentData = {
      id: id || uuidv4(),
      name,
      description,
      category,
      html,
      styles,
      javascript,
      isScss,
      versions: id ? components.find((c) => c.id === id)?.versions || [] : [],
    };

    if (id) {
      updateComponent(id, componentData);
      toast.success('Component updated successfully!');
    } else {
      addComponent(componentData);
      toast.success('Component added successfully!');
    }

    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Component' : 'Add New Component'}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <LivePreview html={html} styles={styles} javascript={javascript} isScss={isScss} />
      </div>
      <div className="mt-6">
        <div className="flex mb-4">
          <Button
            type="button"
            variant={activeTab === 'html' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('html')}
            className="mr-2"
          >
            HTML
          </Button>
          <Button
            type="button"
            variant={activeTab === 'styles' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('styles')}
            className="mr-2"
          >
            {isScss ? 'SCSS' : 'CSS'}
          </Button>
          <Button
            type="button"
            variant={activeTab === 'javascript' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('javascript')}
          >
            JavaScript
          </Button>
        </div>
        {activeTab === 'html' && (
          <Editor
            height="400px"
            defaultLanguage="html"
            value={html}
            onChange={(value) => setHtml(value || '')}
            options={{ minimap: { enabled: false } }}
          />
        )}
        {activeTab === 'styles' && (
          <>
            <div className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isScss}
                  onChange={() => setIsScss(!isScss)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Use SCSS</span>
              </label>
            </div>
            <Editor
              height="400px"
              defaultLanguage={isScss ? "scss" : "css"}
              value={styles}
              onChange={(value) => setStyles(value || '')}
              options={{ minimap: { enabled: false } }}
            />
          </>
        )}
        {activeTab === 'javascript' && (
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={javascript}
            onChange={(value) => setJavascript(value || '')}
            options={{ minimap: { enabled: false } }}
          />
        )}
      </div>
      <div className="flex justify-end mt-6">
        <Button type="submit">{id ? 'Update Component' : 'Add Component'}</Button>
      </div>
    </form>
  );
};

export default ComponentForm;