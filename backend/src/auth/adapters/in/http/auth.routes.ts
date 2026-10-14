import { Router } from 'express';
import type { RequestHandler } from 'express';
import type { AuthController } from './auth.controller.js';

export function routerAdmin(controller: AuthController, exigerAdminMw: RequestHandler): Router {
  const router = Router();

  router.post('/login', controller.login);
  router.get('/session', exigerAdminMw, controller.session);

  return router;
}
