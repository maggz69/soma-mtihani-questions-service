/**
 * Pius Gumo
 * 23/01/2023
 * 
 * The controller for the topics associated with a Question
 */

import {dbConnection} from "../database.js"

export const getTopics = async (req, res) => {
    // Select all the topics from th questions and group them


    dbConnection().then((db) => {
        const questionsCollection = db.collection('questions');
        questionsCollection.aggregate([
            {
                $unwind: "$topics"
            },
            {
                $group: {
                    _id: "$topics",
                    count: { $sum: 1 }
                }
            }
        ]).toArray().then((topics) => {
            res.send(topics);
        })
    })

}