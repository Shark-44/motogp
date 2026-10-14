import { describe, expect, it } from 'vitest';
import { VerifierAdminUseCase } from './verifier-admin.use-case.js';

describe('VerifierAdminUseCase', () => {
  const useCase = new VerifierAdminUseCase('secret-admin');

  it('accepte le bon mot de passe', async () => {
    expect(await useCase.execute('secret-admin')).toBe(true);
  });

  it('refuse un mauvais mot de passe', async () => {
    expect(await useCase.execute('mauvais')).toBe(false);
  });

  it('refuse une chaîne vide', async () => {
    expect(await useCase.execute('')).toBe(false);
  });

  it('refuse un mot de passe de longueur différente sans lever d\'exception', async () => {
    // timingSafeEqual lèverait une erreur sur des buffers de tailles différentes :
    // le passage par SHA-256 doit l'éviter.
    await expect(useCase.execute('a')).resolves.toBe(false);
    await expect(useCase.execute('x'.repeat(500))).resolves.toBe(false);
  });

  it('est sensible à la casse', async () => {
    expect(await useCase.execute('SECRET-ADMIN')).toBe(false);
  });

  it('refuse de se construire avec un mot de passe attendu vide', () => {
    expect(() => new VerifierAdminUseCase('')).toThrow();
  });
});
