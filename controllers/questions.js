/**
 * Pius Gumo
 * 24/12/2022
 * 
 * The controller for the Questions Service.
 */

import { dbConnection } from '../database.js';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const getQuestions = async (req, res) => {

    // get the database connection
    dbConnection().then((db) => {
        // get the questions collection
        const questionsCollection = db.collection('questions');


        // check for page and limit query parameters
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;

        questionsCollection.find().toArray().then((totalQuestions) => {
            console.log('Total Questions', totalQuestions);
        }).catch((error) => { });

        // get the total number of questions
        questionsCollection.countDocuments().then((totalQuestions) => {

            console.log('Total Questions', totalQuestions);
            // get the questions
            questionsCollection.find().skip((page - 1) * limit).limit(limit).toArray().then((questions) => {
                // send the questions
                res.send({
                    questions: questions,
                    totalQuestions: totalQuestions,
                    totalPages: Math.ceil(totalQuestions / limit),
                    currentPage: page
                });
            }).catch((error) => {
                // send the error
                res.status(500).send
            });
        }).catch((error) => {
            // send the error
            res.status(500).send
        });
    });


}

export const getQuestion = async (req, res) => {

    const id = req.params.id;
    const query = req.query;

    // If the id is inserted get the question with that id

    // If the id is not inserted get the question with the query


    dbConnection().then((db) => {
        const questionsCollection = db.collection('questions');

        if (id) {
            questionsCollection.findOne({ _id: new MongoClient.ObjectId(id) }).then((question) => {
                res.send(question);
            }).catch((error) => {
                res.status(500).send(error)
            });

            // if no id exists in MongoDB, return a 404

        } else {


            questionsCollection.findOne(query).then((question) => {
                res.send(question);
            }).catch((error) => {
                res.status(500).send
            });
        }
    });

}


export const createQuestion = (req, res) => {
    var requiredFields = ['type', 'title', 'description', 'topics', 'examinationId'];

    var missingFields = requiredFields.filter((field) => {
        return !(field in req.body);
    });

    if (missingFields.length > 0) {
        res.status(400).send({ message: `The following fields are required: ${missingFields.join(', ')}` });
    }

    dbConnection().then((db) => {
        const questionsCollection = db.collection('questions');

        const question = {
            ...req.body,
            createdAt: new Date()
        }

        questionsCollection.insertOne(question).then((result) => {
            res.status(201).send({
                message: 'The question was created successfully.',
                questionId: result.insertedId
            });
        }).catch((error) => {
            res.status(500).send({ message: 'An error occurred while creating the question.' });
        });
    }).catch((error) => {
        res.status(500).send({ message: 'An error occurred while creating the question.' });
    });
}

export const updateQuestion = (req, res) => {
    res.send('This works!');
}

export const deleteQuestion = (req, res) => {
    res.send('This works!');
}

// Path: controllers/questions.js
