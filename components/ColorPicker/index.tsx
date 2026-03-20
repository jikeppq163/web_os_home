import React, { useState, useRef, useEffect } from 'react';
import { validColors, DEFAULT_COLOR } from '@/components/AppIcon';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label = '颜色' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 获取当前选中的颜色索引
  const selectedIndex = validColors.indexOf(value as typeof validColors[number]);
  const effectiveIndex = selectedIndex >= 0 ? selectedIndex : validColors.indexOf(DEFAULT_COLOR);
  const currentColor = validColors[effectiveIndex];

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* 颜色预览按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-2 
          border border-gray-300 rounded-lg 
          hover:border-gray-400 hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200
        `}
      >
        <div
          className={`w-8 h-8 rounded-md bg-linear-to-br ${currentColor} shadow-sm`}
        />
        <span className="text-sm text-gray-600">点击选择颜色</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 颜色选择弹窗 */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="mb-3 pb-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">选择颜色</span>
          </div>

          {/* 色盘网格 */}
          <div className="grid grid-cols-4 gap-3">
            {validColors.map((color, index) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`
                  w-12 h-12 rounded-lg bg-linear-to-br ${color}
                  transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${index === effectiveIndex
                    ? 'ring-2 ring-offset-2 ring-blue-500 scale-105 shadow-md'
                    : 'ring-1 ring-gray-200'
                  }
                `}
                title={color}
              />
            ))}
          </div>

          {/* 关闭按钮 */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
