/**
 * Pius Gumo
 * 
 * 14/02/2023
 * 
 * The controllers for the Courses Service.
 */

import { dbConnection } from '../database.js'

export const getSavedCourses = async (req, res) => {
    dbConnection().then((db) => {
        // get the course names from the examinations collection

        db.collection('examinations').distinct('course').then((courses) => {
            res.status(200).send({
                message: 'The courses were retrieved successfully.',
                data: courses,
                count: courses.length
            });
        }).catch((err) => {
            res.status(500).send({ message: 'An error occurred while retrieving the courses.' });
        });
    }).catch((err) => {
        res.status(500).send({ message: 'A database error occurred while retrieving the courses.' });
    });
}
