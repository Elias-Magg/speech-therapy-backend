const Exercise = require('../models/Exercise');
const ExerciseBundle = require('../models/ExerciseBundle');
const exerciseCrud = require('../crud/ExerciseCrud');
const { v4: uuidv4 } = require('uuid');
const pool = require("../config/db-connection");

async function createExerciseBundle(exerciseBundle) {
    const id = uuidv4();
    await pool.query('INSERT INTO speech_therapy.exercise_bundle (id, title, global) VALUES ($1, $2, $3)', [id, exerciseBundle.title, exerciseBundle.global]);
    exerciseBundle.id = id
    exerciseBundle.exercises = [];
    return exerciseBundle;
}
async function getBundleById(id, fetchExercises) {
    if (!id) {
        throw new Error("Exercise Bundle 'id' is required.");
    }

    const bundleRes = await pool.query('SELECT * FROM speech_therapy.exercise_bundle WHERE id = $1', [id]);
    if (bundleRes.rows.length === 0) return null;

    let exercises = null;
    if (fetchExercises) {
        const exercisesRes = await exerciseCrud.findExercisesByBundleId(id);
        exercises = exercisesRes.map(e => new Exercise(
            e.id, e.bundle_id, e.step, e.title, e.description, e.audio, e.picture, e.video_file_path
        ));
    }

    const bundle = bundleRes.rows[0];
    return new ExerciseBundle(bundle.id, bundle.title, exercises, bundle.global);
}

async function getBundlesByUserId(id) {
    if (!id) {
        throw new Error("User 'id' is required.");
    }

    const bundleRes = await pool.query('SELECT bundle_id FROM speech_therapy.user_bundle WHERE user_id = $1', [id]);
    if (bundleRes.rows.length === 0) return null;

    return new ExerciseBundle(bundleRes.rows);
}

async function updateExerciseBundle(exerciseBundle) {
    if (!exerciseBundle.id) {
        throw new Error("Exercise Bundle 'id' is required for update.");
    }

    // Update only the main values (not exercises)
    // Filter out null or undefined fields
    const entries = Object.entries(exerciseBundle)
        .filter(([key,value]) => key !== 'exercises' && value !== null && value !== undefined);

    let updatedMainEntries;

    if (entries.length !== 0) {

        const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`);
        const values = entries.map(([, value]) => value);

        const query = `UPDATE speech_therapy.exercise_bundle
            SET ${setClauses.join(', ')}
            WHERE id = $${values.length + 1}
            RETURNING *;`;

        values.push(exerciseBundle.id);

        updatedMainEntries = await pool.query(query, values);

    }

    return updatedMainEntries.rows[0];
}

async function deleteExerciseBundle(id) {
    await pool.query('DELETE FROM speech_therapy.exercise_bundle WHERE id = $1', [id]);
}

module.exports = {
    createExerciseBundle,
    getBundleById,
    getBundlesByUserId,
    updateExerciseBundle,
    deleteExerciseBundle,
};
