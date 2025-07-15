const Exercise = require('../models/Exercise');
const ExerciseBundle = require('../models/ExerciseBundle');
const { v4: uuidv4 } = require('uuid');
const pool = require("../config/db-connection");

async function createExerciseBundle(title) {
    const id = uuidv4();
    await pool.query('INSERT INTO speech_therapy.exercise_bundle (id, title) VALUES ($1, $2)', [id, title]);
    return new ExerciseBundle(id, title, []);
}

async function addBundleToUser(userId, bundleId) {
    await pool.query('INSERT INTO speech_therapy.user_bundle (user_id, bundle_id) VALUES ($1, $2)', [userId, bundleId]);
}

async function getBundleById(id) {
    const bundleRes = await pool.query('SELECT * FROM speech_therapy.exercise_bundle WHERE id = $1', [id]);
    if (bundleRes.rows.length === 0) return null;

    const exercisesRes = await pool.query('SELECT * FROM speech_therapy.exercise WHERE bundle_id = $1 ORDER BY step', [id]);
    const exercises = exercisesRes.rows.map(e => new Exercise(
        e.id, e.step, e.title, e.description, e.audio, e.picture, e.video_file_path
    ));

    const bundle = bundleRes.rows[0];
    return new ExerciseBundle(bundle.id, bundle.title, exercises);
}

async function updateExerciseBundle(id, title) {
    await pool.query('UPDATE speech_therapy.exercise_bundle SET title = $1 WHERE id = $2', [title, id]);
}

async function deleteExerciseBundle(id) {
    await pool.query('DELETE FROM speech_therapy.exercise_bundle WHERE id = $1', [id]);
}

module.exports = {
    createExerciseBundle,
    getBundleById,
    updateExerciseBundle,
    deleteExerciseBundle,
    addBundleToUser,
};
