// src/shared/infrastructure/authHeader.ts
// En-tête d'authentification pour les appels admin.
// Le jeton est lu à CHAQUE appel (pas au chargement du fichier) :
// ainsi, une connexion ou une déconnexion est prise en compte tout de suite.
export function authHeader(): Record<string, string> {
  const jeton = localStorage.getItem('admin_token')
  return jeton ? { Authorization: `Bearer ${jeton}` } : {}
}
