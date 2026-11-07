// src/modules/auth/infrastructure/http-auth.repository.ts

import type { AuthRepository } from '../domain/ports/out/auth.repository'; // Adapte le chemin selon ton arborescence exacte

export function createHttpAuthRepository(
  baseUrl = '/api/auth',
): AuthRepository {
  return {
    async login(password: string): Promise<string> {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motDePasse: password }),
      });

      if (!response.ok) {
        throw new Error(
          `Échec de la connexion (erreur ${response.status}).`,
        );
      }

      const data = await response.json();
      
      return data.jeton; 
    },
  };
}