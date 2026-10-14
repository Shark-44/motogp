import { describe, expect, it, vi } from 'vitest';
import { VerifierJetonUseCase } from './verifier-jeton.use-case.js';
import type { JetonServicePort } from '../../domaine/ports/out/jeton-service.port.js';

function preparer(retour: { role: 'admin' } | null) {
  const jetonService = { emettre: vi.fn(), verifier: vi.fn().mockReturnValue(retour) };
  const useCase = new VerifierJetonUseCase(jetonService as unknown as JetonServicePort);
  return { useCase, jetonService };
}

describe('VerifierJetonUseCase', () => {
  it('retourne le contenu du jeton quand il est valide', async () => {
    const { useCase, jetonService } = preparer({ role: 'admin' });

    const contenu = await useCase.execute('jeton-valide');

    expect(contenu).toEqual({ role: 'admin' });
    expect(jetonService.verifier).toHaveBeenCalledWith('jeton-valide');
  });

  it('retourne null quand le jeton est invalide ou expiré', async () => {
    const { useCase } = preparer(null);

    expect(await useCase.execute('jeton-invalide')).toBeNull();
  });
});
