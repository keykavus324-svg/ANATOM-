import React from 'react';
import { Bone, Dumbbell, HeartPulse, Brain, Wind, UtensilsCrossed } from 'lucide-react';
import { useI18n } from '../i18n.jsx';

const SYSTEMS = [
  { lesson: 5, label: 'İskelet', Icon: Bone },
  { lesson: 6, label: 'Kas', Icon: Dumbbell },
  { lesson: 7, label: 'Dolaşım', Icon: HeartPulse },
  { lesson: 9, label: 'Sinir', Icon: Brain },
  { lesson: 11, label: 'Solunum', Icon: Wind },
  { lesson: 8, label: 'Sindirim', Icon: UtensilsCrossed },
];

// Sistemler arası tek dokunuşluk geçiş: sayfa kaydırmadan derse atlar.
export default function SystemBar({ current, onLesson }) {
  const { tr } = useI18n();
  return <nav className="system-bar" aria-label={tr('Sistemler arası hızlı geçiş')}>
    {SYSTEMS.map(({ lesson, label, Icon }) => <button
      key={lesson}
      className={current === lesson ? 'active' : ''}
      aria-current={current === lesson ? 'page' : undefined}
      onClick={() => onLesson(lesson)}
    ><Icon size={15}/><span>{tr(label)}</span></button>)}
  </nav>;
}
