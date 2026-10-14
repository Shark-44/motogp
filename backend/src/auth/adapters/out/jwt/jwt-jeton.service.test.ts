import { describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { JwtJetonService } from './jwt-jeton.service.js';

const SECRET = 'secret-de-test-'.padEnd(40, 'x');
const maintenant = () => Math.floor(Date.now() / 1000);

describe('JwtJetonService', () => {
  describe('construction', () => {
    it('refuse un secret de moins de 32 caractères', () => {
      expect(() => new JwtJetonService('trop-court')).toThrow(/32 caractères/);
    });

    it('refuse une durée nulle, négative ou non entière', () => {
      expect(() => new JwtJetonService(SECRET, 0)).toThrow();
      expect(() => new JwtJetonService(SECRET, -5)).toThrow();
      expect(() => new JwtJetonService(SECRET, 1.5)).toThrow();
    });
  });

  describe('émission', () => {
    it('émet un jeton qu\'il sait relire, avec la durée demandée', () => {
      const service = new JwtJetonService(SECRET, 600);

      const { jeton, expireDansSecondes } = service.emettre({ role: 'admin' });

      expect(expireDansSecondes).toBe(600);
      expect(service.verifier(jeton)).toEqual({ role: 'admin' });
    });
  });

  describe('vérification', () => {
    const service = new JwtJetonService(SECRET, 600);

    it('refuse un jeton signé avec un autre secret', () => {
      const autre = new JwtJetonService('un-autre-secret-'.padEnd(40, 'y'), 600);
      const { jeton } = autre.emettre({ role: 'admin' });

      expect(service.verifier(jeton)).toBeNull();
    });

    it('refuse un jeton expiré', () => {
      const jeton = jwt.sign({ role: 'admin', exp: maintenant() - 10 }, SECRET, { algorithm: 'HS256' });

      expect(service.verifier(jeton)).toBeNull();
    });

    it('refuse une chaîne qui n\'est pas un jeton', () => {
      expect(service.verifier('n-importe-quoi')).toBeNull();
      expect(service.verifier('')).toBeNull();
    });

    it('refuse un jeton modifié après signature', () => {
      const { jeton } = service.emettre({ role: 'admin' });
      const [entete, , signature] = jeton.split('.');
      const faux = Buffer.from(JSON.stringify({ role: 'admin', exp: maintenant() + 99999 })).toString('base64url');

      expect(service.verifier(`${entete}.${faux}.${signature}`)).toBeNull();
    });

    it('refuse un jeton non signé (algorithme none)', () => {
      const jeton = jwt.sign({ role: 'admin' }, '', { algorithm: 'none' });

      expect(service.verifier(jeton)).toBeNull();
    });

    it('refuse un jeton valide dont le rôle est inconnu', () => {
      const jeton = jwt.sign({ role: 'superman' }, SECRET, { algorithm: 'HS256', expiresIn: 600 });

      expect(service.verifier(jeton)).toBeNull();
    });

    it('refuse un jeton valide sans rôle', () => {
      const jeton = jwt.sign({ nom: 'quelquun' }, SECRET, { algorithm: 'HS256', expiresIn: 600 });

      expect(service.verifier(jeton)).toBeNull();
    });
  });
});
