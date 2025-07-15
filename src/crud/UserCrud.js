const User = require("../models/User");
const Exercise = require('../models/Exercise');
const ExerciseBundle = require('../models/ExerciseBundle');
const { v4: uuidv4 } = require('uuid');
const pool = require("../config/db-connection");

// ========== USERS ==========

async function createUser(type, name, surname) {
    const id = uuidv4();
    await pool.query(
        'INSERT INTO speech_therapy.user (id, type, name, surname) VALUES ($1, $2, $3, $4)',
        [id, type, name, surname]
    );
    return new User(id, type, name, surname, []);
}

async function getUserById(id) {
    const userRes = await pool.query('SELECT * FROM speech_therapy.user WHERE id = $1', [id]);
    if (userRes.rows.length === 0) return null;

    const userData = userRes.rows[0];

    const bundlesRes = await pool.query(`
    SELECT eb.* FROM speech_therapy.exercise_bundle eb
    JOIN speech_therapy.user_bundle ub ON ub.bundle_id = eb.id
    WHERE ub.user_id = $1
  `, [id]);

    const bundles = await Promise.all(bundlesRes.rows.map(async bundle => {
        const exercisesRes = await pool.query(
            'SELECT * FROM speech_therapy.exercise WHERE bundle_id = $1 ORDER BY step',
            [bundle.id]
        );
        const exercises = exercisesRes.rows.map(e => new Exercise(
            e.id, e.step, e.title, e.description, e.audio, e.picture, e.video_file_path
        ));
        return new ExerciseBundle(bundle.id, bundle.title, exercises);
    }));

    return new User(userData.id, userData.type, userData.name, userData.surname, bundles);
}

async function updateUser(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return;

    const values = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
    await pool.query(`UPDATE speech_therapy.user SET ${values} WHERE id = $${keys.length + 1}`, [
        ...Object.values(fields),
        id,
    ]);
}

async function deleteUser(id) {
    await pool.query('DELETE FROM speech_therapy.user WHERE id = $1', [id]);
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
};
