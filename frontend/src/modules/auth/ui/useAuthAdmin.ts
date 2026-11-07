// src/modules/auth/ui/useAuthAdmin.ts
import { useState } from 'react';
import { createHttpAuthRepository } from '../infrastructure/httpAuthRepository';

const authRepository = createHttpAuthRepository();

export const useAuthAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!localStorage.getItem('admin_token');
  });

  const login = async (password: string): Promise<boolean> => {
    try {
      const jeton = await authRepository.login(password);
      localStorage.setItem('admin_token', jeton);
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};