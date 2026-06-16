import { useState, useRef } from 'react';
import {
  Palette, Image, Upload, X, Check, AlertCircle, Plus,
  Type, Layout, Grid, FileImage, MousePointer, ChevronDown
} from 'lucide-react';

interface ColorEntry {
  name: string;
  hex: string;
  usage: string;
}

interface DesignWorkspacePanelProps {
  onSubmitColorPalette: (colors: ColorEntry[]) => void;
  onUploadDesign: (file: File, type: string) => void;
  onCreateMoodboard: (items: string[]) => void;
  submittedColors?: ColorEntry[];
  submittedDesigns?: { id: string; name: string; type: string }[];
}

export const DesignWorkspacePanel = ({
  onSubmitColorPalette,
  onUploadDesign,
  onCreateMoodboard,
  submittedColors = [],
  submittedDesigns = []
}: DesignWorkspacePanelProps) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'upload' | 'moodboard'>('colors');
  const [colors, setColors] = useState<ColorEntry[]>([
    { name: 'Primary', hex: '#FF6B6B', usage: 'Main brand color' },
    { name: 'Secondary', hex: '#4ECDC4', usage: 'Supporting color' },
    { name: 'Accent', hex: '#45B7D1', usage: 'Highlight color' },
  ]);
  const [moodboardItems, setMoodboardItems] = useState<string[]>(['', '', '', '', '', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const handleColorChange = (index: number, field: keyof ColorEntry, value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, { name: '', hex: '#000000', usage: '' }]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleSubmitColors = () => {
    const validColors = colors.filter(c => c.name && validateHex(c.hex));
    if (validColors.length >= 3) {
      onSubmitColorPalette(validColors);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        onUploadDesign(file, file.type.startsWith('image') ? 'image' : 'other');
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          onUploadDesign(file, 'image');
        }
      });
    }
  };

  const updateMoodboardItem = (index: number, value: string) => {
    const newItems = [...moodboardItems];
    newItems[index] = value;
    setMoodboardItems(newItems);
  };

  const handleCreateMoodboard = () => {
    const validItems = moodboardItems.filter(item => item);
    if (validItems.length >= 4) {
      onCreateMoodboard(validItems);
    }
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'moodboard', label: 'Moodboard', icon: Layout },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Design Workspace</h3>
          <p className="text-xs text-gray-500">Submit your brand work</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Submit your brand color palette (minimum 3 colors)</p>
            <span className="text-xs text-gray-400">{colors.length}/8 colors</span>
          </div>

          <div className="space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <button
                  type="button"
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 cursor-pointer"
                  style={{ backgroundColor: validateHex(color.hex) ? color.hex : '#000' }}
                  onClick={() => {
                    const input = document.getElementById(`color-input-${index}`);
                    input?.click();
                  }}
                  aria-label={`Pick color for ${color.name || 'color'}`}
                />
                <input
                  id={`color-input-${index}`}
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                  className="sr-only"
                />

                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                    placeholder="Color name (e.g., Primary)"
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                    placeholder="#FF6B6B"
                    className={`px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 ${
                      validateHex(color.hex)
                        ? 'border-gray-200 dark:border-gray-700 focus:ring-violet-500'
                        : 'border-red-300 dark:border-red-800 focus:ring-red-500'
                    }`}
                  />
                </div>

                <input
                  type="text"
                  value={color.usage}
                  onChange={(e) => handleColorChange(index, 'usage', e.target.value)}
                  placeholder="Usage (e.g., Buttons, Headers)"
                  className="w-32 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />

                <button
                  onClick={() => removeColor(index)}
                  disabled={colors.length <= 1}
                  aria-label="Remove color"
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {colors.length < 8 && (
            <button
              onClick={addColor}
              className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:border-violet-500 hover:text-violet-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Color
            </button>
          )}

          <button
            onClick={handleSubmitColors}
            disabled={colors.filter(c => c.name && validateHex(c.hex)).length < 3}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Submit Color Palette
          </button>

          {submittedColors.length > 0 && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Colors Submitted ({submittedColors.length})</span>
              </div>
              <div className="flex gap-2 mt-2">
                {submittedColors.slice(0, 5).map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="sr-only"
            />
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium mb-1">
              Drop designs here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              PNG, JPG, SVG up to 10MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Select Files
            </button>
          </div>

          {submittedDesigns.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Submitted Designs ({submittedDesigns.length})</p>
              <div className="grid grid-cols-2 gap-2">
                {submittedDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Image className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {design.name}
                      </p>
                      <p className="text-xs text-gray-500">{design.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'moodboard' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Create your moodboard with at least 4 inspiration items</p>

          <div className="grid grid-cols-3 gap-3">
            {moodboardItems.map((item, index) => (
              <div
                key={index}
                className={`aspect-square rounded-xl border-2 border-dashed transition-colors ${
                  item
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {item ? (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 line-clamp-3">{item}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const newItems = [...moodboardItems];
                      newItems[index] = `Inspiration ${index + 1}`;
                      setMoodboardItems(newItems);
                    }}
                    className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add inspiration text..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  const emptyIndex = moodboardItems.findIndex(item => !item);
                  if (emptyIndex !== -1 && target.value) {
                    updateMoodboardItem(emptyIndex, target.value);
                    target.value = '';
                  }
                }
              }}
            />
          </div>

          <button
            onClick={handleCreateMoodboard}
            disabled={moodboardItems.filter(item => item).length < 4}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Layout className="w-4 h-4" />
            Create Moodboard
          </button>
        </div>
      )}
    </div>
  );
};

export default DesignWorkspacePanel;