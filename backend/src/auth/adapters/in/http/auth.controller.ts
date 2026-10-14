import type { NextFunction, Request, Response } from 'express';
import type { ConnecterAdminPort } from '../../../application/ports/in/connecter-admin.port.js';

export class AuthController {
  constructor(private readonly connecterAdmin: ConnecterAdminPort) {}

  // Fonctions fléchées : `this` reste lié à l'instance même quand Express les appelle en callback.

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const motDePasse: unknown = req.body?.motDePasse;

      if (typeof motDePasse !== 'string' || motDePasse.length === 0) {
        res.status(400).json({ error: 'motDePasse requis' });
        return;
      }

      const session = await this.connecterAdmin.execute(motDePasse);
      if (!session) {
        res.status(401).json({ error: 'Identifiants invalides' });
        return;
      }

      res.status(200).json({
        jeton: session.jeton,
        expireDansSecondes: session.expireDansSecondes,
        role: 'admin',
      });
    } catch (erreur) {
      next(erreur);
    }
  };

  /** Derrière exigerAdmin : permet au front de vérifier qu'il est toujours connecté. */
  session = (_req: Request, res: Response): void => {
    res.status(200).json({ role: res.locals.auth.role });
  };
}
