'use client';

import Link from 'next/link';
import { Search, Users, Calendar, Clock } from 'lucide-react';

/**
 * @title Composant Header
 * @description Barre de navigation principale de l'application
 * @accessibility 
 * - Navigation principale avec des liens explicites
 * - Barre de recherche avec label approprié
 * - Contraste des couleurs optimisé pour la lisibilité
 */
export const Header = () => {
  const menuItems = [
    { href: '/calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendrier' },
    { href: '/tasks', icon: <Clock className="w-5 h-5" />, label: 'Tâches' },
  ];

  return (
    <header className="fixed w-full z-50">
      <div className="bg-gradient-glass backdrop-blur-glass border-b border-white/10 shadow-glass">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface/80 border border-white/5 hover:scale-105 transition-transform duration-150">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-medium text-text-primary">
                  Prospethique
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Menu principal">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Rechercher..."
                  aria-label="Barre de recherche"
                  className="w-64 bg-surface/80 px-4 py-2 pl-10 rounded-lg border border-white/10 text-text-primary placeholder-text-tertiary shadow-input focus:border-primary/30 focus:ring-0 hover:border-white/20 transition-all duration-150"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 