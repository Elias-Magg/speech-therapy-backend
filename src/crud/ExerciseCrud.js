const Exercise = require('../models/Exercise');
const { v4: uuidv4 } = require('uuid');
const pool = require("../config/db-connection");

async function createExercise(bundleId, step, title, description, audio, picture, video_file_path) {
    const id = uuidv4();
    await pool.query(`
    INSERT INTO speech_therapy.exercise 
    (id, bundle_id, step, title, description, audio, picture, video_file_path) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [id, bundleId, step, title, description, audio, picture, video_file_path]);
    return new Exercise(id, step, title, description, audio, picture, video_file_path);
}

async function updateExercise(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return;

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
    await pool.query(`UPDATE speech_therapy.exercise SET ${setClause} WHERE id = $${keys.length + 1}`, [
        ...Object.values(fields),
        id,
    ]);
}

async function deleteExercise(id) {
    await pool.query('DELETE FROM speech_therapy.exercise WHERE id = $1', [id]);
}


module.exports = {
    createExercise,
    updateExercise,
    deleteExercise
};