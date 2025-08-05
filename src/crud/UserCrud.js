const User = require("../models/User");
const Exercise = require('../models/Exercise');
const ExerciseBundle = require('../models/ExerciseBundle');
const { v4: uuidv4 } = require('uuid');
const pool = require("../config/db-connection");
const exerciseBundleCrud = require("./ExerciseBundleCrud");
const userData = require("../models/User");


async function createUser(user) {
    const id = uuidv4();
    await pool.query(
        'INSERT INTO speech_therapy.user (id, type, email, name, surname, year_of_birth, hashed_password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, user.type, user.email, user.name, user.surname, user.year_of_birth, user.hashed_password]
    );
    return new User(id, user.type, user.email, user.name, user.surname, user.year_of_birth,"private password", null);

}

async function getUserByEmail(email) {
    const userRes = await pool.query('SELECT * FROM speech_therapy.user WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return null;
    let userData = userRes.rows[0];

    return new User(userData.id, userData.type, userData.email, userData.name, userData.surname, userData.year_of_birth, userData.hashed_password, userData.clinician_id);
}

async function getUserById(id) {
    const userRes = await pool.query('SELECT * FROM speech_therapy.user WHERE id = $1', [id]);
    if (userRes.rows.length === 0) return null;
    let userData = userRes.rows[0];

    return new User(userData.id, userData.type, userData.email, userData.name, userData.surname,userData.year_of_birth, "private password", userData.clinician_id);
}


//TODO TO UPDATE USER HAS UPDATED TABLE
async function getUsersByClinicianId(clinician_id) {
    const userRes = await pool.query('SELECT * FROM speech_therapy.user WHERE clinician_id = $1', [clinician_id]);
    if (userRes.rows.length === 0) return null;
    let users = userRes.rows.map(item => new User(item.id, item.type, item.email, item.name, item.surname, item.year_of_birth, "private password", item.clinician_id));

    return users;
}


// TO UPDATE USER HAS UPDATED TABLE
async function updateUser(user) {
    const entries = Object.entries(user)
        .filter(([key,value]) => key !== 'exerciseBundles' && value !== null && value !== undefined);

    let updatedEntry;

    if (entries.length !== 0) {

        const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`);
        const values = entries.map(([, value]) => value);

        const query = `UPDATE speech_therapy.user
            SET ${setClauses.join(', ')}
            WHERE id = $${values.length + 1}
            RETURNING *;`;

        values.push(user.id);

        updatedEntry = await pool.query(query, values);

    }

    return updatedEntry.rows[0];
}

async function deleteUser(id) {
    await pool.query('DELETE FROM speech_therapy.user WHERE id = $1', [id]);
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUsersByClinicianId
};
