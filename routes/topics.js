import { Router } from "express";

import { getTopics } from "../controllers/topics.js";

const router = Router();

router.get('/', getTopics);

export default router;