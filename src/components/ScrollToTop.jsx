import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reset scroll position ke atas setiap kali user pindah route.
// Backward-compatible dengan behavior useEffect lama yang ada di App.jsx.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}