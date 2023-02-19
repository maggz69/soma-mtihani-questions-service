/**
 * Pius Gumo
 * 24/12/2022
 * 
 * The routes for the Questions Service.
 */

import { Router } from 'express';

import { getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion } from '../controllers/questions.js';

const router = Router();

router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.post('/', createQuestion);
router.patch('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;