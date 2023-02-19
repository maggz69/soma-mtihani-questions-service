/**
 * Pius Gumo
 * 24/12/2022
 * 
 * The main entry point of the application for the Questions Service. 
 * 
 */


import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import questionsRoutes from './routes/questions.js';
import topicsRoutes from './routes/topics.js';
import examinationsRoutes from './routes/examinations.js';
import coursesRoutes from './routes/courses.js';
import { logTheRequest } from './middlewares.js';

var corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

const app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/questions', logTheRequest, questionsRoutes);
app.use('/topics', logTheRequest, topicsRoutes);
app.use('/examinations', logTheRequest, examinationsRoutes);
app.use('/courses', logTheRequest, coursesRoutes)

// start the Express server
app.listen(5000, () => {
    console.log("server started on port 5000");
});

