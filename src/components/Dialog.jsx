import React, { useEffect, useRef } from 'react';

// Native <dialog> wrapper shared by the reader, the help panel and the book shelf.
export default function Dialog({ children, className = '', onClose, label }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = before; dialog.close(); }; }, []);
  return <dialog ref={ref} className={className} aria-label={label} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>{children}</dialog>;
}
