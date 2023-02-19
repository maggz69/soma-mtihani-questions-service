/**
 * Pius Gumo
 * 14/02/2023
 * 
 * The routes for the Courses Service.
 */

import { Router } from 'express';

import { getSavedCourses } from '../controllers/courses.js';

const router = Router();

router.get('/', getSavedCourses);

export default router;