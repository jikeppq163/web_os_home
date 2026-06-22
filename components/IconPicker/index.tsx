import React, { useState } from 'react';
import { AVAILABLE_ICONS } from '@/constants';
import { Search } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = AVAILABLE_ICONS.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === value);
  const SelectedIconComponent = selectedIcon?.component;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      <div
        className="flex items-center gap-3 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          {SelectedIconComponent ? (
            <SelectedIconComponent size={20} className="text-gray-700" />
          ) : (
            <span className="text-gray-400 text-sm">?</span>
          )}
        </div>
        <span className="flex-1 text-sm text-gray-700">
          {selectedIcon ? `${selectedIcon.label} (${selectedIcon.name})` : '选择图标'}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索图标..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Icon Grid */}
          <div className="max-h-64 overflow-y-auto p-3">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.component;
                const isSelected = icon.name === value;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => {
                      onChange(icon.name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                      ${isSelected
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'hover:bg-gray-100 border-2 border-transparent'
                      }
                    `}
                    title={icon.label}
                  >
                    <IconComponent size={20} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
                    <span className="text-xs mt-1 text-gray-500 truncate w-full text-center">
                      {icon.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-4">
                未找到匹配的图标
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
