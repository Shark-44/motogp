import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller.js';
import type { ConnecterAdminPort } from '../../../application/ports/in/connecter-admin.port.js';

function preparer(retour: unknown = { jeton: 'jeton-signe', expireDansSecondes: 3600 }) {
  const connecterAdmin = {
    execute:
      retour instanceof Error
        ? vi.fn().mockRejectedValue(retour)
        : vi.fn().mockResolvedValue(retour),
  };

  const res = { status: vi.fn(), json: vi.fn(), locals: {} as Record<string, unknown> };
  res.status.mockReturnValue(res);

  const next = vi.fn();
  const controller = new AuthController(connecterAdmin as unknown as ConnecterAdminPort);

  const login = (body: unknown) =>
    controller.login({ body } as unknown as Request, res as unknown as Response, next);

  return { controller, connecterAdmin, res, next, login };
}

describe('AuthController', () => {
  describe('login', () => {
    it('répond 200 avec le jeton quand la connexion réussit', async () => {
      const { connecterAdmin, res, login } = preparer();

      await login({ motDePasse: 'secret' });

      expect(connecterAdmin.execute).toHaveBeenCalledWith('secret');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        jeton: 'jeton-signe',
        expireDansSecondes: 3600,
        role: 'admin',
      });
    });

    it('répond 401 quand le mot de passe est refusé', async () => {
      const { res, login } = preparer(null);

      await login({ motDePasse: 'mauvais' });

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Identifiants invalides' });
    });

    it.each([
      ['un corps absent', undefined],
      ['un champ motDePasse absent', {}],
      ['un motDePasse vide', { motDePasse: '' }],
      ['un motDePasse qui n\'est pas une chaîne', { motDePasse: 1234 }],
    ])('répond 400 pour %s, sans interroger le use case', async (_description, body) => {
      const { connecterAdmin, res, login } = preparer();

      await login(body);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(connecterAdmin.execute).not.toHaveBeenCalled();
    });

    it('transmet l\'erreur à next(erreur) si le use case échoue', async () => {
      const erreur = new Error('Panne inattendue');
      const { next, login } = preparer(erreur);

      await login({ motDePasse: 'secret' });

      expect(next).toHaveBeenCalledWith(erreur);
    });
  });

  describe('session', () => {
    it('renvoie le rôle posé par le middleware', () => {
      const { controller, res } = preparer();
      res.locals.auth = { role: 'admin' };

      controller.session({} as Request, res as unknown as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ role: 'admin' });
    });
  });
});
