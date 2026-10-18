import type { RequestHandler } from 'express';
import type { VerifierJetonPort } from '../../../application/ports/in/verifier-jeton.port.js';

function extraireJeton(entete: string | undefined): string | null {
  if (!entete) return null;
  const [schema, valeur, ...reste] = entete.split(' ');
  if (schema?.toLowerCase() !== 'bearer' || !valeur || reste.length > 0) return null;
  return valeur;
}

/**
 * Adaptateur d'entrée HTTP : lit « Authorization: Bearer <jeton> » et demande à
 * l'application si ce jeton est valide et porte le rôle admin.
 *
 * 401 = pas authentifié (jeton absent, invalide ou expiré)
 * 403 = authentifié mais sans le droit requis
 *
 * Usage : router.post('/ma-route', exigerAdmin(verifierJeton), controller.methode)
 */
export const exigerAdmin =

  (verifierJeton: VerifierJetonPort): RequestHandler =>
  async (req, res, next) => {
    try {
      const jeton = extraireJeton(req.header('authorization'));
      if (!jeton) {
        res.status(401).json({ error: 'Non authentifié' });
        return;
      }

      const contenu = await verifierJeton.execute(jeton);
      if (!contenu) {
        res.status(401).json({ error: 'Jeton invalide ou expiré' });
        return;
      }

      if (contenu.role !== 'admin') {
        res.status(403).json({ error: 'Accès refusé' });
        return;
      }

      res.locals.auth = contenu;
      next();
    } catch (erreur) {
      // Express 4 n'intercepte pas les erreurs d'un handler async : on les transmet nous-mêmes.
      next(erreur);
    }
  };
