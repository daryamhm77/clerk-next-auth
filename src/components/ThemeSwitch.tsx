'use client';

import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted) return <div className="h-5 w-5" />;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="text-xl transition hover:text-amber-500"
      aria-label="Toggle theme"
    >
      {currentTheme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
}
