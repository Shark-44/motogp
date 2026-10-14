import { describe, expect, it, vi } from 'vitest';
import { ConnecterAdminUseCase } from './connecter-admin.use-case.js';
import type { VerifierAdminPort } from '../ports/in/verifier-admin.port.js';
import type { JetonServicePort } from '../../domaine/ports/out/jeton-service.port.js';

function preparer(motDePasseValide: boolean) {
  const verifierAdmin = { execute: vi.fn().mockResolvedValue(motDePasseValide) };
  const jetonService = {
    emettre: vi.fn().mockReturnValue({ jeton: 'jeton-signe', expireDansSecondes: 3600 }),
    verifier: vi.fn(),
  };

  const useCase = new ConnecterAdminUseCase(
    verifierAdmin as unknown as VerifierAdminPort,
    jetonService as unknown as JetonServicePort,
  );

  return { useCase, verifierAdmin, jetonService };
}

describe('ConnecterAdminUseCase', () => {
  it('délivre un jeton admin quand le mot de passe est valide', async () => {
    const { useCase, jetonService } = preparer(true);

    const session = await useCase.execute('secret');

    expect(session).toEqual({ jeton: 'jeton-signe', expireDansSecondes: 3600 });
    expect(jetonService.emettre).toHaveBeenCalledWith({ role: 'admin' });
  });

  it('retourne null et n\'émet aucun jeton quand le mot de passe est invalide', async () => {
    const { useCase, jetonService } = preparer(false);

    const session = await useCase.execute('mauvais');

    expect(session).toBeNull();
    expect(jetonService.emettre).not.toHaveBeenCalled();
  });

  it('transmet le mot de passe saisi à la vérification', async () => {
    const { useCase, verifierAdmin } = preparer(true);

    await useCase.execute('mon-mot-de-passe');

    expect(verifierAdmin.execute).toHaveBeenCalledWith('mon-mot-de-passe');
  });

  it('propage l\'erreur si l\'émission du jeton échoue', async () => {
    const { useCase, jetonService } = preparer(true);
    jetonService.emettre.mockImplementation(() => {
      throw new Error('Panne de signature');
    });

    await expect(useCase.execute('secret')).rejects.toThrow('Panne de signature');
  });
});
