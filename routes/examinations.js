/**
 * Pius Gumo
 * 24/01/2022
 * 
 * The routes for the Examinations Service.
 */

import { Router } from 'express';

import { getExamination, createExamination, getExaminations,updateExamination } from '../controllers/examinations.js';

const router = Router();

router.get('/', getExaminations);
router.get('/:id', getExamination);
router.put('/:id', updateExamination);
router.post('/', createExamination);


export default router;