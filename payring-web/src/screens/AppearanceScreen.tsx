// PayRing Web - Appearance Settings Screen
import { useState } from 'react';
import { Palette, Sun, Moon, Sparkles, Circle, Check, Monitor } from 'lucide-react';
import { useUIStore } from '../store';

const THEMES = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic PayRing blue and green theme',
    colors: {
      primary: '#7C3AED',
      secondary: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    preview: {
      bg: 'bg-white',
      card: 'bg-gray-50',
      accent: 'bg-purple-600',
      text: 'text-gray-900',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark with teal accents',
    colors: {
      primary: '#14B8A6',
      secondary: '#8B5CF6',
      background: '#0F172A',
      text: '#F8FAFC',
    },
    preview: {
      bg: 'bg-slate-900',
      card: 'bg-slate-800',
      accent: 'bg-teal-500',
      text: 'text-white',
    },
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Vibrant gradients and bold colors',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      background: '#1E1B4B',
      text: '#F8FAFC',
    },
    preview: {
      bg: 'bg-gradient-to-br from-indigo-900 to-purple-900',
      card: 'bg-white/10',
      accent: 'bg-gradient-to-r from-pink-500 to-purple-500',
      text: 'text-white',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean monochrome design',
    colors: {
      primary: '#374151',
      secondary: '#6B7280',
      background: '#FAFAFA',
      text: '#111827',
    },
    preview: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      accent: 'bg-gray-800',
      text: 'text-gray-900',
    },
  },
];

export function AppearanceScreen() {
  const { theme, setTheme } = useUIStore();
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [autoTheme, setAutoTheme] = useState(theme === 'system');

  const currentTheme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    if (themeId === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleAutoThemeToggle = (enabled: boolean) => {
    setAutoTheme(enabled);
    if (enabled) {
      setTheme('system');
    } else {
      setTheme(selectedTheme === 'dark' ? 'dark' : 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your visual experience</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Current Theme Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Current Theme</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${currentTheme.preview.accent} flex items-center justify-center`}>
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{currentTheme.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentTheme.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Choose Theme</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedTheme === t.id
                    ? 'border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {selectedTheme === t.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  {t.id === 'default' && <Sun className="w-5 h-5 text-yellow-500" />}
                  {t.id === 'dark' && <Moon className="w-5 h-5 text-slate-400" />}
                  {t.id === 'gradient' && <Sparkles className="w-5 h-5 text-pink-500" />}
                  {t.id === 'minimal' && <Circle className="w-5 h-5 text-gray-500" />}
                  <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-left">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Preview</h3>
          </div>
          <div className="p-6">
            <div className={`${currentTheme.preview.bg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
              <div className={`${currentTheme.preview.card} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${currentTheme.preview.text} opacity-70`}>Balance</span>
                  <button className={`${currentTheme.preview.accent} px-4 py-1.5 rounded-lg text-white text-sm font-medium`}>
                    SEND
                  </button>
                </div>
                <p className={`text-2xl font-bold ${currentTheme.preview.text}`}>$25,430.50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Display Options</h3>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Match system settings</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoTheme}
                onChange={(e) => handleAutoThemeToggle(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
