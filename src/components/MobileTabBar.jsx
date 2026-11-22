import React from 'react';
import { LayoutGrid, BookOpen, Brain, Rotate3d, Menu } from 'lucide-react';
import { useI18n } from '../i18n.jsx';
import { triggerHaptic } from '../nativeBridge.js';

export default function MobileTabBar({ page, mobileOpen, onNavigate, onToggleMenu }) {
  const { tr } = useI18n();

  const tabs = [
    {
      id: 'home',
      label: tr('Ana Sayfa'),
      Icon: LayoutGrid,
      active: !mobileOpen && page === 'home',
      onClick: () => {
        triggerHaptic('light');
        onNavigate('home');
      },
    },
    {
      id: 'library',
      label: tr('Dersler'),
      Icon: BookOpen,
      active: !mobileOpen && (page === 'library' || page === 'lesson'),
      onClick: () => {
        triggerHaptic('light');
        onNavigate('library');
      },
    },
    {
      id: 'quizzes',
      label: tr('Quizler'),
      Icon: Brain,
      active: !mobileOpen && (page === 'quizzes' || page === 'exam' || page === 'practice'),
      onClick: () => {
        triggerHaptic('light');
        onNavigate('quizzes');
      },
    },
    {
      id: 'atlas',
      label: tr('3D Atlas'),
      Icon: Rotate3d,
      active: !mobileOpen && page === 'atlas',
      onClick: () => {
        triggerHaptic('light');
        onNavigate('atlas');
      },
    },
    {
      id: 'menu',
      label: tr('Menü'),
      Icon: Menu,
      active: mobileOpen,
      onClick: () => {
        triggerHaptic('light');
        onToggleMenu();
      },
    },
  ];

  return (
    <nav className="mobile-tab-bar" aria-label={tr('Hızlı mobil gezinti')}>
      {tabs.map(({ id, label, Icon, active, onClick }) => (
        <button
          key={id}
          type="button"
          className={`mobile-tab-item ${active ? 'active' : ''}`}
          aria-current={active && id !== 'menu' ? 'page' : undefined}
          aria-expanded={id === 'menu' ? mobileOpen : undefined}
          onClick={onClick}
        >
          <span className="mobile-tab-pill" aria-hidden="true">
            <Icon size={19} strokeWidth={active ? 2.1 : 1.7} />
          </span>
          <span className="mobile-tab-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
