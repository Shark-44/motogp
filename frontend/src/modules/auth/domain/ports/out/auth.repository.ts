// src/modules/auth/domain/ports/out/auth.repository.ts
export interface AuthRepository {
    login(password: string): Promise<string>;
  }