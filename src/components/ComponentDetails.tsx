import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Download } from 'lucide-react';
import useComponentStore from '../hooks/useComponentStore';
import Button from './ui/Button';
import LivePreview from './LivePreview';
import Editor from '@monaco-editor/react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const ComponentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { components, deleteComponent } = useComponentStore();
  const [selectedVersion, setSelectedVersion] = useState(-1);
  const [activeTab, setActiveTab] = useState('html');

  const component = components.find((c) => c.id === id);

  if (!component) {
    return <div>Component not found</div>;
  }

  const currentVersion = selectedVersion === -1 ? component : component.versions[selectedVersion];

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(component.id);
      navigate('/');
    }
  };

  const handleExport = () => {
    const zip = new JSZip();
    zip.file("index.html", currentVersion.html);
    zip.file("styles.scss", currentVersion.scss);
    zip.file("script.js", currentVersion.javascript);
    
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        saveAs(content, `${component.name}.zip`);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Back to Component List
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{component.name}</h1>
          <div>
            <Link to={`/edit-component/${component.id}`}>
              <Button variant="secondary" className="mr-2">
                <Edit size={20} className="mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="danger" onClick={handleDelete} className="mr-2">
              <Trash2 size={20} className="mr-2" />
              Delete
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download size={20} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{component.description}</p>
        <p className="text-sm text-gray-500 mb-6">Category: {component.category}</p>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <LivePreview
              html={currentVersion.html}
              scss={currentVersion.scss}
              javascript={currentVersion.javascript}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Code</h2>
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
                variant={activeTab === 'scss' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('scss')}
                className="mr-2"
              >
                SCSS
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
                value={currentVersion.html}
                options={{ readOnly: true }}
              />
            )}
            {activeTab === 'scss' && (
              <Editor
                height="400px"
                defaultLanguage="scss"
                value={currentVersion.scss}
                options={{ readOnly: true }}
              />
            )}
            {activeTab === 'javascript' && (
              <Editor
                height="400px"
                defaultLanguage="javascript"
                value={currentVersion.javascript}
                options={{ readOnly: true }}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Versions</h2>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(Number(e.target.value))}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={-1}>Current Version</option>
            {component.versions.map((version, index) => (
              <option key={version.id} value={index}>
                Version {index + 1} - {new Date(version.createdAt).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetails;