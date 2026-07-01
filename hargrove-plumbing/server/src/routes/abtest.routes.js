// Top-level (non-/api) experiment routes: the variant homepage + the results dashboard.
// Mounted before express.static so the homepage is served with its variant applied.
import { Router } from 'express';
import { assignVariant } from '../middleware/abtest.middleware.js';
import * as abController from '../controllers/abtest.controller.js';

const router = Router();

router.get(['/', '/index.html'], assignVariant, abController.serveHome);
router.get('/ab-results', abController.getResults);

export default router;
