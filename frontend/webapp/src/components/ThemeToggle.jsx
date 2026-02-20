import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'site-theme';
const THEME_EVENT = 'site-theme-change';

const applyTheme = (theme) => {
  const root = document.documentElement;
  const isDark = theme === 'dark';
  root.classList.toggle('dark', isDark);
  root.classList.toggle('dark-theme', isDark);
  root.classList.toggle('light-theme', !isDark);
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const theme =
      saved ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setIsDark(theme === 'dark');
    applyTheme(theme);

    const onThemeChange = (event) => {
      const detailTheme = event?.detail?.theme || localStorage.getItem(STORAGE_KEY) || 'light';
      setIsDark(detailTheme === 'dark');
      applyTheme(detailTheme);
    };

    window.addEventListener(THEME_EVENT, onThemeChange);
    window.addEventListener('storage', onThemeChange);
    return () => {
      window.removeEventListener(THEME_EVENT, onThemeChange);
      window.removeEventListener('storage', onThemeChange);
    };
  }, []);

  const setTheme = (theme) => {
    const nextIsDark = theme === 'dark';
    setIsDark(nextIsDark);
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
  };

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className="inline-flex items-center rounded-full border border-slate-300/60 bg-white/90 p-1 shadow"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          !isDark
            ? 'bg-white text-slate-900 shadow'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Sun size={14} />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          isDark
            ? 'bg-black text-white shadow'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Moon size={14} />
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle;
