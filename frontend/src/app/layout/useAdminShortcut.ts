// src/app/layout/useAdminShortcut.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export const useAdminShortcut = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'B') setLoginOpen(true);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const onLoginSuccess = () => {
    setLoginOpen(false);
    navigate('/circuits');
  };

  return { loginOpen, setLoginOpen, onLoginSuccess };
};