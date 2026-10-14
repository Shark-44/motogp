import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { exigerAdmin } from './exiger-admin.middleware.js';
import type { VerifierJetonPort } from '../../../application/ports/in/verifier-jeton.port.js';

function preparer(entete: string | undefined, retour: unknown = { role: 'admin' }) {
  const verifierJeton = {
    execute:
      retour instanceof Error
        ? vi.fn().mockRejectedValue(retour)
        : vi.fn().mockResolvedValue(retour),
  };

  const req = { header: vi.fn().mockReturnValue(entete) };

  const res = { status: vi.fn(), json: vi.fn(), locals: {} as Record<string, unknown> };
  res.status.mockReturnValue(res); // permet le chaînage res.status(401).json(...)

  const next = vi.fn();
  const middleware = exigerAdmin(verifierJeton as unknown as VerifierJetonPort);
  const executer = () => middleware(req as unknown as Request, res as unknown as Response, next);

  return { verifierJeton, req, res, next, executer };
}

describe('exigerAdmin', () => {
  it('lit le jeton dans l\'en-tête Authorization', async () => {
    const { req, executer } = preparer('Bearer abc.def.ghi');

    await executer();

    expect(req.header).toHaveBeenCalledWith('authorization');
  });

  it('appelle next() et expose l\'identité quand le jeton est valide et admin', async () => {
    const { verifierJeton, res, next, executer } = preparer('Bearer abc.def.ghi');

    await executer();

    expect(verifierJeton.execute).toHaveBeenCalledWith('abc.def.ghi');
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(res.locals.auth).toEqual({ role: 'admin' });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('accepte le mot Bearer quelle que soit la casse', async () => {
    const { next, executer } = preparer('bearer abc.def.ghi');

    await executer();

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('répond 401 sans interroger le use case quand l\'en-tête est absent', async () => {
    const { verifierJeton, res, next, executer } = preparer(undefined);

    await executer();

    expect(verifierJeton.execute).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it.each([
    ['un schéma autre que Bearer', 'Basic abc'],
    ['Bearer sans jeton', 'Bearer'],
    ['un en-tête avec trop de morceaux', 'Bearer abc def'],
    ['un en-tête vide', ''],
  ])('répond 401 pour %s', async (_description, entete) => {
    const { verifierJeton, res, next, executer } = preparer(entete);

    await executer();

    expect(verifierJeton.execute).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('répond 401 quand le jeton est invalide ou expiré', async () => {
    const { res, next, executer } = preparer('Bearer abc.def.ghi', null);

    await executer();

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Jeton invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();
  });

  it('répond 403 quand le jeton est valide mais sans le rôle admin', async () => {
    const { res, next, executer } = preparer('Bearer abc.def.ghi', { role: 'lecteur' });

    await executer();

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('transmet l\'erreur à next(erreur) si le use case échoue', async () => {
    const erreur = new Error('Panne inattendue');
    const { res, next, executer } = preparer('Bearer abc.def.ghi', erreur);

    await executer();

    expect(next).toHaveBeenCalledWith(erreur);
    expect(res.status).not.toHaveBeenCalled();
  });
});
