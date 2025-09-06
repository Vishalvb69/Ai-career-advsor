import React from 'react';
import { AILogoIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark p-2">
          <AILogoIcon />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-brand-dark-text dark:text-brand-light">AI Career Advisor</h1>
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
};

export default Header;