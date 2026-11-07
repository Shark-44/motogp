// src/modules/auth/application/ports/in/connecter-admin.port.ts

export interface ConnecterAdminReponse {
    jeton: string;
    expireDansSecondes: number;
    role: string;
  }
  
  export interface ConnecterAdminPort {
    execute(motDePasse: string): Promise<ConnecterAdminReponse | null>;
  }
  
  export const CONNECTER_ADMIN_PORT = Symbol('ConnecterAdminPort');