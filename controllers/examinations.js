/**
 * Pius Gumo
 * 24/12/2022
 * 
 * The Examinations controller that handles all the requests for the Examinations Service.
 * This service entails creating an Examination Type,
 */

import { ObjectId } from 'mongodb';
import { dbConnection } from '../database.js'

export const createExamination = async (req, res) => {

    dbConnection().then((db) => {
        // validate all the required fields are present
        var missingFields = validateExaminationSchema(req.body);
        if (missingFields.length > 0) {
            res.status(400).send({ message: `The following fields are missing: ${missingFields.join(', ')}` });
            return;
        }

        // merge req.body and createdAt into one field
        const examination = {
            ...req.body,
            createdAt: new Date()
        }

        db.collection('examinations').insertOne(examination).then((result) => {
            res.status(201).send({
                message: 'The examination was created successfully.',
                examinationId: result.insertedId
            });
        }).catch((err) => {
            res.status(500).send({ message: 'An error occurred while creating the examination.', error: err });
        })

    }).catch((err) => {
        res.status(500).send({ message: 'An error occurred while creating the examination.' });
    });
}

export const getExaminationStatistics = async (req, res) => {
    const examinationId = req.params.id;

    // Get the number of questions available in the examination collection, the number of questions for the user in the questionViews collection and the total number of views for the user in the questionViews collection
    dbConnection().then((db) => {
        db.collection('examinations').aggregate([
            {
                $match: {
                    _id: new ObjectId(examinationId)
                }
            },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'questions',
                    foreignField: '_id',
                    as: 'questions'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    questions: {
                        $size: '$questions'
                    }
                }
            }
        ]).toArray().then((examination) => {
            if (examination.length > 0) {
                res.status(200).send(examination[0]);
            } else {
                res.status(404).send({ message: 'The examination was not found.' });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'An error occurred while retrieving the examination statistics.' });
        });
    }
    ).catch((err) => {
        res.status(500).send({ message: 'An error occurred while retrieving the examination statistics.' });
    });

}

export const getExamination = async (req, res) => {

    console.log(req.params.id);

    dbConnection().then((db) => {
        db.collection('examinations').findOne({ _id: new ObjectId(req.params.id) }).then((examination) => {
            if (examination) {
                res.status(200).send(examination);
            } else {
                res.status(404).send({ message: 'The examination was not found.' });
            }
        })
    }).catch((err) => {
        res.status(500).send({ message: 'An error occurred while retrieving the examination.' });
    });
}

export const getExaminations = async (req, res) => {

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const search = req.query.search ? req.query.search : '';

    dbConnection().then((db) => {
        db.collection('examinations').find({ name: { $regex: search, $options: 'i' } }).toArray().then((totalExaminations) => {
            db.collection('examinations').find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray().then((examinations) => {
                res.send({
                    data: examinations,
                    totalRecords: totalExaminations.length,
                    totalPages: Math.ceil(totalExaminations.length / limit),
                    currentPage: page,
                    currentRecordPageStart: (page - 1) * limit + 1,
                    recordsPerPage: limit,
                    filterApplied: search.length > 0
                });
            }).catch((error) => {
                res.status(500).send({ message: 'An error occurred while retrieving the examinations.' });
            });
        }).catch((error) => {
            res.status(500).send({ message: 'An error occurred while retrieving the examinations.' });
        });
    }).catch((err) => {
        res.status(500).send({ message: 'An error occurred while retrieving the examinations.' });
    });
}

const validateExaminationSchema = (examination) => {
    var requiredFields = ['name', 'taken_on', 'course', 'type'];

    var allowedTypes = ['tutorial', 'quiz', 'practical', 'final_examination'];

    var missingFields = [];

    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in examination)) {
            missingFields.push(field);
        }
    }

    return missingFields;
}

export const updateExamination = async (req, res) => {
    var allowedFields = ['name', 'description', 'taken_on', 'course', 'type'];

    var updateFields = {};

    for (var i = 0; i < allowedFields.length; i++) {
        var field = allowedFields[i];
        if (field in req.body) {
            updateFields[field] = req.body[field];
        }
    }

    // add the updatedAt field

    updateFields['updatedAt'] = new Date();


    dbConnection().then((db) => {
        db.collection('examinations').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateFields }).then((result) => {
            if (result.modifiedCount > 0) {
                res.status(200).send({ message: 'The examination was updated successfully.' });
            } else {
                res.status(404).send({ message: 'The examination was not found.' });
            }
        }).catch((err) => {
            res.status(500).send({ message: 'An error occurred while updating the examination.' });
        });
    }
    ).catch((err) => {
        res.status(500).send({ message: 'An error occurred while updating the examination.' });
    }
    );

}